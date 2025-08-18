// ===== VARIÁVEIS GLOBAIS =====
let faltas = [];
let funcionarios = [];
let faltaEditando = null;

// ===== ALERTAS =====
function showAlert(msg, tipo = "info") {
  const alerta = document.createElement("div");
  alerta.className = "alerta " + tipo;
  alerta.textContent = msg;
  document.body.appendChild(alerta);
  setTimeout(() => (alerta.style.opacity = 1), 10);
  setTimeout(() => {
    alerta.style.opacity = 0;
    setTimeout(() => alerta.remove(), 300);
  }, 3000);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
  carregarDados();
});

// ===== CARREGAMENTO =====
function carregarDados() {
  funcionarios = window.extranefDB.getFuncionarios();
  faltas = window.extranefDB.getFaltas();

  popularDropdownFuncionarios();
  renderizarTabelaFaltas();
  atualizarEstatisticas();
}

// ===== DROPDOWNS =====
function popularDropdownFuncionarios() {
  const select = document.getElementById("funcionarioId");
  const filtro = document.getElementById("filtroFuncionario");
  select.innerHTML = '<option value="">Selecione um funcionário</option>';
  filtro.innerHTML = '<option value="">Todos os funcionários</option>';
  funcionarios.forEach((f) => {
    if (f.ativo) {
      select.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
      filtro.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
    }
  });
}

// ===== TABELA =====
function renderizarTabelaFaltas() {
  renderizarTabelaFiltrada(faltas);
}

function renderizarTabelaFiltrada(faltasFiltradas) {
  const tbody = document.getElementById("tbodyFaltas");
  tbody.innerHTML = "";
  faltasFiltradas.forEach((f) => {
    const func = funcionarios.find((x) => x.id == f.funcionarioId);
    if (!func) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${func.nome}</td>
      <td>${formatarData(f.dataFalta)}</td>
      <td>${formatarHorario(f.horarioFalta, f.horaInicio, f.horaFim)}</td>
      <td>${f.tipoFalta}</td>
      <td>${f.motivo}</td>
      <td>${f.justificativa || "-"}</td>
      <td>${f.tipoFalta === "justificada" ? "✔" : "❌"}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="editarFalta(${
          f.id
        })"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="excluirFalta(${
          f.id
        })"><i class="fas fa-trash"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// ===== ESTATÍSTICAS =====
function atualizarEstatisticas() {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  document.getElementById("totalFaltas").textContent = faltas.length;
  document.getElementById("faltasMes").textContent = faltas.filter(
    (f) =>
      new Date(f.dataFalta).getMonth() === mesAtual &&
      new Date(f.dataFalta).getFullYear() === anoAtual
  ).length;
  document.getElementById("faltasJustificadas").textContent = faltas.filter(
    (f) => f.tipoFalta === "justificada"
  ).length;
  document.getElementById("totalFuncionarios").textContent =
    funcionarios.filter((f) => f.ativo).length;
}

// ===== MODAL =====
function abrirModalFalta() {
  faltaEditando = null;
  document.getElementById("formFalta").reset();
  document.getElementById("modalFaltaTitulo").textContent = "Nova Falta";
  document.getElementById("horarioEspecifico").style.display = "none";
  document.getElementById("modalFalta").style.display = "block";
}

function fecharModalFalta() {
  document.getElementById("modalFalta").style.display = "none";
  faltaEditando = null;
}

function toggleHorarioEspecifico() {
  const v = document.getElementById("horarioFalta").value;
  document.getElementById("horarioEspecifico").style.display =
    v === "especifico" ? "flex" : "none";
}

// ===== CRUD =====
function salvarFalta(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const dados = Object.fromEntries(form.entries());

  if (
    dados.horarioFalta === "especifico" &&
    (!dados.horaInicio || !dados.horaFim)
  ) {
    showAlert("Informe início e fim do horário específico!", "error");
    return;
  }

  const falta = {
    id: faltaEditando ? faltaEditando.id : Date.now(),
    funcionarioId: parseInt(dados.funcionarioId),
    tipoFalta: dados.tipoFalta,
    dataFalta: dados.dataFalta,
    horarioFalta: dados.horarioFalta,
    horaInicio: dados.horaInicio || null,
    horaFim: dados.horaFim || null,
    motivo: dados.motivo,
    justificativa: dados.justificativa || "",
    observacoes: dados.observacoes || "",
    dataRegistro: faltaEditando
      ? faltaEditando.dataRegistro
      : new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
  };

  if (faltaEditando) {
    const idx = faltas.findIndex((f) => f.id == falta.id);
    if (idx !== -1) faltas[idx] = falta;
    showAlert("Falta atualizada!", "success");
  } else {
    faltas.push(falta);
    showAlert("Falta registrada!", "success");
  }

  window.extranefDB.salvarFaltas(faltas);
  renderizarTabelaFaltas();
  atualizarEstatisticas();
  fecharModalFalta();
}

function editarFalta(id) {
  const f = faltas.find((x) => x.id == id);
  if (!f) return;
  faltaEditando = f;
  document.getElementById("modalFaltaTitulo").textContent = "Editar Falta";
  document.getElementById("funcionarioId").value = f.funcionarioId;
  document.getElementById("tipoFalta").value = f.tipoFalta;
  document.getElementById("dataFalta").value = f.dataFalta;
  document.getElementById("horarioFalta").value = f.horarioFalta;
  document.getElementById("motivo").value = f.motivo;
  document.getElementById("justificativa").value = f.justificativa || "";
  document.getElementById("observacoes").value = f.observacoes || "";
  if (f.horarioFalta === "especifico") {
    document.getElementById("horarioEspecifico").style.display = "flex";
    document.getElementById("horaInicio").value = f.horaInicio || "";
    document.getElementById("horaFim").value = f.horaFim || "";
  } else document.getElementById("horarioEspecifico").style.display = "none";
  document.getElementById("modalFalta").style.display = "block";
}

function excluirFalta(id) {
  if (confirm("Deseja realmente excluir esta falta?")) {
    faltas = faltas.filter((f) => f.id != id);
    window.extranefDB.salvarFaltas(faltas);
    renderizarTabelaFaltas();
    atualizarEstatisticas();
    showAlert("Falta excluída!", "success");
  }
}

// ===== FILTROS =====
function filtrarFaltas() {
  let res = [...faltas];
  const funcId = document.getElementById("filtroFuncionario").value;
  const periodo = document.getElementById("filtroPeriodo").value;
  const tipo = document.getElementById("filtroTipo").value;
  const busca = document.getElementById("buscaFalta").value.toLowerCase();

  if (funcId) res = res.filter((f) => f.funcionarioId == funcId);
  if (periodo) {
    const lim = new Date(Date.now() - periodo * 24 * 60 * 60 * 1000);
    res = res.filter((f) => new Date(f.dataFalta) >= lim);
  }
  if (tipo) res = res.filter((f) => f.tipoFalta === tipo);
  if (busca)
    res = res.filter(
      (f) =>
        f.motivo.toLowerCase().includes(busca) ||
        f.justificativa.toLowerCase().includes(busca) ||
        f.observacoes.toLowerCase().includes(busca)
    );
  renderizarTabelaFiltrada(res);
}

// ===== UTIL =====
function formatarData(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("pt-BR");
}
function formatarHorario(t, ini, fim) {
  if (t === "integral") return "Integral";
  if (t === "parcial") return "Parcial";
  if (t === "especifico") return `${ini} às ${fim}`;
  return "-";
}

// ===== EXPORT / IMPORT =====
function exportarFaltas() {
  const dados = window.extranefDB.exportarDados();
  const json = JSON.stringify(dados, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_extranef_${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importarFaltas(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const dados = JSON.parse(e.target.result);
      window.extranefDB.importarDados(dados);
      carregarDados();
      atualizarEstatisticas();
      showAlert("Dados importados com sucesso!", "success");
    } catch (err) {
      showAlert("Erro ao importar JSON: " + err.message, "error");
    }
  };
  reader.readAsText(file);
}
