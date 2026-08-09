import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'
import { UFR_LIST, getDepartements, getFilieres, getNiveaux } from '../../data/ufrData'

const EMPTY_FORM = { titre: '', description: '', ufr: '', departement: '', filiere: '', niveau: '', groupe: '' }

export default function TpList() {
  const [tps, setTps] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [creating, setCreating] = useState(false)

  function load() {
    setLoading(true)
    api.get('/tps?mine=1').then((res) => setTps(res.data.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'ufr') {
        next.departement = ''
        next.filiere = ''
        next.niveau = ''
      }
      if (field === 'departement') {
        next.filiere = ''
        next.niveau = ''
      }
      if (field === 'filiere') {
        next.niveau = ''
      }
      return next
    })
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/tps', form)
      setForm(EMPTY_FORM)
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
      <p className="mt-1 text-sm text-blueprint-900/60">Creez un TP, planifiez ses seances et deposez des ressources.</p>

      <form onSubmit={handleCreate} className="card mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label">Titre du TP</label>
          <input
            className="input"
            required
            value={form.titre}
            onChange={(e) => update('titre', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Description</label>
          <input
            className="input"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

       <div>
          <label className="label">UFR</label>
          <select required className="input" value={form.ufr} onChange={(e) => update('ufr', e.target.value)}>
            <option value="">Choisir une UFR</option>
            {UFR_LIST.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {form.ufr && (
          <div>
            <label className="label">Departement</label>
            <select required className="input" value={form.departement} onChange={(e) => update('departement', e.target.value)}>
              <option value="">Choisir un departement</option>
              {getDepartements(form.ufr).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        {form.departement && (
          <div>
            <label className="label">Filiere</label>
            <select required className="input" value={form.filiere} onChange={(e) => update('filiere', e.target.value)}>
              <option value="">Choisir une filiere</option>
              {getFilieres(form.ufr, form.departement).map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        )}

        {form.filiere && (
          <div>
            <label className="label">Niveau</label>
            <select required className="input" value={form.niveau} onChange={(e) => update('niveau', e.target.value)}>
              <option value="">Choisir un niveau</option>
              {getNiveaux(form.ufr, form.departement, form.filiere).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="label">Groupe (optionnel)</label>
          <input
            className="input"
            placeholder="Ex: Groupe A"
            value={form.groupe}
            onChange={(e) => update('groupe', e.target.value)}
          />
        </div>

        <button className="btn-accent md:col-span-2" disabled={creating}>
          {creating ? 'Ajout...' : 'Ajouter TP'}
        </button>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {loading && <p className="text-sm text-blueprint-900/50">Chargement...</p>}
        {!loading && tps.length === 0 && <p className="text-sm text-blueprint-900/50">Aucun TP pour le moment.</p>}
        {tps.map((tp) => (
          <div key={tp.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-semibold">{tp.titre}</h3>
                <p className="mt-1 text-sm text-blueprint-900/60">{tp.description || 'Sans description'}</p>
                {(tp.ufr || tp.departement || tp.filiere || tp.niveau) && (
                  <p className="mt-1 font-mono text-xs text-blueprint-900/40">
                    {[tp.ufr, tp.departement, tp.filiere, tp.niveau].filter(Boolean).join(' - ')}
                  </p>
                )}
              </div>
              <button onClick={() => handleDelete(tp.id)} className="text-xs font-medium text-red-500 hover:underline">
                Supprimer
              </button>
            </div>
            <div className="mt-3 flex gap-4 font-mono text-xs text-blueprint-900/50">
              <span>{tp.seances?.length || 0} seance(s)</span>
              <span>{tp.ressources?.length || 0} ressource(s)</span>
            </div>
            <a href={`/enseignant/tp/${tp.id}`} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              Gerer →
            </a>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
