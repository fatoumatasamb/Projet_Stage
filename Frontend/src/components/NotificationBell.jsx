import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [nonLues, setNonLues] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  function load() {
    api.get('/notifications').then((res) => {
      setNotifications(res.data.notifications)
      setNonLues(res.data.non_lues)
    })
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleClick(n) {
    if (!n.lu_at) {
      await api.post(`/notifications/${n.id}/lu`)
      load()
    }
    setOpen(false)
    if (n.lien) navigate(n.lien)
  }

  async function marquerToutesLues() {
    await api.post('/notifications/lues')
    load()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {nonLues > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {nonLues > 9 ? '9+' : nonLues}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-blueprint-900/10 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-blueprint-900/10 px-4 py-2">
            <p className="text-sm font-semibold text-blueprint-900">Notifications</p>
            {nonLues > 0 && (
              <button onClick={marquerToutesLues} className="text-xs font-medium text-accent hover:underline">
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`block w-full border-b border-blueprint-900/5 px-4 py-3 text-left text-sm hover:bg-blueprint-900/5 ${!n.lu_at ? 'bg-accent/5' : ''}`}
              >
                <p className={`text-blueprint-900 ${!n.lu_at ? 'font-medium' : ''}`}>{n.message}</p>
                <p className="mt-1 font-mono text-[11px] text-blueprint-900/40">
                  {new Date(n.created_at).toLocaleString('fr-FR')}
                </p>
              </button>
            ))}
            {!notifications.length && (
              <p className="px-4 py-6 text-center text-sm text-blueprint-900/40">Aucune notification.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}