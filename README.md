# PetCare Marketplace (MERN)

## 🚀 Quick Start (Easiest!)

```bash
./start.sh
```

That's it! This will:
- ✅ Start MongoDB automatically
- ✅ Start Backend (http://localhost:5000)
- ✅ Start Frontend (http://localhost:5173)

To stop: `./stop.sh`

**Full guide:** See [QUICKSTART.md](QUICKSTART.md)

---

## Overview
Marketplace for buying/selling pets with admin approval, local pickup, and a strict in-scope AI assistant. Authentication is powered by Clerk (email OTP + Google).

## Setup
### 1) Server
```
cd /home/lokesh/pet_care/server
cp .env.example .env
npm install
npm run dev
```

Requires MongoDB running locally at `mongodb://127.0.0.1:27017/petcare`.

### 2) Client
```
cd /home/lokesh/pet_care/client
cp .env.example .env
npm install
npm run dev
```

## Clerk Auth
Set these env vars:
- Client: `VITE_CLERK_PUBLISHABLE_KEY`
- Server: `CLERK_SECRET_KEY`

Enable **Email OTP** and **Google** in your Clerk dashboard.

## Admin Access
The first Clerk user whose email matches `SEED_ADMIN_EMAIL` is auto-assigned role `admin`.

## AI Assistant
Set `GROQ_API_KEY` in `server/.env`. The assistant is restricted to marketplace topics only.

## Notes
- Local pickup only; no payments in MVP.
- Buyer can upgrade to Seller in Dashboard.
