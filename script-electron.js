// ====================== CONFIGURAÇÕES GLOBAIS ======================
let config = {
  comissaoPercent: 0.0018, // 0.18%
  theme: {
    primaryColor: "#d4af37",
    backgroundColor: "#1c1c1c",
    menuColor: "#2b2b2b",
  },
};

// Carregar configurações do localStorage
function carregarConfiguracoes() {
  const savedConfig = localStorage.getItem("extranefConfig");
  if (savedConfig) {
    config = { ...config, ...JSON.parse(savedConfig) };
  }
  aplicarTema();
}

// Salvar configurações no localStorage
function salvarConfiguracoes() {
  localStorage.setItem("extranefConfig", JSON.stringify(config));
  aplicarTema();
}

// Aplicar tema dinamicamente
function aplicarTema() {
  const root = document.documentElement;
  root.style.setProperty("--primary-color", config.theme.primaryColor);
  root.style.setProperty("--bg-body", config.theme.backgroundColor);
  root.style.setProperty("--bg-menu", config.theme.menuColor);
}

// ====================== MENU LATERAL ======================
function criarMenu(navContainer) {
  const menu = document.createElement("nav");
  menu.className = "sidebar";
  menu.innerHTML = `
    <div class="logo">
      <h2>EXTRANEF</h2>
      <p>Sistema de Gestão</p>
    </div>
    <div class="menu-items">
      <a href="index.html" class="menu-item">
        <span class="icon">🏠</span>
        <span class="text">Início</span>
      </a>
      <a href="faltas.html" class="menu-item">
        <span class="icon">❌</span>
        <span class="text">Faltas</span>
      </a>
      <a href="ferias.html" class="menu-item">
        <span class="icon">🌴</span>
        <span class="text">Férias</span>
      </a>
      <a href="atestados.html" class="menu-item">
        <span class="icon">📄</span>
        <span class="text">Atestados</span>
      </a>
      <a href="adm.html" class="menu-item">
        <span class="icon">⚙️</span>
        <span class="text">Configurações</span>
      </a>
    </div>
    <div class="menu-footer">
      <p>Versão 1.0.0</p>
    </div>
  `;

  document.body.prepend(menu);

  // Marcar item ativo
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const activeItem = menu.querySelector(`[href="${currentPage}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }
}

// ====================== FUNCIONALIDADES ELECTRON ======================
function setupElectronFeatures() {
  if (window.electronAPI) {
    // Listener para exportar CSV via menu
    window.electronAPI.onMenuExportCSV(() => {
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
      if (currentPage === "faltas.html") {
        exportCSV("faltas");
      } else if (currentPage === "ferias.html") {
        exportCSV("ferias");
      } else if (currentPage === "atestados.html") {
        exportCSV("atestados");
      }
    });
  }
}

// ====================== LOCAL STORAGE ======================
function salvarRegistro(tipo, registro) {
  const key = tipo.toLowerCase();
  const data = JSON.parse(localStorage.getItem(key)) || [];
  registro.id = Date.now(); // ID único
  registro.dataCriacao = new Date().toISOString();
  data.push(registro);
  localStorage.setItem(key, JSON.stringify(data));
  return registro;
}

function carregarRegistros(tipo) {
  return JSON.parse(localStorage.getItem(tipo.toLowerCase())) || [];
}

function atualizarRegistro(tipo, id, novosDados) {
  const key = tipo.toLowerCase();
  const data = carregarRegistros(tipo);
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data[index] = {
      ...data[index],
      ...novosDados,
      dataModificacao: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }
  return false;
}

function excluirRegistro(tipo, id) {
  const key = tipo.toLowerCase();
  const data = carregarRegistros(tipo);
  const filteredData = data.filter((item) => item.id !== id);
  localStorage.setItem(key, JSON.stringify(filteredData));
  return data.length !== filteredData.length;
}

// ====================== IMPORT/EXPORT CSV ======================
async function importarCSV(tipo) {
  if (!window.electronAPI) {
    // Fallback para navegador
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => processarCSV(e.target.files[0], tipo);
    input.click();
    return;
  }

  try {
    const result = await window.electronAPI.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "CSV Files", extensions: ["csv"] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const fileResult = await window.electronAPI.readFile(result.filePaths[0]);
      if (fileResult.success) {
        processarCSVData(fileResult.data, tipo);
      } else {
        alert("Erro ao ler arquivo: " + fileResult.error);
      }
    }
  } catch (error) {
    console.error("Erro ao importar CSV:", error);
    alert("Erro ao importar arquivo CSV");
  }
}

function processarCSVData(csvData, tipo) {
  const linhas = csvData.split("\n");
  const headers = linhas[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const registros = [];

  for (let i = 1; i < linhas.length; i++) {
    if (linhas[i].trim()) {
      const valores = linhas[i]
        .split(",")
        .map((v) => v.trim().replace(/"/g, ""));
      const registro = {};

      headers.forEach((header, index) => {
        registro[header] = valores[index] || "";
      });

      registros.push(registro);
    }
  }

  async function exportCSV(tipo) {
    const data = carregarRegistros(tipo);
    if (data.length === 0) {
      alert("Nenhum registro para exportar!");
      return;
    }

    const keys = Object.keys(data[0]);
    const csvRows = [keys.join(",")];

    data.forEach((row) => {
      csvRows.push(keys.map((k) => `"${row[k] || ""}"`).join(","));
    });

    const csvContent = csvRows.join("\n");
    const filename = `${tipo}_${new Date().toISOString().split("T")[0]}.csv`;

    if (!window.electronAPI) {
      // Fallback para navegador
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      return;
    }

    try {
      const result = await window.electronAPI.showSaveDialog({
        defaultPath: filename,
        filters: [{ name: "CSV Files", extensions: ["csv"] }],
      });

      if (!result.canceled) {
        const writeResult = await window.electronAPI.writeFile(
          result.filePath,
          csvContent
        );
        if (writeResult.success) {
          alert("Arquivo exportado com sucesso!");
        } else {
          alert("Erro ao salvar arquivo: " + writeResult.error);
        }
      }
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("Erro ao exportar arquivo CSV");
    }
  }

  // ====================== UTILITÁRIOS ======================
  function formatarData(data) {
    if (!data) return "";
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
  }

  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  }

  function calcularComissao(valorRecuperado) {
    return valorRecuperado * config.comissaoPercent;
  }

  // ====================== INICIALIZAÇÃO ======================
  document.addEventListener("DOMContentLoaded", () => {
    carregarConfiguracoes();
    setupElectronFeatures();

    // Criar menu se não existir
    if (!document.querySelector("nav")) {
      const container =
        document.getElementById("pageContainer") || document.body;
      criarMenu(container);
    }
  });

  // ====================== FUNÇÕES COMPARTILHADAS ======================
  // Função para carregar tabela genérica
  function carregarTabela(tipo, tbodyId) {
    const registros = carregarRegistros(tipo);
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    tbody.innerHTML = "";

    registros.forEach((registro, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${registro.nome || ""}</td>
      <td>${registro.carteira || ""}</td>
      <td>${formatarData(registro.data) || ""}</td>
      <td>${registro.motivo || ""}</td>
      <td>${registro.observacoes || ""}</td>
      <td>
        <button onclick="editarRegistro('${tipo}', ${
        registro.id
      })" class="btn-edit">✏️</button>
        <button onclick="excluirRegistro('${tipo}', ${
        registro.id
      })" class="btn-delete">🗑️</button>
      </td>
    `;
      tbody.appendChild(tr);
    });
  }

  // Função para editar registro
  function editarRegistro(tipo, id) {
    const registros = carregarRegistros(tipo);
    const registro = registros.find((r) => r.id === id);
    if (!registro) return;

    // Preencher formulário com dados existentes
    const form = document.querySelector("form");
    if (form) {
      Object.keys(registro).forEach((key) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = registro[key];
      });

      // Adicionar ID para edição
      form.dataset.editId = id;
      form.dataset.editTipo = tipo;
    }
  }

  // Função para salvar registro (criar ou atualizar)
  function salvarRegistroForm(tipo) {
    const form = document.querySelector("form");
    if (!form) return;

    const formData = new FormData(form);
    const dados = {};
    formData.forEach((value, key) => {
      dados[key] = value;
    });

    if (form.dataset.editId) {
      // Modo edição
      const sucesso = atualizarRegistro(
        tipo,
        parseInt(form.dataset.editId),
        dados
      );
      if (sucesso) {
        alert("Registro atualizado com sucesso!");
        delete form.dataset.editId;
        delete form.dataset.editTipo;
      }
    } else {
      // Modo criação
      salvarRegistro(tipo, dados);
      alert("Registro salvo com sucesso!");
    }

    // Limpar formulário e recarregar tabela
    form.reset();
    if (typeof carregarTabela === "function") {
      carregarTabela();
    }
  }
}
