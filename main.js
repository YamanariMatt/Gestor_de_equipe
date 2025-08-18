const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  shell,
} = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { URL } = require("url");
const { google } = require("googleapis");
const { Readable } = require("stream");

let mainWindow;
let dataFilePath;
let configFilePath;
let inMemoryDb = null;
let appConfig = { backupDir: null, autoBackup: true };
let oauthTokensPath;
let oauth2Client = null;

function createWindow() {
  // Criar janela do navegador
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets", "icon.ico"),
    title: "EXTRANEF - Sistema de Gestão",
    show: false,
  });

  // Carregar o arquivo index-electron.html
  mainWindow.loadFile("index-electron.html");

  // Mostrar janela quando estiver pronta
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Abrir DevTools em desenvolvimento
    if (process.argv.includes("--dev")) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Fechar janela quando fechada
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Criar menu da aplicação
function createMenu() {
  const template = [
    {
      label: "Arquivo",
      submenu: [
        {
          label: "Importar CSV",
          accelerator: "CmdOrCtrl+I",
          click: () => {
            mainWindow.webContents.send("menu-import-csv");
          },
        },
        {
          label: "Exportar CSV",
          accelerator: "CmdOrCtrl+E",
          click: () => {
            mainWindow.webContents.send("menu-export-csv");
          },
        },
        { type: "separator" },
        {
          label: "Configurar pasta de backup...",
          click: () => {
            mainWindow.webContents.send("menu-configure-backup");
          },
        },
        {
          label: "Executar backup agora",
          accelerator: "CmdOrCtrl+B",
          click: () => {
            mainWindow.webContents.send("menu-backup-now");
          },
        },
        { type: "separator" },
        {
          label: "Sair",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Visualizar",
      submenu: [
        { role: "reload", label: "Recarregar" },
        { role: "forceReload", label: "Forçar Recarregamento" },
        { role: "toggleDevTools", label: "Ferramentas de Desenvolvedor" },
        { type: "separator" },
        { role: "resetZoom", label: "Zoom Normal" },
        { role: "zoomIn", label: "Aumentar Zoom" },
        { role: "zoomOut", label: "Diminuir Zoom" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Tela Cheia" },
      ],
    },
    {
      label: "Ajuda",
      submenu: [
        {
          label: "Sobre EXTRANEF",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "Sobre EXTRANEF",
              message: "EXTRANEF - Sistema de Gestão",
              detail:
                "Versão 1.0.0\n\nSistema local para gestão de produtividade, comissão e controle de pessoal.\n\nDesenvolvido para uso interno da empresa.",
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Eventos da aplicação
app.whenReady().then(() => {
  createWindow();
  createMenu();

  // Arquivos persistentes
  const userDir = app.getPath("userData");
  dataFilePath = path.join(userDir, "extranef-data.json");
  configFilePath = path.join(userDir, "extranef-config.json");
  oauthTokensPath = path.join(userDir, "google-oauth-tokens.json");

  // Carregar config
  try {
    if (fs.existsSync(configFilePath)) {
      appConfig = {
        ...appConfig,
        ...JSON.parse(fs.readFileSync(configFilePath, "utf8")),
      };
    }
  } catch (e) {
    console.error("Falha ao carregar config:", e);
  }

  // Carregar banco de dados
  try {
    if (fs.existsSync(dataFilePath)) {
      inMemoryDb = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    } else {
      inMemoryDb = createEmptyDb();
      persistDb();
    }
  } catch (e) {
    console.error("Falha ao carregar banco de dados:", e);
    inMemoryDb = createEmptyDb();
  }

  // Inicializar OAuth se possível
  tryInitOAuth();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers para funcionalidades do sistema
ipcMain.handle("show-open-dialog", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-save-dialog", async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("write-file", async (event, filePath, data) => {
  try {
    fs.writeFileSync(filePath, data, "utf8");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ===================== SERVIÇO DE DADOS (MAIN) =====================
function createEmptyDb() {
  return {
    meta: { version: "1.0.0", updatedAt: new Date().toISOString() },
    extranef_funcionarios: [],
    extranef_equipes: [
      { id: 1, nome: "Direção", descricao: "Líder/Gerente" },
      { id: 2, nome: "RH", descricao: "Setor de pessoal" },
      { id: 3, nome: "Supervisor", descricao: "Supervisor de Equipe" },
      { id: 4, nome: "Control Desk", descricao: "Auxiliar de Escritório" },
      { id: 5, nome: "Negociador", descricao: "Negociador de Cobrança" },
    ],
    extranef_cargos: [
      { id: 1, nome: "Auxiliar", nivel: 1 },
      { id: 2, nome: "Assistente", nivel: 2 },
      { id: 3, nome: "Analista", nivel: 3 },
      { id: 4, nome: "Supervisor", nivel: 4 },
      { id: 5, nome: "Gerente", nivel: 5 },
      { id: 6, nome: "Diretor", nivel: 6 },
    ],
    extranef_horarios: [
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
    ],
    extranef_tipos_contrato: [
      { id: 1, nome: "Estagiário", tipo: "estagiario" },
      { id: 2, nome: "CLT", tipo: "clt" },
      { id: 3, nome: "Temporário", tipo: "temporario" },
    ],
    extranef_faltas: [],
    extranef_ferias: [],
    extranef_atestados: [],
  };
}

function persistDb() {
  try {
    inMemoryDb.meta.updatedAt = new Date().toISOString();
    fs.writeFileSync(dataFilePath, JSON.stringify(inMemoryDb, null, 2), "utf8");
    autoBackupIfConfigured();
    return true;
  } catch (e) {
    console.error("Erro ao salvar banco de dados:", e);
    return false;
  }
}

function saveConfig() {
  try {
    fs.writeFileSync(
      configFilePath,
      JSON.stringify(appConfig, null, 2),
      "utf8"
    );
    return true;
  } catch (e) {
    console.error("Erro ao salvar config:", e);
    return false;
  }
}

function autoBackupIfConfigured() {
  try {
    if (!appConfig.autoBackup || !appConfig.backupDir) return;
    const targetDir = appConfig.backupDir;
    if (!fs.existsSync(targetDir)) return;
    const baseName = "extranef-data.json";
    const ts = new Date().toISOString().replace(/[:]/g, "-");
    const versioned = `extranef-data-${ts}.json`;
    fs.writeFileSync(
      path.join(targetDir, baseName),
      JSON.stringify(inMemoryDb, null, 2),
      "utf8"
    );
    // Versão com timestamp (mantemos no máximo 10 por simplicidade)
    fs.writeFileSync(
      path.join(targetDir, versioned),
      JSON.stringify(inMemoryDb, null, 2),
      "utf8"
    );
  } catch (e) {
    console.error("Erro no backup automático:", e);
  }
}

ipcMain.handle("db:is-ready", async () => {
  return { ready: !!inMemoryDb };
});

ipcMain.handle("db:get-table", async (event, tableName) => {
  try {
    if (!inMemoryDb[tableName])
      return { success: false, error: "Tabela inexistente" };
    return { success: true, data: inMemoryDb[tableName] };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle("db:save-table", async (event, tableName, rows) => {
  try {
    inMemoryDb[tableName] = rows;
    const ok = persistDb();
    return { success: ok };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle("db:export-all", async () => {
  try {
    return { success: true, data: inMemoryDb };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle("db:import-all", async (event, dump) => {
  try {
    if (!dump || typeof dump !== "object") {
      return { success: false, error: "Dump inválido" };
    }
    // Mesclar apenas tabelas conhecidas
    Object.keys(dump).forEach((k) => {
      if (k.startsWith("extranef_") && Array.isArray(dump[k])) {
        inMemoryDb[k] = dump[k];
      }
    });
    const ok = persistDb();
    return { success: ok };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// ===================== BACKUP CONFIG =====================
ipcMain.handle("backup:choose-dir", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "createDirectory"],
  });
  if (result.canceled) return { success: false, canceled: true };
  appConfig.backupDir = result.filePaths[0];
  saveConfig();
  // Executa um backup inicial
  autoBackupIfConfigured();
  return { success: true, path: appConfig.backupDir };
});

ipcMain.handle("backup:get-config", async () => {
  return { success: true, config: appConfig };
});

ipcMain.handle("backup:set-config", async (event, partial) => {
  appConfig = { ...appConfig, ...partial };
  const ok = saveConfig();
  if (partial && Object.prototype.hasOwnProperty.call(partial, "autoBackup")) {
    if (appConfig.autoBackup) autoBackupIfConfigured();
  }
  return { success: ok, config: appConfig };
});

ipcMain.handle("backup:run-now", async () => {
  try {
    autoBackupIfConfigured();
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// ===================== ANEXOS (Atestados) =====================
function sanitizeForFs(name) {
  if (!name) return "sem-nome";
  return String(name)
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function ensureDirRecursively(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ipcMain.handle("attachments:save-atestado", async (event, payload) => {
  try {
    const { funcionarioNome, originalFileName, dataUrl, atestadoId } =
      payload || {};
    if (!appConfig.backupDir) {
      return {
        success: false,
        error: "BackupDir não configurado",
        notConfigured: true,
      };
    }
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.includes(",")) {
      return { success: false, error: "Data URL inválida" };
    }

    const safeEmployee = sanitizeForFs(funcionarioNome || "Funcionario");
    const baseDir = path.join(appConfig.backupDir, "Atestados", safeEmployee);
    ensureDirRecursively(baseDir);

    // Detectar extensão
    const header = dataUrl.substring(0, dataUrl.indexOf(","));
    let extFromMime = ".bin";
    if (header.includes("application/pdf")) extFromMime = ".pdf";
    else if (header.includes("image/png")) extFromMime = ".png";
    else if (header.includes("image/jpeg")) extFromMime = ".jpg";

    let origBase = sanitizeForFs(originalFileName || "atestado");
    let ext = path.extname(origBase);
    if (!ext) ext = extFromMime;
    const baseNameOnly = ext ? origBase.slice(0, -ext.length) : origBase;

    const ts = new Date().toISOString().replace(/[:]/g, "-");
    const fileName = `${ts}-${atestadoId || Date.now()}-${baseNameOnly}${ext}`;
    const filePath = path.join(baseDir, fileName);

    const base64 = dataUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");
    fs.writeFileSync(filePath, buffer);

    return { success: true, path: filePath };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// ===================== GOOGLE DRIVE (OAuth + Upload) =====================
function tryInitOAuth() {
  try {
    if (!appConfig.google) return;
    const { clientId, clientSecret } = appConfig.google;
    if (!clientId || !clientSecret) return;
    oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      "http://127.0.0.1:53457/callback"
    );
    if (fs.existsSync(oauthTokensPath)) {
      const tokens = JSON.parse(fs.readFileSync(oauthTokensPath, "utf8"));
      oauth2Client.setCredentials(tokens);
    }
  } catch (e) {
    console.error("Falha ao inicializar OAuth:", e);
  }
}

async function runLocalServerForAuth() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, "http://127.0.0.1:53457");
        if (url.pathname === "/callback") {
          const code = url.searchParams.get("code");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(
            "<html><body>Login concluído. Você pode fechar esta janela.</body></html>"
          );
          server.close();
          resolve(code);
        } else {
          res.writeHead(404);
          res.end();
        }
      } catch (e) {
        server.close();
        reject(e);
      }
    });
    server.listen(53457, "127.0.0.1");
  });
}

ipcMain.handle(
  "gdrive:configure",
  async (event, { clientId, clientSecret, folderId, scope = "drive.file" }) => {
    try {
      appConfig.google = { clientId, clientSecret, folderId, scope };
      saveConfig();
      tryInitOAuth();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
);

ipcMain.handle("gdrive:login", async () => {
  try {
    if (!oauth2Client)
      return { success: false, error: "OAuth não configurado" };
    const scopes = ["https://www.googleapis.com/auth/drive.file"];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
    });
    await shell.openExternal(authUrl);
    const code = await runLocalServerForAuth();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(oauthTokensPath, JSON.stringify(tokens, null, 2), "utf8");
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

async function ensureDriveSubfolder(auth, parentFolderId, name) {
  const drive = google.drive({ version: "v3", auth });
  // buscar pasta existente
  const q = `name='${name.replace(
    /'/g,
    "\\'"
  )}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`;
  const list = await drive.files.list({ q, fields: "files(id,name)" });
  if (list.data.files && list.data.files.length > 0)
    return list.data.files[0].id;
  // criar pasta
  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    fields: "id,name",
  });
  return created.data.id;
}

ipcMain.handle(
  "gdrive:upload-atestado",
  async (event, { funcionarioNome, originalFileName, dataUrl, atestadoId }) => {
    try {
      if (!oauth2Client || !appConfig.google || !appConfig.google.folderId) {
        return { success: false, error: "Google Drive não configurado" };
      }
      const baseFolderId = appConfig.google.folderId;
      const employeeFolderName = sanitizeForFs(
        funcionarioNome || "Funcionario"
      );
      const employeeFolderId = await ensureDriveSubfolder(
        oauth2Client,
        baseFolderId,
        employeeFolderName
      );

      // preparar stream
      const header = dataUrl.substring(0, dataUrl.indexOf(","));
      const base64 = dataUrl.split(",")[1];
      const buffer = Buffer.from(base64, "base64");
      let mimeType = "application/octet-stream";
      if (header.includes("application/pdf")) mimeType = "application/pdf";
      else if (header.includes("image/png")) mimeType = "image/png";
      else if (header.includes("image/jpeg")) mimeType = "image/jpeg";

      const ts = new Date().toISOString().replace(/[:]/g, "-");
      const orig = sanitizeForFs(originalFileName || "atestado");
      const ext = orig.includes(".")
        ? orig.split(".").pop()
        : mimeType === "application/pdf"
        ? "pdf"
        : mimeType === "image/png"
        ? "png"
        : mimeType === "image/jpeg"
        ? "jpg"
        : "bin";
      const baseOnly = orig.replace(new RegExp(`\\.${ext}$`), "");
      const driveName = `${ts}-${atestadoId || Date.now()}-${baseOnly}.${ext}`;

      const drive = google.drive({ version: "v3", auth: oauth2Client });
      const res = await drive.files.create({
        requestBody: { name: driveName, parents: [employeeFolderId] },
        media: { mimeType, body: Readable.from(buffer) },
        fields: "id,name,webViewLink,webContentLink",
      });

      return {
        success: true,
        fileId: res.data.id,
        webViewLink: res.data.webViewLink,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
);

// ====== Relatórios (Faltas/Férias) para Google Drive ======
function toIsoDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function computeRange(period) {
  const now = new Date();
  let start, end;
  if (period === "day") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end = new Date(start);
    end.setDate(end.getDate() + 1);
  } else if (period === "week") {
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    start = new Date(end);
    start.setDate(start.getDate() - 7);
  } else {
    // month
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  return { start, end };
}

function overlapsRange(startA, endA, startB, endB) {
  return startA <= endB && endA >= startB;
}

function toCsv(rows) {
  if (!rows || rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r || {}).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  const esc = (v) => {
    if (v === undefined || v === null) return "";
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => esc(row[h])).join(","));
  }
  return lines.join("\n");
}

ipcMain.handle(
  "gdrive:upload-report",
  async (event, { entity, period = "month", format = "csv" }) => {
    try {
      if (!oauth2Client || !appConfig.google || !appConfig.google.folderId) {
        return { success: false, error: "Google Drive não configurado" };
      }
      const { start, end } = computeRange(period);
      let rows = [];
      if (entity === "faltas") {
        const all = inMemoryDb.extranef_faltas || [];
        rows = all.filter((f) => {
          // Normalizar data (input date ISO: YYYY-MM-DD) para meia-noite local
          let d = f && f.dataFalta ? new Date(`${f.dataFalta}T00:00:00`) : null;
          if (!d || isNaN(d.getTime())) {
            d = f && f.dataFalta ? new Date(f.dataFalta) : null;
          }
          return d && d >= start && d < end;
        });
        // Enriquecer com nome do funcionário
        const funcMap = new Map(
          (inMemoryDb.extranef_funcionarios || []).map((fn) => [
            String(fn.id),
            fn.nome,
          ])
        );
        rows = rows.map((r) => ({
          funcionarioNome: funcMap.get(String(r.funcionarioId)) || "",
          ...r,
        }));
      } else if (entity === "ferias") {
        const all = inMemoryDb.extranef_ferias || [];
        rows = all.filter((r) => {
          const aStart =
            r && r.dataInicio
              ? new Date(`${r.dataInicio}T00:00:00`)
              : new Date(r.dataInicio);
          // Considerar até o final do dia
          const endStr = r && r.dataFim ? r.dataFim : r.dataInicio;
          const aEnd = endStr
            ? new Date(`${endStr}T23:59:59`)
            : new Date(r.dataFim || r.dataInicio);
          return overlapsRange(aStart, aEnd, start, end);
        });
        // Enriquecer com nome do funcionário
        const funcMap2 = new Map(
          (inMemoryDb.extranef_funcionarios || []).map((fn) => [
            String(fn.id),
            fn.nome,
          ])
        );
        rows = rows.map((r) => ({
          funcionarioNome: funcMap2.get(String(r.funcionarioId)) || "",
          ...r,
        }));
      } else {
        return { success: false, error: "Entidade inválida" };
      }

      const subRootId = await ensureDriveSubfolder(
        oauth2Client,
        appConfig.google.folderId,
        "Backups"
      );
      const entityFolder = await ensureDriveSubfolder(
        oauth2Client,
        subRootId,
        entity === "faltas" ? "Faltas" : "Ferias"
      );

      const drive = google.drive({ version: "v3", auth: oauth2Client });
      const dateLabel = toIsoDate(new Date());
      const baseName = `${entity}-${period}-${dateLabel}`;
      let mimeType, body, name;
      if (format === "json") {
        const content = JSON.stringify(rows, null, 2);
        mimeType = "application/json";
        body = Readable.from(Buffer.from(content, "utf8"));
        name = `${baseName}.json`;
      } else {
        const content = toCsv(rows);
        mimeType = "text/csv";
        body = Readable.from(Buffer.from(content, "utf8"));
        name = `${baseName}.csv`;
      }

      const res = await drive.files.create({
        requestBody: { name, parents: [entityFolder] },
        media: { mimeType, body },
        fields: "id,name,webViewLink",
      });

      return {
        success: true,
        fileId: res.data.id,
        webViewLink: res.data.webViewLink,
        count: rows.length,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
);
