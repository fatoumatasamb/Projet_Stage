import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

// Consulter notes
export default function Notes() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    api.get('/mes-notes').then((res) => setNotes(res.data))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Mes notes</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-blueprint-900/10">
        <table className="w-full text-sm">
          <thead className="bg-blueprint-950 text-left text-xs uppercase tracking-wide text-white/70">
            <tr>
              <th className="px-4 py-2">TP</th>
              <th className="px-4 py-2">Déposé le</th>
              <th className="px-4 py-2">Note</th>
              <th className="px-4 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((n) => (
              <tr key={n.id} className="border-t border-blueprint-900/5">
                <td className="px-4 py-2">{n.tp?.titre}</td>
                <td className="px-4 py-2 font-mono text-xs">{new Date(n.date_depot).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-2 font-semibold">{n.note}/20</td>
                <td className="px-4 py-2 text-xs">{n.statut}</td>
              </tr>
            ))}
            {!notes.length && <tr><td colSpan={4} className="px-4 py-4 text-center text-blueprint-900/40">Aucune note pour le moment.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
