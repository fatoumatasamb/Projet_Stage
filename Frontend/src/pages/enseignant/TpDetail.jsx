import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')
function fileUrl(path) {
  return `${API_ORIGIN}/storage/${path}`
}

export default function TpDetail() {
  const { id } = useParams()
  const [tp, setTp] = useState(null)
  const [salles, setSalles] = useState([])
  const [seanceForm, setSeanceForm] = useState({ salle_id: '', date: '', heure_debut: '', heure_fin: '' })
  const [ressourceForm, setRessourceForm] = useState({ titre: '', description: '', fichier: null })

  function load() {
    api.get(`/tps/${id}`).then((res) => setTp(res.data))
  }

  useEffect(() => {
    load()
    api.get('/salles').then((res) => setSalles(res.data))
  }, [id])

  async function addSeance(e) {
    e.preventDefault()
    await api.post(`/tps/${id}/seances`, seanceForm)
    setSeanceForm({ salle_id: '', date: '', heure_debut: '', heure_fin: '' })
    load()
  }

  async function addRessource(e) {
    e.preventDefault()
    const data = new FormData()
    data.append('titre', ressourceForm.titre)
    data.append('description', ressourceForm.description)
    if (ressourceForm.fichier) data.append('fichier', ressourceForm.fichier)
    await api.post(`/tps/${id}/ressources`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    setRessourceForm({ titre: '', description: '', fichier: null })
    load()
  }

  async function noter(compteRenduId, note, statut) {
    await api.post(`/comptes-rendus/${compteRenduId}/noter`, { note, statut })
    load()
  }

  if (!tp) {
    return (
      <DashboardLayout>
        <p className="text-sm text-blueprint-900/50">Chargement...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">{tp.titre}</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">{tp.description}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="font-display font-semibold">Seances</h2>
          <form onSubmit={addSeance} className="card mt-3 grid grid-cols-2 gap-3">
            <select
              className="input col-span-2"
              value={seanceForm.salle_id}
              onChange={(e) => setSeanceForm({ ...seanceForm, salle_id: e.target.value })}
            >
              <option value="">Choisir une salle</option>
              {salles.map((s) => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>
            <input
              type="date"
              required
              className="input"
              value={seanceForm.date}
              onChange={(e) => setSeanceForm({ ...seanceForm, date: e.target.value })}
            />
            <div className="flex gap-2">
              <input
                type="time"
                required
                className="input"
                value={seanceForm.heure_debut}
                onChange={(e) => setSeanceForm({ ...seanceForm, heure_debut: e.target.value })}
              />
              <input
                type="time"
                required
                className="input"
                value={seanceForm.heure_fin}
                onChange={(e) => setSeanceForm({ ...seanceForm, heure_fin: e.target.value })}
              />
            </div>
            <button className="btn-accent col-span-2">Planifier la seance</button>
          </form>
          <ul className="mt-3 space-y-2">
            {tp.seances?.map((s) => (
              <li key={s.id} className="card flex justify-between text-sm">
                <span>{s.date} - {s.heure_debut} a {s.heure_fin}</span>
                <span className="font-mono text-xs text-blueprint-900/50">{s.salle?.nom || '-'}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold">Ressources pedagogiques</h2>
          <form onSubmit={addRessource} className="card mt-3 space-y-3">
            <input
              className="input"
              placeholder="Titre"
              required
              value={ressourceForm.titre}
              onChange={(e) => setRessourceForm({ ...ressourceForm, titre: e.target.value })}
            />
            <input
              className="input"
              placeholder="Description"
              value={ressourceForm.description}
              onChange={(e) => setRessourceForm({ ...ressourceForm, description: e.target.value })}
            />
            <input
              type="file"
              className="input"
              onChange={(e) => setRessourceForm({ ...ressourceForm, fichier: e.target.files[0] })}
            />
            <button className="btn-accent w-full">Deposer la ressource</button>
          </form>
          <ul className="mt-3 space-y-2">
            {tp.ressources?.map((r) => (
              <li key={r.id} className="card text-sm">{r.titre}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="font-display font-semibold">Materiels necessaires</h2>
        <MaterielSelector tp={tp} onSaved={load} />
      </section>

      <section className="mt-8">
        <h2 className="font-display font-semibold">Comptes rendus deposes</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-blueprint-900/10">
          <table className="w-full text-sm">
            <thead className="bg-blueprint-950 text-left text-xs uppercase tracking-wide text-white/70">
              <tr>
                <th className="px-4 py-2">Etudiant</th>
                <th className="px-4 py-2">Depose le</th>
                <th className="px-4 py-2">Document</th>
                <th className="px-4 py-2">Note</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tp.comptes_rendus?.map((cr) => (
                <CompteRenduRow key={cr.id} cr={cr} onNoter={noter} />
              ))}
              {!tp.comptes_rendus?.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-blueprint-900/40">
                    Aucun depot.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  )
}

function CompteRenduRow({ cr, onNoter }) {
  const [note, setNote] = useState(cr.note || '')
  const etudiantNom = cr.etudiant?.user
    ? `${cr.etudiant.user.nom} ${cr.etudiant.user.prenom || ''}`.trim()
    : `#${cr.etudiant_id}`

  return (
    <tr className="border-t border-blueprint-900/5">
      <td className="px-4 py-2">{etudiantNom}</td>
      <td className="px-4 py-2 font-mono text-xs">
        {new Date(cr.date_depot).toLocaleString('fr-FR')}
      </td>
      <td className="px-4 py-2">
        {cr.fichier ? (
          <a
            href={fileUrl(cr.fichier)}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-accent hover:underline"
          >
            Consulter
          </a>
        ) : (
          <span className="text-xs text-blueprint-900/30">Aucun fichier</span>
        )}
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          min="0"
          max="20"
          step="0.25"
          className="input w-20"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </td>
      <td className="px-4 py-2 text-xs">{cr.statut}</td>
      <td className="px-4 py-2">
        <button
          className="text-xs font-medium text-accent hover:underline"
          onClick={() => onNoter(cr.id, note, 'valide')}
        >
          Valider
        </button>
      </td>
    </tr>
  )
}

function MaterielSelector({ tp, onSaved }) {
  const [materiels, setMateriels] = useState([])
  const [selection, setSelection] = useState({}) // { [materielId]: quantite }
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/materiels').then((res) => setMateriels(res.data))
  }, [])

  useEffect(() => {
    if (tp?.materiels) {
      const init = {}
      tp.materiels.forEach((m) => {
        init[m.id] = m.pivot.quantite
      })
      setSelection(init)
    }
  }, [tp?.materiels])

  function toggle(id) {
    setSaved(false)
    setSelection((s) => {
      const next = { ...s }
      if (id in next) {
        delete next[id]
      } else {
        next[id] = 1
      }
      return next
    })
  }

  function setQuantite(id, quantite) {
    setSaved(false)
    setSelection((s) => ({ ...s, [id]: Math.max(1, parseInt(quantite) || 1) }))
  }

  async function save() {
    setSaving(true)
    try {
      const payload = {
        materiels: Object.entries(selection).map(([materiel_id, quantite]) => ({
          materiel_id: Number(materiel_id),
          quantite,
        })),
      }
      await api.post(`/tps/${tp.id}/materiels`, payload)
      onSaved()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const parCategorie = {}
  materiels.forEach((m) => {
    const cat = m.categorie || 'Sans categorie'
    if (!parCategorie[cat]) parCategorie[cat] = []
    parCategorie[cat].push(m)
  })

  const selectionnes = materiels.filter((m) => m.id in selection)

  return (
    <div className="card mt-3">
      {selectionnes.length > 0 && (
        <div className="mb-4 rounded-md bg-accent/5 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
            {selectionnes.length} materiel(s) selectionne(s)
          </p>
          <ul className="space-y-1 text-sm">
            {selectionnes.map((m) => (
              <li key={m.id} className="flex justify-between">
                <span>{m.nom}</span>
                <span className="font-mono text-blueprint-900/50">×{selection[m.id]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="max-h-96 space-y-4 overflow-y-auto">
        {Object.entries(parCategorie).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-wide text-blueprint-900/50">{cat}</p>
            <div className="mt-2 space-y-1.5">
              {items.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={m.id in selection}
                    onChange={() => toggle(m.id)}
                  />
                  <span className="flex-1 text-sm">{m.nom}</span>
                  {m.id in selection && (
                    <input
                      type="number"
                      min="1"
                      className="input w-20 py-1"
                      value={selection[m.id]}
                      onChange={(e) => setQuantite(m.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {!materiels.length && (
          <p className="text-sm text-blueprint-900/50">Aucun materiel disponible.</p>
        )}
      </div>

      <button onClick={save} disabled={saving} className="btn-accent mt-4 w-full">
        {saving ? 'Enregistrement…' : saved ? '✓ Materiels enregistres' : 'Enregistrer les materiels selectionnes'}
      </button>
    </div>
  )
}