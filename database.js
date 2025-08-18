// Sistema de Banco de Dados Local + Persistência (Electron) - EXTRANEF

// Adaptador de armazenamento com suporte a Electron (IPC) e localStorage
const StorageAdapter = (() => {
  const cache = {};
  let electronAvailable = typeof window !== "undefined" && !!window.electronAPI;

  async function hydrateTable(tableName) {
    if (!electronAvailable) return;
    try {
      const res = await window.electronAPI.dbGetTable(tableName);
      if (res && res.success && Array.isArray(res.data)) {
        cache[tableName] = res.data;
        // Se a base principal estiver vazia, mas existe conteúdo no localStorage, promover dados locais para o backend
        const localRowsRaw = localStorage.getItem(tableName);
        const localRows = localRowsRaw ? JSON.parse(localRowsRaw) : [];
        if (
          (res.data || []).length === 0 &&
          Array.isArray(localRows) &&
          localRows.length > 0
        ) {
          try {
            await window.electronAPI.dbSaveTable(tableName, localRows);
            cache[tableName] = localRows;
          } catch (_) {}
        }
      }
    } catch (e) {
      // silencia erros de hidratação
    }
  }

  // Hidratar tabelas principais em background
  (async () => {
    if (!electronAvailable) return;
    try {
      const ready = await window.electronAPI.dbIsReady();
      if (ready && ready.ready) {
        const tables = [
          "extranef_funcionarios",
          "extranef_equipes",
          "extranef_cargos",
          "extranef_horarios",
          "extranef_tipos_contrato",
          "extranef_faltas",
          "extranef_ferias",
          "extranef_atestados",
        ];
        await Promise.all(tables.map(hydrateTable));
        // Notificar UI que dados do backend foram carregados
        try {
          document.dispatchEvent(new CustomEvent("extranef:db-ready"));
        } catch (_) {}
      }
    } catch (_) {}
  })();

  function getTable(tableName) {
    if (cache[tableName]) return cache[tableName];
    try {
      const raw = localStorage.getItem(tableName);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveTableSync(tableName, rows) {
    cache[tableName] = rows;
    try {
      localStorage.setItem(tableName, JSON.stringify(rows));
    } catch (_) {}
  }

  async function persist(tableName, rows) {
    saveTableSync(tableName, rows);
    if (!electronAvailable) return;
    try {
      await window.electronAPI.dbSaveTable(tableName, rows);
    } catch (_) {}
  }

  return { getTable, persist };
})();

class ExtranefDB {
  constructor() {
    this.initDatabase();
  }

  // Inicializar banco de dados
  initDatabase() {
    // Estruturas principais
    if (!localStorage.getItem("extranef_equipes")) {
      localStorage.setItem(
        "extranef_equipes",
        JSON.stringify([
          { id: 1, nome: "Direção", descricao: "Líder/Gerente" },
          { id: 2, nome: "RH", descricao: "Setor de pessoal" },
          { id: 3, nome: "Supervisor", descricao: "Supervisor de Equipe" },
          { id: 4, nome: "Control Desk", descricao: "Auxiliar de Escritório" },
          { id: 5, nome: "Negociador", descricao: "Negociador de Cobrança" },
        ])
      );
    }

    if (!localStorage.getItem("extranef_cargos")) {
      localStorage.setItem(
        "extranef_cargos",
        JSON.stringify([
          { id: 1, nome: "Auxiliar", nivel: 1 },
          { id: 2, nome: "Assistente", nivel: 2 },
          { id: 3, nome: "Analista", nivel: 3 },
          { id: 4, nome: "Supervisor", nivel: 4 },
          { id: 5, nome: "Gerente", nivel: 5 },
          { id: 6, nome: "Diretor", nivel: 6 },
        ])
      );
    }

    if (!localStorage.getItem("extranef_horarios")) {
      localStorage.setItem(
        "extranef_horarios",
        JSON.stringify([
          {
            id: 1,
            nome: "Matutino",
            inicio: "08:00",
            fim: "12:00",
            tipo: "parcial",
          },
          {
            id: 2,
            nome: "Vespertino",
            inicio: "13:00",
            fim: "17:00",
            tipo: "parcial",
          },
          {
            id: 3,
            nome: "Integral",
            inicio: "08:00",
            fim: "18:00",
            tipo: "integral",
          },
        ])
      );
    }

    if (!localStorage.getItem("extranef_tipos_contrato")) {
      localStorage.setItem(
        "extranef_tipos_contrato",
        JSON.stringify([
          { id: 1, nome: "Estagiário", tipo: "estagiario" },
          { id: 2, nome: "CLT", tipo: "clt" },
          { id: 3, nome: "Temporário", tipo: "temporario" },
        ])
      );
    }

    // Tabelas principais
    if (!localStorage.getItem("extranef_funcionarios")) {
      localStorage.setItem("extranef_funcionarios", JSON.stringify([]));
    }

    if (!localStorage.getItem("extranef_faltas")) {
      localStorage.setItem("extranef_faltas", JSON.stringify([]));
    }

    if (!localStorage.getItem("extranef_ferias")) {
      localStorage.setItem("extranef_ferias", JSON.stringify([]));
    }

    if (!localStorage.getItem("extranef_atestados")) {
      localStorage.setItem("extranef_atestados", JSON.stringify([]));
    }
  }

  // ===== FUNCIONÁRIOS =====
  getFuncionarios() {
    return StorageAdapter.getTable("extranef_funcionarios");
  }

  addFuncionario(funcionario) {
    const funcionarios = this.getFuncionarios();
    funcionario.id = Date.now();
    funcionario.dataCadastro = new Date().toISOString();
    funcionario.ativo = true;
    funcionarios.push(funcionario);
    StorageAdapter.persist("extranef_funcionarios", funcionarios);
    return funcionario;
  }

  updateFuncionario(id, dados) {
    const funcionarios = this.getFuncionarios();
    const index = funcionarios.findIndex((f) => f.id === id);
    if (index !== -1) {
      funcionarios[index] = { ...funcionarios[index], ...dados };
      StorageAdapter.persist("extranef_funcionarios", funcionarios);
      return funcionarios[index];
    }
    return null;
  }

  deleteFuncionario(id) {
    const funcionarios = this.getFuncionarios();
    const index = funcionarios.findIndex((f) => f.id === id);
    if (index !== -1) {
      funcionarios.splice(index, 1);
      StorageAdapter.persist("extranef_funcionarios", funcionarios);
      return true;
    }
    return false;
  }

  getFuncionarioById(id) {
    const funcionarios = this.getFuncionarios();
    return funcionarios.find((f) => f.id === id);
  }

  // ===== EQUIPES =====
  getEquipes() {
    return StorageAdapter.getTable("extranef_equipes");
  }

  addEquipe(equipe) {
    const equipes = this.getEquipes();
    equipe.id = Date.now();
    equipes.push(equipe);
    StorageAdapter.persist("extranef_equipes", equipes);
    return equipe;
  }

  // ===== CARGOS =====
  getCargos() {
    return StorageAdapter.getTable("extranef_cargos");
  }

  addCargo(cargo) {
    const cargos = this.getCargos();
    cargo.id = Date.now();
    cargos.push(cargo);
    StorageAdapter.persist("extranef_cargos", cargos);
    return cargo;
  }

  // ===== HORÁRIOS =====
  getHorarios() {
    return StorageAdapter.getTable("extranef_horarios");
  }

  // ===== TIPOS DE CONTRATO =====
  getTiposContrato() {
    return StorageAdapter.getTable("extranef_tipos_contrato");
  }

  // ===== FALTAS =====
  getFaltas() {
    return StorageAdapter.getTable("extranef_faltas");
  }

  addFalta(falta) {
    const faltas = this.getFaltas();
    falta.id = Date.now();
    falta.dataRegistro = new Date().toISOString();
    faltas.push(falta);
    StorageAdapter.persist("extranef_faltas", faltas);
    return falta;
  }

  // ===== FÉRIAS =====
  getFerias() {
    return StorageAdapter.getTable("extranef_ferias");
  }

  addFerias(ferias) {
    const feriasList = this.getFerias();
    ferias.id = Date.now();
    ferias.dataRegistro = new Date().toISOString();
    feriasList.push(ferias);
    StorageAdapter.persist("extranef_ferias", feriasList);
    return ferias;
  }

  // ===== ATESTADOS =====
  getAtestados() {
    return StorageAdapter.getTable("extranef_atestados");
  }

  addAtestado(atestado) {
    const atestados = this.getAtestados();
    atestado.id = Date.now();
    atestado.dataRegistro = new Date().toISOString();
    atestados.push(atestado);
    StorageAdapter.persist("extranef_atestados", atestados);
    return atestado;
  }

  // ===== RELATÓRIOS =====
  getRelatorioFuncionarios() {
    const funcionarios = this.getFuncionarios();
    const faltas = this.getFaltas();
    const atestados = this.getAtestados();
    const ferias = this.getFerias();

    return funcionarios.map((func) => {
      const faltasFunc = faltas.filter((f) => f.funcionarioId === func.id);
      const atestadosFunc = atestados.filter(
        (a) => a.funcionarioId === func.id
      );
      const feriasFunc = ferias.filter((f) => f.funcionarioId === func.id);

      return {
        ...func,
        totalFaltas: faltasFunc.length,
        totalAtestados: atestadosFunc.length,
        totalFerias: feriasFunc.length,
        ultimaFalta:
          faltasFunc.length > 0
            ? Math.max(...faltasFunc.map((f) => new Date(f.dataFalta)))
            : null,
      };
    });
  }

  // ===== BACKUP E RESTAURAÇÃO =====
  exportarDados() {
    return {
      funcionarios: this.getFuncionarios(),
      equipes: this.getEquipes(),
      cargos: this.getCargos(),
      horarios: this.getHorarios(),
      tiposContrato: this.getTiposContrato(),
      faltas: this.getFaltas(),
      ferias: this.getFerias(),
      atestados: this.getAtestados(),
      dataExportacao: new Date().toISOString(),
      versao: "1.0.0",
    };
  }

  importarDados(dados) {
    try {
      if (dados.funcionarios)
        StorageAdapter.persist("extranef_funcionarios", dados.funcionarios);
      if (dados.equipes)
        StorageAdapter.persist("extranef_equipes", dados.equipes);
      if (dados.cargos) StorageAdapter.persist("extranef_cargos", dados.cargos);
      if (dados.horarios)
        StorageAdapter.persist("extranef_horarios", dados.horarios);
      if (dados.tiposContrato)
        StorageAdapter.persist("extranef_tipos_contrato", dados.tiposContrato);
      if (dados.faltas) StorageAdapter.persist("extranef_faltas", dados.faltas);
      if (dados.ferias) StorageAdapter.persist("extranef_ferias", dados.ferias);
      if (dados.atestados)
        StorageAdapter.persist("extranef_atestados", dados.atestados);
      return true;
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      return false;
    }
  }

  limparDados() {
    localStorage.removeItem("extranef_funcionarios");
    localStorage.removeItem("extranef_faltas");
    localStorage.removeItem("extranef_ferias");
    localStorage.removeItem("extranef_atestados");
    this.initDatabase();
  }

  // ===== MÉTODOS DE SALVAMENTO =====
  salvarFuncionarios(funcionarios) {
    StorageAdapter.persist("extranef_funcionarios", funcionarios);
  }

  salvarFaltas(faltas) {
    StorageAdapter.persist("extranef_faltas", faltas);
  }

  salvarFerias(ferias) {
    StorageAdapter.persist("extranef_ferias", ferias);
  }

  salvarAtestados(atestados) {
    StorageAdapter.persist("extranef_atestados", atestados);
  }
  salvarEquipes(equipes) {
    StorageAdapter.persist("extranef_equipes", equipes);
  }

  salvarCargos(cargos) {
    StorageAdapter.persist("extranef_cargos", cargos);
  }

  salvarHorarios(horarios) {
    StorageAdapter.persist("extranef_horarios", horarios);
  }
}

// Instância global do banco de dados
window.extranefDB = new ExtranefDB();
