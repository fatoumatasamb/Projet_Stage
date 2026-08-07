import React, { useEffect, useMemo, useState } from 'react'
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
  departement: '',
  filiere: '',
  niveau: '',
}

const TABS = [
  { key: 'responsable', label: 'Responsables' },
  { key: 'enseignant', label: 'Enseignants' },
  { key: 'etudiant', label: 'Etudiants' },
  { key: 'technicien', label: 'Techniciens' },
]

// Gerer les utilisateurs / Valider / Rejeter / Suspendre / Supprimer / Creer un compte
export default function Utilisateurs() {
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('etudiant')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Filtres additionnels pour l'onglet Etudiants
  const [filtreDepartement, setFiltreDepartement] = useState('')
  const [filtreFiliere, setFiltreFiliere] = useState('')
  const [filtreNiveau, setFiltreNiveau] = useState('')

  function load() {
    api.get('/utilisateurs', { params: { role: activeTab || undefined } }).then((res) => setUsers(res.data.data))
  }

  useEffect(load, [activeTab])

  // Reinitialise les filtres etudiants quand on change d'onglet
  useEffect(() => {
    setFiltreDepartement('')
    setFiltreFiliere('')
    setFiltreNiveau('')
  }, [activeTab])

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

  // --- Donnees specifiques a l'onglet Etudiants ---
  const etudiants = useMemo(() => {
    if (activeTab !== 'etudiant') return []

    const departements = new Set()
    const filieres = new Set()
    const niveaux = new Set()

    users.forEach((u) => {
      if (u.etudiant?.departement) departements.add(u.etudiant.departement)
      if (u.etudiant?.filiere) filieres.add(u.etudiant.filiere)
      if (u.etudiant?.niveau) niveaux.add(u.etudiant.niveau)
    })

    const filtres = users.filter((u) => {
      if (filtreDepartement && u.etudiant?.departement !== filtreDepartement) return false
      if (filtreFiliere && u.etudiant?.filiere !== filtreFiliere) return false
      if (filtreNiveau && u.etudiant?.niveau !== filtreNiveau) return false
      return true
    })

    // Tri : Departement > Filiere > Niveau > Groupe
    const tries = [...filtres].sort((a, b) => {
      const da = a.etudiant?.departement || ''
      const db = b.etudiant?.departement || ''
      if (da !== db) return da.localeCompare(db)

      const fa = a.etudiant?.filiere || ''
      const fb = b.etudiant?.filiere || ''
      if (fa !== fb) return fa.localeCompare(fb)

      const na = a.etudiant?.niveau || ''
      const nb = b.etudiant?.niveau || ''
      if (na !== nb) return na.localeCompare(nb)

      const ga = a.etudiant?.groupe || ''
      const gb = b.etudiant?.groupe || ''
      return ga.localeCompare(gb)
    })

    return {
      liste: tries,
      departements: [...departements].sort(),
      filieres: [...filieres].sort(),
      niveaux: [...niveaux].sort(),
    }
  }, [users, activeTab, filtreDepartement, filtreFiliere, filtreNiveau])

  const listeAffichee = activeTab === 'etudiant' ? etudiants.liste : users

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Utilisateurs</h1>
        <button onClick={() => setShowForm((v) => !v)} className="btn-accent">
          {showForm ? 'Annuler' : '+ Creer un compte'}
        </button>
      </div>

      {/* Onglets par role */}
      <div className="mt-4 flex gap-1 border-b border-blueprint-900/10">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'border-b-2 border-accent text-accent'
                : 'text-blueprint-900/50 hover:text-blueprint-900/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
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
            <>
              <input placeholder="Departement" className="input" value={form.departement} onChange={(e) => setForm({ ...form, departement: e.target.value })} />
              <input placeholder="Filiere" className="input" value={form.filiere} onChange={(e) => setForm({ ...form, filiere: e.target.value })} />
              <select className="input" value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })}>
                <option value="">Niveau</option>
                <option value="Licence 1">Licence 1</option>
                <option value="Licence 2">Licence 2</option>
                <option value="Licence 3">Licence 3</option>
                <option value="Master 1">Master 1</option>
                <option value="Master 2">Master 2</option>
              </select>
              <input placeholder="Groupe" className="input" value={form.groupe} onChange={(e) => setForm({ ...form, groupe: e.target.value })} />
            </>
          )}
          {form.role === 'technicien' && (
            <input placeholder="Matricule" className="input" value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} />
          )}

          <button disabled={submitting} className="btn-accent md:col-span-3">
            {submitting ? 'Creation...' : 'Creer le compte'}
          </button>
        </form>
      )}

      {/* Filtres specifiques aux etudiants */}
      {activeTab === 'etudiant' && (
        <div className="mt-4 flex flex-wrap gap-3">
          <select className="input w-48" value={filtreDepartement} onChange={(e) => setFiltreDepartement(e.target.value)}>
            <option value="">Tous les departements</option>
            {etudiants.departements?.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="input w-48" value={filtreFiliere} onChange={(e) => setFiltreFiliere(e.target.value)}>
            <option value="">Toutes les filieres</option>
            {etudiants.filieres?.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select className="input w-48" value={filtreNiveau} onChange={(e) => setFiltreNiveau(e.target.value)}>
            <option value="">Tous les niveaux</option>
            {etudiants.niveaux?.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-blueprint-900/10">
        <table className="w-full text-sm">
          <thead className="bg-blueprint-950 text-left text-xs uppercase tracking-wide text-white/70">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>

              {activeTab === 'enseignant' && <th className="px-4 py-2">Specialite</th>}

              {activeTab === 'etudiant' && (
                <>
                  <th className="px-4 py-2">Departement</th>
                  <th className="px-4 py-2">Filiere</th>
                  <th className="px-4 py-2">Niveau</th>
                  <th className="px-4 py-2">Groupe</th>
                </>
              )}

              {activeTab === 'technicien' && <th className="px-4 py-2">Matricule</th>}

              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listeAffichee.map((u) => (
              <tr key={u.id} className="border-t border-blueprint-900/5">
                <td className="px-4 py-2 font-medium">{u.nom} {u.prenom}</td>
                <td className="px-4 py-2 font-mono text-xs">{u.email}</td>

                {activeTab === 'enseignant' && (
                  <td className="px-4 py-2">{u.enseignant?.specialite || '-'}</td>
                )}

                {activeTab === 'etudiant' && (
                  <>
                    <td className="px-4 py-2">{u.etudiant?.departement || '-'}</td>
                    <td className="px-4 py-2">{u.etudiant?.filiere || '-'}</td>
                    <td className="px-4 py-2">{u.etudiant?.niveau || '-'}</td>
                    <td className="px-4 py-2">{u.etudiant?.groupe || '-'}</td>
                  </>
                )}

                {activeTab === 'technicien' && (
                  <td className="px-4 py-2">{u.technicien?.matricule || '-'}</td>
                )}

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
            {!listeAffichee.length && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-blueprint-900/50">
                  Aucun utilisateur pour cet onglet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}