const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Validações
const faltaValidation = [
  body('funcionario_id').isUUID().withMessage('ID do funcionário inválido'),
  body('data_inicio').isISO8601().withMessage('Data de início inválida'),
  body('data_fim').isISO8601().withMessage('Data de fim inválida'),
  body('tipo').isIn(['falta', 'atraso', 'saida_antecipada']).withMessage('Tipo de falta inválido'),
  body('motivo').optional()
];

// Listar faltas
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, funcionario_id, data_inicio, data_fim, tipo } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('faltas')
      .select(`
        *,
        funcionarios(nome, cpf)
      `)
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id);

    // Filtros
    if (funcionario_id) {
      query = query.eq('funcionario_id', funcionario_id);
    }
    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }
    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }
    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('data_inicio', { ascending: false });

    if (error) {
      return res.status(400).json({
        error: 'Erro ao buscar faltas',
        message: error.message
      });
    }

    res.json({
      faltas: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar faltas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao buscar faltas'
    });
  }
});

// Criar falta
router.post('/', faltaValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const faltaData = {
      ...req.body,
      empresa_id: req.user.user_metadata?.empresa || req.user.id,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('faltas')
      .insert(faltaData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Erro ao registrar falta',
        message: error.message
      });
    }

    res.status(201).json({
      message: 'Falta registrada com sucesso',
      falta: data
    });

  } catch (error) {
    console.error('Erro ao criar falta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao registrar falta'
    });
  }
});

module.exports = router;
