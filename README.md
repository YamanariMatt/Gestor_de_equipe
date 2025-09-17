# � Usuários de Teste

Adicione o seguinte usuário de teste no Supabase Auth (Authentication > Users):

| E-mail                          | UID                                   |
|----------------------------------|---------------------------------------|
| matheus.yamanari@extranef.com.br | cfdfd49f-2180-4c66-991e-392c0fff8f12  |

> **Importante:** Defina a senha manualmente pelo painel do Supabase ou envie convite de redefinição de senha.
# �🚀 NEF - Sistema de Gestão de Equipe

> **Sistema web profissional para gestão completa de funcionários, faltas, férias e atestados com controle de acesso restrito**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/YamanariMatt/Gestor_de_equipe)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2+-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/supabase-latest-green.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Funcionalidades Completas](#-funcionalidades-completas)
- [🛠️ Tecnologias](#-tecnologias)
- [📋 Pré-requisitos](#-pré-requisitos)
- [🛠️ Instalação e Configuração](#-instalação-e-configuração)
- [🔐 Configuração de Segurança](#-configuração-de-segurança)
- [☁️ Deploy Completo](#-deploy-completo)
- [🎯 Como Usar o Sistema](#-como-usar-o-sistema)
- [🏗️ Estrutura do Projeto](#-estrutura-do-projeto)
- [🛡️ Recursos de Segurança](#-recursos-de-segurança)
- [🚨 Solução de Problemas](#-solução-de-problemas)
- [🔧 Desenvolvimento](#-desenvolvimento)
- [🤝 Contribuição](#-contribuição)
- [📞 Suporte](#-suporte)

## 🎯 Sobre o Projeto

O **NEF** é um sistema web profissional e moderno desenvolvido com React 18, Node.js e Supabase para gestão completa de equipes empresariais. Oferece controle total de funcionários, registro de faltas, gestão de férias, upload de atestados médicos e relatórios analíticos, com **acesso restrito** apenas para supervisores e gestores autorizados.

### ✨ **Destaques da Versão 2.0**

- 🎨 **Interface Profissional**: Componentes reutilizáveis e design system completo
- 🔐 **Segurança Avançada**: Autenticação JWT, RLS e validações robustas
- 📊 **Analytics Integrado**: Dashboards e relatórios em tempo real
- 🚀 **Performance Otimizada**: Lazy loading, caching e otimizações de bundle
- 📱 **Mobile-First**: Design responsivo para todos os dispositivos
- 🛠️ **DevOps Ready**: Scripts automatizados, linting e testes integrados

### ✨ Características Principais

- 🌐 **Aplicação Web**: Interface moderna e responsiva
- 🔐 **Acesso Restrito**: Apenas 5 usuários pré-autorizados
- ☁️ **Banco de Dados**: PostgreSQL via Supabase com Row Level Security
- 📊 **Relatórios Avançados**: Dashboards interativos e exportações
- 🎨 **Interface Moderna**: Design system com Tailwind CSS
- 🛡️ **Segurança Robusta**: JWT, RLS e múltiplas camadas de validação
- 🚀 **Monorepo**: Estrutura organizada com scripts automatizados
- 📱 **Mobile-First**: Responsivo para todos os dispositivos

### 🎯 Objetivos do Sistema

O NEF foi desenvolvido para organizações que necessitam de controle rigoroso na gestão de recursos humanos, oferecendo:

- **🔒 Segurança Máxima**: Acesso controlado com autenticação JWT e RLS
- **👥 Gestão Centralizada**: Controle completo de funcionários, equipes e hierarquias
- **📈 Análises Precisas**: Relatórios detalhados para tomada de decisões estratégicas
- **⚡ Performance**: Interface otimizada com carregamento rápido
- **🔄 Escalabilidade**: Arquitetura preparada para crescimento organizacional
- **📱 Acessibilidade**: Design responsivo para uso em qualquer dispositivo

### 👥 Usuários Autorizados

| Nome | Email | Função | Status |
|------|-------|--------|--------|
| **Felype Simões** | felypesimones@nefadv.com.br | Supervisor | ✅ Autorizado |
| **José Silva** | jose.silva@extranef.com.br | Supervisor | ✅ Autorizado |
| **Júlio Gonçalves** | juliogoncalves@nefadv.com.br | Gerente | ✅ Autorizado |
| **Ediel Winicius** | edielwinicius@nefadv.com.br | RH | ✅ Autorizado |
| **Maria Oliveira** | mariaoliveira@nefadv.com.br | Supervisor | ✅ Autorizado |

> ⚠️ **Importante**: O sistema possui controle de acesso rigoroso. Apenas estes 5 usuários podem fazer login e acessar todas as funcionalidades.

## 🚀 Funcionalidades Completas

### 👥 **Gestão de Funcionários**
- **Cadastro Completo**: Nome, CPF, email, telefone, cargo, equipe
- **Controle de Status**: Ativo/Inativo com histórico de mudanças
- **Organização por Equipes**: Atribuição e transferência entre equipes
- **Busca Avançada**: Filtros por nome, cargo, equipe, status
- **Histórico Completo**: Registro de todas as alterações com timestamp
- **Validações**: CPF, email único, campos obrigatórios
- **Interface Intuitiva**: Formulários responsivos com validação em tempo real

### 📅 **Controle de Faltas**
- **Registro Detalhado**: Data, motivo, observações, tipo de falta
- **Tipos de Falta**: Justificada, injustificada, médica, pessoal
- **Sistema de Aprovação**: Workflow para supervisores aprovarem/rejeitarem
- **Relatórios por Período**: Diário, semanal, mensal, anual
- **Estatísticas Avançadas**: Frequência por funcionário e equipe
- **Notificações**: Alertas para faltas pendentes de aprovação
- **Exportação**: CSV/JSON com filtros personalizados

### 🏖️ **Gestão de Férias**
- **Planejamento Anual**: Calendário visual para planejamento
- **Workflow de Aprovação**: Solicitação → Análise → Aprovação/Rejeição
- **Controle de Saldo**: Dias disponíveis, usados e pendentes
- **Períodos Múltiplos**: Divisão de férias em períodos menores
- **Conflitos**: Verificação automática de sobreposição de datas
- **Relatórios Detalhados**: Por funcionário, equipe e período
- **Histórico Completo**: Todas as férias anteriores com status

### 🏥 **Atestados Médicos**
- **Upload Seguro**: Suporte a PDF, JPG, PNG com validação
- **Validação Automática**: Verificação de datas e períodos
- **Organização**: Pasta por funcionário com nomenclatura padronizada
- **Visualização**: Preview de documentos diretamente no sistema
- **Download**: Acesso controlado aos documentos
- **Integração**: Vinculação automática com faltas médicas
- **Backup**: Armazenamento seguro no Supabase Storage

### 👨‍👩‍👧‍👦 **Gestão de Equipes**
- **Criação de Equipes**: Nome, descrição, cor identificadora
- **Gestão de Membros**: Adicionar/remover funcionários
- **Hierarquia**: Definição de supervisores por equipe
- **Estatísticas**: Métricas de desempenho por equipe
- **Relatórios Comparativos**: Análise entre diferentes equipes
- **Visualização**: Cards coloridos com contadores em tempo real

### 📊 **Dashboard e Relatórios**
- **Métricas em Tempo Real**: Contadores dinâmicos atualizados automaticamente
- **Gráficos Interativos**: Recharts com drill-down e filtros
- **Análises Avançadas**: Tendências, padrões e insights
- **Exportações Personalizadas**: CSV, JSON, PDF com filtros
- **Dashboards por Função**: Visões específicas para supervisores e gestores
- **Alertas Inteligentes**: Notificações para situações que requerem atenção

### 🔐 **Sistema de Autenticação**
- **Login Seguro**: JWT tokens via Supabase
- **Controle de Acesso**: Validação de usuários autorizados
- **Sessões Seguras**: Timeout automático e renovação de tokens
- **Logs de Auditoria**: Registro de todas as tentativas de acesso
- **Recuperação de Senha**: Sistema seguro de reset (para usuários autorizados)

#### **👥 Usuários Autorizados**
O sistema NEF possui **acesso restrito** apenas para supervisores e gestores autorizados:

| Email | Nome | Função |
|-------|------|--------|
| `felypesimones@nefadv.com.br` | Felype Simões | Supervisor |
| `jose.silva@extranef.com.br` | José Silva | Supervisor |
| `juliogoncalves@nefadv.com.br` | Júlio Gonçalves | Gerente |
| `edielwinicius@nefadv.com.br` | Ediel Winicius | RH |
| `mariaoliveira@nefadv.com.br` | Maria Oliveira | Supervisor |

> ⚠️ **Importante**: Apenas estes usuários podem acessar o sistema. Tentativas de acesso com outros emails serão bloqueadas automaticamente.

### 📱 **Interface Responsiva**
- **Design Mobile-First**: Otimizado para dispositivos móveis
- **Navegação Intuitiva**: Menu lateral colapsável
- **Tema Moderno**: Cores consistentes e tipografia legível
- **Acessibilidade**: Suporte a leitores de tela e navegação por teclado
- **Performance**: Carregamento rápido com lazy loading

## 🛠️ Tecnologias

### **Frontend**
- **React 18**: Biblioteca para interfaces modernas
- **Vite**: Build tool rápida e otimizada
- **Tailwind CSS**: Framework CSS utilitário responsivo
- **React Query**: Gerenciamento de estado do servidor
- **React Hook Form**: Formulários performáticos com validação
- **React Router**: Roteamento SPA
- **Lucide Icons**: Ícones SVG modernos e leves
- **Headless UI**: Componentes acessíveis

### **Backend**
- **Node.js 18+**: Runtime JavaScript moderno
- **Express**: Framework web minimalista
- **Supabase**: Backend as a Service completo
- **JWT**: Autenticação segura com tokens
- **Express Validator**: Validação robusta de dados
- **Helmet**: Middleware de segurança
- **Morgan**: Logging de requisições
- **Rate Limiting**: Proteção contra ataques
- **Multer**: Upload seguro de arquivos

### **Banco de Dados**
- **PostgreSQL 15+**: Via Supabase
- **Row Level Security (RLS)**: Isolamento de dados por usuário
- **Real-time**: Atualizações em tempo real
- **Triggers**: Automação de processos
- **Constraints**: Integridade referencial
- **Indexes**: Performance otimizada

### **DevOps & Qualidade**
- **ESLint**: Análise estática de código
- **Prettier**: Formatação automática
- **Husky**: Git hooks automatizados
- **Concurrently**: Execução paralela de scripts
- **Dotenv**: Gerenciamento de variáveis de ambiente

## 📋 Pré-requisitos

### **Ambiente de Desenvolvimento**
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 8+ ou **yarn** (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Editor de Código** (VS Code recomendado)

### **Contas Necessárias**
- **Conta Supabase** ([Criar conta gratuita](https://supabase.com))
- **Conta Render** ([Criar conta gratuita](https://render.com)) - opcional para deploy

### **Extensões VS Code Recomendadas**
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Rename Tag
- GitLens
- Bracket Pair Colorizer
- Auto Import - ES6, TS, JSX, TSX

## 🛠️ Instalação e Configuração

### 🚀 Passo 1: Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/YamanariMatt/Gestor_de_equipe.git
cd Gestor_de_equipe

# Instale todas as dependências (backend + frontend)
npm run setup
```

### 🔧 Passo 2: Configure o Supabase

#### 2.1 Criar Projeto no Supabase

1. **Acesse** [supabase.com](https://supabase.com) e faça login
2. **Clique** em "New Project"
3. **Preencha** os dados:
   - **Name**: `nef-sistema-gestao`
   - **Database Password**: Gere uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
4. **Clique** em "Create new project"
5. **Aguarde** a criação (2-3 minutos)
6. **Anote** a URL do projeto e as chaves de API

#### 2.2 Configure o Banco de Dados

1. **Acesse** a aba "SQL Editor" no painel do Supabase
2. **Execute** o schema:
   - Copie todo o conteúdo de `database/schema.sql`
   - Cole no SQL Editor e clique em "Run"
3. **Execute** os seeds:
   - Copie todo o conteúdo de `database/seeds.sql`
   - Cole no SQL Editor e clique em "Run"

#### 2.3 Configure Storage para Atestados

1. **Acesse** a aba "Storage"
2. **Clique** em "Create a new bucket"
3. **Nome**: `atestados`
4. **Public bucket**: ✅ Marque como público
5. **Clique** em "Create bucket"

#### 2.4 Obtenha as Chaves do Supabase

1. **Acesse** Settings → API
2. **Anote** as seguintes informações:
   - **Project URL**
   - **anon/public key**
   - **service_role key**
3. **Acesse** Settings → Auth
4. **Anote** o **JWT Secret**

### 🔐 Passo 3: Configure as Variáveis de Ambiente

#### 3.1 Backend (.env)
```bash
# Copie o arquivo de exemplo
cp backend/.env.example backend/.env

# Edite o arquivo backend/.env com suas configurações:
```

```env
# NEF Backend - Configurações de Ambiente

# Configurações do Servidor
NODE_ENV=development
PORT=3001

# URL do Frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Configurações do Supabase
SUPABASE_URL=sua_url_do_supabase_aqui
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_KEY=sua_chave_de_servico_aqui

# JWT Secret (obtenha do Supabase Dashboard > Settings > API)
JWT_SECRET=seu_jwt_secret_do_supabase_aqui

# Configurações de Upload
MAX_FILE_SIZE=10485760

# Configurações de Segurança
BCRYPT_ROUNDS=12
```

#### 3.2 Frontend (.env)
```bash
# Copie o arquivo de exemplo
cp frontend/.env.example frontend/.env

# Edite o arquivo frontend/.env com suas configurações:
```

```env
# NEF Frontend - Configurações de Ambiente

# Configurações do Supabase
VITE_SUPABASE_URL=sua_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# URL da API Backend
VITE_API_URL=http://localhost:3001

# Configurações de Desenvolvimento
VITE_APP_NAME=NEF
VITE_APP_VERSION=2.0.0
```

### 👥 Passo 4: Configure os Usuários Autorizados

#### 4.1 Criar Usuários no Supabase Auth

1. **Acesse** Authentication → Users no painel do Supabase
2. **Clique** em "Add user"
3. **Crie** cada usuário autorizado:

```
Email: felypesimones@nefadv.com.br
Password: [senha segura]
Role: Supervisor

Email: jose.silva@extranef.com.br
Password: [senha segura]
Role: Supervisor

Email: juliogoncalves@nefadv.com.br
Password: [senha segura]
Role: Gerente

Email: edielwinicius@nefadv.com.br
Password: [senha segura]
Role: RH

Email: mariaoliveira@nefadv.com.br
Password: [senha segura]
Role: Supervisor
```

4. **Anote** os UUIDs gerados para cada usuário

#### 4.2 Atualize os Perfis no Banco

1. **Acesse** SQL Editor no Supabase
2. **Execute** as atualizações com os UUIDs reais:

```sql
-- Substitua os UUIDs pelos IDs reais do Supabase Auth
UPDATE profiles SET id = 'UUID_REAL_FELYPE' WHERE username = 'felype.simones';
UPDATE profiles SET id = 'UUID_REAL_JOSE' WHERE username = 'jose.felipe';
UPDATE profiles SET id = 'UUID_REAL_MARIA' WHERE username = 'maria.pereira';
UPDATE profiles SET id = 'UUID_REAL_JULIO' WHERE username = 'julio.goncalves';
```

### 🚀 Passo 5: Execute o Sistema

#### 5.1 Desenvolvimento Local

```bash
# Inicia backend e frontend simultaneamente
npm run dev

# Ou execute separadamente:
npm run dev:backend    # Backend: http://localhost:3001
npm run dev:frontend   # Frontend: http://localhost:5173
```

#### 5.2 Acesse o Sistema

1. **Abra** o navegador em: http://localhost:5173
2. **Clique** em "Login"
3. **Use** as credenciais de um usuário autorizado
4. **Sistema** validará automaticamente o acesso

#### 5.3 Produção

```bash
# Build completo (backend + frontend)
npm run build

# Inicia em produção (backend + frontend)
npm start
```

## 🔐 Configuração de Segurança

### 🛡️ Controles de Acesso Implementados

O sistema NEF possui **múltiplas camadas de segurança** para garantir acesso restrito:

#### ✅ **Frontend (React)**
- **Validação prévia** de email autorizado no login
- **Carregamento automático** do perfil do usuário
- **Logout automático** para usuários não autorizados
- **Mensagens de erro** personalizadas e informativas
- **Página de registro desabilitada** com mensagem informativa

#### ✅ **Backend (Node.js + Express)**
- **Middleware de autenticação** em todas as rotas `/api`
- **Verificação de token JWT** via Supabase
- **Validação de perfil** e status ativo
- **Controle de acesso por função** (admin, supervisor, gestor, gerente, rh)
- **Lista de usuários autorizados** validada por email no middleware
- **Endpoint de registro desabilitado** retornando erro 403
- **Atualização de último login** para auditoria

#### ✅ **Banco de Dados (Supabase + PostgreSQL)**
- **Row Level Security (RLS)** configurado
- **Isolamento por empresa** nos dados
- **Campos de controle**: `ativo`, `primeiro_acesso`, `ultimo_login`
- **Validações de integridade** referencial

### 🔍 **Logs de Auditoria**

O sistema registra automaticamente:
- **Tentativas de login** (sucesso e falha)
- **Tentativas de acesso não autorizado**
- **Alterações nos dados** com timestamp e usuário
- **Uploads de arquivos** com metadata
- **Mudanças de status** de funcionários

### ⚠️ **Importantes Observações de Segurança**

1. **Registro Desabilitado**: A página de registro foi completamente desabilitada
2. **Emails Autorizados**: O sistema verifica emails contra uma lista fixa de 5 usuários
3. **Roles Atualizadas**: Suporte para supervisor, gestor, gerente, rh e admin
4. **Validação Dupla**: Por email (principal) e username (backup)
5. **Middleware Robusto**: Autenticação JWT + validação de usuário autorizado
6. **Sessões Seguras**: Tokens JWT com expiração automática
7. **Isolamento de Dados**: Row Level Security (RLS) no Supabase

## ☁️ Deploy Completo

### 🚀 **Deploy no Render (Recomendado)**

#### **Pré-requisitos para Deploy**
- ✅ Projeto configurado localmente e funcionando
- ✅ Conta no [Render](https://render.com) (gratuita)
- ✅ Repositório Git (GitHub, GitLab ou Bitbucket)
- ✅ Supabase configurado e funcionando

#### **Passo 1: Preparar o Repositório**

```bash
# Certifique-se de que todos os arquivos estão commitados
git add .
git commit -m "Preparar para deploy"
git push origin main
```

#### **Passo 2: Deploy do Backend**

1. **Acesse** [render.com](https://render.com) e faça login
2. **Clique** em "New +" → "Web Service"
3. **Conecte** seu repositório Git
4. **Configure** o serviço:

```yaml
Name: nef-backend
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

5. **Configure** as variáveis de ambiente:

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://seu-frontend.onrender.com
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_KEY=sua_chave_de_servico
JWT_SECRET=seu_jwt_secret
MAX_FILE_SIZE=10485760
BCRYPT_ROUNDS=12
```

6. **Clique** em "Create Web Service"
7. **Aguarde** o deploy (5-10 minutos)
8. **Anote** a URL gerada (ex: `https://nef-backend.onrender.com`)

#### **Passo 3: Deploy do Frontend**

1. **Clique** em "New +" → "Static Site"
2. **Conecte** o mesmo repositório
3. **Configure** o site:

```yaml
Name: nef-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

4. **Configure** as variáveis de ambiente:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_API_URL=https://nef-backend.onrender.com
VITE_APP_NAME=NEF
VITE_APP_VERSION=1.0.0
```

5. **Clique** em "Create Static Site"
6. **Aguarde** o deploy (3-5 minutos)
7. **Anote** a URL gerada (ex: `https://nef-frontend.onrender.com`)

#### **Passo 4: Atualizar Configurações**

1. **Volte** ao backend no Render
2. **Atualize** a variável `FRONTEND_URL` com a URL real do frontend
3. **Redeploy** o backend

#### **Passo 5: Configurar CORS no Supabase**

1. **Acesse** o painel do Supabase
2. **Vá** para Settings → API
3. **Em** "CORS origins", adicione:
   - `https://nef-frontend.onrender.com`
   - `https://nef-backend.onrender.com`

#### **Passo 6: Testar o Deploy**

1. **Acesse** a URL do frontend
2. **Teste** o login com um usuário autorizado
3. **Verifique** todas as funcionalidades
4. **Monitore** os logs no Render para erros

### 🔧 **Deploy Alternativo (Vercel + Railway)**

#### **Frontend no Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy do frontend
cd frontend
vercel --prod
```

#### **Backend no Railway**
1. **Acesse** [railway.app](https://railway.app)
2. **Conecte** o repositório
3. **Configure** as variáveis de ambiente
4. **Deploy** automático

### 🌐 **Deploy com Docker (Avançado)**

#### **Dockerfile Backend**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

#### **Dockerfile Frontend**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **Docker Compose**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🏗️ Estrutura do Projeto

```
nef/
├── backend/                 # API Node.js + Express
│   ├── config/             # Configurações (Supabase, etc)
│   ├── middleware/         # Middlewares de autenticação
│   ├── routes/             # Rotas da API
│   ├── .env.example        # Exemplo de variáveis de ambiente
│   ├── package.json        # Dependências do backend
│   └── server.js           # Servidor principal
├── frontend/               # Aplicação React
│   ├── public/             # Arquivos públicos
│   ├── src/                # Código fonte
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Contextos (Auth, etc)
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços (API, Supabase)
│   │   └── main.jsx        # Ponto de entrada
│   ├── .env.example        # Exemplo de variáveis de ambiente
│   └── package.json        # Dependências do frontend
├── database/               # Schema e seeds SQL
│   ├── schema.sql          # Estrutura do banco
│   └── seeds.sql           # Dados iniciais
├── INITIAL_SETUP.md        # Guia de configuração inicial
├── DEPLOY_GUIDE.md         # Guia de deploy
└── package.json            # Configuração do monorepo
```

## 🛡️ Segurança

### **Acesso Restrito**
O sistema NEF possui **controle de acesso rigoroso**:

- ✅ **Apenas 4 usuários autorizados** podem acessar
- ✅ **Validação em múltiplas camadas** (frontend + backend)
- ✅ **Registro de novos usuários desabilitado**
- ✅ **Logs de tentativas não autorizadas**

### **Usuários Autorizados**
1. **Felype Simões** - Supervisor
2. **José Felipe** - Gestor
3. **Maria Pereira** - Gestora
4. **Júlio Gonçalves** - Supervisor

### **Tecnologias de Segurança**
- **JWT Tokens** via Supabase
- **Row Level Security (RLS)** no banco
- **Middleware de autenticação** em todas as rotas
- **Validação de roles** (admin, supervisor, gestor)

## 🎯 Como Usar o Sistema

### 🔐 **1. Acesso e Login**

#### **1.1 Acessar o Sistema**
- **Local**: http://localhost:5173
- **Produção**: URL do seu deploy no Render

#### **1.2 Fazer Login**
1. **Clique** em "Login" na página inicial
2. **Digite** o email de um usuário autorizado:
   - `felype.simones@empresa.com`
   - `jose.felipe@empresa.com`
   - `maria.pereira@empresa.com`
   - `julio.goncalves@empresa.com`
3. **Digite** a senha configurada no Supabase
4. **Clique** em "Entrar"
5. **Sistema** validará automaticamente o acesso

#### **1.3 Primeira Vez no Sistema**
- Sistema detecta primeiro acesso automaticamente
- Perfil é carregado com função (Supervisor/Gestor)
- Acesso às funcionalidades liberado conforme a função

### 🏠 **2. Dashboard Principal**

#### **2.1 Visão Geral**
O dashboard apresenta:
- **Métricas em Tempo Real**: Total de funcionários, faltas pendentes, férias aprovadas
- **Gráficos Interativos**: Tendências de faltas, distribuição por equipes
- **Atividades Recentes**: Últimas ações no sistema
- **Alertas**: Situações que requerem atenção

#### **2.2 Navegação**
- **Menu Lateral**: Acesso a todas as funcionalidades
- **Breadcrumbs**: Navegação hierárquica
- **Busca Global**: Pesquisa rápida por funcionários
- **Perfil do Usuário**: Configurações e logout

### 👥 **3. Gestão de Funcionários**

#### **3.1 Listar Funcionários**
1. **Clique** em "Funcionários" no menu lateral
2. **Visualize** a lista com filtros:
   - Por equipe
   - Por status (Ativo/Inativo)
   - Por cargo
   - Busca por nome/CPF

#### **3.2 Cadastrar Novo Funcionário**
1. **Clique** no botão "Novo Funcionário"
2. **Preencha** os dados obrigatórios:
   - Nome completo
   - CPF (validação automática)
   - Email (único no sistema)
   - Telefone
   - Cargo
   - Equipe
   - Data de admissão
3. **Clique** em "Salvar"
4. **Sistema** valida e confirma o cadastro

#### **3.3 Editar Funcionário**
1. **Clique** no ícone de edição na lista
2. **Modifique** os dados necessários
3. **Salve** as alterações
4. **Histórico** é mantido automaticamente

#### **3.4 Inativar/Ativar Funcionário**
1. **Clique** no toggle de status
2. **Confirme** a ação
3. **Sistema** atualiza status e registra no histórico

### 📅 **4. Controle de Faltas**

#### **4.1 Registrar Nova Falta**
1. **Acesse** "Faltas" no menu
2. **Clique** em "Nova Falta"
3. **Selecione** o funcionário
4. **Escolha** a data da falta
5. **Defina** o tipo:
   - Justificada
   - Injustificada
   - Médica
   - Pessoal
6. **Adicione** motivo e observações
7. **Salve** o registro

#### **4.2 Aprovar/Rejeitar Faltas**
1. **Visualize** faltas pendentes no dashboard
2. **Clique** na falta para detalhes
3. **Analise** as informações
4. **Escolha** "Aprovar" ou "Rejeitar"
5. **Adicione** comentários se necessário
6. **Confirme** a decisão

#### **4.3 Relatórios de Faltas**
1. **Acesse** a aba "Relatórios"
2. **Selecione** o período desejado
3. **Filtre** por funcionário/equipe
4. **Visualize** gráficos e estatísticas
5. **Exporte** em CSV/JSON se necessário

### 🏖️ **5. Gestão de Férias**

#### **5.1 Solicitar Férias**
1. **Acesse** "Férias" no menu
2. **Clique** em "Nova Solicitação"
3. **Selecione** o funcionário
4. **Defina** o período:
   - Data de início
   - Data de fim
   - Tipo (30 dias, 15 dias, etc.)
5. **Verifique** conflitos automaticamente
6. **Adicione** observações
7. **Envie** para aprovação

#### **5.2 Aprovar Férias**
1. **Visualize** solicitações pendentes
2. **Analise** o calendário de conflitos
3. **Verifique** saldo de dias disponíveis
4. **Aprove** ou **rejeite** com justificativa
5. **Sistema** atualiza saldo automaticamente

#### **5.3 Calendário de Férias**
1. **Visualize** o calendário anual
2. **Filtre** por equipe/funcionário
3. **Identifique** períodos de alta demanda
4. **Planeje** distribuição equilibrada

### 🏥 **6. Atestados Médicos**

#### **6.1 Upload de Atestado**
1. **Acesse** "Atestados" no menu
2. **Clique** em "Novo Atestado"
3. **Selecione** o funcionário
4. **Faça upload** do arquivo (PDF, JPG, PNG)
5. **Defina** o período de afastamento
6. **Adicione** observações médicas
7. **Salve** o documento

#### **6.2 Validar Atestado**
1. **Visualize** atestados pendentes
2. **Clique** para ver o documento
3. **Verifique** datas e informações
4. **Valide** ou **rejeite** com motivo
5. **Sistema** vincula automaticamente às faltas

#### **6.3 Organizar Documentos**
- **Pastas automáticas** por funcionário
- **Nomenclatura padronizada** com data
- **Backup seguro** no Supabase Storage
- **Acesso controlado** por função

### 👨‍👩‍👧‍👦 **7. Gestão de Equipes**

#### **7.1 Criar Nova Equipe**
1. **Acesse** "Equipes" no menu
2. **Clique** em "Nova Equipe"
3. **Defina**:
   - Nome da equipe
   - Descrição
   - Cor identificadora
   - Supervisor responsável
4. **Salve** a equipe

#### **7.2 Gerenciar Membros**
1. **Selecione** uma equipe
2. **Adicione** funcionários disponíveis
3. **Remova** membros se necessário
4. **Defina** hierarquias internas
5. **Atualize** responsabilidades

#### **7.3 Relatórios por Equipe**
1. **Visualize** métricas por equipe
2. **Compare** desempenho entre equipes
3. **Identifique** padrões e tendências
4. **Exporte** relatórios comparativos

### 📊 **8. Relatórios e Análises**

#### **8.1 Dashboard Executivo**
- **KPIs principais** em tempo real
- **Gráficos de tendências** mensais/anuais
- **Alertas automáticos** para situações críticas
- **Comparativos** entre períodos

#### **8.2 Relatórios Personalizados**
1. **Selecione** o tipo de relatório
2. **Defina** filtros e períodos
3. **Escolha** formato de exportação
4. **Gere** e baixe o relatório

#### **8.3 Análises Avançadas**
- **Padrões de ausência** por funcionário
- **Sazonalidade** de faltas e férias
- **Produtividade** por equipe
- **Previsões** baseadas em histórico

### 🔧 **9. Configurações do Sistema**

#### **9.1 Perfil do Usuário**
1. **Clique** no avatar no canto superior direito
2. **Visualize** informações do perfil
3. **Atualize** dados pessoais se permitido
4. **Altere** senha se necessário

#### **9.2 Configurações Gerais**
- **Tema**: Claro/escuro
- **Idioma**: Português (padrão)
- **Fuso horário**: Configuração automática
- **Notificações**: Ativar/desativar alertas

### 🚪 **10. Logout e Segurança**

#### **10.1 Sair do Sistema**
1. **Clique** no avatar
2. **Selecione** "Sair"
3. **Confirme** o logout
4. **Sistema** invalida a sessão automaticamente

#### **10.2 Sessões Seguras**
- **Timeout automático** após inatividade
- **Renovação** de tokens em segundo plano
- **Logout forçado** em caso de problemas de segurança
- **Logs de auditoria** para todas as ações

## 📊 Relatórios e Exportações

- **Dashboards interativos** com gráficos em tempo real
- **Exportações em CSV/JSON** personalizáveis
- **Relatórios por período** (dia, semana, mês, ano)
- **Métricas por equipe** e funcionário
- **Análises avançadas** de frequência e produtividade

## ☁️ Deploy

O sistema NEF pode ser facilmente deployado usando o **Render** para hospedagem. Consulte o arquivo `DEPLOY_GUIDE.md` para instruções detalhadas.

### **Deploy Automático**
1. **Backend**: Deploy no Render como Web Service
2. **Frontend**: Deploy no Render como Static Site
3. **Banco**: Supabase (já na nuvem)

### **Configuração de Produção**
- Configure as variáveis de ambiente no Render
- Atualize as URLs de produção
- Teste o acesso com usuários autorizados

## 🔧 Desenvolvimento

### **Scripts Disponíveis**

```bash
# Instalação
npm run install:all       # Instala todas as dependências

# Desenvolvimento
npm run dev               # Inicia backend + frontend
npm run dev:backend       # Apenas backend (porta 3001)
npm run dev:frontend      # Apenas frontend (porta 5173)

# Produção
npm run start:backend     # Inicia backend em produção
npm run build:frontend    # Build do frontend para produção

# Testes
npm run test:backend      # Testes do backend
npm run test:frontend     # Testes do frontend
```

### **Estrutura de Desenvolvimento**

#### **Backend (Node.js + Express)**
- **server.js**: Servidor principal com middlewares
- **routes/**: Endpoints da API REST
- **middleware/**: Autenticação e validações
- **config/**: Configurações do Supabase

#### **Frontend (React + Vite)**
- **pages/**: Páginas da aplicação
- **components/**: Componentes reutilizáveis
- **contexts/**: Gerenciamento de estado global
- **services/**: Integração com API e Supabase

## 🎨 Interface e Design

### **Tema e Cores**
- **Design System**: Tailwind CSS
- **Cores Primárias**: Azul e cinza
- **Modo Escuro**: Suporte nativo
- **Responsivo**: Mobile-first design

### **Componentes**
- **Formulários**: React Hook Form + Yup
- **Tabelas**: Filtros e paginação
- **Gráficos**: Recharts para dashboards
- **Notificações**: React Hot Toast
- **Ícones**: Lucide React

## 🚨 Solução de Problemas

### **Erro: "Email não autorizado"**
- Verifique se o email está na lista de usuários autorizados
- Consulte o arquivo `INITIAL_SETUP.md` para mais detalhes

### **Erro: "Perfil não encontrado"**
- Certifique-se de que o usuário foi criado no Supabase Auth
- Verifique se o perfil foi inserido na tabela `profiles`
- Confirme se o campo `ativo` está como `true`

#### **3. Problemas de CORS**
```bash
❌ CORS policy: No 'Access-Control-Allow-Origin' header
```
**🔧 Soluções**:
- Configure as URLs corretas no arquivo `.env`
- Adicione as URLs no painel do Supabase (Settings → API → CORS)
- Verifique se `FRONTEND_URL` no backend está correto

#### **4. Falha no Upload de Arquivos**
```bash
❌ Storage bucket 'atestados' not found
❌ File upload failed
```
**🔧 Soluções**:
- Crie o bucket `atestados` no Supabase Storage
- Configure o bucket como público
- Verifique permissões de upload no Supabase

#### **5. Erro de Autenticação JWT**
```bash
❌ Token inválido
❌ JWT malformed
```
**🔧 Soluções**:
- Verifique se `JWT_SECRET` está correto no backend
- Limpe o localStorage do navegador
- Faça logout e login novamente
- Verifique se o token não expirou

#### **6. Problemas de Build/Deploy**
```bash
❌ Module not found
❌ Build failed
```
**🔧 Soluções**:
- Execute `npm install` em ambas as pastas (backend/frontend)
- Verifique se todas as dependências estão instaladas
- Confirme se as versões do Node.js são compatíveis
- Limpe cache: `npm cache clean --force`

### 🔍 **Logs e Debug**

#### **Backend (Node.js)**
```bash
# Ativar logs detalhados
NODE_ENV=development npm run dev:backend

# Verificar logs específicos
console.log('Debugging info:', variavel)

# Logs de erro
console.error('Error details:', error)
```

#### **Frontend (React)**
```bash
# Console do navegador (F12 → Console)
# Verificar Network tab para requisições
# Verificar Application tab para localStorage

# Debug React Query
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

#### **Supabase**
```bash
# Logs em tempo real no painel
# Acesse: Supabase Dashboard → Logs
# Filtre por tipo: API, Auth, Storage, Database
```

### 🚨 **Situações de Emergência**

#### **Sistema Fora do Ar**
1. **Verifique** status do Supabase
2. **Confirme** status do Render/Vercel
3. **Teste** conexão local
4. **Contate** suporte se necessário

#### **Perda de Dados**
1. **Não entre em pânico** - Supabase faz backup automático
2. **Acesse** Supabase Dashboard → Database → Backups
3. **Restaure** backup mais recente se necessário
4. **Documente** o incidente

#### **Acesso Comprometido**
1. **Altere** senhas imediatamente
2. **Revogue** tokens de acesso
3. **Verifique** logs de auditoria
4. **Atualize** chaves de API se necessário

## 👨‍💻 Desenvolvimento

### 🔧 **Configuração do Ambiente de Desenvolvimento**

#### **Pré-requisitos para Desenvolvedores**
```bash
# Ferramentas necessárias
Node.js 18+
Git
VS Code (recomendado)
Extensões VS Code:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Tailwind CSS IntelliSense
```

#### **Setup Completo**
```bash
# Clone e configure
git clone <repo-url>
cd nef
npm run install:all

# Configure ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edite os arquivos .env com suas configurações

# Execute em modo desenvolvimento
npm run dev
```

### 📁 **Estrutura de Desenvolvimento**

#### **Organização do Código**
```
nef/
├── backend/                 # API Node.js + Express
│   ├── controllers/         # Lógica de negócio
│   ├── middleware/          # Autenticação, validação
│   ├── routes/             # Definição de rotas
│   ├── services/           # Serviços externos
│   └── utils/              # Utilitários
├── frontend/               # App React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Context API (Auth, etc)
│   │   ├── services/       # API calls, validações
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilitários frontend
└── database/               # Schema e seeds SQL
```

#### **Padrões de Código**
```javascript
// Componentes React - PascalCase
const UserProfile = () => {}

// Hooks customizados - camelCase com 'use'
const useAuth = () => {}

// Funções utilitárias - camelCase
const formatDate = () => {}

// Constantes - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'

// Arquivos - kebab-case
user-profile.jsx
auth-context.jsx
```

### 🧪 **Testes**

#### **Configuração de Testes**
```bash
# Instalar dependências de teste
npm install --save-dev jest @testing-library/react

# Executar testes
npm run test

# Executar com coverage
npm run test:coverage
```

#### **Estrutura de Testes**
```javascript
// Teste de componente
import { render, screen } from '@testing-library/react'
import UserProfile from './UserProfile'

test('renders user profile', () => {
  render(<UserProfile />)
  expect(screen.getByText('Profile')).toBeInTheDocument()
})

// Teste de API
import request from 'supertest'
import app from '../app'

test('GET /api/users', async () => {
  const response = await request(app).get('/api/users')
  expect(response.status).toBe(200)
})
```

### 🚀 **Scripts de Desenvolvimento**

```bash
# Desenvolvimento
npm run dev              # Inicia backend + frontend
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend

# Build e produção
npm run build           # Build completo
npm run build:frontend  # Build apenas frontend
npm run start:backend   # Produção backend

# Qualidade de código
npm run lint            # ESLint
npm run format          # Prettier
npm run type-check      # TypeScript (se configurado)

# Banco de dados
npm run db:reset        # Reset completo do banco
npm run db:seed         # Executar seeds
npm run db:migrate      # Executar migrações
```

## 🤝 Contribuição

### 📋 **Como Contribuir**
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Diretrizes de Contribuição**
- Mantenha o código limpo e bem documentado
- Siga os padrões de segurança estabelecidos
- Teste todas as funcionalidades antes do commit
- Respeite o controle de acesso restrito

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema NEF:

- **Email**: matheusvictormy@gmail.com
- **GitHub**: [@YamanariMatt](https://github.com/YamanariMatt) - Perfil do desenvolvedor
- **Documentação**: Consulte os arquivos `.md` do projeto
- **Issues**: Reporte problemas via GitHub Issues

### **Suporte para Usuários Autorizados**
- Consulte o `INITIAL_SETUP.md` para configuração inicial
- Consulte o `DEPLOY_GUIDE.md` para instruções de deploy
- Entre em contato com o administrador para questões de acesso

## 🙏 Agradecimentos

- **React**: Biblioteca para interfaces modernas
- **Node.js**: Runtime JavaScript robusto
- **Supabase**: Backend as a Service confiável
- **Tailwind CSS**: Framework CSS utilitário
- **Comunidade**: Contribuições e feedback valiosos

---

**NEF** – Sistema de Gestão de Equipe com segurança robusta e acesso controlado.

*Desenvolvido com foco em segurança, performance e usabilidade para gestão eficiente de equipes.*
