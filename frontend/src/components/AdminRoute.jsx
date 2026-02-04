import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authAPI } from '../config/api'

/**
 * Protects admin routes: redirects to /login if not authenticated,
 * and to / if user is not admin/main_admin.
 */
export default function AdminRoute({ children }) {
  const location = useLocation()
  const [status, setStatus] = useState('loading') // 'loading' | 'allowed' | 'login' | 'forbidden'
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('login')
      setChecking(false)
      return
    }
    authAPI
      .getCurrentUser()
      .then((response) => {
        if (response?.user?.role === 'admin' || response?.user?.role === 'main_admin') {
          setStatus('allowed')
        } else {
          setStatus('forbidden')
        }
      })
      .catch(() => {
        setStatus('login')
      })
      .finally(() => {
        setChecking(false)
      })
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#017233] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    )
  }

  if (status === 'login') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (status === 'forbidden') {
    return <Navigate to="/" replace />
  }

  return children
}
