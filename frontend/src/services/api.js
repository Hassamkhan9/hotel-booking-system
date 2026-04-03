import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000',
})

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Rooms ────────────────────────────────────────────────────────────────────
export const getRooms = (filters = {}) =>
  API.get('/api/rooms', { params: filters })

export const getRoomById = (id) =>
  API.get(`/api/rooms/${id}`)

// ── Reservations ─────────────────────────────────────────────────────────────
export const createReservation = (data) =>
  API.post('/api/reservations', data)

export const getReservations = (filters = {}) =>
  API.get('/api/reservations', { params: filters })

export const cancelReservation = (id) =>
  API.delete(`/api/reservations/${id}`)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email, password) =>
  API.post('/api/auth/login', { email, password })

export const register = (email, password) =>
  API.post('/api/auth/register', { email, password })