import React, { useEffect, useState } from 'react'
import api from '../services/api'
import StatusDot from './StatusDot'

// Réserver un créneau / Accéder au laboratoire — partagé entre Enseignant et Étudiant
export default function ReservationsPanel() {
  const [reservations, setReservations] = useState([])
  const [salles, setSalles] = useState([])
  const [form, setForm] = useState({ salle_id: '', date: '', heure_debut: '', heure_fin: '' })
  const [error, setError] = useState('')

  function load() {
    api.get('/reservations').then((res) => setReservations(res.data))
    api.get('/salles').then((res) => setSalles(res.data))
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/reservations', form)
      setForm({ salle_id: '', date: '', heure_debut: '', heure_fin: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation.')
    }
  }

  async function cancel(id) {
    await api.delete(`/reservations/${id}`)
    load()
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Réserver un créneau</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">Accédez au laboratoire en réservant une salle et un créneau horaire.</p>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-3 md:grid-cols-5">
        {error && <p className="md:col-span-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <select required className="input" value={form.salle_id} onChange={(e) => setForm({ ...form, salle_id: e.target.value })}>
          <option value="">Salle</option>
          {salles.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
        </select>
        <input type="date" required className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input type="time" required className="input" value={form.heure_debut} onChange={(e) => setForm({ ...form, heure_debut: e.target.value })} />
        <input type="time" required className="input" value={form.heure_fin} onChange={(e) => setForm({ ...form, heure_fin: e.target.value })} />
        <button className="btn-accent">Réserver</button>
      </form>

      <div className="mt-6 space-y-2">
        {reservations.map((r) => (
          <div key={r.id} className="card flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{r.salle?.nom}</p>
              <p className="font-mono text-xs text-blueprint-900/50">{r.date} · {r.heure_debut} - {r.heure_fin}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusDot status={r.statut} />
              {r.statut !== 'annulee' && (
                <button onClick={() => cancel(r.id)} className="text-xs font-medium text-red-500 hover:underline">
                  Annuler
                </button>
              )}
            </div>
          </div>
        ))}
        {!reservations.length && <p className="text-sm text-blueprint-900/50">Aucune réservation.</p>}
      </div>
    </div>
  )
}
