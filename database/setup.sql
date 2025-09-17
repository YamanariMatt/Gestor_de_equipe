-- =====================================================
-- EXTRANEF - Script de Configuração Completa
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Este script combina schema + seeds + configurações
-- Execute tudo de uma vez para configuração completa

-- =====================================================
-- 1. EXECUTAR SCHEMA PRINCIPAL
-- =====================================================
-- Copie e cole o conteúdo do arquivo schema.sql aqui
-- ou execute schema.sql separadamente primeiro

-- =====================================================
-- 2. CONFIGURAR STORAGE BUCKET
-- =====================================================

-- Criar bucket para documentos (execute via interface ou API)
-- Nome: 'documentos'
-- Público: false
-- Tamanho máximo: 10MB

-- =====================================================
-- 3. POLÍTICAS DE STORAGE
-- =====================================================

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

-- Política para deletar documentos
CREATE POLICY "Usuários podem deletar documentos da sua empresa"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documentos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- 4. FUNÇÕES AUXILIARES ADICIONAIS
-- =====================================================

-- Função para obter estatísticas da empresa
CREATE OR REPLACE FUNCTION get_empresa_stats(empresa_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_funcionarios', (
            SELECT COUNT(*) FROM funcionarios 
            WHERE empresa_id = empresa_uuid AND ativo = true
        ),
        'total_equipes', (
            SELECT COUNT(*) FROM equipes 
            WHERE empresa_id = empresa_uuid AND ativo = true
        ),
        'total_cargos', (
            SELECT COUNT(*) FROM cargos 
            WHERE empresa_id = empresa_uuid AND ativo = true
        ),
        'faltas_mes_atual', (
            SELECT COUNT(*) FROM faltas 
            WHERE empresa_id = empresa_uuid 
            AND data_inicio >= date_trunc('month', CURRENT_DATE)
            AND data_inicio < date_trunc('month', CURRENT_DATE) + interval '1 month'
        ),
        'ferias_pendentes', (
            SELECT COUNT(*) FROM ferias 
            WHERE empresa_id = empresa_uuid 
            AND status = 'solicitado'
        ),
        'atestados_nao_validados', (
            SELECT COUNT(*) FROM atestados 
            WHERE empresa_id = empresa_uuid 
            AND validado = false
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar funcionários com filtros
CREATE OR REPLACE FUNCTION buscar_funcionarios(
    empresa_uuid UUID,
    search_term TEXT DEFAULT NULL,
    equipe_uuid UUID DEFAULT NULL,
    cargo_uuid UUID DEFAULT NULL,
    ativo_filter BOOLEAN DEFAULT NULL,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    nome VARCHAR,
    email VARCHAR,
    cpf VARCHAR,
    telefone VARCHAR,
    equipe_nome VARCHAR,
    cargo_nome VARCHAR,
    salario DECIMAL,
    ativo BOOLEAN,
    data_admissao DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.nome,
        f.email,
        f.cpf,
        f.telefone,
        e.nome as equipe_nome,
        c.nome as cargo_nome,
        f.salario,
        f.ativo,
        f.data_admissao
    FROM funcionarios f
    LEFT JOIN equipes e ON f.equipe_id = e.id
    LEFT JOIN cargos c ON f.cargo_id = c.id
    WHERE f.empresa_id = empresa_uuid
    AND (search_term IS NULL OR f.nome ILIKE '%' || search_term || '%' OR f.email ILIKE '%' || search_term || '%')
    AND (equipe_uuid IS NULL OR f.equipe_id = equipe_uuid)
    AND (cargo_uuid IS NULL OR f.cargo_id = cargo_uuid)
    AND (ativo_filter IS NULL OR f.ativo = ativo_filter)
    ORDER BY f.nome
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. VIEWS ÚTEIS
-- =====================================================

-- View para relatório de funcionários
CREATE OR REPLACE VIEW vw_funcionarios_completo AS
SELECT 
    f.id,
    f.nome,
    f.email,
    f.cpf,
    f.telefone,
    f.data_admissao,
    f.data_demissao,
    f.salario,
    f.tipo_contrato,
    f.ativo,
    e.nome as equipe_nome,
    e.cor as equipe_cor,
    c.nome as cargo_nome,
    c.nivel as cargo_nivel,
    h.nome as horario_nome,
    h.hora_inicio,
    h.hora_fim,
    f.empresa_id,
    f.created_at,
    f.updated_at
FROM funcionarios f
LEFT JOIN equipes e ON f.equipe_id = e.id
LEFT JOIN cargos c ON f.cargo_id = c.id
LEFT JOIN horarios h ON f.horario_id = h.id;

-- View para dashboard de faltas
CREATE OR REPLACE VIEW vw_faltas_dashboard AS
SELECT 
    f.id,
    f.data_inicio,
    f.data_fim,
    f.tipo,
    f.motivo,
    f.aprovado,
    func.nome as funcionario_nome,
    func.cpf as funcionario_cpf,
    e.nome as equipe_nome,
    c.nome as cargo_nome,
    f.empresa_id,
    f.created_at
FROM faltas f
JOIN funcionarios func ON f.funcionario_id = func.id
LEFT JOIN equipes e ON func.equipe_id = e.id
LEFT JOIN cargos c ON func.cargo_id = c.id;

-- View para relatório de férias
CREATE OR REPLACE VIEW vw_ferias_relatorio AS
SELECT 
    fer.id,
    fer.data_inicio,
    fer.data_fim,
    fer.dias_uteis,
    fer.ano_referencia,
    fer.status,
    fer.observacoes,
    func.nome as funcionario_nome,
    func.cpf as funcionario_cpf,
    e.nome as equipe_nome,
    c.nome as cargo_nome,
    fer.empresa_id,
    fer.created_at,
    fer.aprovado_em
FROM ferias fer
JOIN funcionarios func ON fer.funcionario_id = func.id
LEFT JOIN equipes e ON func.equipe_id = e.id
LEFT JOIN cargos c ON func.cargo_id = c.id;

-- =====================================================
-- 6. TRIGGERS ADICIONAIS
-- =====================================================

-- Trigger para calcular dias úteis automaticamente nas férias
CREATE OR REPLACE FUNCTION calcular_dias_uteis_ferias()
RETURNS TRIGGER AS $$
BEGIN
    NEW.dias_uteis := calcular_dias_uteis(NEW.data_inicio, NEW.data_fim);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_dias_uteis_ferias
    BEFORE INSERT OR UPDATE ON ferias
    FOR EACH ROW
    EXECUTE FUNCTION calcular_dias_uteis_ferias();

-- Trigger para calcular horas trabalhadas automaticamente
CREATE OR REPLACE FUNCTION calcular_horas_ponto()
RETURNS TRIGGER AS $$
BEGIN
    NEW.horas_trabalhadas := calcular_horas_trabalhadas(
        NEW.entrada_manha,
        NEW.saida_almoco,
        NEW.volta_almoco,
        NEW.saida_tarde
    );
    
    -- Calcular horas extras (assumindo 8h como jornada padrão)
    IF NEW.horas_trabalhadas > interval '8 hours' THEN
        NEW.horas_extras := NEW.horas_trabalhadas - interval '8 hours';
    ELSE
        NEW.horas_extras := interval '0 hours';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_horas_ponto
    BEFORE INSERT OR UPDATE ON pontos
    FOR EACH ROW
    EXECUTE FUNCTION calcular_horas_ponto();

-- =====================================================
-- 7. CONFIGURAÇÕES DE PERFORMANCE
-- =====================================================

-- Configurar autovacuum para tabelas com muitas inserções
ALTER TABLE faltas SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE pontos SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE atestados SET (autovacuum_vacuum_scale_factor = 0.2);

-- =====================================================
-- 8. GRANTS E PERMISSÕES
-- =====================================================

-- Garantir que as funções podem ser executadas por usuários autenticados
GRANT EXECUTE ON FUNCTION get_empresa_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION buscar_funcionarios(UUID, TEXT, UUID, UUID, BOOLEAN, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION calcular_dias_uteis(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION calcular_horas_trabalhadas(TIME, TIME, TIME, TIME) TO authenticated;

-- Permitir acesso às views
GRANT SELECT ON vw_funcionarios_completo TO authenticated;
GRANT SELECT ON vw_faltas_dashboard TO authenticated;
GRANT SELECT ON vw_ferias_relatorio TO authenticated;

-- =====================================================
-- FINALIZAÇÃO
-- =====================================================

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Configuração do banco de dados EXTRANEF concluída com sucesso!';
    RAISE NOTICE '📋 Próximos passos:';
    RAISE NOTICE '1. Configure as variáveis de ambiente no backend';
    RAISE NOTICE '2. Crie o bucket "documentos" no Storage';
    RAISE NOTICE '3. Execute os seeds.sql se desejar dados de exemplo';
    RAISE NOTICE '4. Teste a conexão com o backend';
END $$;
