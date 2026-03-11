#!/bin/bash
set -euo pipefail

ROOT="/home/lokesh/pet_care"
SERVER_DIR="$ROOT/server"
CLIENT_DIR="$ROOT/client"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${BLUE}→${NC} $1"; }
ok() { echo -e "${GREEN}✓${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }

have_cmd() { command -v "$1" >/dev/null 2>&1; }

wait_for_url() {
  local url="$1"; local retries="$2"; local delay="$3"
  if ! have_cmd curl; then
    warn "curl not found; skipping health check for $url"
    return 0
  fi
  for _ in $(seq 1 "$retries"); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
  done
  return 1
}

printf "\n🐾 PetCare Project - Atlas Start\n=================================\n\n"

if [ ! -f "$SERVER_DIR/.env" ]; then
  err "Missing server .env at $SERVER_DIR/.env"
  exit 1
fi

# Ensure Atlas mode by requiring MONGO_URI in .env (use grep for portability)
if ! grep -q '^MONGO_URI=' "$SERVER_DIR/.env"; then
  err "MONGO_URI is not set in $SERVER_DIR/.env"
  exit 1
fi

printf "\n"
info "Starting Backend (Atlas)..."
if wait_for_url "http://localhost:5000/health" 1 1; then
  ok "Backend already running"
else
  (cd "$SERVER_DIR" && MONGO_ALLOW_LOCAL_FALLBACK=false nohup npm run dev > server.log 2>&1 &) || {
    err "Failed to start backend"
    exit 1
  }
  if wait_for_url "http://localhost:5000/health" 15 1; then
    ok "Backend running on http://localhost:5000"
  else
    err "Backend failed to start. Check $SERVER_DIR/server.log"
    exit 1
  fi
fi

printf "\n"
info "Starting Frontend..."
if wait_for_url "http://localhost:5173" 1 1; then
  ok "Frontend already running"
else
  (cd "$CLIENT_DIR" && nohup npm run dev > client.log 2>&1 &) || {
    err "Failed to start frontend"
    exit 1
  }
  if wait_for_url "http://localhost:5173" 20 1; then
    ok "Frontend running on http://localhost:5173"
  else
    err "Frontend failed to start. Check $CLIENT_DIR/client.log"
    exit 1
  fi
fi

printf "\n${GREEN}============================================${NC}\n"
ok "PetCare is running (Atlas)"
printf "${GREEN}============================================${NC}\n\n"

echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
