import axios from 'axios'
import { supabase } from './supabase'
import toast from 'react-hot-toast'

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch (error) {
      console.error('Erro ao obter token:', error)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Se o token expirou, tentar renovar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError || !session) {
          // Se não conseguir renovar, fazer logout
          await supabase.auth.signOut()
          window.location.href = '/auth/login'
          return Promise.reject(error)
        }

        // Tentar novamente com o novo token
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError)
        await supabase.auth.signOut()
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }
    }

    // Tratar outros erros
    const errorMessage = error.response?.data?.message || error.message || 'Erro na requisição'
    
    // Não mostrar toast para alguns erros específicos
    const silentErrors = [401, 403]
    if (!silentErrors.includes(error.response?.status)) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

// Serviços da API
export const apiService = {
  // Funcionários
  funcionarios: {
    list: (params = {}) => api.get('/funcionarios', { params }),
    get: (id) => api.get(`/funcionarios/${id}`),
    create: (data) => api.post('/funcionarios', data),
    update: (id, data) => api.put(`/funcionarios/${id}`, data),
    delete: (id) => api.delete(`/funcionarios/${id}`),
    reactivate: (id) => api.patch(`/funcionarios/${id}/reativar`),
  },

  // Equipes
  equipes: {
    list: () => api.get('/equipes'),
    get: (id) => api.get(`/equipes/${id}`),
    create: (data) => api.post('/equipes', data),
    update: (id, data) => api.put(`/equipes/${id}`, data),
    delete: (id) => api.delete(`/equipes/${id}`),
  },

  // Cargos
  cargos: {
    list: () => api.get('/cargos'),
    get: (id) => api.get(`/cargos/${id}`),
    create: (data) => api.post('/cargos', data),
    update: (id, data) => api.put(`/cargos/${id}`, data),
    delete: (id) => api.delete(`/cargos/${id}`),
  },

  // Faltas
  faltas: {
    list: (params = {}) => api.get('/faltas', { params }),
    get: (id) => api.get(`/faltas/${id}`),
    create: (data) => api.post('/faltas', data),
    update: (id, data) => api.put(`/faltas/${id}`, data),
    delete: (id) => api.delete(`/faltas/${id}`),
    approve: (id) => api.patch(`/faltas/${id}/aprovar`),
    reject: (id) => api.patch(`/faltas/${id}/rejeitar`),
  },

  // Férias
  ferias: {
    list: (params = {}) => api.get('/ferias', { params }),
    get: (id) => api.get(`/ferias/${id}`),
    create: (data) => api.post('/ferias', data),
    update: (id, data) => api.put(`/ferias/${id}`, data),
    delete: (id) => api.delete(`/ferias/${id}`),
    approve: (id) => api.patch(`/ferias/${id}/aprovar`),
    reject: (id) => api.patch(`/ferias/${id}/rejeitar`),
  },

  // Atestados
  atestados: {
    list: (params = {}) => api.get('/atestados', { params }),
    get: (id) => api.get(`/atestados/${id}`),
    create: (data) => {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })
      return api.post('/atestados', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    update: (id, data) => api.put(`/atestados/${id}`, data),
    delete: (id) => api.delete(`/atestados/${id}`),
    validate: (id) => api.patch(`/atestados/${id}/validar`),
  },

  // Autenticação
  auth: {
    me: () => api.get('/auth/me'),
    refresh: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
  },

  // Health check
  health: () => api.get('/health'),
}

export default api
