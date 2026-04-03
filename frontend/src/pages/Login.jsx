import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api.js'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-10 shadow-sm">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.4em] uppercase text-gold-600 mb-2">Staff Access</p>
          <h1 className="font-serif text-3xl text-navy-900">Sign In</h1>
          <div className="w-10 h-px bg-gold-400 mx-auto mt-4" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="admin@hotel.com"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Default: admin@hotel.com / Admin@1234
        </p>
      </div>
    </div>
  )
}