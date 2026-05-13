# HealthNest — Complete Project 🏥

## Folder Structure

```
Healthnestt/
├── hosipital-frontend/    ← React + Vite frontend
└── backend/               ← Node.js + Express + MongoDB backend
```

---

## Quick Start

### Step 1 — Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/healthnest
JWT_SECRET=apna_koi_bhi_secret_string_likho
PORT=5000
FRONTEND_URL=http://localhost:5173
```

```bash
# Start backend server
npm start
```

✅ Terminal mein dikhega:
```
✅ MongoDB connected
🚀 HealthNest API running on http://localhost:5000
```

---

### Step 2 — Frontend

```bash
cd hosipital-frontend

# Install dependencies
npm install

# .env file banao
echo "VITE_API_URL=http://localhost:5000" > .env

# Start frontend
npm run dev
```

✅ Browser mein open karo: **http://localhost:5173**

---

## MongoDB Setup

**Local (Free):**
1. https://www.mongodb.com/try/download/community se download karo
2. Install karo, phir terminal mein: `mongod`

**Cloud Atlas (Free):**
1. https://cloud.mongodb.com pe free account banao
2. Cluster banao → Connect → Connection String copy karo
3. `.env` mein `MONGO_URI` mein paste karo

---

## Features
- ✅ Register / Login / Logout
- ✅ Profile update (name, phone, DOB, gender, address)
- ✅ Password change
- ✅ Appointment booking (4-step flow)
- ✅ My Appointments — view, cancel
- ✅ Doctors & Departments catalog (auto-seeded)
- ✅ Secure JWT authentication
