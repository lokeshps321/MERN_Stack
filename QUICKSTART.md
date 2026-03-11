# 🐾 PetCare Project - Quick Reference

## 🚀 Quick Start (One Command)

```bash
./start.sh
```

This will:
1. ✅ Start MongoDB (if not running)
2. ✅ Start Backend Server (port 5000)
3. ✅ Start Frontend Client (port 5173)

**Access:** http://localhost:5173

---

## 🛑 Stop Project

```bash
./stop.sh
```

---

## 📦 First Time Setup

If you cloned the project or dependencies are missing:

```bash
./setup.sh
```

---

## 🔧 Manual Commands

### Start MongoDB Only
```bash
/home/lokesh/mongodb/mongodb-linux-x86_64-ubuntu2204-7.0.14/bin/mongod \
  --dbpath /home/lokesh/pet_care/server/db_data \
  --logpath /home/lokesh/pet_care/server/db_data/mongod.log \
  --fork
```

### Start Backend Only
```bash
cd server
npm run dev
```

### Start Frontend Only
```bash
cd client
npm run dev
```

---

## 📊 Services

| Service  | URL/Port                      |
|----------|-------------------------------|
| Frontend | http://localhost:5173         |
| Backend  | http://localhost:5000         |
| MongoDB  | mongodb://127.0.0.1:27017/petcare |

---

## 🏗️ Project Structure

```
pet_care/
├── start.sh          # Start everything
├── stop.sh           # Stop everything
├── setup.sh          # First-time setup
├── server/           # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/   # Database config
│   │   ├── models/   # Mongoose models
│   │   ├── routes/   # API routes
│   │   └── controllers/
│   ├── db_data/      # MongoDB data
│   └── .env          # Environment variables
└── client/           # Frontend (React + Vite)
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/
    │   └── utils/
    └── .env          # Environment variables
```

---

## 🔑 Environment Variables

### Server (.env)
- `MONGO_URI` - MongoDB connection string
- `CLERK_SECRET_KEY` - Clerk API key
- `CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `GROQ_API_KEY` - AI assistant API key

### Client (.env)
- `VITE_API_URL` - Backend URL (http://localhost:5000)
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key

---

## 🐛 Troubleshooting

### MongoDB won't start
```bash
# Check if already running
pgrep -f mongod

# Kill stuck processes
pkill -f mongod

# Check logs
cat /home/lokesh/pet_care/server/db_data/mongod.log
```

### Port already in use
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>
```

### Reset everything
```bash
./stop.sh
pkill -f mongod
./start.sh
```

---

## 📝 Quick Tips

1. **Always use `./start.sh`** - It handles MongoDB automatically
2. **Don't delete `server/db_data/`** - Contains your database
3. **Keep terminal open** - Closing stops the servers
4. **Check logs** - `server/app.log` and `server/server.log`

---

## 🎯 Common Tasks

### Check if services are running
```bash
# MongoDB
pgrep -f mongod

# Backend
curl http://localhost:5000/health

# Frontend
curl http://localhost:5173
```

### View database
```bash
# Connect to MongoDB
/home/lokesh/mongodb/mongodb-linux-x86_64-ubuntu2204-7.0.14/bin/mongosh mongodb://127.0.0.1:27017/petcare

# List collections
show collections

# Count documents
db.listings.countDocuments()
db.requests.countDocuments()
db.users.countDocuments()
```

### Clear database (⚠️ DANGER - Deletes all data)
```bash
rm -rf /home/lokesh/pet_care/server/db_data/*
./start.sh
```

---

**Made with ❤️ for easy development**
