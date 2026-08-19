import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

// Construit l'URL publique d'un fichier stocké côté backend (storage/app/public/...)
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')
function fileUrl(path) {
  return `${API_ORIGIN}/storage/${path}`
}

// Consulter TP + Voir/Télécharger les ressources + Déposer un compte rendu
export default function TpList() {
  const [tps, setTps] = useState([])
  const [ressources, setRessources] = useState({}) // { [tpId]: [...] }
  const [uploading, setUploading] = useState(null)

  function load() {
    api.get('/tps').then((res) => {
      const list = res.data.data
      setTps(list)
      list.forEach((tp) => {
        api.get(`/tps/${tp.id}/ressources`).then((r) => {
          setRessources((prev) => ({ ...prev, [tp.id]: r.data }))
        })
      })
    })
  }

  useEffect(load, [])

  async function deposer(tpId, file) {
    if (!file) return
    setUploading(tpId)
    const data = new FormData()
    data.append('fichier', file)
    try {
      await api.post(`/tps/${tpId}/comptes-rendus`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Compte rendu déposé avec succès.')
    } finally {
      setUploading(null)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Travaux pratiques</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">Consultez les TP disponibles, téléchargez les ressources, et déposez vos comptes rendus.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {tps.map((tp) => (
          <div key={tp.id} className="card">
            <h3 className="font-display font-semibold">{tp.titre}</h3>
            <p className="mt-1 text-sm text-blueprint-900/60">{tp.description}</p>
            <p className="mt-2 font-mono text-xs text-blueprint-900/50">Par {tp.enseignant?.user?.nom}</p>

            {tp.materiels?.length > 0 && (
              <div className="mt-3 border-t border-blueprint-900/10 pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-blueprint-900/50">Matériels nécessaires</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {tp.materiels.map((m) => (
                    <li key={m.id} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                      {m.nom} {m.pivot?.quantite > 1 && `×${m.pivot.quantite}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-3 border-t border-blueprint-900/10 pt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-blueprint-900/50">Ressources pédagogiques</p>
              {ressources[tp.id]?.length > 0 ? (
                <ul className="mt-2 space-y-1.5">
                  {ressources[tp.id].map((r) => (
                    <li key={r.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{r.titre}</p>
                        {r.description && <p className="text-xs text-blueprint-900/50">{r.description}</p>}
                      </div>
                      {r.fichier && (
                        <a href={fileUrl(r.fichier)}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="text-xs font-medium text-accent hover:underline"
                        >
                          Télécharger
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-blueprint-900/40">Aucune ressource déposée.</p>
              )}
            </div>

            <div className="mt-3 border-t border-blueprint-900/10 pt-3">
              <label className="label">Déposer un compte rendu</label>
              <input
                type="file"
                className="input"
                disabled={uploading === tp.id}
                onChange={(e) => deposer(tp.id, e.target.files[0])}
              />
            </div>
          </div>
        ))}
        {!tps.length && <p className="text-sm text-blueprint-900/50">Aucun TP publié pour le moment.</p>}
      </div>
    </DashboardLayout>
  )
}