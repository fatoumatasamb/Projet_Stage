import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import EnseignantTpList from './pages/enseignant/TpList'
import EnseignantTpDetail from './pages/enseignant/TpDetail'
import EnseignantReservations from './pages/enseignant/Reservations'
import EnseignantComptesRendus from './pages/enseignant/ComptesRendus'

import EtudiantTpList from './pages/etudiant/TpList'
import EtudiantNotes from './pages/etudiant/Notes'

import TechnicienMateriels from './pages/technicien/Materiels'
import TechnicienIncidents from './pages/technicien/Incidents'

import ResponsableOverview from './pages/responsable/Overview'
import ResponsableUtilisateurs from './pages/responsable/Utilisateurs'
import ResponsableSalles from './pages/responsable/Salles'
import ResponsableMateriels from './pages/responsable/Materiels'

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="flex h-screen items-center justify-center text-sm text-blueprint-900/60">Chargement…</div>
  }
  if (!user) return <Navigate to="/connexion" replace />
  return <Navigate to={`/${user.role}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          <Route path="/enseignant" element={<ProtectedRoute roles={['enseignant']}><EnseignantTpList /></ProtectedRoute>} />
          <Route path="/enseignant/tp/:id" element={<ProtectedRoute roles={['enseignant']}><EnseignantTpDetail /></ProtectedRoute>} />
          <Route path="/enseignant/reservations" element={<ProtectedRoute roles={['enseignant']}><EnseignantReservations /></ProtectedRoute>} />
          <Route path="/enseignant/notes" element={<ProtectedRoute roles={['enseignant']}><EnseignantComptesRendus /></ProtectedRoute>} />

          <Route path="/etudiant" element={<ProtectedRoute roles={['etudiant']}><EtudiantTpList /></ProtectedRoute>} />
          <Route path="/etudiant/notes" element={<ProtectedRoute roles={['etudiant']}><EtudiantNotes /></ProtectedRoute>} />

          <Route path="/technicien" element={<ProtectedRoute roles={['technicien']}><TechnicienMateriels /></ProtectedRoute>} />
          <Route path="/technicien/incidents" element={<ProtectedRoute roles={['technicien']}><TechnicienIncidents /></ProtectedRoute>} />

          <Route path="/responsable" element={<ProtectedRoute roles={['responsable']}><ResponsableOverview /></ProtectedRoute>} />
          <Route path="/responsable/utilisateurs" element={<ProtectedRoute roles={['responsable']}><ResponsableUtilisateurs /></ProtectedRoute>} />
          <Route path="/responsable/salles" element={<ProtectedRoute roles={['responsable']}><ResponsableSalles /></ProtectedRoute>} />
          <Route path="/responsable/materiels" element={<ProtectedRoute roles={['responsable']}><ResponsableMateriels /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}