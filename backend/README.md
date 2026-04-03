# Hotel Booking System — Backend API

REST API for a hotel room booking system. Built with Node.js, Express, and PostgreSQL.

## Stack
- **Runtime**: Node.js
- **Framework**: Express 4
- **Database**: PostgreSQL (via `pg`)
- **Auth**: JWT + bcrypt
- **Dev**: nodemon

## Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | — | Server health check |
| GET | `/api/rooms` | — | List available rooms |
| GET | `/api/rooms/:id` | — | Single room detail |
| POST | `/api/reservations` | — | Create a booking |
| GET | `/api/reservations` | Admin JWT | All reservations |
| GET | `/api/reservations/:id` | — | Single reservation |
| DELETE | `/api/reservations/:id` | — | Cancel a booking |
| POST | `/api/auth/register` | — | Register guest |
| POST | `/api/auth/login` | — | Login, returns JWT |

### Optional query filters on `GET /api/rooms`
`?type=suite` `?min_price=100` `?max_price=300` `?capacity=2`

## Local setup

### 1. Copy `.env.example` to `.env` and fill in your values
```bash
cp .env.example .env
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create the database and run migrations
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE hotel_db;
\q

# Run schema and seed
psql -U postgres -d hotel_db -f db/schema.sql
psql -U postgres -d hotel_db -f db/seed.sql
```

### 4. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

## Default admin account
- **Email**: admin@hotel.com
- **Password**: Admin@1234

## Auth flow
1. `POST /api/auth/login` with email + password
2. Copy the `token` from the response
3. Send it as: `Authorization: Bearer <token>` on admin routes