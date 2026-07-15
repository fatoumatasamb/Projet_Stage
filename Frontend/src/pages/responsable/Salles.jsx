import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

// Gérer les salles
export default function Salles() {
  const [salles, setSalles] = useState([])
  const [form, setForm] = useState({ nom: '', capacite: 10 })

  function load() {
    api.get('/salles').then((res) => setSalles(res.data))
  }

  useEffect(load, [])

  async function handleCreate(e) {
    e.preventDefault()
    await api.post('/salles', form)
    setForm({ nom: '', capacite: 10 })
    load()
  }

  async function toggle(s) {
    await api.put(`/salles/${s.id}`, { disponibilite: !s.disponibilite })
    load()
  }

  async function remove(id) {
    if (!confirm('Supprimer cette salle ?')) return
    await api.delete(`/salles/${id}`)
    load()
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Salles du laboratoire</h1>

      <form onSubmit={handleCreate} className="card mt-6 grid gap-3 md:grid-cols-4">
        <input required className="input" placeholder="Nom de la salle" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
        <input type="number" min="1" className="input" placeholder="Capacité" value={form.capacite} onChange={(e) => setForm({ ...form, capacite: e.target.value })} />
        <button className="btn-accent md:col-span-2">Ajouter la salle</button>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {salles.map((s) => (
          <div key={s.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-semibold">{s.nom}</h3>
                <p className="font-mono text-xs text-blueprint-900/50">Capacité : {s.capacite}</p>
              </div>
              <button onClick={() => remove(s.id)} className="text-xs font-medium text-red-500 hover:underline">Suppr.</button>
            </div>
            <button onClick={() => toggle(s)} className="mt-3 flex items-center gap-2 text-xs font-medium">
              <span className={`status-dot ${s.disponibilite ? 'bg-accent' : 'bg-red-500'}`} />
              {s.disponibilite ? 'Disponible' : 'Indisponible'}
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
