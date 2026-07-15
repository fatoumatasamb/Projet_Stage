import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'
import StatusDot from '../../components/StatusDot'

// Traiter les incidents
export default function Incidents() {
  const [incidents, setIncidents] = useState([])

  function load() {
    api.get('/incidents').then((res) => setIncidents(res.data))
  }

  useEffect(load, [])

  async function setStatut(id, statut) {
    await api.put(`/incidents/${id}`, { statut })
    load()
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Incidents signalés</h1>
      <div className="mt-6 space-y-3">
        {incidents.map((i) => (
          <div key={i.id} className="card flex items-center justify-between">
            <div>
              <p className="text-sm">{i.description}</p>
              <p className="mt-1 font-mono text-xs text-blueprint-900/50">
                {i.materiel?.nom || i.salle?.nom || '—'} · {new Date(i.date_signalement).toLocaleString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusDot status={i.statut} />
              <select className="input w-40" value={i.statut} onChange={(e) => setStatut(i.id, e.target.value)}>
                <option value="signale">Signalé</option>
                <option value="en_cours">En cours</option>
                <option value="resolu">Résolu</option>
              </select>
            </div>
          </div>
        ))}
        {!incidents.length && <p className="text-sm text-blueprint-900/50">Aucun incident signalé.</p>}
      </div>
    </DashboardLayout>
  )
}
