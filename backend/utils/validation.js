// =====================================================
// NEF - Utilitários de Validação
// Sistema de Gestão de Equipe
// =====================================================

const { body, param, query } = require('express-validator');

// Validações para autenticação
const authValidation = {
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres')
  ],
  
  resetPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido')
  ]
};

// Validações para funcionários
const funcionarioValidation = {
  create: [
    body('nome')
      .isLength({ min: 2, max: 255 })
      .withMessage('Nome deve ter entre 2 e 255 caracteres'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('cpf')
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      .withMessage('CPF deve estar no formato XXX.XXX.XXX-XX'),
    body('telefone')
      .optional()
      .isMobilePhone('pt-BR')
      .withMessage('Telefone inválido'),
    body('data_nascimento')
      .isISO8601()
      .withMessage('Data de nascimento inválida'),
    body('data_admissao')
      .isISO8601()
      .withMessage('Data de admissão inválida'),
    body('equipe_id')
      .isUUID()
      .withMessage('ID da equipe inválido'),
    body('cargo_id')
      .isUUID()
      .withMessage('ID do cargo inválido'),
    body('salario')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Salário deve ser um valor positivo')
  ],
  
  update: [
    param('id')
      .isUUID()
      .withMessage('ID do funcionário inválido'),
    body('nome')
      .optional()
      .isLength({ min: 2, max: 255 })
      .withMessage('Nome deve ter entre 2 e 255 caracteres'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('telefone')
      .optional()
      .isMobilePhone('pt-BR')
      .withMessage('Telefone inválido'),
    body('salario')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Salário deve ser um valor positivo')
  ]
};

// Validações para faltas
const faltaValidation = {
  create: [
    body('funcionario_id')
      .isUUID()
      .withMessage('ID do funcionário inválido'),
    body('data_inicio')
      .isISO8601()
      .withMessage('Data de início inválida'),
    body('data_fim')
      .isISO8601()
      .withMessage('Data de fim inválida'),
    body('tipo')
      .isIn(['falta', 'atraso', 'saida_antecipada', 'medica', 'justificada'])
      .withMessage('Tipo de falta inválido'),
    body('motivo')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Motivo deve ter no máximo 500 caracteres')
  ]
};

// Validações para férias
const feriasValidation = {
  create: [
    body('funcionario_id')
      .isUUID()
      .withMessage('ID do funcionário inválido'),
    body('data_inicio')
      .isISO8601()
      .withMessage('Data de início inválida'),
    body('data_fim')
      .isISO8601()
      .withMessage('Data de fim inválida'),
    body('dias_solicitados')
      .isInt({ min: 1, max: 30 })
      .withMessage('Dias solicitados deve ser entre 1 e 30'),
    body('observacoes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Observações devem ter no máximo 500 caracteres')
  ]
};

// Validações para equipes
const equipeValidation = {
  create: [
    body('nome')
      .isLength({ min: 2, max: 255 })
      .withMessage('Nome deve ter entre 2 e 255 caracteres'),
    body('descricao')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Descrição deve ter no máximo 500 caracteres'),
    body('cor')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('Cor deve estar no formato hexadecimal (#RRGGBB)')
  ]
};

// Validações para atestados
const atestadoValidation = {
  create: [
    body('funcionario_id')
      .isUUID()
      .withMessage('ID do funcionário inválido'),
    body('data_inicio')
      .isISO8601()
      .withMessage('Data de início inválida'),
    body('data_fim')
      .isISO8601()
      .withMessage('Data de fim inválida'),
    body('tipo')
      .isIn(['medico', 'odontologico', 'psicologico', 'fisioterapia', 'outros'])
      .withMessage('Tipo de atestado inválido'),
    body('cid')
      .optional()
      .isLength({ max: 10 })
      .withMessage('CID deve ter no máximo 10 caracteres')
  ]
};

// Validações de paginação
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100'),
  query('search')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Busca deve ter no máximo 255 caracteres')
];

// Validações de UUID
const uuidValidation = {
  param: (field = 'id') => [
    param(field)
      .isUUID()
      .withMessage(`${field} deve ser um UUID válido`)
  ]
};

// Função para verificar se há erros de validação
const checkValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array(),
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

module.exports = {
  authValidation,
  funcionarioValidation,
  faltaValidation,
  feriasValidation,
  equipeValidation,
  atestadoValidation,
  paginationValidation,
  uuidValidation,
  checkValidationErrors
};
