import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'
import StatusDot from '../../components/StatusDot'

// Gérer les utilisateurs / Valider / Suspendre compte
export default function Utilisateurs() {
  const [users, setUsers] = useState([])
  const [roleFilter, setRoleFilter] = useState('')

  function load() {
    api.get('/utilisateurs', { params: { role: roleFilter || undefined } }).then((res) => setUsers(res.data.data))
  }

  useEffect(load, [roleFilter])

  async function valider(id) {
    await api.post(`/utilisateurs/${id}/valider`)
    load()
  }

  async function suspendre(id) {
    await api.post(`/utilisateurs/${id}/suspendre`)
    load()
  }
  async function rejeter(id) {
    if (!window.confirm('Rejeter cette inscription ? Le compte sera supprime.')) return
    await api.post(`/utilisateurs/${id}/rejeter`)
    load()
  }
  async function supprimer(id) {
    if (!window.confirm('Supprimer definitivement cet utilisateur ? Cette action est irreversible.')) return
    await api.delete(`/utilisateurs/${id}`)
    load()
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Utilisateurs</h1>
        <select className="input w-48" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Tous les rôles</option>
          <option value="enseignant">Enseignants</option>
          <option value="etudiant">Étudiants</option>
          <option value="technicien">Techniciens</option>
          <option value="responsable">Responsables</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-blueprint-900/10">
        <table className="w-full text-sm">
          <thead className="bg-blueprint-950 text-left text-xs uppercase tracking-wide text-white/70">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rôle</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-blueprint-900/5">
                <td className="px-4 py-2 font-medium">{u.nom} {u.prenom}</td>
                <td className="px-4 py-2 font-mono text-xs">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2"><StatusDot status={u.statut} /></td>
                <td className="px-4 py-2 space-x-3">
                 {u.statut !== 'actif' && (
                    <button onClick={() => valider(u.id)} className="text-xs font-medium text-accent hover:underline">Valider</button>
                  )}
                  {u.statut === 'en_attente' && (
                    <button onClick={() => rejeter(u.id)} className="text-xs font-medium text-red-600 hover:underline">Rejeter</button>
                  )}
                 {u.statut !== 'suspendu' && (
                    <button onClick={() => suspendre(u.id)} className="text-xs font-medium text-red-500 hover:underline">Suspendre</button>
                  )}
                  <button onClick={() => supprimer(u.id)} className="text-xs font-medium text-red-700 hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
