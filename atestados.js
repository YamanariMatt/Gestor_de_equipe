let atestadoEditando = null;
let arquivoSelecionado = null;

document.addEventListener("DOMContentLoaded", function () {
  carregarFuncionarios();
  carregarTabelaAtestados();
  atualizarEstatisticas();
});

// ===== ALERTAS =====
function showAlert(mensagem, tipo = "info") {
  const alerta = document.createElement("div");
  alerta.textContent = mensagem;
  alerta.style.position = "fixed";
  alerta.style.top = "20px";
  alerta.style.right = "20px";
  alerta.style.padding = "10px 20px";
  alerta.style.backgroundColor =
    tipo === "success" ? "#28a745" : tipo === "error" ? "#dc3545" : "#17a2b8";
  alerta.style.color = "#fff";
  alerta.style.borderRadius = "5px";
  alerta.style.zIndex = 9999;
  alerta.style.opacity = 0;
  alerta.style.transition = "opacity 0.3s";
  document.body.appendChild(alerta);
  setTimeout(() => (alerta.style.opacity = 1), 10);
  setTimeout(() => {
    alerta.style.opacity = 0;
    setTimeout(() => alerta.remove(), 300);
  }, 3000);
}

// ===== CONFIRMAÇÃO VISUAL =====
function confirmVisual(msg, callback) {
  const container = document.getElementById("confirmContainer");
  container.style.display = "flex";
  document.getElementById("confirmMessage").textContent = msg;
  const yes = document.getElementById("confirmYes");
  const no = document.getElementById("confirmNo");

  function limpar() {
    container.style.display = "none";
    yes.removeEventListener("click", onYes);
    no.removeEventListener("click", onNo);
  }
  function onYes() {
    limpar();
    callback(true);
  }
  function onNo() {
    limpar();
    callback(false);
  }

  yes.addEventListener("click", onYes);
  no.addEventListener("click", onNo);
}

// ===== CARREGAR FUNCIONÁRIOS =====
function carregarFuncionarios() {
  const select = document.getElementById("funcionarioId");
  const filtro = document.getElementById("filtroFuncionario");
  const funcionarios = extranefDB.getFuncionarios();
  select.innerHTML = '<option value="">Selecione</option>';
  filtro.innerHTML = '<option value="">Todos os funcionários</option>';
  funcionarios.forEach((f) => {
    select.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
    filtro.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
  });
}

// ===== MODAL =====
function abrirModalAtestado() {
  atestadoEditando = null;
  document.getElementById("formAtestado").reset();
  document.getElementById("filePreview").innerHTML =
    "<p>Nenhum arquivo selecionado</p>";
  document.getElementById("modalAtestadoTitulo").textContent = "Novo Atestado";
  document.getElementById("modalAtestado").style.display = "block";
}

function fecharModalAtestado() {
  document.getElementById("modalAtestado").style.display = "none";
}

// ===== ARQUIVO =====
function selecionarArquivo(event) {
  arquivoSelecionado = event.target.files[0];
  const preview = document.getElementById("filePreview");
  if (arquivoSelecionado) {
    preview.innerHTML = `<p>${arquivoSelecionado.name}</p>`;
  } else {
    preview.innerHTML = "<p>Nenhum arquivo selecionado</p>";
  }
}

// ===== CALCULAR DIAS =====
function calcularDias() {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  if (inicio && fim) {
    const diff = (new Date(fim) - new Date(inicio)) / 86400000 + 1;
    document.getElementById("dias").value = diff > 0 ? diff : 0;
  }
}

// ===== SALVAR =====
function salvarAtestado(event) {
  event.preventDefault();
  const form = event.target;

  if (arquivoSelecionado) {
    const reader = new FileReader();
    reader.onload = function (e) {
      salvarNoLocal(
        form,
        e.target.result,
        arquivoSelecionado && arquivoSelecionado.name
      );
    };
    reader.readAsDataURL(arquivoSelecionado); // salva como base64
  } else {
    salvarNoLocal(
      form,
      atestadoEditando ? atestadoEditando.arquivo : null,
      null
    );
  }
}

async function salvarNoLocal(form, arquivoData, originalFileName) {
  const dados = {
    id: atestadoEditando ? atestadoEditando.id : Date.now(),
    funcionarioId: form.funcionarioId.value,
    tipo: form.tipoAtestado.value,
    dataInicio: form.dataInicio.value,
    dataFim: form.dataFim.value,
    dias: form.dias.value,
    medico: form.medico.value,
    especialidade: form.especialidade.value,
    observacoes: form.observacoes.value,
    arquivo: arquivoData,
  };
  let atestados = extranefDB.getAtestados();
  if (atestadoEditando) {
    const idx = atestados.findIndex((a) => a.id === atestadoEditando.id);
    atestados[idx] = dados;
    showAlert("Atestado atualizado!", "success");
  } else {
    atestados.push(dados);
    showAlert("Atestado adicionado!", "success");
  }
  extranefDB.salvarAtestados(atestados);

  // Tentativa de subir ao Google Drive e salvar backup local na pasta sincronizada
  try {
    if (window.electronAPI && arquivoData) {
      const funcionarios = extranefDB.getFuncionarios();
      const func = funcionarios.find(
        (f) => String(f.id) === String(dados.funcionarioId)
      );
      const funcionarioNome = func ? func.nome : "Funcionario";
      // Upload para Google Drive (se configurado)
      try {
        const up = await window.electronAPI.gdriveUploadAtestado({
          funcionarioNome,
          originalFileName: originalFileName || "atestado",
          dataUrl: arquivoData,
          atestadoId: dados.id,
        });
        if (up && up.success) {
          showAlert("Arquivo enviado ao Google Drive", "success");
        }
      } catch (_) {}
      const res = await window.electronAPI.saveAtestadoAttachment({
        funcionarioNome,
        originalFileName: originalFileName || "atestado",
        dataUrl: arquivoData,
        atestadoId: dados.id,
      });
      if (res && res.success) {
        showAlert("Arquivo salvo na pasta do funcionário", "success");
      } else if (res && res.notConfigured) {
        showAlert("Defina a pasta de backup no menu Arquivo", "info");
      }
    }
  } catch (err) {
    console.error("Falha ao salvar anexo em disco:", err);
  }

  fecharModalAtestado();
  carregarTabelaAtestados();
  atualizarEstatisticas();
}

// ===== CARREGAR TABELA =====
function carregarTabelaAtestados() {
  const tbody = document.getElementById("tbodyAtestados");
  const atestados = extranefDB.getAtestados();
  const funcionarios = extranefDB.getFuncionarios();
  tbody.innerHTML = "";
  atestados.forEach((a) => {
    const func = funcionarios.find((f) => f.id == a.funcionarioId);
    const arquivoLink = a.arquivo
      ? `<button onclick="visualizarArquivo('${a.id}')">Ver</button>`
      : "-";
    tbody.innerHTML += `<tr>
      <td>${func ? func.nome : "-"}</td>
      <td>${a.dataInicio}</td>
      <td>${a.dataFim}</td>
      <td>${a.dias}</td>
      <td>${a.medico}</td>
      <td>${a.especialidade}</td>
      <td>${a.tipo}</td>
      <td>${arquivoLink}</td>
      <td>
        <button onclick="editarAtestado(${
          a.id
        })"><i class="fas fa-edit"></i></button>
        <button onclick="excluirAtestado(${
          a.id
        })"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  });
}

// ===== VISUALIZAR ARQUIVO =====
function visualizarArquivo(id) {
  const atestados = extranefDB.getAtestados();
  const a = atestados.find((x) => x.id == id);
  if (!a || !a.arquivo) return;
  const win = window.open("");
  if (a.arquivo.startsWith("data:application/pdf")) {
    win.document.write(
      `<iframe src="${a.arquivo}" style="width:100%;height:100vh;"></iframe>`
    );
  } else {
    win.document.write(
      `<img src="${a.arquivo}" style="width:100%;height:auto;" />`
    );
  }
}

// ===== EDITAR =====
function editarAtestado(id) {
  const atestados = extranefDB.getAtestados();
  const a = atestados.find((x) => x.id === id);
  if (!a) return;
  atestadoEditando = a;
  document.getElementById("funcionarioId").value = a.funcionarioId;
  document.getElementById("tipoAtestado").value = a.tipo;
  document.getElementById("dataInicio").value = a.dataInicio;
  document.getElementById("dataFim").value = a.dataFim;
  document.getElementById("dias").value = a.dias;
  document.getElementById("medico").value = a.medico;
  document.getElementById("especialidade").value = a.especialidade;
  document.getElementById("observacoes").value = a.observacoes;
  document.getElementById("filePreview").innerHTML = a.arquivo
    ? `<p>Arquivo carregado</p>`
    : "<p>Nenhum arquivo selecionado</p>";
  document.getElementById("modalAtestadoTitulo").textContent =
    "Editar Atestado";
  document.getElementById("modalAtestado").style.display = "block";
}

// ===== EXCLUIR =====
function excluirAtestado(id) {
  confirmVisual("Deseja realmente excluir este atestado?", (confirmed) => {
    if (confirmed) {
      let atestados = extranefDB.getAtestados();
      atestados = atestados.filter((a) => a.id !== id);
      extranefDB.salvarAtestados(atestados);
      carregarTabelaAtestados();
      atualizarEstatisticas();
      showAlert("Atestado excluído!", "success");
    }
  });
}

// ===== FILTRAR =====
function filtrarAtestados() {
  const func = document.getElementById("filtroFuncionario").value;
  const tipo = document.getElementById("filtroTipo").value;
  const periodo = document.getElementById("filtroPeriodo").value;
  const busca = document.getElementById("buscaAtestado").value.toLowerCase();
  const tbody = document.getElementById("tbodyAtestados");
  const atestados = extranefDB.getAtestados();
  const funcionarios = extranefDB.getFuncionarios();
  tbody.innerHTML = "";
  atestados
    .filter((a) => {
      const funcOk = func ? a.funcionarioId == func : true;
      const tipoOk = tipo ? a.tipo == tipo : true;
      const buscaOk =
        a.medico.toLowerCase().includes(busca) ||
        a.observacoes.toLowerCase().includes(busca);
      const periodoOk = periodo
        ? new Date(a.dataInicio) >= new Date(Date.now() - periodo * 86400000)
        : true;
      return funcOk && tipoOk && buscaOk && periodoOk;
    })
    .forEach((a) => {
      const f = funcionarios.find((x) => x.id == a.funcionarioId);
      const arquivoLink = a.arquivo
        ? `<button onclick="visualizarArquivo('${a.id}')">Ver</button>`
        : "-";
      tbody.innerHTML += `<tr>
      <td>${f ? f.nome : "-"}</td>
      <td>${a.dataInicio}</td>
      <td>${a.dataFim}</td>
      <td>${a.dias}</td>
      <td>${a.medico}</td>
      <td>${a.especialidade}</td>
      <td>${a.tipo}</td>
      <td>${arquivoLink}</td>
      <td>
        <button onclick="editarAtestado(${
          a.id
        })"><i class="fas fa-edit"></i></button>
        <button onclick="excluirAtestado(${
          a.id
        })"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
    });
}

// ===== ESTATÍSTICAS =====
function atualizarEstatisticas() {
  const atestados = extranefDB.getAtestados();
  const funcionarios = extranefDB.getFuncionarios();
  document.getElementById("totalAtestados").textContent = atestados.length;
  const mesAtual = new Date().getMonth();
  const esteMes = atestados.filter(
    (a) => new Date(a.dataInicio).getMonth() === mesAtual
  ).length;
  document.getElementById("atestadosMes").textContent = esteMes;
  const totalDias = atestados.reduce((acc, a) => acc + Number(a.dias), 0);
  document.getElementById("diasMedios").textContent = atestados.length
    ? (totalDias / atestados.length).toFixed(1)
    : 0;
  document.getElementById("totalFuncionarios").textContent =
    funcionarios.length;
}
