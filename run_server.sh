#!/bin/bash
# Pet Care Server Startup Script

cd /home/lokesh/pet_care/server

# Kill any existing server
pkill -f "node src/index.js" 2>/dev/null
sleep 1

# Start server in background
nohup node src/index.js > server.log 2>&1 &
SERVER_PID=$!

echo "Server started with PID: $SERVER_PID"
echo "Waiting for server to be ready..."

# Wait for server to be ready
for i in {1..10}; do
  if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "✓ Server is running on http://localhost:5000"
    exit 0
  fi
  sleep 1
done

echo "✗ Server failed to start. Check server.log for details"
cat server.log
exit 1
