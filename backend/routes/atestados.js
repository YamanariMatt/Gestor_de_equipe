const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configurar multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use JPG, PNG ou PDF.'), false);
    }
  }
});

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Validações
const atestadoValidation = [
  body('funcionario_id').isUUID().withMessage('ID do funcionário inválido'),
  body('data_inicio').isISO8601().withMessage('Data de início inválida'),
  body('data_fim').isISO8601().withMessage('Data de fim inválida'),
  body('tipo').isIn(['medico', 'odontologico', 'psicologico', 'outros']).withMessage('Tipo de atestado inválido'),
  body('observacoes').optional()
];

// Listar atestados
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, funcionario_id, tipo, data_inicio, data_fim } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('atestados')
      .select(`
        *,
        funcionarios(nome, cpf)
      `)
      .eq('empresa_id', req.user.user_metadata?.empresa || req.user.id);

    // Filtros
    if (funcionario_id) {
      query = query.eq('funcionario_id', funcionario_id);
    }
    if (tipo) {
      query = query.eq('tipo', tipo);
    }
    if (data_inicio) {
      query = query.gte('data_inicio', data_inicio);
    }
    if (data_fim) {
      query = query.lte('data_fim', data_fim);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('data_inicio', { ascending: false });

    if (error) {
      return res.status(400).json({
        error: 'Erro ao buscar atestados',
        message: error.message
      });
    }

    res.json({
      atestados: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar atestados:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao buscar atestados'
    });
  }
});

// Criar atestado com upload de arquivo
router.post('/', upload.single('arquivo'), atestadoValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    let arquivo_url = null;

    // Upload do arquivo se fornecido
    if (req.file) {
      const fileName = `atestados/${req.user.id}/${Date.now()}-${req.file.originalname}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        return res.status(400).json({
          error: 'Erro ao fazer upload do arquivo',
          message: uploadError.message
        });
      }

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(fileName);

      arquivo_url = urlData.publicUrl;
    }

    const atestadoData = {
      ...req.body,
      arquivo_url,
      empresa_id: req.user.user_metadata?.empresa || req.user.id,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('atestados')
      .insert(atestadoData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Erro ao registrar atestado',
        message: error.message
      });
    }

    res.status(201).json({
      message: 'Atestado registrado com sucesso',
      atestado: data
    });

  } catch (error) {
    console.error('Erro ao criar atestado:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao registrar atestado'
    });
  }
});

module.exports = router;
