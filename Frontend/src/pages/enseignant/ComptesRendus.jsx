import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

// Vue agrégée "Consulter compte rendu" à travers tous les TP de l'enseignant
export default function ComptesRendus() {
  const [tps, setTps] = useState([])

  useEffect(() => {
    api.get('/tps?mine=1').then((res) => setTps(res.data.data))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-semibold">Comptes rendus</h1>
      <p className="mt-1 text-sm text-blueprint-900/60">Ouvrez un TP pour consulter et noter les comptes rendus déposés.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {tps.map((tp) => (
          <a key={tp.id} href={`/enseignant/tp/${tp.id}`} className="card block hover:border-accent">
            <h3 className="font-display font-semibold">{tp.titre}</h3>
            <p className="mt-1 font-mono text-xs text-blueprint-900/50">{tp.comptes_rendus?.length ?? 0} dépôt(s)</p>
          </a>
        ))}
      </div>
    </DashboardLayout>
  )
}
