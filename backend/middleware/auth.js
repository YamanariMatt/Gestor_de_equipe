const jwt = require('jsonwebtoken')
const { supabase } = require('../config/supabase')

// Middleware para verificar JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' })
  }

  try {
    // Verificar token com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(403).json({ error: 'Token inválido' })
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return res.status(403).json({ error: 'Perfil de usuário não encontrado' })
    }

    // Verificar se usuário está ativo
    if (!profile.ativo) {
      return res.status(403).json({ error: 'Usuário desativado. Contate o administrador.' })
    }

    // Verificar se usuário tem role autorizado (supervisor, gestor, gerente, rh ou admin)
    if (!['supervisor', 'gestor', 'gerente', 'rh', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Acesso negado. Apenas supervisores, gestores, gerentes e RH têm acesso ao sistema.' })
    }

    // Atualizar último login
    await supabase
      .from('profiles')
      .update({ ultimo_login: new Date().toISOString() })
      .eq('id', user.id)

    req.user = { ...user, profile }
    next()
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return res.status(403).json({ error: 'Token inválido' })
  }
}

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user.profile.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Permissão de administrador requerida.' })
  }
  next()
}

// Middleware para verificar se é supervisor ou admin
const requireSupervisor = (req, res, next) => {
  if (!['supervisor', 'admin'].includes(req.user.profile.role)) {
    return res.status(403).json({ error: 'Acesso negado. Permissão de supervisor requerida.' })
  }
  next()
}

// Middleware para verificar se é gestor, supervisor, gerente, rh ou admin
const requireGestor = (req, res, next) => {
  if (!['gestor', 'supervisor', 'gerente', 'rh', 'admin'].includes(req.user.profile.role)) {
    return res.status(403).json({ error: 'Acesso negado. Permissão de gestor, supervisor, gerente ou RH requerida.' })
  }
  next()
}

// Middleware para verificar acesso restrito (apenas usuários autorizados)
const requireAuthorizedUser = (req, res, next) => {
  const authorizedEmails = [
    'felypesimones@nefadv.com.br',
    'jose.silva@extranef.com.br',
    'juliogoncalves@nefadv.com.br',
    'edielwinicius@nefadv.com.br',
    'mariaoliveira@nefadv.com.br'
  ]

  const userProfile = req.user.profile
  
  // Admin sempre tem acesso
  if (userProfile.role === 'admin') {
    return next()
  }

  // Verificar se está na lista de usuários autorizados
  if (!authorizedEmails.includes(req.user.email)) {
    return res.status(403).json({ 
      error: 'Acesso negado. Usuário não autorizado para este sistema.',
      message: 'Apenas supervisores e gestores autorizados têm acesso.',
      authorizedEmails: authorizedEmails
    })
  }

  next()
}

// Middleware para validar empresa (isolamento de dados)
const validateEmpresa = (req, res, next) => {
  // Adicionar empresa_id do usuário às queries para isolamento
  req.empresa_id = req.user.profile.empresa_id
  next()
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireSupervisor,
  requireGestor,
  requireAuthorizedUser,
  validateEmpresa
};
