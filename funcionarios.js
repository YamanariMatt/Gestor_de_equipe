// Sistema de Gestão de Funcionários - EXTRANEF
let funcionarioEditando = null;

// Inicialização da página
document.addEventListener("DOMContentLoaded", function () {
  carregarDados();
  carregarFiltros();
  carregarTabelaFuncionarios();
  // Recarregar quando o backend hidratar dados
  document.addEventListener("extranef:db-ready", () => {
    carregarDados();
    carregarFiltros();
    carregarTabelaFuncionarios();
  });
});

// Carregar dados iniciais
function carregarDados() {
  atualizarEstatisticas();
  carregarSelects();
}

// Atualizar estatísticas
function atualizarEstatisticas() {
  const funcionarios = extranefDB.getFuncionarios();
  const equipes = extranefDB.getEquipes();
  const cargos = extranefDB.getCargos();
  const horarios = extranefDB.getHorarios();

  document.getElementById("totalFuncionarios").textContent =
    funcionarios.length;
  document.getElementById("totalEquipes").textContent = equipes.length;
  document.getElementById("totalCargos").textContent = cargos.length;
  document.getElementById("totalHorarios").textContent = horarios.length;
}

// Carregar selects dos filtros
function carregarFiltros() {
  const equipes = extranefDB.getEquipes();
  const cargos = extranefDB.getCargos();

  // Filtro de equipes
  const filtroEquipe = document.getElementById("filtroEquipe");
  filtroEquipe.innerHTML = '<option value="">Todas as equipes</option>';
  equipes.forEach((equipe) => {
    const option = document.createElement("option");
    option.value = equipe.id;
    option.textContent = equipe.nome;
    filtroEquipe.appendChild(option);
  });

  // Filtro de cargos
  const filtroCargo = document.getElementById("filtroCargo");
  filtroCargo.innerHTML = '<option value="">Todos os cargos</option>';
  cargos.forEach((cargo) => {
    const option = document.createElement("option");
    option.value = cargo.id;
    option.textContent = cargo.nome;
    filtroCargo.appendChild(option);
  });
}

// Carregar selects dos formulários
function carregarSelects() {
  const equipes = extranefDB.getEquipes();
  const cargos = extranefDB.getCargos();
  const horarios = extranefDB.getHorarios();
  const tiposContrato = extranefDB.getTiposContrato();

  // Select de equipes
  const selectEquipe = document.getElementById("equipeId");
  selectEquipe.innerHTML = '<option value="">Selecione uma equipe</option>';
  equipes.forEach((equipe) => {
    const option = document.createElement("option");
    option.value = equipe.id;
    option.textContent = equipe.nome;
    selectEquipe.appendChild(option);
  });

  // Select de cargos
  const selectCargo = document.getElementById("cargoId");
  selectCargo.innerHTML = '<option value="">Selecione um cargo</option>';
  cargos.forEach((cargo) => {
    const option = document.createElement("option");
    option.value = cargo.id;
    option.textContent = cargo.nome;
    selectCargo.appendChild(option);
  });

  // Select de horários
  const selectHorario = document.getElementById("horarioId");
  selectHorario.innerHTML = '<option value="">Selecione um horário</option>';
  horarios.forEach((horario) => {
    const option = document.createElement("option");
    option.value = horario.id;
    option.textContent = `${horario.nome} (${horario.inicio} - ${horario.fim})`;
    selectHorario.appendChild(option);
  });

  // Select de tipos de contrato
  const selectTipoContrato = document.getElementById("tipoContratoId");
  selectTipoContrato.innerHTML = '<option value="">Selecione o tipo</option>';
  tiposContrato.forEach((tipo) => {
    const option = document.createElement("option");
    option.value = tipo.id;
    option.textContent = tipo.nome;
    selectTipoContrato.appendChild(option);
  });
}

// Carregar tabela de funcionários
function carregarTabelaFuncionarios() {
  const funcionarios = extranefDB.getFuncionarios();
  const equipes = extranefDB.getEquipes();
  const cargos = extranefDB.getCargos();
  const horarios = extranefDB.getHorarios();
  const tiposContrato = extranefDB.getTiposContrato();

  const tbody = document.getElementById("tbodyFuncionarios");
  tbody.innerHTML = "";

  funcionarios.forEach((funcionario) => {
    const equipe = equipes.find((e) => e.id === funcionario.equipeId);
    const cargo = cargos.find((c) => c.id === funcionario.cargoId);
    const horario = horarios.find((h) => h.id === funcionario.horarioId);
    const tipoContrato = tiposContrato.find(
      (t) => t.id === funcionario.tipoContratoId
    );

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${funcionario.nome}</td>
            <td>${equipe ? equipe.nome : "-"}</td>
            <td>${cargo ? cargo.nome : "-"}</td>
            <td>${horario ? horario.nome : "-"}</td>
            <td>${tipoContrato ? tipoContrato.nome : "-"}</td>
            <td>
                <span class="status-badge ${
                  funcionario.ativo ? "ativo" : "inativo"
                }">
                    ${funcionario.ativo ? "Ativo" : "Inativo"}
                </span>
            </td>
            <td>
                <div class="action-buttons-small">
                    <button class="btn-small btn-edit" onclick="editarFuncionario(${
                      funcionario.id
                    })" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-delete" onclick="excluirFuncionario(${
                      funcionario.id
                    })" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-small btn-toggle" onclick="toggleStatusFuncionario(${
                      funcionario.id
                    })" title="${funcionario.ativo ? "Desativar" : "Ativar"}">
                        <i class="fas fa-${
                          funcionario.ativo ? "ban" : "check"
                        }"></i>
                    </button>
                </div>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// Filtrar funcionários
function filtrarFuncionarios() {
  const filtroEquipe = document.getElementById("filtroEquipe").value;
  const filtroCargo = document.getElementById("filtroCargo").value;
  const filtroStatus = document.getElementById("filtroStatus").value;
  const busca = document.getElementById("buscaFuncionario").value.toLowerCase();

  let funcionarios = extranefDB.getFuncionarios();

  // Aplicar filtros
  if (filtroEquipe) {
    funcionarios = funcionarios.filter((f) => f.equipeId == filtroEquipe);
  }

  if (filtroCargo) {
    funcionarios = funcionarios.filter((f) => f.cargoId == filtroCargo);
  }

  if (filtroStatus !== "") {
    funcionarios = funcionarios.filter(
      (f) => f.ativo == (filtroStatus === "true")
    );
  }

  if (busca) {
    funcionarios = funcionarios.filter(
      (f) =>
        f.nome.toLowerCase().includes(busca) ||
        f.cpf.includes(busca) ||
        f.matricula.toLowerCase().includes(busca)
    );
  }

  // Atualizar tabela com resultados filtrados
  const equipes = extranefDB.getEquipes();
  const cargos = extranefDB.getCargos();
  const horarios = extranefDB.getHorarios();
  const tiposContrato = extranefDB.getTiposContrato();

  const tbody = document.getElementById("tbodyFuncionarios");
  tbody.innerHTML = "";

  funcionarios.forEach((funcionario) => {
    const equipe = equipes.find((e) => e.id === funcionario.equipeId);
    const cargo = cargos.find((c) => c.id === funcionario.cargoId);
    const horario = horarios.find((h) => h.id === funcionario.horarioId);
    const tipoContrato = tiposContrato.find(
      (t) => t.id === funcionario.tipoContratoId
    );

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${funcionario.nome}</td>
            <td>${equipe ? equipe.nome : "-"}</td>
            <td>${cargo ? cargo.nome : "-"}</td>
            <td>${horario ? horario.nome : "-"}</td>
            <td>${tipoContrato ? tipoContrato.nome : "-"}</td>
            <td>
                <span class="status-badge ${
                  funcionario.ativo ? "ativo" : "inativo"
                }">
                    ${funcionario.ativo ? "Ativo" : "Inativo"}
                </span>
            </td>
            <td>
                <div class="action-buttons-small">
                    <button class="btn-small btn-edit" onclick="editarFuncionario(${
                      funcionario.id
                    })" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-delete" onclick="excluirFuncionario(${
                      funcionario.id
                    })" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-small btn-toggle" onclick="toggleStatusFuncionario(${
                      funcionario.id
                    })" title="${funcionario.ativo ? "Desativar" : "Ativar"}">
                        <i class="fas fa-${
                          funcionario.ativo ? "ban" : "check"
                        }"></i>
                    </button>
                </div>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// ===== MODAL FUNCIONÁRIO =====
function abrirModalFuncionario(funcionario = null) {
  funcionarioEditando = funcionario;
  const modal = document.getElementById("modalFuncionario");
  const titulo = document.getElementById("modalFuncionarioTitulo");
  const form = document.getElementById("formFuncionario");

  if (funcionario) {
    titulo.textContent = "Editar Funcionário";
    preencherFormularioFuncionario(funcionario);
  } else {
    titulo.textContent = "Novo Funcionário";
    form.reset();
  }

  modal.style.display = "block";
}

function fecharModalFuncionario() {
  const modal = document.getElementById("modalFuncionario");
  modal.style.display = "none";
  funcionarioEditando = null;
}

function preencherFormularioFuncionario(funcionario) {
  document.getElementById("nome").value = funcionario.nome;
  document.getElementById("dataAdmissao").value = funcionario.dataAdmissao;
  document.getElementById("equipeId").value = funcionario.equipeId;
  document.getElementById("cargoId").value = funcionario.cargoId;
  document.getElementById("horarioId").value = funcionario.horarioId;
  document.getElementById("tipoContratoId").value = funcionario.tipoContratoId;
  document.getElementById("email").value = funcionario.email || "";
  document.getElementById("telefone").value = funcionario.telefone || "";
  document.getElementById("endereco").value = funcionario.endereco || "";
  document.getElementById("observacoes").value = funcionario.observacoes || "";
}

function salvarFuncionario(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = Object.fromEntries(formData.entries());

  // Validações
  if (funcionarioEditando) {
    // Editar funcionário existente
    const funcionarioAtualizado = extranefDB.updateFuncionario(
      funcionarioEditando.id,
      dados
    );
    if (funcionarioAtualizado) {
      alert("Funcionário atualizado com sucesso!");
    } else {
      alert("Erro ao atualizar funcionário!");
      return;
    }
  } else {
    // Novo funcionário
    const novoFuncionario = extranefDB.addFuncionario(dados);
    if (novoFuncionario) {
      alert("Funcionário cadastrado com sucesso!");
    } else {
      alert("Erro ao cadastrar funcionário!");
      return;
    }
  }

  fecharModalFuncionario();
  carregarDados();
  carregarTabelaFuncionarios();
}

// ===== MODAL EQUIPE =====
function abrirModalEquipe() {
  const modal = document.getElementById("modalEquipe");
  modal.style.display = "block";
}

function fecharModalEquipe() {
  const modal = document.getElementById("modalEquipe");
  modal.style.display = "none";
  document.getElementById("formEquipe").reset();
}

function salvarEquipe(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = {
    nome: formData.get("nomeEquipe"),
    descricao: formData.get("descricaoEquipe"),
  };

  const novaEquipe = extranefDB.addEquipe(dados);
  if (novaEquipe) {
    alert("Equipe criada com sucesso!");
    fecharModalEquipe();
    carregarDados();
    carregarFiltros();
    carregarSelects();
  } else {
    alert("Erro ao criar equipe!");
  }
}

// ===== MODAL CARGO =====
function abrirModalCargo() {
  const modal = document.getElementById("modalCargo");
  modal.style.display = "block";
}

function fecharModalCargo() {
  const modal = document.getElementById("modalCargo");
  modal.style.display = "none";
  document.getElementById("formCargo").reset();
}

function salvarCargo(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = {
    nome: formData.get("nomeCargo"),
    nivel: parseInt(formData.get("nivelCargo")),
  };

  const novoCargo = extranefDB.addCargo(dados);
  if (novoCargo) {
    alert("Cargo criado com sucesso!");
    fecharModalCargo();
    carregarDados();
    carregarFiltros();
    carregarSelects();
  } else {
    alert("Erro ao criar cargo!");
  }
}

// ===== AÇÕES DE FUNCIONÁRIOS =====
function editarFuncionario(id) {
  const funcionario = extranefDB.getFuncionarioById(id);
  if (funcionario) {
    abrirModalFuncionario(funcionario);
  }
}

function excluirFuncionario(id) {
  if (confirm("Tem certeza que deseja excluir este funcionário?")) {
    const sucesso = extranefDB.deleteFuncionario(id);
    if (sucesso) {
      alert("Funcionário excluído com sucesso!");
      carregarDados();
      carregarTabelaFuncionarios();
    } else {
      alert("Erro ao excluir funcionário!");
    }
  }
}

function toggleStatusFuncionario(id) {
  const funcionario = extranefDB.getFuncionarioById(id);
  if (funcionario) {
    const novoStatus = !funcionario.ativo;
    const sucesso = extranefDB.updateFuncionario(id, { ativo: novoStatus });
    if (sucesso) {
      alert(
        `Funcionário ${novoStatus ? "ativado" : "desativado"} com sucesso!`
      );
      carregarTabelaFuncionarios();
    } else {
      alert("Erro ao alterar status do funcionário!");
    }
  }
}

// ===== EXPORTAR/IMPORTAR DADOS =====
function exportarDados() {
  try {
    const dados = extranefDB.exportarDados();
    const blob = new Blob([JSON.stringify(dados, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `extranef_dados_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Dados exportados com sucesso!");
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    alert("Erro ao exportar dados!");
  }
}

function importarDados() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const dados = JSON.parse(e.target.result);
          const sucesso = extranefDB.importarDados(dados);

          if (sucesso) {
            alert("Dados importados com sucesso!");
            carregarDados();
            carregarFiltros();
            carregarSelects();
            carregarTabelaFuncionarios();
          } else {
            alert("Erro ao importar dados!");
          }
        } catch (error) {
          console.error("Erro ao processar arquivo:", error);
          alert("Erro ao processar arquivo!");
        }
      };
      reader.readAsText(file);
    }
  };

  input.click();
}

// Fechar modais ao clicar fora
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
