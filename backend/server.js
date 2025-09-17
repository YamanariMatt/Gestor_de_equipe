const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { authenticateToken, requireAuthorizedUser, validateEmpresa } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const funcionariosRoutes = require('./routes/funcionarios');
const faltasRoutes = require('./routes/faltas');
const feriasRoutes = require('./routes/ferias');
const atestadosRoutes = require('./routes/atestados');
const equipesRoutes = require('./routes/equipes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares de segurança
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/faltas', faltasRoutes);
app.use('/api/ferias', feriasRoutes);
app.use('/api/atestados', atestadosRoutes);
app.use('/api/equipes', equipesRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NEF API está funcionando',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Rota de informações da API
app.get('/api/info', (req, res) => {
  res.json({
    name: 'NEF API',
    version: '2.0.0',
    description: 'Sistema de Gestão de Equipe',
    endpoints: {
      auth: '/api/auth',
      funcionarios: '/api/funcionarios',
      faltas: '/api/faltas',
      ferias: '/api/ferias',
      atestados: '/api/atestados',
      equipes: '/api/equipes'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Aplicar middleware de autenticação e autorização a rotas protegidas
// (exceto auth e health check)
app.use('/api/funcionarios', authenticateToken, requireAuthorizedUser);
app.use('/api/faltas', authenticateToken, requireAuthorizedUser);
app.use('/api/ferias', authenticateToken, requireAuthorizedUser);
app.use('/api/atestados', authenticateToken, requireAuthorizedUser);
app.use('/api/equipes', authenticateToken, requireAuthorizedUser);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe`
  });
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 NEF - Sistema de Gestão de Equipe');
  console.log('='.repeat(50));
  console.log(`📡 Servidor rodando na porta: ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 API Info: http://localhost:${PORT}/api/info`);
  console.log(`🌐 CORS Origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('='.repeat(50) + '\n');
});

module.exports = app;
