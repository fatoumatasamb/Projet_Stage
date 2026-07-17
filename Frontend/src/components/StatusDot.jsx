import React from 'react'

const COLORS = {
  actif: 'bg-accent',
  en_attente: 'bg-amber',
  suspendu: 'bg-red-500',
  confirmee: 'bg-accent',
  annulee: 'bg-red-500',
  resolu: 'bg-accent',
  en_cours: 'bg-amber',
  signale: 'bg-red-500',
  transmis: 'bg-amber',
  depose: 'bg-amber',
  valide: 'bg-accent',
  refuse: 'bg-red-500',
}

const LABELS = {
  actif: 'Actif',
  en_attente: 'En attente',
  suspendu: 'Suspendu',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
  resolu: 'Résolu',
  en_cours: 'En cours',
  signale: 'Signalé',
  transmis: 'Transmis au technicien',
  depose: 'Déposé',
  valide: 'Validé',
  refuse: 'Refusé',
}

export default function StatusDot({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blueprint-900/70">
      <span className={`status-dot ${COLORS[status] || 'bg-blueprint-900/30'}`} />
      {LABELS[status] || status}
    </span>
  )
}
