#!/bin/bash
set -euo pipefail

ROOT="/home/lokesh/pet_care"
MONGODB_PATH="/home/lokesh/mongodb/mongodb-linux-x86_64-ubuntu2204-7.0.14/bin/mongod"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${BLUE}→${NC} $1"; }
ok() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }

have_cmd() { command -v "$1" >/dev/null 2>&1; }

kill_port() {
  local port="$1"
  if have_cmd lsof; then
    local pids
    pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
    if [ -n "$pids" ]; then
      kill $pids 2>/dev/null || true
    fi
  fi
}

printf "\n🐾 PetCare Project - Stopping...\n=================================\n\n"

info "Stopping backend and frontend..."
kill_port 5000
kill_port 5173

# Fallback if ports are not detected
pkill -f "node.*src/index.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
ok "Backend and frontend stopped"

if [ "${STOP_MONGO:-false}" = "true" ]; then
  info "Stopping MongoDB..."
  pkill -f "$MONGODB_PATH" 2>/dev/null || true
  ok "MongoDB stopped"
else
  warn "MongoDB kept running (set STOP_MONGO=true to stop it)"
fi

printf "\n${GREEN}============================================${NC}\n"
ok "PetCare stopped"
printf "${GREEN}============================================${NC}\n\n"
