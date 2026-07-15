import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const REDIRECTS = {
  enseignant: '/enseignant',
  etudiant: '/etudiant',
  technicien: '/technicien',
  responsable: '/responsable',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(REDIRECTS[user.role] || '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-blueprint-950">
      <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-40" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Laboratoire de TP à distance</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white">
            Lab<span className="text-accent">TPAD</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <h2 className="mb-4 font-display text-lg font-semibold">Se connecter</h2>
          {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <div className="mb-4">
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@labtpad.sn"
            />
          </div>
          <div className="mb-6">
            <label className="label">Mot de passe</label>
            <input
              type="password"
              required
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
          <p className="mt-4 text-center text-sm text-blueprint-900/60">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="font-medium text-accent hover:underline">
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
