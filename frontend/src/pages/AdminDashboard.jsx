import { useState, useEffect } from 'react'
import { getReservations, cancelReservation } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const STATUS_STYLES = {
  confirmed:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  completed:  'bg-gray-100 text-gray-600',
}

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [filter, setFilter]             = useState('')
  const [cancelling, setCancelling]     = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchReservations = async (status = '') => {
    setLoading(true)
    try {
      const params = status ? { status } : {}
      const res = await getReservations(params)
      setReservations(res.data.reservations)
    } catch {
      setError('Failed to load reservations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReservations(filter) }, [filter])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return
    setCancelling(id)
    try {
      await cancelReservation(id)
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
      )
    } catch {
      alert('Failed to cancel reservation.')
    } finally {
      setCancelling(null)
    }
  }

  const stats = {
    total:     reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    revenue:   reservations
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + parseFloat(r.total_price || 0), 0),
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-gold-600 mb-1">Management</p>
        <h1 className="font-serif text-4xl text-navy-900">Reservations Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Logged in as {user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total',      value: stats.total },
          { label: 'Confirmed',  value: stats.confirmed },
          { label: 'Cancelled',  value: stats.cancelled },
          { label: 'Revenue',    value: `$${stats.revenue.toFixed(0)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 p-6">
            <div className="text-xs tracking-widest uppercase text-gray-400 mb-2">{label}</div>
            <div className="text-3xl font-light text-navy-900">{value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'confirmed', 'cancelled', 'completed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
              filter === s
                ? 'bg-navy-800 text-white border-navy-800'
                : 'border-gray-300 text-gray-600 hover:border-navy-800'
            }`}
          >
            {s === '' ? 'All' : s}
          </button>
        ))}
        <button
          onClick={() => fetchReservations(filter)}
          className="ml-auto px-4 py-2 text-xs tracking-widest uppercase border border-gray-300 text-gray-600 hover:border-navy-800 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {loading && <LoadingSpinner message="Loading reservations..." />}
      {error   && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          {reservations.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm tracking-wide">No reservations found.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 overflow-hidden">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy-900 text-white">
                    <tr>
                      {['Ref', 'Guest', 'Room', 'Check-in', 'Check-out', 'Total', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-xs tracking-widest uppercase font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reservations.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-mono text-gray-400 text-xs">
                          #{String(r.id).padStart(6, '0')}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-navy-900">{r.guest_name}</div>
                          <div className="text-xs text-gray-400">{r.guest_email}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          <div>{r.room_type}</div>
                          <div className="text-xs text-gray-400">Room {r.room_number}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {new Date(r.check_in_date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {new Date(r.check_out_date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-5 py-4 font-medium text-navy-900">
                          ${parseFloat(r.total_price).toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-3 py-1 tracking-wide uppercase font-medium ${STATUS_STYLES[r.status] || ''}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {r.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancel(r.id)}
                              disabled={cancelling === r.id}
                              className="text-xs text-red-500 hover:text-red-700 tracking-wide uppercase disabled:opacity-50"
                            >
                              {cancelling === r.id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {reservations.map(r => (
                  <div key={r.id} className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-navy-900">{r.guest_name}</div>
                        <div className="text-xs text-gray-400 font-mono">#{String(r.id).padStart(6, '0')}</div>
                      </div>
                      <span className={`text-xs px-3 py-1 tracking-wide uppercase font-medium ${STATUS_STYLES[r.status] || ''}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{r.room_type} — Room {r.room_number}</div>
                      <div>{new Date(r.check_in_date).toLocaleDateString('en-GB')} → {new Date(r.check_out_date).toLocaleDateString('en-GB')}</div>
                      <div className="font-medium text-navy-900">${parseFloat(r.total_price).toFixed(2)}</div>
                    </div>
                    {r.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="mt-3 text-xs text-red-500 hover:text-red-700 tracking-wide uppercase"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}