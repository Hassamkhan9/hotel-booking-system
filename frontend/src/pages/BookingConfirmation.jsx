import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { reservation, room } = location.state || {}

  useEffect(() => {
    if (!reservation) navigate('/')
  }, [reservation, navigate])

  if (!reservation) return null

  const checkIn  = new Date(reservation.check_in_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const checkOut = new Date(reservation.check_out_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white max-w-lg w-full p-10 shadow-sm text-center">
        {/* Checkmark */}
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xs tracking-[0.4em] uppercase text-gold-600 mb-2">Booking Confirmed</p>
        <h1 className="font-serif text-3xl text-navy-900 mb-2">Thank You</h1>
        <div className="w-10 h-px bg-gold-400 mx-auto mb-6" />

        <p className="text-gray-500 text-sm mb-8">
          Your reservation has been confirmed. A summary is shown below.
        </p>

        {/* Reference */}
        <div className="bg-navy-900 text-white py-4 px-6 mb-8">
          <div className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-1">
            Booking Reference
          </div>
          <div className="font-mono text-xl tracking-widest text-gold-300">
            #{String(reservation.id).padStart(6, '0')}
          </div>
        </div>

        {/* Details */}
        <div className="text-left space-y-4 mb-8">
          {[
            ['Guest',    reservation.guest_name],
            ['Email',    reservation.guest_email],
            ['Room',     room ? `${room.room_type} — Room ${room.room_number}` : '—'],
            ['Check-in',  checkIn],
            ['Check-out', checkOut],
            ['Total',    `$${parseFloat(reservation.total_price).toFixed(2)}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-xs tracking-widest uppercase text-gray-400">{label}</span>
              <span className="text-sm text-navy-900 font-medium">{value}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="btn-primary w-full">
          Back to Rooms
        </button>
      </div>
    </div>
  )
}