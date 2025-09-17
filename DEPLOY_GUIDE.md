# 🚀 Guia de Deploy - NEF Sistema de Gestão de Equipe

Este guia fornece instruções passo a passo para fazer o deploy da aplicação NEF no Supabase (banco de dados) e Render (aplicação web).

## 📋 Pré-requisitos

- [ ] Conta no [Supabase](https://supabase.com)
- [ ] Conta no [Render](https://render.com)
- [ ] Git configurado
- [ ] Node.js 18+ instalado
- [ ] Código do projeto NEF

## 🗄️ Parte 1: Configuração do Supabase (Banco de Dados)

### 1.1 Criar Projeto no Supabase

1. **Acesse** [supabase.com](https://supabase.com) e faça login
2. **Clique** em "New Project"
3. **Preencha** os dados:
   - **Name**: `nef-sistema-gestao`
   - **Database Password**: Gere uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: South America)
4. **Clique** em "Create new project"
5. **Aguarde** a criação (2-3 minutos)

### 1.2 Configurar o Banco de Dados

1. **Acesse** a aba "SQL Editor" no painel do Supabase
2. **Execute** o script de setup completo:

```sql
-- Cole todo o conteúdo do arquivo database/setup.sql aqui
-- Ou execute os arquivos na seguinte ordem:
-- 1. database/schema.sql
-- 2. database/seeds.sql
```

3. **Clique** em "Run" para executar
4. **Verifique** se as tabelas foram criadas na aba "Table Editor"

### 1.3 Configurar Storage (Arquivos)

1. **Acesse** a aba "Storage"
2. **Clique** em "Create a new bucket"
3. **Nome**: `atestados`
4. **Public bucket**: ✅ Marque como público
5. **Clique** em "Create bucket"

### 1.4 Configurar Authentication

1. **Acesse** a aba "Authentication"
2. **Vá** em "Settings" → "Auth"
3. **Configure**:
   - **Site URL**: `https://seu-app.onrender.com` (será definido depois)
   - **Redirect URLs**: `https://seu-app.onrender.com/auth/callback`
4. **Salve** as configurações

### 1.5 Obter Credenciais

1. **Acesse** a aba "Settings" → "API"
2. **Anote** as seguintes informações:
   ```
   Project URL: https://xxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🌐 Parte 2: Deploy no Render

### 2.1 Preparar o Repositório

1. **Crie** um repositório no GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - NEF Sistema de Gestão"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/nef-sistema.git
   git push -u origin main
   ```

### 2.2 Deploy do Backend

1. **Acesse** [render.com](https://render.com) e faça login
2. **Clique** em "New +" → "Web Service"
3. **Conecte** seu repositório GitHub
4. **Configure** o serviço:
   - **Name**: `nef-backend`
   - **Environment**: `Node`
   - **Region**: `Ohio (US East)`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Configure** as variáveis de ambiente:
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=https://xxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=sua-chave-jwt-super-secreta-aqui
   FRONTEND_URL=https://nef-frontend.onrender.com
   MAX_FILE_SIZE=5242880
   ```

6. **Clique** em "Create Web Service"
7. **Aguarde** o deploy (5-10 minutos)
8. **Anote** a URL do backend: `https://nef-backend.onrender.com`

### 2.3 Deploy do Frontend

1. **Clique** em "New +" → "Static Site"
2. **Conecte** o mesmo repositório
3. **Configure** o site:
   - **Name**: `nef-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Configure** as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_API_URL=https://nef-backend.onrender.com
   ```

5. **Clique** em "Create Static Site"
6. **Aguarde** o deploy (3-5 minutos)
7. **Anote** a URL do frontend: `https://nef-frontend.onrender.com`

### 2.4 Atualizar URLs no Supabase

1. **Volte** ao Supabase → "Authentication" → "Settings"
2. **Atualize**:
   - **Site URL**: `https://nef-frontend.onrender.com`
   - **Redirect URLs**: `https://nef-frontend.onrender.com/auth/callback`

### 2.5 Atualizar CORS no Backend

1. **Edite** o arquivo `backend/server.js`
2. **Atualize** a configuração do CORS:
   ```javascript
   app.use(cors({
     origin: ['https://nef-frontend.onrender.com'],
     credentials: true
   }))
   ```
3. **Commit** e **push** as alterações

## ✅ Parte 3: Verificação e Testes

### 3.1 Testar a Aplicação

1. **Acesse** `https://nef-frontend.onrender.com`
2. **Teste** o registro de usuário
3. **Teste** o login
4. **Verifique** se o dashboard carrega
5. **Teste** as funcionalidades principais

### 3.2 Verificar Logs

**Backend:**
1. **Acesse** o painel do Render → seu backend service
2. **Clique** em "Logs" para ver erros

**Frontend:**
1. **Abra** o DevTools (F12)
2. **Verifique** o Console para erros

### 3.3 Monitoramento

**Supabase:**
- **Database**: Monitore uso na aba "Settings" → "Usage"
- **Auth**: Verifique usuários na aba "Authentication"

**Render:**
- **Metrics**: Monitore performance na aba "Metrics"
- **Events**: Acompanhe deploys na aba "Events"

## 🔧 Parte 4: Configurações Avançadas

### 4.1 Domínio Customizado (Opcional)

**No Render:**
1. **Vá** em "Settings" → "Custom Domains"
2. **Adicione** seu domínio
3. **Configure** DNS conforme instruções

### 4.2 SSL/HTTPS

- **Render**: SSL automático ✅
- **Supabase**: SSL automático ✅

### 4.3 Backup do Banco

**No Supabase:**
1. **Acesse** "Settings" → "Database"
2. **Configure** backups automáticos
3. **Baixe** backup manual se necessário

## 🚨 Solução de Problemas

### Erro de CORS
```
Verifique se as URLs estão corretas no backend e Supabase
```

### Erro de Autenticação
```
Verifique as chaves do Supabase e URLs de redirect
```

### Erro de Build
```
Verifique se todas as dependências estão no package.json
Verifique se as variáveis de ambiente estão corretas
```

### Erro de Conexão com Banco
```
Verifique as credenciais do Supabase
Verifique se o RLS está configurado corretamente
```

## 📞 Suporte

- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **Issues do Projeto**: Crie uma issue no repositório

## 🎉 Parabéns!

Sua aplicação NEF está agora rodando em produção! 🚀

**URLs da sua aplicação:**
- **Frontend**: https://nef-frontend.onrender.com
- **Backend**: https://nef-backend.onrender.com
- **Banco**: https://xxxxxxxx.supabase.co

---

**Próximos passos:**
1. Configurar monitoramento
2. Configurar backups automáticos
3. Implementar CI/CD
4. Adicionar domínio customizado
5. Configurar analytics
