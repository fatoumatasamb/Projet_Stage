import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

// Gérer les équipements / Mettre à jour les ressources techniques
export default function Materiels() {
  const [materiels, setMateriels] = useState([])
  const [form, setForm] = useState({ nom: '', type: '', quantite: 1, etat: 'bon', disponibilite: true })

  function load() {
    api.get('/materiels').then((res) => setMateriels(res.data))
  }

  useEffect(load, [])

  async function handleCreate(e) {
    e.preventDefault()
    await api.post('/materiels', form)
    setForm({ nom: '', type: '', quantite: 1, etat: 'bon', disponibilite: true })
    load()
  }

  async function toggleDispo(m) {
    await api.put(`/materiels/${m.id}`, { disponibilite: !m.disponibilite })
    load()
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Matériels &amp; équipements</h1>

      <form onSubmit={handleCreate} className="card mt-6 grid gap-3 md:grid-cols-5">
        <input required className="input" placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
        <input className="input" placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
        <input type="number" min="0" className="input" placeholder="Quantité" value={form.quantite} onChange={(e) => setForm({ ...form, quantite: e.target.value })} />
        <input className="input" placeholder="État" value={form.etat} onChange={(e) => setForm({ ...form, etat: e.target.value })} />
        <button className="btn-accent">Ajouter</button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-blueprint-900/10">
        <table className="w-full text-sm">
          <thead className="bg-blueprint-950 text-left text-xs uppercase tracking-wide text-white/70">
            <tr><th className="px-4 py-2">Nom</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Qté</th><th className="px-4 py-2">État</th><th className="px-4 py-2">Disponibilité</th></tr>
          </thead>
          <tbody>
            {materiels.map((m) => (
              <tr key={m.id} className="border-t border-blueprint-900/5">
                <td className="px-4 py-2 font-medium">{m.nom}</td>
                <td className="px-4 py-2">{m.type}</td>
                <td className="px-4 py-2 font-mono">{m.quantite}</td>
                <td className="px-4 py-2">{m.etat}</td>
                <td className="px-4 py-2">
                  <button onClick={() => toggleDispo(m)} className={`status-dot ${m.disponibilite ? 'bg-accent' : 'bg-red-500'}`} title="Basculer la disponibilité" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
