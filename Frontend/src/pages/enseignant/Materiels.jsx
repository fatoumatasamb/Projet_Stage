import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const CATEGORIES = [
  { nom: 'Matériels scientifiques et didactiques', icone: '🔬' },
  { nom: 'Capteurs et instrumentation', icone: '📡' },
  { nom: 'Acquisition de données', icone: '📊' },
  { nom: 'Commande et contrôle', icone: '🎛️' },
  { nom: 'Informatique embarquée et calcul', icone: '💻' },
  { nom: 'Audiovisuel et supervision', icone: '📹' },
  { nom: 'Réseau et communication', icone: '🌐' },
  { nom: 'Infrastructure, alimentation et sécurité', icone: '🔌' },
]

const ETAT_STYLES = {
  bon: 'bg-emerald-50 text-emerald-700',
  use: 'bg-amber-50 text-amber-700',
  defectueux: 'bg-red-50 text-red-700',
}

// Consulter les matériels disponibles (lecture seule)
export default function Materiels() {
  const [materiels, setMateriels] = useState([])

  useEffect(() => {
    api.get('/materiels').then((res) => setMateriels(res.data))
  }, [])

  const parCategorie = CATEGORIES.map((cat) => ({
    ...cat,
    items: materiels.filter((m) => m.categorie === cat.nom),
  }))
  const sansCategorie = materiels.filter((m) => !m.categorie)

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Matériels &amp; équipements</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">Consultez les matériels disponibles pour vos séances de TP, classés par catégorie.</p>

      <div className="mt-6 space-y-6">
        {parCategorie.map((groupe) => (
          groupe.items.length > 0 && (
            <section key={groupe.nom} className="card overflow-hidden !p-0">
              <div className="flex items-center gap-2 border-b border-blueprint-900/10 bg-blueprint-950/[0.03] px-5 py-3">
                <span className="text-lg">{groupe.icone}</span>
                <h2 className="font-display text-sm font-semibold text-blueprint-900">{groupe.nom}</h2>
                <span className="ml-auto rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {groupe.items.length}
                </span>
              </div>
              <div className="divide-y divide-blueprint-900/5">
                {groupe.items.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-blueprint-900">{m.nom}</p>
                      <p className="text-xs text-blueprint-900/50">{m.type || 'Type non précisé'}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-xs text-blueprint-900/50">×{m.quantite}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ETAT_STYLES[m.etat] || 'bg-blueprint-900/5 text-blueprint-900/60'}`}>
                        {m.etat || 'non précisé'}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${m.disponibilite ? 'bg-accent' : 'bg-red-500'}`}
                        title={m.disponibilite ? 'Disponible' : 'Indisponible'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        ))}

        {sansCategorie.length > 0 && (
          <section className="card overflow-hidden !p-0">
            <div className="flex items-center gap-2 border-b border-blueprint-900/10 bg-blueprint-950/[0.03] px-5 py-3">
              <span className="text-lg">📦</span>
              <h2 className="font-display text-sm font-semibold text-blueprint-900">Sans catégorie</h2>
              <span className="ml-auto rounded-full bg-blueprint-900/10 px-2.5 py-0.5 text-xs font-semibold text-blueprint-900/60">
                {sansCategorie.length}
              </span>
            </div>
            <div className="divide-y divide-blueprint-900/5">
              {sansCategorie.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-blueprint-900">{m.nom}</p>
                    <p className="text-xs text-blueprint-900/50">{m.type || 'Type non précisé'}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-xs text-blueprint-900/50">×{m.quantite}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ETAT_STYLES[m.etat] || 'bg-blueprint-900/5 text-blueprint-900/60'}`}>
                      {m.etat || 'non précisé'}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${m.disponibilite ? 'bg-accent' : 'bg-red-500'}`}
                      title={m.disponibilite ? 'Disponible' : 'Indisponible'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!materiels.length && (
          <p className="rounded-lg border border-dashed border-blueprint-900/15 py-10 text-center text-sm text-blueprint-900/50">
            Aucun matériel enregistré pour le moment.
          </p>
        )}
      </div>
    </DashboardLayout>
  )
}