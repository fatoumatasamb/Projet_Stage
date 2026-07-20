import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

export default function TpList() {
  const [tps, setTps] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ titre: '', description: '' })
  const [creating, setCreating] = useState(false)

  function load() {
    setLoading(true)
    api.get('/tps?mine=1').then((res) => setTps(res.data.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/tps', form)
      setForm({ titre: '', description: '' })
      load()
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce TP ?')) return
    await api.delete(`/tps/${id}`)
    load()
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Mes travaux pratiques</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">Créez un TP, planifiez ses séances et déposez des ressources.</p>

      <form onSubmit={handleCreate} className="card mt-6 grid gap-4 md:grid-cols-[1fr_2fr_auto]">
        <input
          className="input"
          placeholder="Titre du TP"
          required
          value={form.titre}
          onChange={(e) => setForm({ ...form, titre: e.target.value })}
        />
        <input
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="btn-accent" disabled={creating}>{creating ? 'Ajout…' : 'Ajouter TP'}</button>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {loading && <p className="text-sm text-blueprint-900/50">Chargement…</p>}
        {!loading && tps.length === 0 && <p className="text-sm text-blueprint-900/50">Aucun TP pour le moment.</p>}
        {tps.map((tp) => (
          <div key={tp.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-semibold">{tp.titre}</h3>
                <p className="mt-1 text-sm text-blueprint-900/60">{tp.description || 'Sans description'}</p>
              </div>
              <button onClick={() => handleDelete(tp.id)} className="text-xs font-medium text-red-500 hover:underline">
                Supprimer
              </button>
            </div>
            <div className="mt-3 flex gap-4 font-mono text-xs text-blueprint-900/50">
              <span>{tp.seances?.length || 0} séance(s)</span>
              <span>{tp.ressources?.length || 0} ressource(s)</span>
            </div>
            <a href={`/enseignant/tp/${tp.id}`} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              Gérer →
            </a>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
