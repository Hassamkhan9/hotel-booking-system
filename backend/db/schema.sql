-- Drop tables if they exist (safe re-run)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

-- Rooms
CREATE TABLE rooms (
  id              SERIAL PRIMARY KEY,
  room_number     VARCHAR(10)    NOT NULL UNIQUE,
  room_type       VARCHAR(50)    NOT NULL,
  price_per_night NUMERIC(10,2)  NOT NULL,
  capacity        INT            NOT NULL,
  description     TEXT,
  is_available    BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(10)   NOT NULL DEFAULT 'guest'
                CHECK (role IN ('guest', 'admin')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Reservations
CREATE TABLE reservations (
  id             SERIAL PRIMARY KEY,
  room_id        INT           NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  guest_name     VARCHAR(255)  NOT NULL,
  guest_email    VARCHAR(255)  NOT NULL,
  check_in_date  DATE          NOT NULL,
  check_out_date DATE          NOT NULL,
  total_price    NUMERIC(10,2) NOT NULL,
  status         VARCHAR(20)   NOT NULL DEFAULT 'confirmed'
                 CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
);

-- Indexes for common queries
CREATE INDEX idx_reservations_room_id    ON reservations(room_id);
CREATE INDEX idx_reservations_dates      ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_status     ON reservations(status);