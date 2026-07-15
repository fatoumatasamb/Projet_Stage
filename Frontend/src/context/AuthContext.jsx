import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('labtpad_token')
    const storedUser = localStorage.getItem('labtpad_user')
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('labtpad_user')
      }
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const res = await api.post('/login', { email, password })
    const { token, user: loggedInUser } = res.data
    localStorage.setItem('labtpad_token', token)
    localStorage.setItem('labtpad_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }

  async function register(data) {
    const res = await api.post('/register', data)
    const { token, user: newUser } = res.data
    if (token) {
      localStorage.setItem('labtpad_token', token)
      localStorage.setItem('labtpad_user', JSON.stringify(newUser))
      setUser(newUser)
    }
    return newUser
  }

  function logout() {
    api.post('/logout').catch(() => {})
    localStorage.removeItem('labtpad_token')
    localStorage.removeItem('labtpad_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return ctx
}