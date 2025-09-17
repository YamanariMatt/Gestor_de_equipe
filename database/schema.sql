-- =====================================================
-- NEF - Esquema do Banco de Dados PostgreSQL
-- Sistema de Gestão de Equipe
-- Versão: 2.0
-- Data: 2024-01-17
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: empresas
-- Empresas/organizações do sistema
-- =====================================================
CREATE TABLE empresas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: profiles
-- Perfis de usuários (extensão da tabela auth.users do Supabase)
-- =====================================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'supervisor' CHECK (role IN ('admin', 'supervisor', 'gestor', 'gerente', 'rh')),
    ativo BOOLEAN DEFAULT true,
    primeiro_acesso BOOLEAN DEFAULT true,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: equipes
-- Equipes/departamentos da empresa
-- =====================================================
CREATE TABLE equipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    supervisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cor VARCHAR(7) DEFAULT '#3498db', -- Cor hexadecimal para identificação visual
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT equipes_nome_empresa_unique UNIQUE (nome, empresa_id)
);

-- =====================================================
-- TABELA: cargos
-- Cargos/funções disponíveis
-- =====================================================
CREATE TABLE cargos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    salario_base DECIMAL(10,2),
    nivel VARCHAR(50) CHECK (nivel IN ('junior', 'pleno', 'senior', 'coordenador', 'gerente', 'diretor')),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT cargos_nome_empresa_unique UNIQUE (nome, empresa_id)
);

-- =====================================================
-- TABELA: horarios
-- Horários de trabalho
-- =====================================================
CREATE TABLE horarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    intervalo_inicio TIME,
    intervalo_fim TIME,
    dias_semana INTEGER[] DEFAULT '{1,2,3,4,5}', -- 1=Segunda, 7=Domingo
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT horarios_nome_empresa_unique UNIQUE (nome, empresa_id)
);

-- =====================================================
-- TABELA: funcionarios
-- Funcionários da empresa
-- =====================================================
CREATE TABLE funcionarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    rg VARCHAR(20),
    telefone VARCHAR(20),
    endereco TEXT,
    data_nascimento DATE,
    data_admissao DATE NOT NULL,
    data_demissao DATE,
    equipe_id UUID REFERENCES equipes(id) ON DELETE SET NULL,
    cargo_id UUID REFERENCES cargos(id) ON DELETE SET NULL,
    horario_id UUID REFERENCES horarios(id) ON DELETE SET NULL,
    salario DECIMAL(10,2),
    tipo_contrato VARCHAR(50) DEFAULT 'clt' CHECK (tipo_contrato IN ('clt', 'pj', 'estagiario', 'terceirizado')),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    ativo BOOLEAN DEFAULT true,
    observacoes TEXT,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT funcionarios_cpf_check CHECK (LENGTH(cpf) = 11),
    CONSTRAINT funcionarios_data_admissao_demissao_check CHECK (data_demissao IS NULL OR data_demissao >= data_admissao)
);

-- =====================================================
-- TABELA: faltas
-- Registro de faltas e ausências
-- =====================================================
CREATE TABLE faltas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    funcionario_id UUID REFERENCES funcionarios(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    hora_inicio TIME,
    hora_fim TIME,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('falta', 'atraso', 'saida_antecipada', 'falta_justificada')),
    motivo TEXT,
    justificativa TEXT,
    aprovado BOOLEAN,
    aprovado_por UUID REFERENCES profiles(id),
    aprovado_em TIMESTAMP WITH TIME ZONE,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT faltas_data_check CHECK (data_fim >= data_inicio),
    CONSTRAINT faltas_hora_check CHECK (
        (hora_inicio IS NULL AND hora_fim IS NULL) OR 
        (hora_inicio IS NOT NULL AND hora_fim IS NOT NULL AND hora_fim > hora_inicio)
    )
);

-- =====================================================
-- TABELA: ferias
-- Períodos de férias
-- =====================================================
CREATE TABLE ferias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    funcionario_id UUID REFERENCES funcionarios(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    dias_uteis INTEGER NOT NULL,
    ano_referencia INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'solicitado' CHECK (status IN ('solicitado', 'aprovado', 'rejeitado', 'em_andamento', 'concluido')),
    observacoes TEXT,
    aprovado_por UUID REFERENCES profiles(id),
    aprovado_em TIMESTAMP WITH TIME ZONE,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT ferias_data_check CHECK (data_fim > data_inicio),
    CONSTRAINT ferias_dias_uteis_check CHECK (dias_uteis > 0 AND dias_uteis <= 30),
    CONSTRAINT ferias_ano_referencia_check CHECK (ano_referencia >= 1900 AND ano_referencia <= 2100)
);

-- =====================================================
-- TABELA: atestados
-- Atestados médicos e documentos
-- =====================================================
CREATE TABLE atestados (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    funcionario_id UUID REFERENCES funcionarios(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('medico', 'odontologico', 'psicologico', 'outros')),
    arquivo_url TEXT,
    arquivo_nome VARCHAR(255),
    observacoes TEXT,
    validado BOOLEAN DEFAULT false,
    validado_por UUID REFERENCES profiles(id),
    validado_em TIMESTAMP WITH TIME ZONE,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT atestados_data_check CHECK (data_fim >= data_inicio)
);

-- =====================================================
-- TABELA: pontos
-- Registro de ponto eletrônico (opcional)
-- =====================================================
CREATE TABLE pontos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    funcionario_id UUID REFERENCES funcionarios(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    entrada_manha TIME,
    saida_almoco TIME,
    volta_almoco TIME,
    saida_tarde TIME,
    horas_trabalhadas INTERVAL,
    horas_extras INTERVAL,
    observacoes TEXT,
    ip_address INET,
    localizacao POINT,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT pontos_funcionario_data_unique UNIQUE (funcionario_id, data)
);

-- =====================================================
-- TABELA: configuracoes
-- Configurações do sistema por empresa
-- =====================================================
CREATE TABLE configuracoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE UNIQUE,
    backup_automatico BOOLEAN DEFAULT true,
    backup_intervalo INTEGER DEFAULT 24, -- horas
    notificacoes_email BOOLEAN DEFAULT true,
    notificacoes_push BOOLEAN DEFAULT true,
    tema VARCHAR(50) DEFAULT 'light' CHECK (tema IN ('light', 'dark', 'auto')),
    idioma VARCHAR(10) DEFAULT 'pt-BR',
    fuso_horario VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    configuracoes_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para profiles
CREATE INDEX idx_profiles_empresa_id ON profiles(empresa_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Índices para funcionarios
CREATE INDEX idx_funcionarios_empresa_id ON funcionarios(empresa_id);
CREATE INDEX idx_funcionarios_equipe_id ON funcionarios(equipe_id);
CREATE INDEX idx_funcionarios_cargo_id ON funcionarios(cargo_id);
CREATE INDEX idx_funcionarios_ativo ON funcionarios(ativo);
CREATE INDEX idx_funcionarios_cpf ON funcionarios(cpf);
CREATE INDEX idx_funcionarios_nome ON funcionarios USING gin(to_tsvector('portuguese', nome));

-- Índices para faltas
CREATE INDEX idx_faltas_funcionario_id ON faltas(funcionario_id);
CREATE INDEX idx_faltas_empresa_id ON faltas(empresa_id);
CREATE INDEX idx_faltas_data_inicio ON faltas(data_inicio);
CREATE INDEX idx_faltas_tipo ON faltas(tipo);

-- Índices para ferias
CREATE INDEX idx_ferias_funcionario_id ON ferias(funcionario_id);
CREATE INDEX idx_ferias_empresa_id ON ferias(empresa_id);
CREATE INDEX idx_ferias_data_inicio ON ferias(data_inicio);
CREATE INDEX idx_ferias_status ON ferias(status);
CREATE INDEX idx_ferias_ano_referencia ON ferias(ano_referencia);

-- Índices para atestados
CREATE INDEX idx_atestados_funcionario_id ON atestados(funcionario_id);
CREATE INDEX idx_atestados_empresa_id ON atestados(empresa_id);
CREATE INDEX idx_atestados_data_inicio ON atestados(data_inicio);
CREATE INDEX idx_atestados_tipo ON atestados(tipo);

-- Índices para pontos
CREATE INDEX idx_pontos_funcionario_id ON pontos(funcionario_id);
CREATE INDEX idx_pontos_data ON pontos(data);
CREATE INDEX idx_pontos_empresa_id ON pontos(empresa_id);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para todas as tabelas
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipes_updated_at BEFORE UPDATE ON equipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cargos_updated_at BEFORE UPDATE ON cargos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_horarios_updated_at BEFORE UPDATE ON horarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON funcionarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faltas_updated_at BEFORE UPDATE ON faltas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ferias_updated_at BEFORE UPDATE ON ferias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_atestados_updated_at BEFORE UPDATE ON atestados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pontos_updated_at BEFORE UPDATE ON pontos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS (Row Level Security) POLICIES
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE faltas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE atestados ENABLE ROW LEVEL SECURITY;
ALTER TABLE pontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para equipes
CREATE POLICY "Usuários podem ver equipes da sua empresa" ON equipes FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar equipes da sua empresa" ON equipes FOR ALL USING (empresa_id = auth.uid());

-- Políticas para cargos
CREATE POLICY "Usuários podem ver cargos da sua empresa" ON cargos FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar cargos da sua empresa" ON cargos FOR ALL USING (empresa_id = auth.uid());

-- Políticas para horarios
CREATE POLICY "Usuários podem ver horários da sua empresa" ON horarios FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar horários da sua empresa" ON horarios FOR ALL USING (empresa_id = auth.uid());

-- Políticas para funcionarios
CREATE POLICY "Usuários podem ver funcionários da sua empresa" ON funcionarios FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar funcionários da sua empresa" ON funcionarios FOR ALL USING (empresa_id = auth.uid());

-- Políticas para faltas
CREATE POLICY "Usuários podem ver faltas da sua empresa" ON faltas FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar faltas da sua empresa" ON faltas FOR ALL USING (empresa_id = auth.uid());

-- Políticas para ferias
CREATE POLICY "Usuários podem ver férias da sua empresa" ON ferias FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar férias da sua empresa" ON ferias FOR ALL USING (empresa_id = auth.uid());

-- Políticas para atestados
CREATE POLICY "Usuários podem ver atestados da sua empresa" ON atestados FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar atestados da sua empresa" ON atestados FOR ALL USING (empresa_id = auth.uid());

-- Políticas para pontos
CREATE POLICY "Usuários podem ver pontos da sua empresa" ON pontos FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar pontos da sua empresa" ON pontos FOR ALL USING (empresa_id = auth.uid());

-- Políticas para configuracoes
CREATE POLICY "Usuários podem ver configurações da sua empresa" ON configuracoes FOR SELECT USING (empresa_id = auth.uid());
CREATE POLICY "Usuários podem gerenciar configurações da sua empresa" ON configuracoes FOR ALL USING (empresa_id = auth.uid());

-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para calcular dias úteis entre duas datas
CREATE OR REPLACE FUNCTION calcular_dias_uteis(data_inicio DATE, data_fim DATE)
RETURNS INTEGER AS $$
DECLARE
    dias INTEGER := 0;
    data_atual DATE := data_inicio;
BEGIN
    WHILE data_atual <= data_fim LOOP
        -- Contar apenas dias úteis (segunda a sexta)
        IF EXTRACT(DOW FROM data_atual) BETWEEN 1 AND 5 THEN
            dias := dias + 1;
        END IF;
        data_atual := data_atual + 1;
    END LOOP;
    
    RETURN dias;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular horas trabalhadas
CREATE OR REPLACE FUNCTION calcular_horas_trabalhadas(
    entrada_manha TIME,
    saida_almoco TIME,
    volta_almoco TIME,
    saida_tarde TIME
)
RETURNS INTERVAL AS $$
DECLARE
    horas_manha INTERVAL := '0 hours';
    horas_tarde INTERVAL := '0 hours';
BEGIN
    -- Calcular horas da manhã
    IF entrada_manha IS NOT NULL AND saida_almoco IS NOT NULL THEN
        horas_manha := saida_almoco - entrada_manha;
    END IF;
    
    -- Calcular horas da tarde
    IF volta_almoco IS NOT NULL AND saida_tarde IS NOT NULL THEN
        horas_tarde := saida_tarde - volta_almoco;
    END IF;
    
    RETURN horas_manha + horas_tarde;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS INICIAIS (SEEDS)
-- =====================================================

-- Inserir configuração padrão quando um novo perfil é criado
CREATE OR REPLACE FUNCTION criar_configuracao_padrao()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir configuração apenas se não existir para a empresa
    INSERT INTO configuracoes (empresa_id) 
    VALUES (NEW.empresa_id)
    ON CONFLICT (empresa_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_criar_configuracao_padrao
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION criar_configuracao_padrao();

-- =====================================================
-- COMENTÁRIOS DAS TABELAS
-- =====================================================

COMMENT ON TABLE profiles IS 'Perfis de usuários do sistema';
COMMENT ON TABLE equipes IS 'Equipes/departamentos da empresa';
COMMENT ON TABLE cargos IS 'Cargos e funções disponíveis';
COMMENT ON TABLE horarios IS 'Horários de trabalho';
COMMENT ON TABLE funcionarios IS 'Funcionários da empresa';
COMMENT ON TABLE faltas IS 'Registro de faltas e ausências';
COMMENT ON TABLE ferias IS 'Períodos de férias dos funcionários';
COMMENT ON TABLE atestados IS 'Atestados médicos e documentos';
COMMENT ON TABLE pontos IS 'Registro de ponto eletrônico';
COMMENT ON TABLE configuracoes IS 'Configurações do sistema por empresa';
