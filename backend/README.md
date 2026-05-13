# HealthNest Backend — Setup Guide 🏥

## Project Structure

```
healthnest-backend/
├── server.js              ← Entry point
├── .env.example           ← Copy to .env and fill values
├── package.json
├── middleware/
│   └── auth.js            ← JWT protect middleware
├── models/
│   ├── User.js            ← User schema
│   ├── Appointment.js     ← Appointment schema
│   └── Catalog.js         ← Doctor & Department schemas
└── routes/
    ├── auth.js            ← /api/auth/*
    ├── appointments.js    ← /api/appointments/*
    ├── profile.js         ← /api/profile/*
    └── catalog.js         ← /api/doctors, /api/departments
```

---

## Step 1: Install MongoDB

**Option A — Local MongoDB:**
- Download from https://www.mongodb.com/try/download/community
- Install and start: `mongod --dbpath /data/db`

**Option B — MongoDB Atlas (Free Cloud):**
1. Go to https://cloud.mongodb.com
2. Create free cluster → get connection string
3. Use that string in `.env` as `MONGO_URI`

---

## Step 2: Setup Backend

```bash
# Enter backend folder
cd healthnest-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env — set MONGO_URI, JWT_SECRET, PORT
# (Use any text editor)
```

**Edit `.env`:**
```env
MONGO_URI=mongodb://localhost:27017/healthnest
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

```bash
# Start backend
npm start
# OR for auto-restart on changes:
npm run dev
```

✅ You should see:
```
✅ MongoDB connected: mongodb://localhost:27017/healthnest
🚀 HealthNest API running on http://localhost:5000
```

---

## Step 3: Fix Frontend api.js

Replace the contents of `hosipital-frontend/src/api.js` with the file `FRONTEND_api.js` provided in this folder.

**Key fix:** `catalogApi` now has:
- `catalogApi.doctors()` → calls `/api/doctors`
- `catalogApi.departments()` → calls `/api/departments`

(Old file had `getDoctors`/`getDepartments` which didn't match the Appointments.jsx usage of `catalogApi.departments()` and `catalogApi.doctors()`)

---

## Step 4: Setup Frontend

```bash
cd hosipital-frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start frontend
npm run dev
```

---

## API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout (clears session) |
| GET  | `/api/auth/me` | Get current user |

### Appointments (requires login)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/appointments` | Get all user appointments |
| GET    | `/api/appointments/:id` | Get single appointment |
| POST   | `/api/appointments` | Book new appointment |
| PUT    | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment |

### Profile (requires login)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile info |
| PUT | `/api/profile/password` | Change password |

### Catalog (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors |
| GET | `/api/departments` | List all departments |

---

## Register Request Example

```json
POST /api/auth/register
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "phone": "+91 98765 43210"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com" }
}
```

---

## Book Appointment Request Example

```json
POST /api/appointments
Authorization: Bearer <token>
{
  "doctorName": "Dr. Neha Singh",
  "department": "Cardiology",
  "date": "2026-06-15",
  "time": "10:30 AM",
  "fee": "₹1,200",
  "paymentMethod": "offline",
  "patient": {
    "fullName": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+91 98765 43210",
    "dateOfBirth": "1990-05-10",
    "gender": "Male",
    "address": "123 MG Road, Ludhiana, Punjab"
  }
}
```

---

## Common Issues

**"MongoDB connection failed"**  
→ Make sure MongoDB is running. Try: `mongod` in terminal.

**"Request failed (401)"**  
→ User is not logged in. Token missing from localStorage.

**CORS error in browser**  
→ Set `FRONTEND_URL=http://localhost:5173` in backend `.env`

**"Cannot GET /api/appointments"**  
→ Appointments need auth. Add `Authorization: Bearer <token>` header.
