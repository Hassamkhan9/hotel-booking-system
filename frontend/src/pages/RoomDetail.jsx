import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoomById, createReservation } from '../services/api.js'
import BookingForm from '../components/BookingForm.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const ROOM_IMAGES = {
  'Standard Single':  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
  'Standard Double':  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
  'Superior Double':  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80',
  'Deluxe King':      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
  'Junior Suite':     'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
  'Executive Suite':  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
  'Presidential':     'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&q=80',
}

export default function RoomDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [room, setRoom]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [booking, setBooking]   = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(id)
        setRoom(res.data.room)
      } catch {
        setError('Room not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchRoom()
  }, [id])

  const handleBook = async (formData) => {
    setBooking(true)
    setError('')
    try {
      const res = await createReservation(formData)
      navigate('/confirmation', { state: { reservation: res.data.reservation, room } })
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
      setBooking(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage message="Loading room details..." />
  if (error && !room) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate('/')} className="btn-outline">Back to Rooms</button>
    </div>
  )

  const image = ROOM_IMAGES[room.room_type] || ROOM_IMAGES['Standard Single']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-800 transition-colors mb-8 tracking-wide"
      >
        ← Back to all rooms
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left — room info */}
        <div>
          <div className="overflow-hidden mb-8">
            <img src={image} alt={room.room_type} className="w-full h-80 object-cover" />
          </div>

          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 mb-2">Room {room.room_number}</p>
          <h1 className="font-serif text-4xl text-navy-900 mb-2">{room.room_type}</h1>
          <div className="w-12 h-px bg-gold-400 mb-6" />

          <p className="text-gray-600 leading-relaxed mb-8">{room.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-5">
              <div className="text-xs tracking-widest uppercase text-gray-400 mb-1">Capacity</div>
              <div className="text-2xl font-light text-navy-900">{room.capacity}</div>
              <div className="text-xs text-gray-400">
                {room.capacity === 1 ? 'guest' : 'guests'}
              </div>
            </div>
            <div className="bg-gray-50 p-5">
              <div className="text-xs tracking-widest uppercase text-gray-400 mb-1">Rate</div>
              <div className="text-2xl font-light text-navy-900">${room.price_per_night}</div>
              <div className="text-xs text-gray-400">per night</div>
            </div>
          </div>
        </div>

        {/* Right — booking form */}
        <div>
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="font-serif text-2xl text-navy-900 mb-1">Reserve This Room</h2>
            <div className="w-10 h-px bg-gold-400 mb-6" />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-5">
                {error}
              </div>
            )}

            <BookingForm room={room} onSubmit={handleBook} isLoading={booking} />
          </div>
        </div>
      </div>
    </div>
  )
}