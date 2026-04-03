const express  = require('express');
const pool     = require('../db/connection');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/reservations — create a booking
router.post('/', async (req, res) => {
  const { room_id, guest_name, guest_email, check_in_date, check_out_date } = req.body;

  if (!room_id || !guest_name || !guest_email || !check_in_date || !check_out_date) {
    return res.status(400).json({ error: 'All fields are required: room_id, guest_name, guest_email, check_in_date, check_out_date.' });
  }

  const checkIn  = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  const today    = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(checkIn) || isNaN(checkOut)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }
  if (checkIn < today) {
    return res.status(400).json({ error: 'Check-in date cannot be in the past.' });
  }
  if (checkOut <= checkIn) {
    return res.status(400).json({ error: 'Check-out must be after check-in.' });
  }

  try {
    // Check room exists and is available
    const roomResult = await pool.query(
      'SELECT * FROM rooms WHERE id = $1 AND is_available = TRUE',
      [room_id]
    );
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found or not available.' });
    }
    const room = roomResult.rows[0];

    // Check for date conflicts
    const conflictResult = await pool.query(
      `SELECT id FROM reservations
       WHERE room_id = $1
         AND status = 'confirmed'
         AND check_in_date  < $3
         AND check_out_date > $2`,
      [room_id, check_in_date, check_out_date]
    );
    if (conflictResult.rows.length > 0) {
      return res.status(409).json({
        error: 'Room is already booked for the selected dates. Please choose different dates.'
      });
    }

    // Calculate total price
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const total_price = (room.price_per_night * nights).toFixed(2);

    // Create reservation
    const result = await pool.query(
      `INSERT INTO reservations
         (room_id, guest_name, guest_email, check_in_date, check_out_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')
       RETURNING *`,
      [room_id, guest_name, guest_email, check_in_date, check_out_date, total_price]
    );

    res.status(201).json({
      message: 'Booking confirmed.',
      reservation: result.rows[0],
      nights,
      room: { room_number: room.room_number, room_type: room.room_type }
    });
  } catch (err) {
    console.error('Create reservation error:', err);
    res.status(500).json({ error: 'Failed to create booking. Please try again.' });
  }
});

// GET /api/reservations — admin only
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, date } = req.query;

    let query = `
      SELECT r.*, rm.room_number, rm.room_type, rm.price_per_night
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      WHERE 1=1`;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND r.status = $${params.length}`;
    }
    if (date) {
      params.push(date);
      query += ` AND (r.check_in_date <= $${params.length} AND r.check_out_date > $${params.length})`;
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ reservations: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Get reservations error:', err);
    res.status(500).json({ error: 'Failed to fetch reservations.' });
  }
});

// GET /api/reservations/:id — get single reservation (public, by ID)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, rm.room_number, rm.room_type
       FROM reservations r
       JOIN rooms rm ON r.room_id = rm.id
       WHERE r.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }
    res.json({ reservation: result.rows[0] });
  } catch (err) {
    console.error('Get reservation error:', err);
    res.status(500).json({ error: 'Failed to fetch reservation.' });
  }
});

// DELETE /api/reservations/:id — cancel a booking
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await pool.query(
      'SELECT * FROM reservations WHERE id = $1',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }
    if (existing.rows[0].status === 'cancelled') {
      return res.status(400).json({ error: 'Reservation is already cancelled.' });
    }

    const result = await pool.query(
      `UPDATE reservations SET status = 'cancelled'
       WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({
      message: 'Reservation cancelled successfully.',
      reservation: result.rows[0]
    });
  } catch (err) {
    console.error('Cancel reservation error:', err);
    res.status(500).json({ error: 'Failed to cancel reservation.' });
  }
});

module.exports = router;