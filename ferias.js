// ===== VARIÁVEIS GLOBAIS =====
let ferias = [];
let funcionarios = [];
let feriasEditando = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
  carregarDados();
  atualizarEstatisticas();
});

// ===== CARREGAMENTO DE DADOS =====
function carregarDados() {
  // Carregar funcionários
  funcionarios = window.extranefDB.getFuncionarios();

  // Carregar férias
  ferias = window.extranefDB.getFerias();

  // Popular dropdowns
  popularDropdownFuncionarios();

  // Renderizar tabela
  renderizarTabelaFerias();
}

function popularDropdownFuncionarios() {
  const select = document.getElementById("funcionarioId");
  const filtroSelect = document.getElementById("filtroFuncionario");

  select.innerHTML = '<option value="">Selecione um funcionário</option>';
  filtroSelect.innerHTML = '<option value="">Todos os funcionários</option>';

  funcionarios.forEach((funcionario) => {
    if (funcionario.ativo || funcionario.status === "ativo") {
      const option = document.createElement("option");
      option.value = funcionario.id;
      option.textContent = `${funcionario.nome} (${
        funcionario.matricula || ""
      })`;
      select.appendChild(option);

      const filtroOption = document.createElement("option");
      filtroOption.value = funcionario.id;
      filtroOption.textContent = `${funcionario.nome} (${
        funcionario.matricula || ""
      })`;
      filtroSelect.appendChild(filtroOption);
    }
  });
}

// ===== RENDERIZAÇÃO =====
function renderizarTabelaFerias() {
  renderizarTabelaFiltrada(ferias);
}

function renderizarTabelaFiltrada(feriasFiltradas) {
  const tbody = document.getElementById("tbodyFerias");
  tbody.innerHTML = "";

  feriasFiltradas.forEach((feria) => {
    const funcionario = funcionarios.find((f) => f.id == feria.funcionarioId);
    if (!funcionario) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${funcionario.nome}</td>
      <td>${formatarData(feria.dataInicio)}</td>
      <td>${formatarData(feria.dataFim)}</td>
      <td>${feria.dias}</td>
      <td><span class="status-badge ${feria.status}">${formatarStatus(
      feria.status
    )}</span></td>
      <td>${formatarTipoFerias(feria.tipoFerias)}</td>
      <td>${feria.local || "-"}</td>
      <td>${feria.observacoes || "-"}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="editarFerias(${
          feria.id
        })" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="excluirFerias(${
          feria.id
        })" title="Excluir">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== ESTATÍSTICAS =====
function atualizarEstatisticas() {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  document.getElementById("totalFerias").textContent = ferias.length;

  const feriasMes = ferias.filter((feria) => {
    const dataInicio = new Date(feria.dataInicio);
    const dataFim = new Date(feria.dataFim);
    return (
      (dataInicio.getMonth() === mesAtual &&
        dataInicio.getFullYear() === anoAtual) ||
      (dataFim.getMonth() === mesAtual && dataFim.getFullYear() === anoAtual) ||
      (dataInicio <= hoje && dataFim >= hoje)
    );
  });
  document.getElementById("feriasMes").textContent = feriasMes.length;

  const totalDias = ferias.reduce(
    (total, feria) => total + (feria.dias || 0),
    0
  );
  const diasMedios = ferias.length ? Math.round(totalDias / ferias.length) : 0;
  document.getElementById("diasMedios").textContent = diasMedios;

  document.getElementById("totalFuncionarios").textContent =
    funcionarios.filter((f) => f.ativo || f.status === "ativo").length;
}

// ===== MODAIS =====
function abrirModalFerias() {
  document.getElementById("modalFerias").style.display = "block";
  document.getElementById("modalFeriasTitulo").textContent = "Nova Férias";
  document.getElementById("formFerias").reset();
  feriasEditando = null;
  document.getElementById("dias").value = "";
}

function fecharModalFerias() {
  document.getElementById("modalFerias").style.display = "none";
  feriasEditando = null;
}

function editarFerias(id) {
  const feriasItem = ferias.find((f) => f.id == id);
  if (!feriasItem) return;

  feriasEditando = feriasItem;
  document.getElementById("modalFeriasTitulo").textContent = "Editar Férias";

  document.getElementById("funcionarioId").value = feriasItem.funcionarioId;
  document.getElementById("tipoFerias").value = feriasItem.tipoFerias;
  document.getElementById("dataInicio").value = feriasItem.dataInicio;
  document.getElementById("dataFim").value = feriasItem.dataFim;
  document.getElementById("dias").value = feriasItem.dias || "";
  document.getElementById("status").value = feriasItem.status;
  document.getElementById("local").value = feriasItem.local || "";
  document.getElementById("valorAbono").value = feriasItem.valorAbono || "";
  document.getElementById("observacoes").value = feriasItem.observacoes || "";

  document.getElementById("modalFerias").style.display = "block";
}

// ===== FUNCIONALIDADES =====
function salvarFerias(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = Object.fromEntries(formData.entries());

  if (!dados.funcionarioId) {
    alert("Selecione um funcionário!");
    return;
  }

  if (new Date(dados.dataInicio) > new Date(dados.dataFim)) {
    alert("A data de início não pode ser posterior à data de fim!");
    return;
  }

  const novaFerias = {
    id: feriasEditando ? feriasEditando.id : Date.now(),
    funcionarioId: parseInt(dados.funcionarioId),
    tipoFerias: dados.tipoFerias,
    dataInicio: dados.dataInicio,
    dataFim: dados.dataFim,
    dias: parseInt(dados.dias) || 0,
    status: dados.status,
    local: dados.local || "",
    valorAbono: dados.valorAbono ? parseFloat(dados.valorAbono) : null,
    observacoes: dados.observacoes || "",
    dataRegistro: feriasEditando
      ? feriasEditando.dataRegistro
      : new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
  };

  if (feriasEditando) {
    const index = ferias.findIndex((f) => f.id === feriasEditando.id);
    if (index !== -1) ferias[index] = novaFerias;
  } else {
    ferias.push(novaFerias);
  }

  window.extranefDB.salvarFerias(ferias);
  renderizarTabelaFerias();
  atualizarEstatisticas();
  fecharModalFerias();
}

function excluirFerias(id) {
  if (confirm("Tem certeza que deseja excluir estas férias?")) {
    ferias = ferias.filter((f) => f.id != id);
    window.extranefDB.salvarFerias(ferias);
    renderizarTabelaFerias();
    atualizarEstatisticas();
  }
}

// ===== FILTROS =====
function filtrarFerias() {
  const funcionarioId = document.getElementById("filtroFuncionario").value;
  const periodo = document.getElementById("filtroPeriodo").value;
  const status = document.getElementById("filtroStatus").value;
  const busca = document.getElementById("buscaFerias").value.toLowerCase();

  let feriasFiltradas = [...ferias];

  if (funcionarioId)
    feriasFiltradas = feriasFiltradas.filter(
      (f) => f.funcionarioId == funcionarioId
    );

  if (periodo) {
    const hoje = new Date();
    const diasFrente = parseInt(periodo);
    const dataLimite = new Date(
      hoje.getTime() + diasFrente * 24 * 60 * 60 * 1000
    );
    feriasFiltradas = feriasFiltradas.filter(
      (f) =>
        new Date(f.dataInicio) <= dataLimite && new Date(f.dataInicio) >= hoje
    );
  }

  if (status)
    feriasFiltradas = feriasFiltradas.filter((f) => f.status === status);

  if (busca) {
    feriasFiltradas = feriasFiltradas.filter(
      (f) =>
        (f.local && f.local.toLowerCase().includes(busca)) ||
        (f.observacoes && f.observacoes.toLowerCase().includes(busca))
    );
  }

  renderizarTabelaFiltrada(feriasFiltradas);
}

// ===== UTILITÁRIOS =====
function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarStatus(status) {
  switch (status) {
    case "planejada":
      return "Planejada";
    case "em_andamento":
      return "Em Andamento";
    case "concluida":
      return "Concluída";
    case "cancelada":
      return "Cancelada";
    default:
      return status;
  }
}

function formatarTipoFerias(tipo) {
  switch (tipo) {
    case "normais":
      return "Férias Normais";
    case "proporcionais":
      return "Férias Proporcionais";
    case "coletivas":
      return "Férias Coletivas";
    case "antecipadas":
      return "Férias Antecipadas";
    default:
      return tipo;
  }
}

function calcularDias() {
  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim = document.getElementById("dataFim").value;
  if (dataInicio && dataFim) {
    const diff = new Date(dataFim) - new Date(dataInicio);
    document.getElementById("dias").value =
      Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }
}

// ===== EXPORTAR / IMPORTAR =====
function exportarFerias() {
  const csv = [
    [
      "Funcionário",
      "Data Início",
      "Data Fim",
      "Dias",
      "Status",
      "Tipo",
      "Local",
      "Valor Abono",
      "Observações",
    ],
    ...ferias.map((f) => {
      const func = funcionarios.find((fn) => fn.id == f.funcionarioId);
      return [
        func ? func.nome : "N/A",
        formatarData(f.dataInicio),
        formatarData(f.dataFim),
        f.dias || "",
        formatarStatus(f.status),
        formatarTipoFerias(f.tipoFerias),
        f.local || "",
        f.valorAbono || "",
        f.observacoes || "",
      ];
    }),
  ]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `ferias_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

function importarFerias() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const dados = JSON.parse(e.target.result);
          if (dados.ferias) {
            ferias = dados.ferias;
            window.extranefDB.salvarFerias(ferias);
            renderizarTabelaFerias();
            atualizarEstatisticas();
            alert("Dados importados com sucesso!");
          }
        } catch (error) {
          alert("Erro ao importar dados: " + error.message);
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}
