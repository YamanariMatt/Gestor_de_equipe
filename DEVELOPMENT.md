# 🛠️ Guia de Desenvolvimento - NEF

## 🚀 Comandos Rápidos

### Desenvolvimento
```bash
# Instalar todas as dependências
npm run setup

# Iniciar desenvolvimento (backend + frontend)
npm run dev

# Iniciar apenas backend
npm run dev:backend

# Iniciar apenas frontend  
npm run dev:frontend
```

### Produção
```bash
# Build do projeto
npm run build

# Iniciar em produção (backend + frontend)
npm start

# Iniciar apenas backend em produção
npm run start:backend
```

### Testes
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

### Qualidade de Código
```bash
# Lint de todo o projeto
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix

# Verificar formatação
npm run format:check

# Formatar código automaticamente
npm run format
```

### Utilitários
```bash
# Limpar cache e node_modules
npm run clean

# Reinstalar tudo do zero
npm run reset

# Verificar saúde do projeto
npm run check

# Verificar variáveis de ambiente
npm run check-env

# Testar conexão com Supabase
npm run db:test
```

## 📁 Estrutura do Projeto

```
nef/
├── backend/                 # API Node.js + Express
│   ├── controllers/         # Lógica de negócio
│   ├── middleware/          # Autenticação, validação
│   ├── routes/             # Definição de rotas
│   ├── services/           # Serviços externos
│   ├── utils/              # Utilitários
│   ├── server.js           # Servidor principal
│   └── package.json        # Dependências backend
├── frontend/               # App React + Vite
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── common/     # Componentes compartilhados
│   │   │   ├── ui/         # Componentes de interface
│   │   │   └── layouts/    # Layouts principais
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Context API (Auth, etc)
│   │   ├── services/       # API calls, validações
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilitários frontend
│   ├── public/             # Arquivos estáticos
│   ├── vite.config.js      # Configuração Vite
│   └── package.json        # Dependências frontend
├── database/               # Schema e seeds SQL
│   ├── schema.sql          # Estrutura do banco
│   └── seeds.sql           # Dados iniciais
├── docs/                   # Documentação adicional
├── package.json            # Scripts principais (monorepo)
├── .gitignore              # Arquivos ignorados pelo Git
└── README.md               # Documentação principal
```

## 🔧 Configuração de Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm 8+
- Git
- Conta Supabase
- Editor de código (VS Code recomendado)

### Extensões VS Code Recomendadas
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Configuração Inicial
1. Clone o repositório
2. Execute `npm run setup`
3. Configure os arquivos `.env` (backend e frontend)
4. Execute `npm run dev`

## 🌐 URLs de Desenvolvimento

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Preview**: http://localhost:4173

## 🔍 Debug e Logs

### Backend
```bash
# Debug mode
npm run dev:debug

# Verificar logs
tail -f backend/logs/app.log
```

### Frontend
- Console do navegador (F12)
- React DevTools
- Vite DevTools

## 📦 Dependências Principais

### Backend
- **Express**: Framework web
- **Supabase**: Banco de dados e auth
- **Helmet**: Segurança
- **CORS**: Cross-origin requests
- **Multer**: Upload de arquivos

### Frontend
- **React**: Biblioteca UI
- **Vite**: Build tool
- **React Router**: Roteamento
- **Tailwind CSS**: Estilização
- **React Query**: Estado do servidor
- **React Hook Form**: Formulários

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── backend/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── frontend/
    ├── components/
    ├── pages/
    └── utils/
```

### Convenções
- Arquivos de teste: `*.test.js` ou `*.spec.js`
- Mocks: `__mocks__/`
- Setup: `setupTests.js`

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev
```

### Staging
```bash
npm run build
npm run preview
```

### Produção
```bash
npm run build
npm start
```

## 🔒 Segurança

### Variáveis de Ambiente
- Nunca commitar arquivos `.env`
- Usar `.env.example` como template
- Validar variáveis obrigatórias

### Autenticação
- JWT tokens via Supabase
- Middleware de autenticação
- Controle de acesso por função

## 📝 Convenções de Código

### JavaScript/React
- ESLint + Prettier configurados
- Componentes em PascalCase
- Hooks em camelCase com 'use'
- Constantes em UPPER_SNAKE_CASE

### Git
- Commits em inglês
- Conventional Commits
- Branches: feature/nome, fix/nome, hotfix/nome

### CSS
- Tailwind CSS classes
- Componentes responsivos
- Mobile-first approach

## 🐛 Troubleshooting

### Problemas Comuns
1. **Porta ocupada**: Altere as portas no package.json
2. **Erro de CORS**: Verifique configuração do Vite
3. **Supabase connection**: Verifique variáveis .env
4. **Build falha**: Limpe cache com `npm run clean`

### Comandos de Diagnóstico
```bash
# Verificar saúde geral
npm run check

# Verificar backend
npm run check:backend

# Verificar frontend  
npm run check:frontend

# Testar conexão Supabase
npm run db:test
```

## 📞 Suporte

- **Documentação**: README.md
- **Issues**: GitHub Issues
- **Contato**: matheusvictormy@gmail.com
- **GitHub**: [@YamanariMatt](https://github.com/YamanariMatt)

---

**Happy Coding! 🚀**
