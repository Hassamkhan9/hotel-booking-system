import { useState, useEffect } from 'react'

export default function BookingForm({ room, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    guest_name:     '',
    guest_email:    '',
    check_in_date:  '',
    check_out_date: '',
  })
  const [nights, setNights]     = useState(0)
  const [totalPrice, setTotal]  = useState(0)
  const [error, setError]       = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (form.check_in_date && form.check_out_date) {
      const inDate  = new Date(form.check_in_date)
      const outDate = new Date(form.check_out_date)
      const diff    = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24))
      if (diff > 0) {
        setNights(diff)
        setTotal(diff * parseFloat(room.price_per_night))
      } else {
        setNights(0)
        setTotal(0)
      }
    }
  }, [form.check_in_date, form.check_out_date, room.price_per_night])

  const handleChange = (e) => {
    setError('')
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.guest_name.trim())  return setError('Please enter your name.')
    if (!form.guest_email.trim()) return setError('Please enter your email.')
    if (!form.check_in_date)      return setError('Please select a check-in date.')
    if (!form.check_out_date)     return setError('Please select a check-out date.')
    if (nights <= 0)              return setError('Check-out must be after check-in.')
    onSubmit({ ...form, room_id: room.id })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="guest_name"
          value={form.guest_name}
          onChange={handleChange}
          placeholder="John Smith"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="guest_email"
          value={form.guest_email}
          onChange={handleChange}
          placeholder="john@example.com"
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
            Check-in
          </label>
          <input
            type="date"
            name="check_in_date"
            value={form.check_in_date}
            onChange={handleChange}
            min={today}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
            Check-out
          </label>
          <input
            type="date"
            name="check_out_date"
            value={form.check_out_date}
            onChange={handleChange}
            min={form.check_in_date || today}
            className="input-field"
            required
          />
        </div>
      </div>

      {/* Price summary */}
      {nights > 0 && (
        <div className="bg-gray-50 border border-gray-200 p-5">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>${room.price_per_night} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between font-medium text-navy-900">
            <span className="text-sm tracking-wide uppercase">Total</span>
            <span className="text-xl">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || nights <= 0}
        className="btn-primary w-full"
      >
        {isLoading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  )
}