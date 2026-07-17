import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

// Gérer les ressources matérielles et pédagogiques
export default function Materiels() {
  const [materiels, setMateriels] = useState([])
  const [form, setForm] = useState({ nom: '', type: '', quantite: 1, etat: 'bon' })
  const [submitting, setSubmitting] = useState(false)

  function load() {
    api.get('/materiels').then((res) => setMateriels(res.data))
  }
  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/materiels-admin', form)
      setForm({ nom: '', type: '', quantite: 1, etat: 'bon' })
      load()
    } finally {
      setSubmitting(false)
    }
  }

  async function remove(id) {
    if (!confirm('Supprimer ce matériel ?')) return
    await api.delete(`/materiels-admin/${id}`)
    load()
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Matériels &amp; ressources pédagogiques</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">
        Vous pouvez ajouter un materiel, superviser les entrees des techniciens et retirer une entree si necessaire.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-3 md:grid-cols-4">
        <input
          required
          className="input"
          placeholder="Nom du materiel"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />
        <input
          className="input"
          placeholder="Type (optionnel)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <input
          type="number"
          min="0"
          required
          className="input"
          placeholder="Quantite"
          value={form.quantite}
          onChange={(e) => setForm({ ...form, quantite: e.target.value })}
        />
        <select
          className="input"
          value={form.etat}
          onChange={(e) => setForm({ ...form, etat: e.target.value })}
        >
          <option value="bon">Bon etat</option>
          <option value="use">Use</option>
          <option value="defectueux">Defectueux</option>
        </select>
        <button disabled={submitting} className="btn-accent md:col-span-4">
          {submitting ? 'Ajout...' : 'Ajouter le materiel'}
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-blueprint-900/10">
        <table className="w-full text-sm">
          <thead className="bg-blueprint-950 text-left text-xs uppercase tracking-wide text-white/70">
            <tr><th className="px-4 py-2">Nom</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Qté</th><th className="px-4 py-2">État</th><th className="px-4 py-2"></th></tr>
          </thead>
          <tbody>
            {materiels.map((m) => (
              <tr key={m.id} className="border-t border-blueprint-900/5">
                <td className="px-4 py-2 font-medium">{m.nom}</td>
                <td className="px-4 py-2">{m.type}</td>
                <td className="px-4 py-2 font-mono">{m.quantite}</td>
                <td className="px-4 py-2">{m.etat}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => remove(m.id)} className="text-xs font-medium text-red-500 hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
