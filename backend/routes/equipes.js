const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Validações
const equipeValidation = [
  body('nome').notEmpty().withMessage('Nome da equipe é obrigatório'),
  body('descricao').optional()
];

// Listar equipes
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('equipes')
      .select('*')
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id)
      .order('nome');

    if (error) {
      return res.status(400).json({
        error: 'Erro ao buscar equipes',
        message: error.message
      });
    }

    res.json({ equipes: data });

  } catch (error) {
    console.error('Erro ao listar equipes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao buscar equipes'
    });
  }
});

// Criar equipe
router.post('/', equipeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const equipeData = {
      ...req.body,
      empresa_id: req.user.user_metadata?.empresa || req.user.id,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('equipes')
      .insert(equipeData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Erro ao criar equipe',
        message: error.message
      });
    }

    res.status(201).json({
      message: 'Equipe criada com sucesso',
      equipe: data
    });

  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao criar equipe'
    });
  }
});

module.exports = router;
