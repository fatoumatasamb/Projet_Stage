import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protège une route : exige d'être connecté, et optionnellement d'avoir un rôle précis
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-sm text-blueprint-900/60">Chargement…</div>
  }

  if (!user) {
    return <Navigate to="/connexion" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
