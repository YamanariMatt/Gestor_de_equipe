const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Validações
const funcionarioValidation = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('cpf').isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 dígitos'),
  body('equipe_id').isUUID().withMessage('ID da equipe inválido'),
  body('cargo_id').isUUID().withMessage('ID do cargo inválido')
];

// Listar funcionários
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, equipe_id, ativo } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('funcionarios')
      .select(`
        *,
        equipes(nome),
        cargos(nome, salario)
      `)
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id);

    // Filtros
    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,cpf.ilike.%${search}%`);
    }
    if (equipe_id) {
      query = query.eq('equipe_id', equipe_id);
    }
    if (ativo !== undefined) {
      query = query.eq('ativo', ativo === 'true');
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('nome');

    if (error) {
      return res.status(400).json({
        error: 'Erro ao buscar funcionários',
        message: error.message
      });
    }

    res.json({
      funcionarios: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao buscar funcionários'
    });
  }
});

// Buscar funcionário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        *,
        equipes(nome),
        cargos(nome, salario)
      `)
      .eq('id', id)
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Funcionário não encontrado'
      });
    }

    res.json({ funcionario: data });

  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao buscar funcionário'
    });
  }
});

// Criar funcionário
router.post('/', funcionarioValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const funcionarioData = {
      ...req.body,
      empresa_id: req.user.user_metadata?.empresa || req.user.id,
      created_at: new Date().toISOString(),
      ativo: true
    };

    const { data, error } = await supabase
      .from('funcionarios')
      .insert(funcionarioData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Erro ao criar funcionário',
        message: error.message
      });
    }

    res.status(201).json({
      message: 'Funcionário criado com sucesso',
      funcionario: data
    });

  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao criar funcionário'
    });
  }
});

// Atualizar funcionário
router.put('/:id', funcionarioValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('funcionarios')
      .update(updateData)
      .eq('id', id)
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Funcionário não encontrado ou erro ao atualizar',
        message: error?.message
      });
    }

    res.json({
      message: 'Funcionário atualizado com sucesso',
      funcionario: data
    });

  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao atualizar funcionário'
    });
  }
});

// Deletar funcionário (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('funcionarios')
      .update({ 
        ativo: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Funcionário não encontrado'
      });
    }

    res.json({
      message: 'Funcionário desativado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao desativar funcionário'
    });
  }
});

// Reativar funcionário
router.patch('/:id/reativar', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('funcionarios')
      .update({ 
        ativo: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Funcionário não encontrado'
      });
    }

    res.json({
      message: 'Funcionário reativado com sucesso',
      funcionario: data
    });

  } catch (error) {
    console.error('Erro ao reativar funcionário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao reativar funcionário'
    });
  }
});

module.exports = router;
