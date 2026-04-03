import { useState, useEffect } from 'react'
import { getRooms } from '../services/api.js'
import RoomCard from '../components/RoomCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function Home() {
  const [rooms, setRooms]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [filter, setFilter]     = useState('')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms()
        setRooms(res.data.rooms)
      } catch (err) {
        setError('Unable to load rooms. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  const types = [...new Set(rooms.map(r => r.room_type))]
  const filtered = filter ? rooms.filter(r => r.room_type === filter) : rooms

  return (
    <div>
      {/* Hero */}
      <div
        className="relative h-[60vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-navy-900 bg-opacity-55" />
        <div className="relative text-center px-4">
          <p className="text-xs tracking-[0.4em] uppercase text-gold-300 mb-4">
            Welcome to
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 leading-tight">
            The Grand Hotel
          </h1>
          <p className="text-gray-300 text-lg font-light max-w-md mx-auto">
            An experience of timeless elegance and exceptional comfort
          </p>
        </div>
      </div>

      {/* Rooms section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-gold-600 mb-3">Accommodation</p>
          <h2 className="section-title">Our Rooms & Suites</h2>
          <div className="w-16 h-px bg-gold-400 mx-auto mt-4" />
        </div>

        {/* Type filter */}
        {!loading && types.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setFilter('')}
              className={`px-5 py-2 text-xs tracking-widest uppercase border transition-colors ${
                filter === '' ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-300 text-gray-600 hover:border-navy-800'
              }`}
            >
              All
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 text-xs tracking-widest uppercase border transition-colors ${
                  filter === type ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-300 text-gray-600 hover:border-navy-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {loading && <LoadingSpinner message="Loading rooms..." />}
        {error   && <p className="text-center text-red-500 py-10">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}