// ===== VARIÁVEIS GLOBAIS =====
let equipes = [];
let cargos = [];
let horarios = [];
let funcionarios = [];
let equipeEditando = null;
let cargoEditando = null;
let horarioEditando = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
  carregarDados();
  atualizarEstatisticas();
  carregarConfiguracoes();
  // Recarregar dados quando o backend terminar de hidratar
  document.addEventListener("extranef:db-ready", () => {
    carregarDados();
    atualizarEstatisticas();
  });
  // Pré-preencher Google Drive se já houver valores no localStorage
  try {
    const cfg = JSON.parse(
      localStorage.getItem("extranef_gdrive_cfg") || "null"
    );
    if (cfg) {
      const id = document.getElementById("gdriveClientId");
      const sec = document.getElementById("gdriveClientSecret");
      const fol = document.getElementById("gdriveFolderId");
      if (id && sec && fol) {
        id.value = cfg.clientId || "";
        sec.value = cfg.clientSecret || "";
        fol.value = cfg.folderId || "";
      }
    }
  } catch (_) {}
});

// ===== CARREGAMENTO DE DADOS =====
function carregarDados() {
  // Carregar dados do banco
  equipes = window.extranefDB.getEquipes();
  cargos = window.extranefDB.getCargos();
  horarios = window.extranefDB.getHorarios();
  funcionarios = window.extranefDB.getFuncionarios();

  // Renderizar tabelas
  renderizarTabelaEquipes();
  renderizarTabelaCargos();
  renderizarTabelaHorarios();
}

// ===== ESTATÍSTICAS =====
function atualizarEstatisticas() {
  // Total de dados
  const totalDados =
    equipes.length + cargos.length + horarios.length + funcionarios.length;
  document.getElementById("totalDados").textContent = totalDados;

  // Total de funcionários
  document.getElementById("totalFuncionarios").textContent =
    funcionarios.length;

  // Total de equipes
  document.getElementById("totalEquipes").textContent = equipes.length;

  // Total de cargos
  document.getElementById("totalCargos").textContent = cargos.length;
}

// ===== RENDERIZAÇÃO DAS TABELAS =====
function renderizarTabelaEquipes() {
  const tbody = document.getElementById("tbodyEquipes");
  tbody.innerHTML = "";

  equipes.forEach((equipe) => {
    const funcionariosEquipe = funcionarios.filter(
      (f) => f.equipeId == equipe.id
    ).length;

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${equipe.id}</td>
            <td>${equipe.nome}</td>
            <td>${equipe.descricao || "-"}</td>
            <td>${funcionariosEquipe}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editarEquipe(${
                  equipe.id
                })" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirEquipe(${
                  equipe.id
                })" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function renderizarTabelaCargos() {
  const tbody = document.getElementById("tbodyCargos");
  tbody.innerHTML = "";

  cargos.forEach((cargo) => {
    const funcionariosCargo = funcionarios.filter(
      (f) => f.cargoId == cargo.id
    ).length;

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${cargo.id}</td>
            <td>${cargo.nome}</td>
            <td>${cargo.nivel}</td>
            <td>${funcionariosCargo}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editarCargo(${cargo.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirCargo(${cargo.id})" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function renderizarTabelaHorarios() {
  const tbody = document.getElementById("tbodyHorarios");
  tbody.innerHTML = "";

  horarios.forEach((horario) => {
    const funcionariosHorario = funcionarios.filter(
      (f) => f.horarioId == horario.id
    ).length;

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${horario.id}</td>
            <td>${horario.nome}</td>
            <td>${horario.inicio}</td>
            <td>${horario.fim}</td>
            <td><span class="status-badge ${
              horario.tipo
            }">${formatarTipoHorario(horario.tipo)}</span></td>
            <td>${funcionariosHorario}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editarHorario(${
                  horario.id
                })" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirHorario(${
                  horario.id
                })" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// ===== MODAIS EQUIPE =====
function abrirModalEquipe() {
  document.getElementById("modalEquipe").style.display = "block";
  document.getElementById("modalEquipeTitulo").textContent = "Nova Equipe";
  document.getElementById("formEquipe").reset();
  equipeEditando = null;
}

function fecharModalEquipe() {
  document.getElementById("modalEquipe").style.display = "none";
  equipeEditando = null;
}

function editarEquipe(id) {
  const equipe = equipes.find((e) => e.id == id);
  if (!equipe) return;

  equipeEditando = equipe;
  document.getElementById("modalEquipeTitulo").textContent = "Editar Equipe";

  // Preencher formulário
  document.getElementById("nomeEquipe").value = equipe.nome;
  document.getElementById("descricaoEquipe").value = equipe.descricao || "";

  document.getElementById("modalEquipe").style.display = "block";
}

// ===== MODAIS CARGO =====
function abrirModalCargo() {
  document.getElementById("modalCargo").style.display = "block";
  document.getElementById("modalCargoTitulo").textContent = "Novo Cargo";
  document.getElementById("formCargo").reset();
  cargoEditando = null;
}

function fecharModalCargo() {
  document.getElementById("modalCargo").style.display = "none";
  cargoEditando = null;
}

function editarCargo(id) {
  const cargo = cargos.find((c) => c.id == id);
  if (!cargo) return;

  cargoEditando = cargo;
  document.getElementById("modalCargoTitulo").textContent = "Editar Cargo";

  // Preencher formulário
  document.getElementById("nomeCargo").value = cargo.nome;
  document.getElementById("nivelCargo").value = cargo.nivel;

  document.getElementById("modalCargo").style.display = "block";
}

// ===== MODAIS HORÁRIO =====
function abrirModalHorario() {
  document.getElementById("modalHorario").style.display = "block";
  document.getElementById("modalHorarioTitulo").textContent = "Novo Horário";
  document.getElementById("formHorario").reset();
  horarioEditando = null;
}

function fecharModalHorario() {
  document.getElementById("modalHorario").style.display = "none";
  horarioEditando = null;
}

function editarHorario(id) {
  const horario = horarios.find((h) => h.id == id);
  if (!horario) return;

  horarioEditando = horario;
  document.getElementById("modalHorarioTitulo").textContent = "Editar Horário";

  // Preencher formulário
  document.getElementById("nomeHorario").value = horario.nome;
  document.getElementById("inicioHorario").value = horario.inicio;
  document.getElementById("fimHorario").value = horario.fim;
  document.getElementById("tipoHorario").value = horario.tipo;

  document.getElementById("modalHorario").style.display = "block";
}

// ===== FUNCIONALIDADES EQUIPE =====
function salvarEquipe(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = Object.fromEntries(formData.entries());

  const equipe = {
    id: equipeEditando ? equipeEditando.id : Date.now(),
    nome: dados.nomeEquipe,
    descricao: dados.descricaoEquipe || "",
  };

  if (equipeEditando) {
    // Editar
    const index = equipes.findIndex((e) => e.id == equipe.id);
    if (index !== -1) {
      equipes[index] = equipe;
    }
  } else {
    // Novo
    equipes.push(equipe);
  }

  // Salvar no banco
  window.extranefDB.salvarEquipes(equipes);

  // Atualizar interface
  renderizarTabelaEquipes();
  atualizarEstatisticas();
  fecharModalEquipe();
}

function excluirEquipe(id) {
  const funcionariosEquipe = funcionarios.filter(
    (f) => f.equipeId == id
  ).length;

  if (funcionariosEquipe > 0) {
    alert(
      `Não é possível excluir esta equipe. Existem ${funcionariosEquipe} funcionário(s) vinculado(s) a ela.`
    );
    return;
  }

  if (confirm("Tem certeza que deseja excluir esta equipe?")) {
    equipes = equipes.filter((e) => e.id != id);
    window.extranefDB.salvarEquipes(equipes);

    renderizarTabelaEquipes();
    atualizarEstatisticas();
  }
}

// ===== FUNCIONALIDADES CARGO =====
function salvarCargo(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = Object.fromEntries(formData.entries());

  const cargo = {
    id: cargoEditando ? cargoEditando.id : Date.now(),
    nome: dados.nomeCargo,
    nivel: parseInt(dados.nivelCargo),
  };

  if (cargoEditando) {
    // Editar
    const index = cargos.findIndex((c) => c.id == cargo.id);
    if (index !== -1) {
      cargos[index] = cargo;
    }
  } else {
    // Novo
    cargos.push(cargo);
  }

  // Salvar no banco
  window.extranefDB.salvarCargos(cargos);

  // Atualizar interface
  renderizarTabelaCargos();
  atualizarEstatisticas();
  fecharModalCargo();
}

function excluirCargo(id) {
  const funcionariosCargo = funcionarios.filter((f) => f.cargoId == id).length;

  if (funcionariosCargo > 0) {
    alert(
      `Não é possível excluir este cargo. Existem ${funcionariosCargo} funcionário(s) vinculado(s) a ele.`
    );
    return;
  }

  if (confirm("Tem certeza que deseja excluir este cargo?")) {
    cargos = cargos.filter((c) => c.id != id);
    window.extranefDB.salvarCargos(cargos);

    renderizarTabelaCargos();
    atualizarEstatisticas();
  }
}

// ===== FUNCIONALIDADES HORÁRIO =====
function salvarHorario(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = Object.fromEntries(formData.entries());

  const horario = {
    id: horarioEditando ? horarioEditando.id : Date.now(),
    nome: dados.nomeHorario,
    inicio: dados.inicioHorario,
    fim: dados.fimHorario,
    tipo: dados.tipoHorario,
  };

  if (horarioEditando) {
    // Editar
    const index = horarios.findIndex((h) => h.id == horario.id);
    if (index !== -1) {
      horarios[index] = horario;
    }
  } else {
    // Novo
    horarios.push(horario);
  }

  // Salvar no banco
  window.extranefDB.salvarHorarios(horarios);

  // Atualizar interface
  renderizarTabelaHorarios();
  atualizarEstatisticas();
  fecharModalHorario();
}

function excluirHorario(id) {
  const funcionariosHorario = funcionarios.filter(
    (f) => f.horarioId == id
  ).length;

  if (funcionariosHorario > 0) {
    alert(
      `Não é possível excluir este horário. Existem ${funcionariosHorario} funcionário(s) vinculado(s) a ele.`
    );
    return;
  }

  if (confirm("Tem certeza que deseja excluir este horário?")) {
    horarios = horarios.filter((h) => h.id != id);
    window.extranefDB.salvarHorarios(horarios);

    renderizarTabelaHorarios();
    atualizarEstatisticas();
  }
}

// ===== CONFIGURAÇÕES DO SISTEMA =====
function carregarConfiguracoes() {
  // Carregar configurações salvas
  const tema = localStorage.getItem("extranef_tema") || "dark";
  const idioma = localStorage.getItem("extranef_idioma") || "pt-BR";
  const notificacoes = localStorage.getItem("extranef_notificacoes") === "true";
  const backupAutomatico =
    localStorage.getItem("extranef_backup_automatico") === "true";

  // Aplicar configurações
  document.getElementById("temaSistema").value = tema;
  document.getElementById("idiomaSistema").value = idioma;
  document.getElementById("notificacoesAtivas").checked = notificacoes;
  document.getElementById("backupAutomatico").checked = backupAutomatico;
}

function alterarTema() {
  const tema = document.getElementById("temaSistema").value;
  localStorage.setItem("extranef_tema", tema);

  // Aplicar tema
  document.body.className = `theme-${tema}`;

  mostrarNotificacao("Tema alterado com sucesso!");
}

function alterarIdioma() {
  const idioma = document.getElementById("idiomaSistema").value;
  localStorage.setItem("extranef_idioma", idioma);

  // Recarregar página para aplicar idioma
  if (confirm("O idioma será alterado. Deseja recarregar a página?")) {
    location.reload();
  }
}

function alterarNotificacoes() {
  const ativo = document.getElementById("notificacoesAtivas").checked;
  localStorage.setItem("extranef_notificacoes", ativo);

  mostrarNotificacao(`Notificações ${ativo ? "ativadas" : "desativadas"}!`);
}

function alterarBackupAutomatico() {
  const ativo = document.getElementById("backupAutomatico").checked;
  localStorage.setItem("extranef_backup_automatico", ativo);

  mostrarNotificacao(`Backup automático ${ativo ? "ativado" : "desativado"}!`);
}

// ===== GOOGLE DRIVE =====
async function conectarGoogleDrive(event) {
  event && event.preventDefault && event.preventDefault();
  const clientId = document.getElementById("gdriveClientId").value.trim();
  const clientSecret = document
    .getElementById("gdriveClientSecret")
    .value.trim();
  const folderId = document.getElementById("gdriveFolderId").value.trim();
  const statusEl = document.getElementById("gdriveStatus");
  if (!clientId || !clientSecret || !folderId) {
    mostrarNotificacao("Preencha Client ID, Secret e Folder ID", "error");
    return;
  }
  try {
    // salvar preferências locais
    localStorage.setItem(
      "extranef_gdrive_cfg",
      JSON.stringify({ clientId, clientSecret, folderId })
    );
    if (window.electronAPI) {
      await window.electronAPI.gdriveConfigure({
        clientId,
        clientSecret,
        folderId,
        scope: "drive.file",
      });
      const login = await window.electronAPI.gdriveLogin();
      if (login && login.success) {
        mostrarNotificacao("Google Drive conectado", "success");
        if (statusEl) statusEl.textContent = "Conectado";
      } else {
        mostrarNotificacao("Falha ao conectar Google Drive", "error");
        if (statusEl) statusEl.textContent = "Falha ao conectar";
      }
    } else {
      mostrarNotificacao("Recurso disponível apenas no app desktop", "error");
    }
  } catch (e) {
    mostrarNotificacao("Erro na configuração do Google Drive", "error");
    if (statusEl) statusEl.textContent = "Erro";
  }
}

async function testarUploadDrive(event) {
  event && event.preventDefault && event.preventDefault();
  if (!window.electronAPI) {
    mostrarNotificacao("Recurso disponível apenas no app desktop", "error");
    return;
  }
  try {
    const payload = {
      funcionarioNome: "Teste",
      originalFileName: "hello.txt",
      dataUrl: "data:text/plain;base64,SEVMTExPIEVYVFJBTkVGIERSSVZFIQ==",
      atestadoId: Date.now(),
    };
    const res = await window.electronAPI.gdriveUploadAtestado(payload);
    if (res && res.success) {
      mostrarNotificacao("Upload de teste enviado ao Drive", "success");
    } else {
      mostrarNotificacao("Falha no upload de teste", "error");
    }
  } catch (_) {
    mostrarNotificacao("Erro ao enviar teste", "error");
  }
}

async function enviarRelatorioDrive(entidade) {
  try {
    const periodo = document.getElementById("reportPeriodo").value;
    const formato = document.getElementById("reportFormato").value;
    if (!window.electronAPI) {
      mostrarNotificacao("Disponível apenas no app desktop", "error");
      return;
    }
    const res = await window.electronAPI.gdriveUploadReport({
      entity: entidade,
      period: periodo,
      format: formato,
    });
    if (res && res.success) {
      mostrarNotificacao(
        `${entidade} (${res.count}) enviados ao Drive`,
        "success"
      );
    } else {
      mostrarNotificacao("Falha ao enviar relatório", "error");
    }
  } catch (_) {
    mostrarNotificacao("Erro ao enviar relatório", "error");
  }
}

// ===== EXPORTAR DADOS =====
function exportarTodosDados() {
  const todosDados = {
    funcionarios: funcionarios,
    equipes: equipes,
    cargos: cargos,
    horarios: horarios,
    faltas: window.extranefDB.getFaltas(),
    ferias: window.extranefDB.getFerias(),
    atestados: window.extranefDB.getAtestados(),
    metadata: {
      exportadoEm: new Date().toISOString(),
      versao: "1.0.0",
      sistema: "EXTRANEF",
    },
  };

  const jsonContent = JSON.stringify(todosDados, null, 2);
  const filename = `extranef_backup_completo_${
    new Date().toISOString().split("T")[0]
  }.json`;

  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  mostrarNotificacao("Backup completo exportado com sucesso!");
}

// ===== UTILITÁRIOS =====
function formatarTipoHorario(tipo) {
  switch (tipo) {
    case "parcial":
      return "Parcial";
    case "integral":
      return "Integral";
    default:
      return tipo;
  }
}

function mostrarNotificacao(mensagem, tipo = "success") {
  // Criar notificação simples
  const notification = document.createElement("div");
  notification.className = `notification ${tipo}`;
  notification.textContent = mensagem;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === "success" ? "#28a745" : "#dc3545"};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
