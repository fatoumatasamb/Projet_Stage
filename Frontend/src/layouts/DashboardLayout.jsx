import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from '../components/NotificationBell'

const NAV = {
  enseignant: [
    { to: '/enseignant', label: 'Mes TP' },
    { to: '/enseignant/reservations', label: 'Réservations' },
    { to: '/enseignant/notes', label: 'Comptes rendus' },
    { to: '/enseignant/incidents', label: 'Incidents' },
  ],
  etudiant: [
    { to: '/etudiant', label: 'TP disponibles' },
    { to: '/etudiant/notes', label: 'Mes notes' },
  ],
  technicien: [
    { to: '/technicien', label: 'Matériels' },
    { to: '/technicien/incidents', label: 'Incidents' },
  ],
 responsable: [
    { to: '/responsable', label: "Vue d'ensemble" },
    { to: '/responsable/utilisateurs', label: 'Utilisateurs' },
    { to: '/responsable/salles', label: 'Salles' },
    { to: '/responsable/materiels', label: 'Matériels' },
    { to: '/responsable/incidents', label: 'Incidents' },
  ],
}

const ROLE_LABELS = {
  enseignant: 'Enseignant',
  etudiant: 'Étudiant',
  technicien: 'Technicien',
  responsable: 'Responsable',
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const links = NAV[user?.role] || []

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-blueprint-900/10 bg-blueprint-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-display text-lg font-semibold text-white">
              Lab<span className="text-accent">TPAD</span>
            </Link>
            <nav className="hidden gap-1 md:flex">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
         <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.prenom} {user?.nom}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide text-accent">{ROLE_LABELS[user?.role]}</p>
            </div>
            <button onClick={logout} className="btn-outline border-white/20 text-white hover:bg-white/10">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
