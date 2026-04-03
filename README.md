# The Grand Hotel — Booking System

A full stack hotel room booking system built with React, Node.js, Express and PostgreSQL. Features a guest-facing booking interface and a protected admin dashboard for managing reservations.

**Live Demo:** *(coming soon — deploying to Vercel)*  
**GitHub:** https://github.com/Hassamkhan9/hotel-booking-system

---

## Screenshots

<img width="1920" height="3423" alt="Screenshot 2026-04-03 at 16-00-55 The Grand Hotel" src="https://github.com/user-attachments/assets/92615c9b-e66c-48c3-9424-8ed5bf4ea67a" />

---

## Features

**Guest side**
- Browse all available rooms with photos, descriptions, and pricing
- Filter rooms by type (Single, Double, Suite, etc.)
- View full room details and select dates
- Live price calculation based on number of nights selected
- Submit a booking and receive a confirmation reference number

**Admin side**
- Secure login with JWT authentication
- Protected dashboard showing all reservations
- Filter reservations by status (confirmed, cancelled, completed)
- Cancel any active reservation with one click
- Summary stats: total bookings, confirmed, cancelled, and total revenue

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| HTTP Client | Axios |
| Dev tooling | Nodemon, Vite HMR |

---

## Project Structure
```
hotel-booking-system/
├── backend/
│   ├── db/
│   │   ├── connection.js
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   └── reservations.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── BookingForm.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx
    │   │   └── RoomCard.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── BookingConfirmation.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   └── RoomDetail.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Server health check |
| GET | `/api/rooms` | — | List all available rooms |
| GET | `/api/rooms/:id` | — | Single room details |
| POST | `/api/reservations` | — | Create a booking |
| GET | `/api/reservations` | Admin JWT | All reservations |
| GET | `/api/reservations/:id` | — | Single reservation |
| DELETE | `/api/reservations/:id` | — | Cancel a booking |
| POST | `/api/auth/register` | — | Register new guest |
| POST | `/api/auth/login` | — | Login, returns JWT |

### Optional filters on `GET /api/rooms`
`?type=suite` `?min_price=100` `?max_price=400` `?capacity=2`

---

## Local Setup

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 15 or higher

### 1. Clone the repository
```bash
git clone https://github.com/Hassamkhan9/hotel-booking-system.git
cd hotel-booking-system
```

### 2. Set up the backend
```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your PostgreSQL password and a JWT secret.
```bash
npm install
```

### 3. Set up the database
```bash
psql -U postgres -c "CREATE DATABASE hotel_db;"
psql -U postgres -d hotel_db -f db/schema.sql
psql -U postgres -d hotel_db -f db/seed.sql
```

### 4. Start the backend
```bash
npm run dev
```

Server runs on `http://localhost:3001`

### 5. Set up and start the frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 6. Default admin login
| Field | Value |
|---|---|
| Email | admin@hotel.com |
| Password | Admin@1234 |

---

## What I Would Add Next

- **Payment integration** — Stripe for processing card payments at booking
- **Email confirmations** — send booking details to the guest via Nodemailer
- **Room photos upload** — allow admins to upload real photos per room
- **Availability calendar** — visual calendar view showing booked and free dates per room
- **Multi-property support** — extend the system to manage multiple hotel locations

---

## Background

This project was built to demonstrate hands-on hospitality technology experience. The booking engine architecture — particularly the room availability conflict checking and the REST API layer syncing reservation state — mirrors work I performed at Canary Riverside Plaza Hotel in London, where I built a similar system that eliminated approximately 120 manual reconciliation hours per quarter.

---
