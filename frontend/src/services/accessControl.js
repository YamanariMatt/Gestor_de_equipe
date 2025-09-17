// Lista de e-mails autorizados para acesso
const AUTHORIZED_USERS = [
  'matheus.yamanari@extranef.com.br',
  'felypesimones@nefadv.com.br',
  // Adicione outros e-mails autorizados conforme necessário
];
// Serviço de controle de acesso restrito
// Apenas supervisores e gestores autorizados têm acesso ao sistema NEF

// Lista de emails autorizados para acesso ao sistema
export const AUTHORIZED_EMAILS = [
  'matheus.yamanari@extranef.com.br',
  'felypesimones@nefadv.com.br',
  'jose.silva@extranef.com.br',
  'juliogoncalves@nefadv.com.br',
  'edielwinicius@nefadv.com.br',
  'mariaoliveira@nefadv.com.br'
]

// Lista de usernames autorizados (backup/alternativo)
export const AUTHORIZED_USERNAMES = [
  'felypesimones',
  'jose.silva',
  'juliogoncalves',
  'edielwinicius',
  'mariaoliveira'
]

// Roles autorizados
export const AUTHORIZED_ROLES = ['supervisor', 'gestor', 'admin']

/**
 * Verifica se um email está autorizado a acessar o sistema
 * @param {string} email - Email do usuário
 * @returns {boolean} - True se autorizado
 */
export const isEmailAuthorized = (email) => {
  if (!email) return false
  return AUTHORIZED_EMAILS.includes(email.toLowerCase().trim())
}

/**
 * Verifica se um username está autorizado a acessar o sistema
 * @param {string} username - Username do usuário
 * @returns {boolean} - True se autorizado
 */
export const isUsernameAuthorized = (username) => {
  if (!username) return false
  return AUTHORIZED_USERNAMES.includes(username.trim())
}

/**
 * Verifica se um role está autorizado a acessar o sistema
 * @param {string} role - Role do usuário
 * @returns {boolean} - True se autorizado
 */
export const isRoleAuthorized = (role) => {
  if (!role) return false
  return AUTHORIZED_ROLES.includes(role.toLowerCase().trim())
}

/**
 * Validação completa de acesso do usuário
 * @param {object} user - Objeto do usuário
 * @returns {object} - Resultado da validação
 */
export const validateUserAccess = (user) => {
  const result = {
    authorized: false,
    reason: '',
    user: user
  }

  // Verificar se usuário existe
  if (!user) {
    result.reason = 'Usuário não encontrado'
    return result
  }

  // Verificar email autorizado
  if (!isEmailAuthorized(user.email)) {
    result.reason = 'Email não autorizado. Apenas supervisores e gestores específicos têm acesso.'
    return result
  }

  // Verificar se tem perfil
  if (!user.profile) {
    result.reason = 'Perfil de usuário não encontrado'
    return result
  }

  // Verificar se usuário está ativo
  if (!user.profile.ativo) {
    result.reason = 'Usuário desativado. Contate o administrador.'
    return result
  }

  // Verificar role autorizado
  if (!isRoleAuthorized(user.profile.role)) {
    result.reason = 'Role não autorizado. Apenas supervisores e gestores têm acesso.'
    return result
  }

  // Verificar username autorizado (dupla validação)
  if (user.profile.username && !isUsernameAuthorized(user.profile.username)) {
    result.reason = 'Username não autorizado'
    return result
  }

  // Se chegou até aqui, usuário está autorizado
  result.authorized = true
  result.reason = 'Acesso autorizado'
  
  return result
}

/**
 * Mensagens de erro padronizadas
 */
export const ACCESS_DENIED_MESSAGES = {
  EMAIL_NOT_AUTHORIZED: 'Acesso negado. Apenas os seguintes usuários têm acesso ao sistema: Felype Simões, José Felipe, Maria Pereira e Júlio Gonçalves.',
  USER_INACTIVE: 'Usuário desativado. Contate o administrador do sistema.',
  INVALID_ROLE: 'Acesso negado. Apenas supervisores e gestores têm acesso ao sistema.',
  PROFILE_NOT_FOUND: 'Perfil de usuário não encontrado. Contate o administrador.',
  GENERAL_ACCESS_DENIED: 'Acesso negado. Este sistema é restrito a supervisores e gestores autorizados.'
}

/**
 * Função para obter mensagem de erro baseada no motivo
 * @param {string} reason - Motivo da negação
 * @returns {string} - Mensagem de erro
 */
export const getAccessDeniedMessage = (reason) => {
  if (reason.includes('Email não autorizado')) {
    return ACCESS_DENIED_MESSAGES.EMAIL_NOT_AUTHORIZED
  }
  if (reason.includes('desativado')) {
    return ACCESS_DENIED_MESSAGES.USER_INACTIVE
  }
  if (reason.includes('Role não autorizado')) {
    return ACCESS_DENIED_MESSAGES.INVALID_ROLE
  }
  if (reason.includes('Perfil')) {
    return ACCESS_DENIED_MESSAGES.PROFILE_NOT_FOUND
  }
  
  return ACCESS_DENIED_MESSAGES.GENERAL_ACCESS_DENIED
}

/**
 * Função para log de tentativas de acesso não autorizado
 * @param {string} email - Email da tentativa
 * @param {string} reason - Motivo da negação
 */
export const logUnauthorizedAccess = (email, reason) => {
  console.warn(`🚫 Tentativa de acesso não autorizado:`, {
    email,
    reason,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  })
  
  // Em produção, aqui poderia enviar para um serviço de monitoramento
}
