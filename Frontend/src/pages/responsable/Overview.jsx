import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const CARDS = [
  { key: 'total_utilisateurs', label: 'Utilisateurs' },
  { key: 'total_enseignants', label: 'Enseignants' },
  { key: 'total_etudiants', label: 'Étudiants' },
  { key: 'total_techniciens', label: 'Techniciens' },
  { key: 'comptes_en_attente', label: 'Comptes en attente' },
  { key: 'total_tps', label: 'TP créés' },
  { key: 'total_reservations', label: 'Réservations' },
  { key: 'incidents_ouverts', label: 'Incidents ouverts' },
]

// Consulter statistiques
export default function Overview() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/statistiques').then((res) => setStats(res.data))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Vue d'ensemble</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">Statistiques générales de la plateforme LabTPAD.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {CARDS.map((c) => (
          <div key={c.key} className="card">
            <p className="font-mono text-3xl font-semibold text-blueprint-950">{stats ? stats[c.key] : '—'}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-blueprint-900/50">{c.label}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
