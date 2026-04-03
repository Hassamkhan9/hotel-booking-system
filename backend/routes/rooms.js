const express = require('express');
const pool    = require('../db/connection');

const router = express.Router();

// GET /api/rooms — all available rooms
router.get('/', async (req, res) => {
  try {
    const { type, min_price, max_price, capacity } = req.query;

    let query  = 'SELECT * FROM rooms WHERE is_available = TRUE';
    const params = [];

    if (type) {
      params.push(type);
      query += ` AND LOWER(room_type) = LOWER($${params.length})`;
    }
    if (min_price) {
      params.push(Number(min_price));
      query += ` AND price_per_night >= $${params.length}`;
    }
    if (max_price) {
      params.push(Number(max_price));
      query += ` AND price_per_night <= $${params.length}`;
    }
    if (capacity) {
      params.push(Number(capacity));
      query += ` AND capacity >= $${params.length}`;
    }

    query += ' ORDER BY price_per_night ASC';

    const result = await pool.query(query, params);
    res.json({ rooms: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Get rooms error:', err);
    res.status(500).json({ error: 'Failed to fetch rooms.' });
  }
});

// GET /api/rooms/:id — single room
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found.' });
    }
    res.json({ room: result.rows[0] });
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ error: 'Failed to fetch room.' });
  }
});

module.exports = router;