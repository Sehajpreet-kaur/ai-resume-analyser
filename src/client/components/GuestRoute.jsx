import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router-dom'

function GuestRoute({ children }) {
  const { user, token } = useAuthStore()
  if (user && token) return <Navigate to="/" replace />
  return children
}

export default GuestRoute