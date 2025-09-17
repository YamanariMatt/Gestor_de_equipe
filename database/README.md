# 🗄️ Banco de Dados EXTRANEF

Este diretório contém o esquema SQL e configurações do banco de dados PostgreSQL para o sistema EXTRANEF.

## 📋 Estrutura do Banco

### Tabelas Principais

| Tabela | Descrição | Relacionamentos |
|--------|-----------|-----------------|
| `profiles` | Perfis de usuários (extensão do Supabase Auth) | Base para todas as outras tabelas |
| `equipes` | Equipes/departamentos da empresa | → `funcionarios` |
| `cargos` | Cargos e funções disponíveis | → `funcionarios` |
| `horarios` | Horários de trabalho | → `funcionarios` |
| `funcionarios` | Funcionários da empresa | ← `faltas`, `ferias`, `atestados` |
| `faltas` | Registro de faltas e ausências | → `funcionarios` |
| `ferias` | Períodos de férias | → `funcionarios` |
| `atestados` | Atestados médicos e documentos | → `funcionarios` |
| `pontos` | Registro de ponto eletrônico | → `funcionarios` |
| `configuracoes` | Configurações do sistema | → `profiles` |

## 🚀 Configuração no Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Defina:
   - **Nome do projeto**: `extranef-gestao-equipe`
   - **Senha do banco**: (gere uma senha segura)
   - **Região**: `South America (São Paulo)` (recomendado para Brasil)

### 2. Executar o Schema

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Copie e cole o conteúdo do arquivo `schema.sql`
4. Execute o script (Ctrl+Enter ou botão "Run")

### 3. Inserir Dados Iniciais (Opcional)

1. No SQL Editor, crie uma nova query
2. Copie e cole o conteúdo do arquivo `seeds.sql`
3. Execute o script para inserir dados de exemplo

### 4. Configurar Storage (para atestados)

1. Vá para **Storage** no painel lateral
2. Clique em "Create Bucket"
3. Nome do bucket: `documentos`
4. Configurações:
   - **Public**: `false` (privado)
   - **File size limit**: `10MB`
   - **Allowed MIME types**: `image/jpeg,image/png,application/pdf`

### 5. Configurar Políticas de Storage

Execute no SQL Editor:

```sql
-- Política para upload de documentos
CREATE POLICY "Usuários podem fazer upload de documentos da sua empresa"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documentos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para visualizar documentos
CREATE POLICY "Usuários podem ver documentos da sua empresa"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documentos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🔑 Variáveis de Ambiente

Após criar o projeto, configure as seguintes variáveis no arquivo `.env` do backend:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### Como obter as chaves:

1. No painel do Supabase, vá para **Settings** → **API**
2. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`

## 📊 Estrutura de Dados

### Relacionamentos Principais

```
profiles (usuário/empresa)
├── equipes
├── cargos
├── horarios
├── funcionarios
│   ├── faltas
│   ├── ferias
│   ├── atestados
│   └── pontos
└── configuracoes
```

### Campos Importantes

#### Funcionários
- **CPF**: Único no sistema, usado como identificador principal
- **Empresa ID**: Vincula o funcionário à empresa (isolamento de dados)
- **Ativo**: Soft delete - funcionários inativos não são excluídos

#### Faltas
- **Tipo**: `falta`, `atraso`, `saida_antecipada`, `falta_justificada`
- **Aprovação**: Sistema de workflow para aprovação de faltas

#### Férias
- **Status**: `solicitado`, `aprovado`, `rejeitado`, `em_andamento`, `concluido`
- **Dias Úteis**: Calculado automaticamente
- **Ano Referência**: Para controle de períodos aquisitivos

#### Atestados
- **Arquivo URL**: Link para documento no Supabase Storage
- **Validação**: Sistema de validação de atestados

## 🔒 Segurança (RLS)

O banco utiliza **Row Level Security (RLS)** para garantir que:

- Usuários só acessem dados da própria empresa
- Dados são isolados por `empresa_id`
- Autenticação via Supabase Auth é obrigatória

### Políticas Implementadas

- **SELECT**: Usuários podem ver apenas dados da própria empresa
- **INSERT/UPDATE/DELETE**: Usuários podem gerenciar apenas dados da própria empresa
- **Profiles**: Usuários podem ver/editar apenas o próprio perfil

## 🛠️ Manutenção

### Backup

O Supabase oferece backup automático, mas recomenda-se:

1. **Backup diário**: Configurado automaticamente
2. **Export manual**: Para migrações ou backup local
3. **Versionamento**: Manter histórico de mudanças no schema

### Monitoramento

Monitore no painel do Supabase:

- **Database**: Uso de espaço e performance
- **Auth**: Usuários ativos e autenticações
- **Storage**: Uso do storage para documentos
- **API**: Requisições e latência

### Atualizações do Schema

Para atualizações futuras:

1. Crie migration files numerados (ex: `001_add_new_table.sql`)
2. Execute em ordem no SQL Editor
3. Documente mudanças neste README
4. Teste em ambiente de desenvolvimento primeiro

## 📝 Notas Importantes

1. **Timezone**: Todas as datas usam `TIMESTAMP WITH TIME ZONE`
2. **UUIDs**: Chaves primárias são UUIDs para melhor distribuição
3. **Índices**: Criados para otimizar consultas frequentes
4. **Triggers**: `updated_at` é atualizado automaticamente
5. **Constraints**: Validações de dados implementadas no banco

## 🆘 Troubleshooting

### Problemas Comuns

1. **Erro de permissão**: Verifique se RLS está configurado corretamente
2. **Dados não aparecem**: Confirme se `empresa_id` está correto
3. **Upload falha**: Verifique políticas do Storage
4. **Conexão lenta**: Considere otimizar queries ou índices

### Logs e Debug

- **Supabase Logs**: Painel → Logs
- **SQL Queries**: SQL Editor para testar queries
- **API Logs**: Monitorar requisições da API

## 🔄 Migrations Futuras

Mantenha um histórico de migrations em `database/migrations/`:

```
migrations/
├── 001_initial_schema.sql
├── 002_add_pontos_table.sql
├── 003_add_configuracoes.sql
└── ...
```
