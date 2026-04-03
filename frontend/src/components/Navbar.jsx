import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const token     = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-navy-900 text-white">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight">
            <span className="font-serif text-2xl text-gold-300 tracking-wide">
              The Grand
            </span>
            <span className="text-xs tracking-[0.3em] uppercase text-gray-400">
              Hotel & Suites
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm tracking-widest uppercase transition-colors ${
                isActive('/') ? 'text-gold-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Rooms
            </Link>
            {token ? (
              <>
                <Link
                  to="/admin"
                  className={`text-sm tracking-widest uppercase transition-colors ${
                    isActive('/admin') ? 'text-gold-300' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm tracking-widest uppercase text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm tracking-widest uppercase text-gray-300 hover:text-white transition-colors"
              >
                Staff Login
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-800 px-4 pb-4 flex flex-col gap-4">
          <Link to="/"      onClick={() => setMenuOpen(false)} className="text-sm tracking-widest uppercase text-gray-300 hover:text-white py-2">Rooms</Link>
          {token ? (
            <>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm tracking-widest uppercase text-gray-300 hover:text-white py-2">Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-left text-sm tracking-widest uppercase text-gray-300 hover:text-white py-2">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm tracking-widest uppercase text-gray-300 hover:text-white py-2">Staff Login</Link>
          )}
        </div>
      )}
    </header>
  )
}