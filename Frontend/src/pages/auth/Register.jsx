import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UFR_LIST, getDepartements, getFilieres, getNiveaux } from '../../data/ufrData'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
 const [form, setForm] = useState({
  nom: '', prenom: '', email: '', password: '', password_confirmation: '',
  telephone: '', role: 'etudiant', specialite: '', matricule: '',
  ufr: '', departement: '', filiere: '', niveau: '',  groupe: '',
})

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

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

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await register(form)
      if (res.token) {
        navigate(`/${form.role}`)
      } else {
        setMessage(res.message)
      }
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message || 'Erreur lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-blueprint-950 py-10">
      <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-40" />
      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Rejoindre le laboratoire</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white">
            Lab<span className="text-accent">TPAD</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <h2 className="mb-4 font-display text-lg font-semibold">S'inscrire</h2>
          {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
{message && <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          <div className="mb-4">
            <label className="label">Je suis</label>
            <select className="input" value={form.role} onChange={(e) => update('role', e.target.value)}>
              <option value="etudiant">Étudiant</option>
              <option value="enseignant">Enseignant</option>
              <option value="technicien">Technicien</option>
              <option value="responsable">Responsable</option>
            </select>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nom</label>
              <input required className="input" value={form.nom} onChange={(e) => update('nom', e.target.value)} />
            </div>
            <div>
              <label className="label">Prénom</label>
              <input className="input" value={form.prenom} onChange={(e) => update('prenom', e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <label className="label">Email</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="label">Mot de passe</label>
              <input type="password" required className="input" value={form.password} onChange={(e) => update('password', e.target.value)} />
            </div>
            <div>
              <label className="label">Confirmer</label>
              <input type="password" required className="input" value={form.password_confirmation} onChange={(e) => update('password_confirmation', e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <label className="label">Téléphone</label>
            <input className="input" value={form.telephone} onChange={(e) => update('telephone', e.target.value)} />
          </div>

          {form.role === 'enseignant' && (
            <div className="mb-4">
              <label className="label">Spécialité</label>
              <input className="input" value={form.specialite} onChange={(e) => update('specialite', e.target.value)} />
            </div>
          )}
     {form.role === 'etudiant' && (
  <>
    <div className="mb-4">
      <label className="label">UFR</label>
      <select className="input" value={form.ufr} onChange={(e) => update('ufr', e.target.value)}>
        <option value="">Sélectionner une UFR</option>
        {UFR_LIST.map((u) => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
    {form.ufr && (
      <div className="mb-4">
        <label className="label">Département</label>
        <select className="input" value={form.departement} onChange={(e) => update('departement', e.target.value)}>
          <option value="">Sélectionner un département</option>
          {getDepartements(form.ufr).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
    )}
    {form.departement && (
      <div className="mb-4">
        <label className="label">Filière</label>
        <select className="input" value={form.filiere} onChange={(e) => update('filiere', e.target.value)}>
          <option value="">Sélectionner une filière</option>
          {getFilieres(form.ufr, form.departement).map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    )}
    {form.filiere && (
      <div className="mb-4">
        <label className="label">Niveau</label>
        <select className="input" value={form.niveau} onChange={(e) => update('niveau', e.target.value)}>
          <option value="">Sélectionner un niveau</option>
          {getNiveaux(form.ufr, form.departement, form.filiere).map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    )}
 <div className="mb-4">
      <label className="label">Groupe</label>
      <input className="input" value={form.groupe} onChange={(e) => update('groupe', e.target.value)} />
    </div>
  </>
)}    {form.role === 'technicien' && (
            <div className="mb-4">
              <label className="label">Matricule</label>
              <input className="input" value={form.matricule} onChange={(e) => update('matricule', e.target.value)} />
            </div>
          )}
          {form.role === 'responsable' && (
            <p className="mb-4 text-xs text-blueprint-900/50">
              Ce type de compte doit être validé par un responsable déjà actif avant la première connexion.
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-accent w-full">
            {loading ? 'Création…' : "S'inscrire"}
          </button>
          <p className="mt-4 text-center text-sm text-blueprint-900/60">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="font-medium text-accent hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
