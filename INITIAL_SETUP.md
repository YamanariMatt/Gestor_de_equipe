# 🚀 NEF - Configuração Inicial

## 📋 Usuários Autorizados

O sistema NEF possui **acesso restrito** apenas para os seguintes usuários autorizados:

| Nome | Email | Função | Status |
|------|-------|--------|--------|
| **Felype Simões** | felype.simones@empresa.com | Supervisor | ✅ Autorizado |
| **José Felipe** | jose.felipe@empresa.com | Gestor | ✅ Autorizado |
| **Maria Pereira** | maria.pereira@empresa.com | Gestora | ✅ Autorizado |
| **Júlio Gonçalves** | julio.goncalves@empresa.com | Supervisor | ✅ Autorizado |

## 🔐 Configuração de Acesso

### 1. Criação de Usuários no Supabase

Para cada usuário autorizado, você deve:

1. **Acessar o Supabase Dashboard**
2. **Ir para Authentication > Users**
3. **Criar cada usuário com os emails listados acima**
4. **Anotar os UUIDs gerados para cada usuário**

### 2. Configuração do Banco de Dados

1. **Execute o schema SQL** (`database/schema.sql`)
2. **Execute os seeds** (`database/seeds.sql`)
3. **Atualize os UUIDs** nos seeds com os IDs reais do Supabase Auth

```sql
-- Exemplo de atualização dos seeds
UPDATE profiles SET id = 'UUID_REAL_DO_SUPABASE' WHERE username = 'felype.simones';
UPDATE profiles SET id = 'UUID_REAL_DO_SUPABASE' WHERE username = 'jose.felipe';
UPDATE profiles SET id = 'UUID_REAL_DO_SUPABASE' WHERE username = 'maria.pereira';
UPDATE profiles SET id = 'UUID_REAL_DO_SUPABASE' WHERE username = 'julio.goncalves';
```

### 3. Configuração de Variáveis de Ambiente

#### Backend (.env)
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_KEY=sua_chave_de_servico
JWT_SECRET=seu_jwt_secret_do_supabase
FRONTEND_URL=http://localhost:5173
PORT=3001
MAX_FILE_SIZE=10485760
```

#### Frontend (.env)
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_API_URL=http://localhost:3001
```

## 🛡️ Segurança Implementada

### ✅ Controles de Acesso
- **Autenticação JWT** via Supabase
- **Validação de email** contra lista de usuários autorizados
- **Validação de função** (apenas supervisor, gestor, admin)
- **Validação de status ativo** do usuário
- **Middleware de segurança** em todas as rotas da API
- **Row Level Security (RLS)** no Supabase

### ✅ Validações Frontend
- **Verificação prévia** de email autorizado no login
- **Carregamento automático** do perfil do usuário
- **Logout automático** para usuários não autorizados
- **Mensagens de erro** personalizadas e informativas

### ✅ Validações Backend
- **Middleware de autenticação** em todas as rotas `/api`
- **Verificação de token JWT** via Supabase
- **Validação de perfil** e status ativo
- **Controle de acesso** por função
- **Atualização de último login**

## 🚀 Inicialização do Sistema

### 1. Instalação de Dependências
```bash
# Na raiz do projeto
npm run install:all
```

### 2. Desenvolvimento Local
```bash
# Iniciar backend e frontend simultaneamente
npm run dev
```

### 3. Acesso ao Sistema
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Página de Login**: http://localhost:5173/auth/login

## ⚠️ Importantes Observações

### 🔒 Registro Desabilitado
- A página de registro foi **desabilitada**
- Apenas usuários pré-autorizados podem acessar
- Novos usuários devem ser adicionados via interface administrativa

### 📧 Emails Autorizados
- O sistema verifica emails contra uma **lista fixa**
- Tentativas de login com emails não autorizados são **bloqueadas**
- Todas as tentativas não autorizadas são **registradas**

### 🔑 Funções de Acesso
- **Admin**: Acesso total ao sistema
- **Supervisor**: Gerenciamento de equipe e funcionários
- **Gestor**: Gerenciamento de equipe e funcionários

## 🆘 Resolução de Problemas

### Problema: "Email não autorizado"
- **Solução**: Verificar se o email está na lista de usuários autorizados
- **Verificar**: Lista em `frontend/src/services/accessControl.js`

### Problema: "Perfil não encontrado"
- **Solução**: Verificar se o usuário foi criado no Supabase Auth
- **Verificar**: Se o perfil foi inserido na tabela `profiles`

### Problema: "Usuário desativado"
- **Solução**: Ativar o usuário no banco de dados
- **SQL**: `UPDATE profiles SET ativo = true WHERE email = 'email@usuario.com'`

### Problema: "Acesso negado"
- **Solução**: Verificar se a função do usuário é válida
- **Funções válidas**: admin, supervisor, gestor

## 📞 Suporte

Para questões técnicas ou problemas de acesso, entre em contato com o administrador do sistema.

---

**NEF - Sistema de Gestão de Equipe**  
*Acesso restrito e controlado para máxima segurança*
