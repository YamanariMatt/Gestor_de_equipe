-- =====================================================
-- SEEDS - Dados iniciais para desenvolvimento/teste
-- =====================================================

-- Inserir empresa exemplo (ID fixo para referência)
INSERT INTO empresas (id, nome, cnpj, endereco, telefone, email) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'NEF Gestão Empresarial', '12.345.678/0001-90', 'Rua da Gestão, 123', '(11) 99999-9999', 'contato@nef.com.br');

-- =====================================================
-- USUÁRIOS INICIAIS COM ACESSO RESTRITO
-- =====================================================
-- IMPORTANTE: Execute este script APENAS após criar os usuários no Supabase Auth!
-- 
-- PASSO A PASSO PARA CONFIGURAR USUÁRIOS:
-- 
-- 1. Acesse o painel do Supabase → Authentication → Users
-- 2. Clique em "Add user" e crie cada usuário com os emails abaixo:
--    - felypesimones@nefadv.com.br (Supervisor)
--    - jose.silva@extranef.com.br (Supervisor)
--    - juliogoncalves@nefadv.com.br (Gerente)
--    - edielwinicius@nefadv.com.br (RH)
--    - mariaoliveira@nefadv.com.br (Supervisor)
--
-- 3. Anote os UUIDs gerados para cada usuário
-- 4. Execute os INSERTs abaixo substituindo os UUIDs pelos reais:

-- Felype Simões - Supervisor (UUID real do Supabase Auth)
INSERT INTO profiles (id, nome, email, username, empresa_id, role, ativo, primeiro_acesso) VALUES 
('eb7d3ee6-a6a0-4910-98ba-0db599bee4a9', 'Felype Simões', 'felypesimones@nefadv.com.br', 'felypesimones', '550e8400-e29b-41d4-a716-446655440000', 'supervisor', true, true);

/*
-- OUTROS USUÁRIOS - Adicione conforme criar no Supabase Auth:
INSERT INTO profiles (id, nome, email, username, empresa_id, role, ativo, primeiro_acesso) VALUES 
('UUID_REAL_DO_JOSE', 'José Silva', 'jose.silva@extranef.com.br', 'jose.silva', '550e8400-e29b-41d4-a716-446655440000', 'supervisor', true, true),
('UUID_REAL_DO_JULIO', 'Júlio Gonçalves', 'juliogoncalves@nefadv.com.br', 'juliogoncalves', '550e8400-e29b-41d4-a716-446655440000', 'gerente', true, true),
('UUID_REAL_DO_EDIEL', 'Ediel Winicius', 'edielwinicius@nefadv.com.br', 'edielwinicius', '550e8400-e29b-41d4-a716-446655440000', 'rh', true, true),
('UUID_REAL_DA_MARIA', 'Maria Oliveira', 'mariaoliveira@nefadv.com.br', 'mariaoliveira', '550e8400-e29b-41d4-a716-446655440000', 'supervisor', true, true);
*/

-- =====================================================
-- NOTA: EQUIPES E CARGOS
-- =====================================================
-- Equipes e cargos serão cadastrados diretamente pelo sistema
-- Não há dados de exemplo aqui - use a interface web para cadastrar

-- =====================================================
-- HORÁRIOS DE EXEMPLO
-- =====================================================
INSERT INTO horarios (id, nome, hora_inicio, hora_fim, intervalo_inicio, intervalo_fim, dias_semana, empresa_id) VALUES
(uuid_generate_v4(), 'Comercial - 8h às 18h', '08:00:00', '18:00:00', '12:00:00', '13:00:00', '{1,2,3,4,5}', '550e8400-e29b-41d4-a716-446655440000'),
(uuid_generate_v4(), 'Comercial - 9h às 18h', '09:00:00', '18:00:00', '12:00:00', '13:00:00', '{1,2,3,4,5}', '550e8400-e29b-41d4-a716-446655440000'),
(uuid_generate_v4(), 'Meio Período - Manhã', '08:00:00', '12:00:00', NULL, NULL, '{1,2,3,4,5}', '550e8400-e29b-41d4-a716-446655440000'),
(uuid_generate_v4(), 'Meio Período - Tarde', '14:00:00', '18:00:00', NULL, NULL, '{1,2,3,4,5}', '550e8400-e29b-41d4-a716-446655440000'),
(uuid_generate_v4(), 'Flexível - 6h diárias', '09:00:00', '16:00:00', '12:00:00', '13:00:00', '{1,2,3,4,5}', '550e8400-e29b-41d4-a716-446655440000'),
(uuid_generate_v4(), 'Plantão - Fins de Semana', '08:00:00', '17:00:00', '12:00:00', '13:00:00', '{6,7}', '550e8400-e29b-41d4-a716-446655440000');

-- =====================================================
-- TIPOS DE FALTA COMUNS (para referência)
-- =====================================================
-- Esta é apenas uma referência dos tipos que o sistema suporta:
-- 'falta' - Falta não justificada
-- 'atraso' - Atraso
-- 'saida_antecipada' - Saída antecipada
-- 'falta_justificada' - Falta justificada

-- =====================================================
-- STATUS DE FÉRIAS (para referência)
-- =====================================================
-- 'solicitado' - Férias solicitadas
-- 'aprovado' - Férias aprovadas
-- 'rejeitado' - Férias rejeitadas
-- 'em_andamento' - Férias em andamento
-- 'concluido' - Férias concluídas

-- =====================================================
-- TIPOS DE ATESTADO (para referência)
-- =====================================================
-- 'medico' - Atestado médico
-- 'odontologico' - Atestado odontológico
-- 'psicologico' - Atestado psicológico
-- 'outros' - Outros tipos de atestado

-- =====================================================
-- TIPOS DE CONTRATO (para referência)
-- =====================================================
-- 'clt' - CLT (Consolidação das Leis do Trabalho)
-- 'pj' - Pessoa Jurídica
-- 'estagiario' - Estagiário
-- 'terceirizado' - Terceirizado

-- =====================================================
-- ROLES DE USUÁRIO (para referência)
-- =====================================================
-- 'user' - Usuário comum
-- 'admin' - Administrador
-- 'manager' - Gerente/Coordenador

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 1. Os dados acima são inseridos apenas se auth.uid() retornar um ID válido
-- 2. Em produção, remova ou adapte estes dados conforme necessário
-- 3. As UUIDs são geradas automaticamente para evitar conflitos
-- 4. Todos os dados são associados ao usuário logado (empresa_id = auth.uid())
-- 5. Os dados de exemplo facilitam o desenvolvimento e testes da aplicação
