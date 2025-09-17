const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Validações
const feriasValidation = [
  body('funcionario_id').isUUID().withMessage('ID do funcionário inválido'),
  body('data_inicio').isISO8601().withMessage('Data de início inválida'),
  body('data_fim').isISO8601().withMessage('Data de fim inválida'),
  body('status').isIn(['solicitado', 'aprovado', 'rejeitado', 'em_andamento', 'concluido']).withMessage('Status inválido')
];

// Listar férias
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, funcionario_id, status, ano } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('ferias')
      .select(`
        *,
        funcionarios(nome, cpf)
      `)
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id);

    // Filtros
    if (funcionario_id) {
      query = query.eq('funcionario_id', funcionario_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (ano) {
      query = query.gte('data_inicio', `${ano}-01-01`).lt('data_inicio', `${parseInt(ano) + 1}-01-01`);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('data_inicio', { ascending: false });

    if (error) {
      return res.status(400).json({
        error: 'Erro ao buscar férias',
        message: error.message
      });
    }

    res.json({
      ferias: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar férias:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao buscar férias'
    });
  }
});

// Criar período de férias
router.post('/', feriasValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const feriasData = {
      ...req.body,
      empresa_id: req.user.user_metadata?.empresa || req.user.id,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ferias')
      .insert(feriasData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Erro ao registrar férias',
        message: error.message
      });
    }

    res.status(201).json({
      message: 'Férias registradas com sucesso',
      ferias: data
    });

  } catch (error) {
    console.error('Erro ao criar férias:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao registrar férias'
    });
  }
});

module.exports = router;
