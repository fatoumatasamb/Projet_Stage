import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'
import StatusDot from '../../components/StatusDot'

export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [materiels, setMateriels] = useState([])
  const [salles, setSalles] = useState([])
  const [form, setForm] = useState({ materiel_id: '', salle_id: '', description: '', quantite_materiel_affecte: 1 })
  const [submitting, setSubmitting] = useState(false)

  function load() {
    api.get('/incidents').then((res) => setIncidents(res.data))
  }

  useEffect(() => {
    load()
    api.get('/materiels').then((res) => setMateriels(res.data))
    api.get('/salles').then((res) => setSalles(res.data))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/incidents', form)
      setForm({ materiel_id: '', salle_id: '', description: '', quantite_materiel_affecte: 1 })
      load()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Signaler un incident</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">Votre signalement sera transmis au responsable, qui le fera suivre au technicien.</p>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-3 md:grid-cols-2">
        <select className="input" value={form.materiel_id} onChange={(e) => setForm({ ...form, materiel_id: e.target.value })}>
          <option value="">Materiel concerne (optionnel)</option>
          {materiels.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>
        <select className="input" value={form.salle_id} onChange={(e) => setForm({ ...form, salle_id: e.target.value })}>
          <option value="">Salle concernee (optionnel)</option>
          {salles.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
        </select>
        <div>
          <label className="label">Nombre de materiels affectes</label>
          <input
            type="number"
            min="1"
            className="input"
            value={form.quantite_materiel_affecte}
            onChange={(e) => setForm({ ...form, quantite_materiel_affecte: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea
            required
            rows={3}
            className="input"
            placeholder="Decrivez le probleme constate"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button disabled={submitting} className="btn-accent md:col-span-2">
          {submitting ? 'Envoi...' : 'Signaler au responsable'}
        </button>
      </form>

      <h2 className="mt-8 font-display font-semibold">Mes signalements</h2>
      <div className="mt-3 space-y-3">
        {incidents.filter((i) => i.signale_par_id).map((i) => (
          <div key={i.id} className="card flex items-center justify-between">
            <div>
              <p className="text-sm">{i.description}</p>
              <p className="mt-1 font-mono text-xs text-blueprint-900/50">
                {i.materiel?.nom || i.salle?.nom || '-'}
                {i.quantite_materiel_affecte ? ` - ${i.quantite_materiel_affecte} unite(s)` : ''}
                {' - '}{new Date(i.date_signalement).toLocaleString('fr-FR')}
              </p>
            </div>
            <StatusDot status={i.statut} />
          </div>
        ))}
        {!incidents.length && <p className="text-sm text-blueprint-900/50">Aucun signalement pour le moment.</p>}
      </div>
    </DashboardLayout>
  )
}