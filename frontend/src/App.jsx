import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import RoomDetail from './pages/RoomDetail.jsx'
import BookingConfirmation from './pages/BookingConfirmation.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/rooms/:id"   element={<RoomDetail />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/admin"       element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
          </Routes>
        </main>
        <footer className="bg-navy-900 text-gray-400 text-center py-8 text-sm tracking-wide">
          © {new Date().getFullYear()} The Grand Hotel. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  )
}