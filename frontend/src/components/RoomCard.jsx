import { useNavigate } from 'react-router-dom'

const ROOM_IMAGES = {
  'Standard Single':  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  'Standard Double':  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
  'Superior Double':  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
  'Deluxe King':      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
  'Junior Suite':     'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  'Executive Suite':  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  'Presidential':     'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80',
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'

export default function RoomCard({ room }) {
  const navigate = useNavigate()
  const image = ROOM_IMAGES[room.room_type] || DEFAULT_IMAGE

  return (
    <div className="bg-white group overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={image}
          alt={room.room_type}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white text-navy-900 text-xs font-medium tracking-widest uppercase px-3 py-1.5">
          Room {room.room_number}
        </div>
        {!room.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm tracking-widest uppercase font-medium">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-serif text-xl text-navy-900">{room.room_type}</h3>
          <div className="text-right">
            <div className="text-2xl font-light text-navy-900">${room.price_per_night}</div>
            <div className="text-xs text-gray-400 tracking-wide">per night</div>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {room.description}
        </p>

        <div className="flex items-center gap-4 mb-5 text-xs text-gray-400 tracking-wide uppercase">
          <span>👤 Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
        </div>

        <button
          onClick={() => navigate(`/rooms/${room.id}`)}
          disabled={!room.is_available}
          className="btn-primary w-full text-center disabled:opacity-40"
        >
          {room.is_available ? 'View & Book' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}