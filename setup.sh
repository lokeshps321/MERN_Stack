#!/bin/bash

echo "🐾 PetCare Project - Complete Setup Script"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB exists
MONGODB_PATH="/home/lokesh/mongodb/mongodb-linux-x86_64-ubuntu2204-7.0.14/bin/mongod"

if [ ! -f "$MONGODB_PATH" ]; then
    echo -e "${RED}❌ MongoDB not found at $MONGODB_PATH${NC}"
    echo ""
    echo "Please install MongoDB first:"
    echo "1. Download from: https://www.mongodb.com/try/download/community"
    echo "2. Extract to: /home/lokesh/mongodb/"
    echo ""
    exit 1
fi

echo -e "${BLUE}✓ MongoDB found${NC}"

# Check if MongoDB is running
if pgrep -f "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is already running${NC}"
else
    echo -e "${BLUE}→ Starting MongoDB...${NC}"
    mkdir -p /home/lokesh/pet_care/server/db_data
    $MONGODB_PATH --dbpath /home/lokesh/pet_care/server/db_data --logpath /home/lokesh/pet_care/server/db_data/mongod.log --fork --bind_ip 127.0.0.1 --port 27017
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ MongoDB started successfully${NC}"
    else
        echo -e "${RED}✗ Failed to start MongoDB${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}→ Installing server dependencies...${NC}"
cd /home/lokesh/pet_care/server
npm install --silent
echo -e "${GREEN}✓ Server dependencies ready${NC}"

echo ""
echo -e "${BLUE}→ Installing client dependencies...${NC}"
cd /home/lokesh/pet_care/client
npm install --silent
echo -e "${GREEN}✓ Client dependencies ready${NC}"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "To start the project, run:"
echo "  ${BLUE}./start.sh${NC}"
echo ""
echo "Or manually:"
echo "  Terminal 1: cd server && npm run dev"
echo "  Terminal 2: cd client && npm run dev"
echo ""
echo "Services will be available at:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:5000"
echo "  - MongoDB:  mongodb://127.0.0.1:27017/petcare"
echo ""
