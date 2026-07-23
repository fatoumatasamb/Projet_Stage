import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas-pro'

const GROUPES = [
  {
    titre: 'Utilisateurs',
    cartes: [
      { key: 'total_utilisateurs', label: 'Total utilisateurs', couleur: 'blueprint' },
      { key: 'total_enseignants', label: 'Enseignants', couleur: 'blueprint' },
      { key: 'total_etudiants', label: 'Etudiants', couleur: 'blueprint' },
      { key: 'total_techniciens', label: 'Techniciens', couleur: 'blueprint' },
      { key: 'comptes_en_attente', label: 'Comptes en attente', couleur: 'amber' },
    ],
  },
  {
    titre: 'Activite pedagogique',
    cartes: [
      { key: 'total_tps', label: 'TP crees', couleur: 'accent' },
      { key: 'total_seances', label: 'Seances planifiees', couleur: 'accent' },
      { key: 'total_comptes_rendus', label: 'Comptes rendus deposes', couleur: 'accent' },
      { key: 'total_reservations', label: 'Reservations', couleur: 'accent' },
    ],
  },
  {
    titre: 'Incidents',
    cartes: [
      { key: 'incidents_ouverts', label: 'Incidents ouverts', couleur: 'rouge' },
      { key: 'comptes_suspendus', label: 'Comptes suspendus', couleur: 'rouge' },
    ],
  },
]

const ICONES = {
  total_utilisateurs: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  total_enseignants: 'M22 10v6M2 10l10-5 10 5-10 5-10-5Z M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5',
  total_etudiants: 'M12 3 2 8l10 5 10-5-10-5Z M2 8v8 M6 10.5v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5',
  total_techniciens: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z',
  comptes_en_attente: 'M12 8v4l3 3 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  total_tps: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z',
  total_seances: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  total_comptes_rendus: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6 M9 15h6 M9 11h6',
  total_reservations: 'M12 8v4l3 3 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  incidents_ouverts: 'M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
  comptes_suspendus: 'M4.93 4.93l14.14 14.14 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
}

const COULEURS = {
  blueprint: { bg: 'bg-blueprint-900/5', text: 'text-blueprint-900', icon: 'text-blueprint-700' },
  accent: { bg: 'bg-accent/10', text: 'text-blueprint-900', icon: 'text-accent' },
  amber: { bg: 'bg-amber/10', text: 'text-blueprint-900', icon: 'text-amber' },
  rouge: { bg: 'bg-red-50', text: 'text-blueprint-900', icon: 'text-red-500' },
}

const HEX = {
  blueprint: '#16365c',
  accent: '#1fb6a6',
  amber: '#e8a33d',
  rouge: '#ef4444',
}

function Icon({ nom, className }) {
  const d = ICONES[nom]
  if (!d) return null
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {d.split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : 'M' + seg} />
      ))}
    </svg>
  )
}

export default function Overview() {
  const [stats, setStats] = useState(null)
  const [exportingPdf, setExportingPdf] = useState(false)
  const graphesRef = React.useRef(null)

  useEffect(() => {
    api.get('/statistiques').then((res) => setStats(res.data))
  }, [])

  async function exporterPDF() {
    if (!stats) return
    setExportingPdf(true)
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const marge = 40

      doc.setFontSize(18)
      doc.setTextColor(15, 37, 64)
      doc.text('LabTPAD - Rapport statistique', marge, 50)
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Genere le ${new Date().toLocaleString('fr-FR')}`, marge, 68)

      const lignes = []
      GROUPES.forEach((groupe) => {
        groupe.cartes.forEach((c) => {
          lignes.push([groupe.titre, c.label, String(stats[c.key] ?? 0)])
        })
      })

      autoTable(doc, {
        startY: 85,
        head: [['Categorie', 'Indicateur', 'Valeur']],
        body: lignes,
        theme: 'striped',
        headStyles: { fillColor: [15, 37, 64] },
        styles: { fontSize: 9, cellPadding: 5 },
        margin: { left: marge, right: marge },
      })

      if (graphesRef.current) {
        const canvas = await html2canvas(graphesRef.current, { scale: 2, backgroundColor: '#ffffff' })
        const imgData = canvas.toDataURL('image/png')
        const pageWidth = doc.internal.pageSize.getWidth() - marge * 2
        const imgHeight = (canvas.height * pageWidth) / canvas.width

        doc.addPage()
        doc.setFontSize(14)
        doc.setTextColor(15, 37, 64)
        doc.text('Graphiques illustratifs', marge, 40)
        doc.addImage(imgData, 'PNG', marge, 55, pageWidth, imgHeight)
      }

      doc.save(`labtpad-rapport-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setExportingPdf(false)
    }
  }

  function exporterCSV() {
    if (!stats) return
    const lignes = [['Indicateur', 'Valeur']]
    GROUPES.forEach((groupe) => {
      lignes.push([groupe.titre, ''])
      groupe.cartes.forEach((c) => {
        lignes.push([c.label, stats[c.key] ?? 0])
      })
    })
    const csv = lignes.map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `labtpad-statistiques-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const dataRoles = stats ? [
    { nom: 'Enseignants', valeur: stats.total_enseignants || 0 },
    { nom: 'Etudiants', valeur: stats.total_etudiants || 0 },
    { nom: 'Techniciens', valeur: stats.total_techniciens || 0 },
  ] : []

  const dataActivite = stats ? [
    { nom: 'TP', valeur: stats.total_tps || 0 },
    { nom: 'Seances', valeur: stats.total_seances || 0 },
    { nom: 'Comptes rendus', valeur: stats.total_comptes_rendus || 0 },
    { nom: 'Reservations', valeur: stats.total_reservations || 0 },
  ] : []

  const actifs = stats ? Math.max((stats.total_utilisateurs || 0) - (stats.comptes_en_attente || 0) - (stats.comptes_suspendus || 0), 0) : 0
  const dataStatuts = stats ? [
    { nom: 'Actifs', valeur: actifs, couleur: HEX.accent },
    { nom: 'En attente', valeur: stats.comptes_en_attente || 0, couleur: HEX.amber },
    { nom: 'Suspendus', valeur: stats.comptes_suspendus || 0, couleur: HEX.rouge },
  ].filter((d) => d.valeur > 0) : []

  return (
    <DashboardLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-blueprint-950">Vue d'ensemble</h1>
          <p className="mt-1 text-sm text-blueprint-900/60">Statistiques generales de la plateforme LabTPAD.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exporterCSV}
            disabled={!stats}
            className="btn-outline flex items-center gap-2 disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            CSV
          </button>
          <button
            onClick={exporterPDF}
            disabled={!stats || exportingPdf}
            className="btn-accent flex items-center gap-2 disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
              <path d="M9 15h6" />
              <path d="M9 11h6" />
            </svg>
            {exportingPdf ? "Generation..." : "Exporter en PDF"}
          </button>
        </div>
      </div>

      {!stats && (
        <div className="mt-10 flex items-center justify-center">
          <p className="text-sm text-blueprint-900/40">Chargement des statistiques...</p>
        </div>
      )}

      {stats && GROUPES.map((groupe) => (
        <section key={groupe.titre} className="mt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-blueprint-900/50">
            {groupe.titre}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
            {groupe.cartes.map((c) => {
              const couleur = COULEURS[c.couleur]
              const valeur = stats[c.key] ?? 0
              const alerte = (c.couleur === 'amber' || c.couleur === 'rouge') && valeur > 0
              return (
                <div key={c.key} className={`card relative overflow-hidden ${alerte ? 'ring-1 ring-inset ring-red-200' : ''}`}>
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${couleur.bg}`}>
                    <Icon nom={c.key} className={`h-5 w-5 ${couleur.icon}`} />
                  </div>
                  <p className="mt-3 font-mono text-3xl font-semibold text-blueprint-950">{valeur}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-blueprint-900/50">{c.label}</p>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      {stats && (
        <section ref={graphesRef} className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-blueprint-900/50">
              Repartition des utilisateurs par role
            </h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataRoles} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f254014" />
                  <XAxis dataKey="nom" tick={{ fontSize: 12, fill: '#0f2540' }} axisLine={{ stroke: '#0f254022' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#0f2540' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #0f254022', fontSize: 12 }} />
                  <Bar dataKey="valeur" fill={HEX.blueprint} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-blueprint-900/50">
              Statut des comptes
            </h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataStatuts} dataKey="valeur" nameKey="nom" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {dataStatuts.map((entry, i) => (
                      <Cell key={i} fill={entry.couleur} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #0f254022', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card md:col-span-2">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-blueprint-900/50">
              Activite pedagogique
            </h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataActivite} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f254014" />
                  <XAxis dataKey="nom" tick={{ fontSize: 12, fill: '#0f2540' }} axisLine={{ stroke: '#0f254022' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#0f2540' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #0f254022', fontSize: 12 }} />
                  <Bar dataKey="valeur" fill={HEX.accent} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}
    </DashboardLayout>
  )
}

