#!/bin/bash
# Pet Care Server - Auto-restart script

cd /home/lokesh/pet_care/server

echo "Starting Pet Care Server..."
echo "Database: MongoDB Atlas (with local fallback)"
echo ""

# Function to start server
start_server() {
  echo "[$(date '+%H:%M:%S')] Starting server..."
  node src/index.js >> server.log 2>&1
  EXIT_CODE=$?
  echo "[$(date '+%H:%M:%S')] Server exited with code: $EXIT_CODE"
  
  if [ $EXIT_CODE -ne 0 ]; then
    echo "[$(date '+%H:%M:%S')] Restarting in 3 seconds..."
    sleep 3
    start_server
  fi
}

# Start the server with auto-restart
start_server
