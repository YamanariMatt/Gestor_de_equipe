-- =====================================================
-- SEEDS - Dados iniciais para desenvolvimento/teste
-- =====================================================

-- Inserir empresa exemplo (ID fixo para referência)
INSERT INTO empresas (id, nome, cnpj, endereco, telefone, email) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'NEF Gestão Empresarial', '12.345.678/0001-90', 'Rua da Gestão, 123', '(11) 99999-9999', 'contato@nef.com.br');

-- =====================================================
-- USUÁRIOS INICIAIS COM ACESSO RESTRITO
-- =====================================================
-- Nota: Estes usuários devem ser criados via Supabase Auth primeiro
-- Depois seus perfis são inseridos aqui

-- Usuários supervisores e gestores iniciais
-- IMPORTANTE: Estes IDs devem ser substituídos pelos IDs reais do Supabase Auth após criação

-- Felype Simões - Supervisor
INSERT INTO profiles (id, nome, email, username, empresa_id, role, ativo, primeiro_acesso) VALUES 
('11111111-1111-1111-1111-111111111111', 'Felype Simões', 'felype.simones@nef.com.br', 'Felype.Simones', '550e8400-e29b-41d4-a716-446655440000', 'supervisor', true, true);

-- José Felipe - Gestor
INSERT INTO profiles (id, nome, email, username, empresa_id, role, ativo, primeiro_acesso) VALUES 
('22222222-2222-2222-2222-222222222222', 'José Felipe', 'jose.felipe@nef.com.br', 'Jose.Felipe', '550e8400-e29b-41d4-a716-446655440000', 'gestor', true, true);

-- Maria Pereira - Gestora
INSERT INTO profiles (id, nome, email, username, empresa_id, role, ativo, primeiro_acesso) VALUES 
('33333333-3333-3333-3333-333333333333', 'Maria Pereira', 'maria.pereira@nef.com.br', 'Maria.Pereira', '550e8400-e29b-41d4-a716-446655440000', 'gestor', true, true);

-- Júlio Gonçalves - Supervisor
INSERT INTO profiles (id, nome, email, username, empresa_id, role, ativo, primeiro_acesso) VALUES 
('44444444-4444-4444-4444-444444444444', 'Júlio Gonçalves', 'julio.goncalves@nef.com.br', 'Julio.Goncalves', '550e8400-e29b-41d4-a716-446655440000', 'supervisor', true, true);

-- =====================================================
-- EQUIPES DE EXEMPLO
-- =====================================================
INSERT INTO equipes (id, nome, descricao, empresa_id, cor) VALUES
(uuid_generate_v4(), 'Recursos Humanos', 'Departamento de gestão de pessoas', auth.uid(), '#e74c3c'),
(uuid_generate_v4(), 'Tecnologia', 'Departamento de TI e desenvolvimento', auth.uid(), '#3498db'),
(uuid_generate_v4(), 'Vendas', 'Equipe comercial e vendas', auth.uid(), '#2ecc71'),
(uuid_generate_v4(), 'Marketing', 'Marketing e comunicação', auth.uid(), '#f39c12'),
(uuid_generate_v4(), 'Financeiro', 'Departamento financeiro', auth.uid(), '#9b59b6'),
(uuid_generate_v4(), 'Operações', 'Operações e logística', auth.uid(), '#34495e');

-- =====================================================
-- CARGOS DE EXEMPLO
-- =====================================================
INSERT INTO cargos (id, nome, descricao, salario_base, nivel, empresa_id) VALUES
-- Recursos Humanos
(uuid_generate_v4(), 'Analista de RH', 'Analista de recursos humanos', 4500.00, 'pleno', auth.uid()),
(uuid_generate_v4(), 'Coordenador de RH', 'Coordenação da equipe de RH', 7000.00, 'coordenador', auth.uid()),
(uuid_generate_v4(), 'Gerente de RH', 'Gerência do departamento de RH', 12000.00, 'gerente', auth.uid()),

-- Tecnologia
(uuid_generate_v4(), 'Desenvolvedor Junior', 'Desenvolvedor de software iniciante', 3500.00, 'junior', auth.uid()),
(uuid_generate_v4(), 'Desenvolvedor Pleno', 'Desenvolvedor de software experiente', 6500.00, 'pleno', auth.uid()),
(uuid_generate_v4(), 'Desenvolvedor Senior', 'Desenvolvedor de software especialista', 10000.00, 'senior', auth.uid()),
(uuid_generate_v4(), 'Tech Lead', 'Liderança técnica', 13000.00, 'coordenador', auth.uid()),
(uuid_generate_v4(), 'CTO', 'Chief Technology Officer', 20000.00, 'diretor', auth.uid()),

-- Vendas
(uuid_generate_v4(), 'Vendedor', 'Vendedor interno/externo', 3000.00, 'junior', auth.uid()),
(uuid_generate_v4(), 'Consultor de Vendas', 'Consultor comercial', 5000.00, 'pleno', auth.uid()),
(uuid_generate_v4(), 'Coordenador de Vendas', 'Coordenação da equipe comercial', 8000.00, 'coordenador', auth.uid()),
(uuid_generate_v4(), 'Gerente Comercial', 'Gerência comercial', 15000.00, 'gerente', auth.uid()),

-- Marketing
(uuid_generate_v4(), 'Analista de Marketing', 'Analista de marketing digital', 4000.00, 'pleno', auth.uid()),
(uuid_generate_v4(), 'Designer Gráfico', 'Designer e criação visual', 3800.00, 'pleno', auth.uid()),
(uuid_generate_v4(), 'Coordenador de Marketing', 'Coordenação de marketing', 7500.00, 'coordenador', auth.uid()),

-- Financeiro
(uuid_generate_v4(), 'Assistente Financeiro', 'Assistente do departamento financeiro', 2800.00, 'junior', auth.uid()),
(uuid_generate_v4(), 'Analista Financeiro', 'Analista financeiro', 5500.00, 'pleno', auth.uid()),
(uuid_generate_v4(), 'Controller', 'Controladoria financeira', 12000.00, 'gerente', auth.uid()),

-- Operações
(uuid_generate_v4(), 'Assistente Operacional', 'Assistente de operações', 2500.00, 'junior', auth.uid()),
(uuid_generate_v4(), 'Analista de Operações', 'Analista operacional', 4200.00, 'pleno', auth.uid()),
(uuid_generate_v4(), 'Coordenador de Operações', 'Coordenação operacional', 6800.00, 'coordenador', auth.uid());

-- =====================================================
-- HORÁRIOS DE EXEMPLO
-- =====================================================
INSERT INTO horarios (id, nome, hora_inicio, hora_fim, intervalo_inicio, intervalo_fim, dias_semana, empresa_id) VALUES
(uuid_generate_v4(), 'Comercial - 8h às 18h', '08:00:00', '18:00:00', '12:00:00', '13:00:00', '{1,2,3,4,5}', auth.uid()),
(uuid_generate_v4(), 'Comercial - 9h às 18h', '09:00:00', '18:00:00', '12:00:00', '13:00:00', '{1,2,3,4,5}', auth.uid()),
(uuid_generate_v4(), 'Meio Período - Manhã', '08:00:00', '12:00:00', NULL, NULL, '{1,2,3,4,5}', auth.uid()),
(uuid_generate_v4(), 'Meio Período - Tarde', '14:00:00', '18:00:00', NULL, NULL, '{1,2,3,4,5}', auth.uid()),
(uuid_generate_v4(), 'Flexível - 6h diárias', '09:00:00', '16:00:00', '12:00:00', '13:00:00', '{1,2,3,4,5}', auth.uid()),
(uuid_generate_v4(), 'Plantão - Fins de Semana', '08:00:00', '17:00:00', '12:00:00', '13:00:00', '{6,7}', auth.uid());

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
