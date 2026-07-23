import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'
import StatusDot from '../../components/StatusDot'

const EMPTY_FORM = {
  nom: '',
  prenom: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'etudiant',
  telephone: '',
  specialite: '',
  groupe: '',
  matricule: '',
}

// Gerer les utilisateurs / Valider / Rejeter / Suspendre / Supprimer / Creer un compte
export default function Utilisateurs() {
  const [users, setUsers] = useState([])
  const [roleFilter, setRoleFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function load() {
    api.get('/utilisateurs', { params: { role: roleFilter || undefined } }).then((res) => setUsers(res.data.data))
  }

  useEffect(load, [roleFilter])

  async function valider(id) {
    await api.post(`/utilisateurs/${id}/valider`)
    load()
  }

  async function rejeter(id) {
    if (!window.confirm('Rejeter cette inscription ? Le compte sera supprime.')) return
    await api.post(`/utilisateurs/${id}/rejeter`)
    load()
  }

  async function suspendre(id) {
    await api.post(`/utilisateurs/${id}/suspendre`)
    load()
  }

  async function supprimer(id) {
    if (!window.confirm('Supprimer definitivement cet utilisateur ? Cette action est irreversible.')) return
    await api.delete(`/utilisateurs/${id}`)
    load()
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/utilisateurs', form)
      setForm(EMPTY_FORM)
      setShowForm(false)
      load()
    } catch (err) {
      const errors = err.response?.data?.errors
      const firstError = errors ? Object.values(errors)[0]?.[0] : null
      setError(firstError || "Erreur lors de la creation du compte.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Utilisateurs</h1>
        <div className="flex items-center gap-3">
          <select className="input w-48" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">Tous les roles</option>
            <option value="enseignant">Enseignants</option>
            <option value="etudiant">Etudiants</option>
            <option value="technicien">Techniciens</option>
            <option value="responsable">Responsables</option>
          </select>
          <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
            {showForm ? 'Annuler' : '+ Creer un compte'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mt-4 grid gap-3 md:grid-cols-3">
          <p className="md:col-span-3 text-xs text-blueprint-900/60">
            Contrairement a l'auto-inscription, vous pouvez creer un compte avec n'importe quelle adresse email
            (utile pour les intervenants externes a l'universite).
          </p>
          {error && <p className="md:col-span-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <input required placeholder="Nom" className="input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          <input placeholder="Prenom" className="input" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="etudiant">Etudiant</option>
            <option value="enseignant">Enseignant</option>
            <option value="technicien">Technicien</option>
            <option value="responsable">Responsable</option>
          </select>

          <input required type="email" placeholder="Email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Mot de passe" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input required type="password" placeholder="Confirmer le mot de passe" className="input" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />

          <input placeholder="Telephone" className="input" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />

          {form.role === 'enseignant' && (
            <input placeholder="Specialite" className="input" value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} />
          )}
          {form.role === 'etudiant' && (
            <input placeholder="Groupe" className="input" value={form.groupe} onChange={(e) => setForm({ ...form, groupe: e.target.value })} />
          )}
          {form.role === 'technicien' && (
            <input placeholder="Matricule" className="input" value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} />
          )}

          <button disabled={submitting} className="btn-accent md:col-span-3">
            {submitting ? 'Creation...' : 'Creer le compte'}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-blueprint-900/10">
        <table className="w-full text-sm">
          <thead className="bg-blueprint-950 text-left text-xs uppercase tracking-wide text-white/70">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
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