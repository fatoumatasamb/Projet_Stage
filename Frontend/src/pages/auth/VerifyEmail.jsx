import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import api from '../../services/api'

export default function VerifyEmail() {
  const { id, hash } = useParams()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function verify() {
      try {
        const signature = searchParams.get('signature')
        const expires = searchParams.get('expires')
        const res = await api.get(`/email/verify/${id}/${hash}`, {
          params: { signature, expires },
        })
        setStatus('success')
        setMessage(res.data.message)
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Le lien de vérification est invalide ou a expiré.')
      }
    }
    verify()
  }, [id, hash, searchParams])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-blueprint-950 py-10">
      <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-40" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Vérification du compte</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white">
            Lab<span className="text-accent">TPAD</span>
          </h1>
        </div>
        <div className="card text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              <p className="text-sm text-blueprint-900/70">Vérification en cours…</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-2 font-display text-lg font-semibold">Email vérifié</h2>
              <p className="mb-6 text-sm text-blueprint-900/70">{message}</p>
              <Link to="/connexion" className="btn-accent inline-block w-full">
                Se connecter
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mb-2 font-display text-lg font-semibold">Échec de la vérification</h2>
              <p className="mb-6 text-sm text-blueprint-900/70">{message}</p>
              <Link to="/inscription" className="btn-accent inline-block w-full">
                Retour à l'inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}