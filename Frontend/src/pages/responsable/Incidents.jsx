import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'
import StatusDot from '../../components/StatusDot'

// Recevoir les signalements des enseignants/etudiants et les transmettre au technicien,
// ou signaler directement un incident detecte par le responsable lui-meme.
export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [description, setDescription] = useState('')
  const [quantite, setQuantite] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  function load() {
    api.get('/incidents').then((res) => setIncidents(res.data))
  }

  useEffect(load, [])

  async function transmettre(id) {
    await api.post(`/incidents/${id}/transmettre`)
    load()
  }

  async function signalerDirectement(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/incidents', { description, quantite_materiel_affecte: quantite })
      setDescription('')
      setQuantite(1)
      setShowForm(false)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  const enAttente = incidents.filter((i) => i.statut === 'signale')
  const transmisOuPlus = incidents.filter((i) => i.statut !== 'signale')

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Incidents</h1>
        <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
          {showForm ? 'Annuler' : '+ Signaler un incident'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={signalerDirectement} className="card mt-4 space-y-3">
          <p className="text-xs text-blueprint-900/60">
            Un incident signale directement par vous est transmis immediatement au technicien.
          </p>
         <div className="grid gap-3 md:grid-cols-3">
            <textarea
              required
              className="input md:col-span-2"
              rows={3}
              placeholder="Description de l'incident"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <label className="label">Nombre de materiels affectes</label>
              <input type="number" min="1" className="input" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
            </div>
          </div>
          <button disabled={submitting} className="btn-accent">
            {submitting ? 'Envoi…' : 'Transmettre au technicien'}
          </button>
        </form>
      )}

      <section className="mt-8">
        <h2 className="font-display font-semibold">En attente de transmission</h2>
        <p className="mt-1 text-xs text-blueprint-900/50">Signalements recus des enseignants/etudiants, a transmettre au technicien.</p>
        <div className="mt-3 space-y-3">
          {enAttente.map((i) => (
            <div key={i.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm">{i.description}</p>
                <p className="mt-1 font-mono text-xs text-blueprint-900/50">
                  {i.materiel?.nom || i.salle?.nom || '—'} · Signale par {i.signale_par?.nom || '—'} · {new Date(i.date_signalement).toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusDot status={i.statut} />
                <button onClick={() => transmettre(i.id)} className="btn-accent">
                  Transmettre au technicien
                </button>
              </div>
            </div>
          ))}
          {!enAttente.length && <p className="text-sm text-blueprint-900/50">Aucun signalement en attente.</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display font-semibold">Suivi (transmis / en cours / resolus)</h2>
        <div className="mt-3 space-y-3">
          {transmisOuPlus.map((i) => (
            <div key={i.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm">{i.description}</p>
                <p className="mt-1 font-mono text-xs text-blueprint-900/50">
                  {i.materiel?.nom || i.salle?.nom || '—'} · Technicien: {i.technicien?.user?.nom || '—'}
                </p>
              </div>
              <StatusDot status={i.statut} />
            </div>
          ))}
          {!transmisOuPlus.length && <p className="text-sm text-blueprint-900/50">Aucun incident transmis pour le moment.</p>}
        </div>
      </section>
    </DashboardLayout>
  )
}