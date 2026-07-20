import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('labtpad_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('labtpad_token')
      localStorage.removeItem('labtpad_user')
      window.location.href = '/connexion'
    }
    return Promise.reject(error)
  },
)

export default api