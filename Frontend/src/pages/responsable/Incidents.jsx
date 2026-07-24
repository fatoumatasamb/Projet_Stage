import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'
import StatusDot from '../../components/StatusDot'

// Recevoir les signalements des enseignants/etudiants et les transmettre au technicien,
// ou signaler directement un incident detecte par le responsable lui-meme.
export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [materiels, setMateriels] = useState([])
  const [salles, setSalles] = useState([])
  const [showForm, setShowForm] = useState(false)
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

  async function transmettre(id) {
    await api.post(`/incidents/${id}/transmettre`)
    load()
  }

  async function signalerDirectement(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/incidents', form)
      setForm({ materiel_id: '', salle_id: '', description: '', quantite_materiel_affecte: 1 })
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
        <form onSubmit={signalerDirectement} className="card mt-4 grid gap-3 md:grid-cols-2">
          <p className="md:col-span-2 text-xs text-blueprint-900/60">
            Un incident signale directement par vous est transmis immediatement au technicien.
          </p>

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
            {submitting ? 'Envoi...' : 'Transmettre au technicien'}
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
                  {i.materiel?.nom || i.salle?.nom || '-'}
                  {i.quantite_materiel_affecte ? ` - ${i.quantite_materiel_affecte} unite(s)` : ''}
                  {' - Signale par '}{i.signale_par?.nom || '-'}{' - '}{new Date(i.date_signalement).toLocaleString('fr-FR')}
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
                  {i.materiel?.nom || i.salle?.nom || '-'}
                  {i.quantite_materiel_affecte ? ` - ${i.quantite_materiel_affecte} unite(s)` : ''}
                  {' - Technicien: '}{i.technicien?.user?.nom || '-'}
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