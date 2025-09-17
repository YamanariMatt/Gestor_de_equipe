import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { authService } from '../services/authService'
import { 
  validateUserAccess, 
  isEmailAuthorized, 
  getAccessDeniedMessage, 
  logUnauthorizedAccess 
} from '../services/accessControl'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Verificar sessão inicial
    checkSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        
        if (session?.user) {
          await loadUserProfile(session.user)
          setSession(session)
        } else {
          setUser(null)
          setSession(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Erro ao verificar sessão:', error)
        return
      }

      if (session?.user) {
        await loadUserProfile(session.user)
        setSession(session)
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (authUser) => {
    try {
      // Primeira validação: verificar se email está autorizado
      if (!isEmailAuthorized(authUser.email)) {
        logUnauthorizedAccess(authUser.email, 'Email não autorizado')
        toast.error('Acesso negado. Apenas supervisores e gestores autorizados podem acessar o sistema.')
        await supabase.auth.signOut()
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar perfil:', error)
        toast.error('Erro ao carregar perfil do usuário')
        return
      }

      // Criar objeto do usuário com perfil
      const userWithProfile = {
        id: authUser.id,
        email: authUser.email,
        nome: profile?.nome || authUser.user_metadata?.nome,
        profile: profile || {
          nome: authUser.user_metadata?.nome,
          email: authUser.email,
          role: 'user',
          ativo: false
        }
      }

      // Validação completa de acesso
      const accessValidation = validateUserAccess(userWithProfile)
      
      if (!accessValidation.authorized) {
        logUnauthorizedAccess(authUser.email, accessValidation.reason)
        toast.error(getAccessDeniedMessage(accessValidation.reason))
        await supabase.auth.signOut()
        return
      }

      // Se chegou até aqui, usuário está autorizado
      setUser(userWithProfile)
      
      // Atualizar último login
      if (profile?.id) {
        await supabase
          .from('profiles')
          .update({ ultimo_login: new Date().toISOString() })
          .eq('id', authUser.id)
      }

    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error)
      toast.error('Erro ao validar acesso do usuário')
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)

      // Login fixo para desenvolvimento
      if (email === 'admin@admin.com' && password === 'admin123') {
        const fakeUser = {
          id: 'dev-fake-id',
          email: 'admin@admin.com',
          nome: 'Administrador Dev',
          profile: {
            nome: 'Administrador Dev',
            email: 'admin@admin.com',
            role: 'admin',
            ativo: true,
            username: 'admin'
          }
        }
        setUser(fakeUser)
        toast.success('Login de desenvolvimento bem-sucedido!')
        return { success: true, data: fakeUser }
      }

      // Validação prévia: verificar se email está autorizado
      if (!isEmailAuthorized(email)) {
        logUnauthorizedAccess(email, 'Tentativa de login com email não autorizado')
        toast.error('Acesso negado. Apenas supervisores e gestores autorizados podem acessar o sistema.')
        return { success: false, error: 'Email não autorizado' }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      toast.success('Login realizado com sucesso!')
      return { success: true, data }
    } catch (error) {
      console.error('Erro no login:', error)

      let message = 'Erro ao fazer login'
      if (error.message === 'Invalid login credentials') {
        message = 'Email ou senha incorretos'
      } else if (error.message === 'Email not confirmed') {
        message = 'Email não confirmado. Verifique sua caixa de entrada.'
      }

      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      
      const { email, password, nome, empresa } = userData

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            empresa
          }
        }
      })

      if (error) {
        throw error
      }

      // Criar perfil do usuário
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            nome,
            empresa,
            role: 'user'
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
        }
      }

      toast.success('Conta criada com sucesso! Verifique seu email.')
      return { success: true, data }
    } catch (error) {
      console.error('Erro no registro:', error)
      
      let message = 'Erro ao criar conta'
      if (error.message === 'User already registered') {
        message = 'Este email já está cadastrado'
      } else if (error.message.includes('Password')) {
        message = 'A senha deve ter pelo menos 6 caracteres'
      }
      
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      setUser(null)
      setSession(null)
      toast.success('Logout realizado com sucesso!')
      return { success: true }
    } catch (error) {
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)

      if (error) {
        throw error
      }

      // Atualizar estado local
      setUser(prev => ({ ...prev, ...profileData }))
      toast.success('Perfil atualizado com sucesso!')
      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        throw error
      }

      toast.success('Email de recuperação enviado!')
      return { success: true }
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error)
      toast.error('Erro ao enviar email de recuperação')
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
