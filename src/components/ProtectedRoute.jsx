import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userProfile } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    // If user doesn't have required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

