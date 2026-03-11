#!/bin/bash
set -euo pipefail

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

printf "\n🐾 PetCare Project - Atlas Stop\n=================================\n\n"

info "Stopping backend and frontend..."
kill_port 5000
kill_port 5173

pkill -f "node.*src/index.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
ok "Backend and frontend stopped"

warn "MongoDB Atlas has no local process to stop"

printf "\n${GREEN}============================================${NC}\n"
ok "PetCare stopped"
printf "${GREEN}============================================${NC}\n\n"
