#!/bin/bash
set -euo pipefail

ROOT="/home/lokesh/pet_care"
MONGODB_PATH="/home/lokesh/mongodb/mongodb-linux-x86_64-ubuntu2204-7.0.14/bin/mongod"
DB_DATA="$ROOT/server/db_data"
MONGO_LOG="$DB_DATA/mongod.log"
SERVER_DIR="$ROOT/server"
CLIENT_DIR="$ROOT/client"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${BLUE}→${NC} $1"; }
ok() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; }

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

printf "\n🐾 PetCare Project - Clean Start\n=================================\n\n"

if [ ! -x "$MONGODB_PATH" ]; then
  err "MongoDB binary not found: $MONGODB_PATH"
  err "Install MongoDB or update MONGODB_PATH in start.sh"
  exit 1
fi

mkdir -p "$DB_DATA"

if pgrep -f "$MONGODB_PATH" >/dev/null 2>&1; then
  ok "MongoDB is already running"
else
  info "Starting MongoDB..."
  "$MONGODB_PATH" --dbpath "$DB_DATA" --logpath "$MONGO_LOG" --fork --bind_ip 127.0.0.1 --port 27017 >/dev/null 2>&1 || {
    err "Failed to start MongoDB"
    err "Check log: $MONGO_LOG"
    exit 1
  }
  ok "MongoDB started"
fi

printf "\n"
info "Starting Backend..."
if wait_for_url "http://localhost:5000/health" 1 1; then
  ok "Backend already running"
else
  (cd "$SERVER_DIR" && nohup npm run dev > server.log 2>&1 &) || {
    err "Failed to start backend"
    exit 1
  }
  if wait_for_url "http://localhost:5000/health" 12 1; then
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
ok "PetCare is running"
printf "${GREEN}============================================${NC}\n\n"

echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo "MongoDB:  mongodb://127.0.0.1:27017/petcare"
