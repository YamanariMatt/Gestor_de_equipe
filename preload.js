const { contextBridge, ipcRenderer } = require("electron");

// Expor APIs seguras para o processo de renderização
contextBridge.exposeInMainWorld("electronAPI", {
  // Diálogos de arquivo
  showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),

  // Operações de arquivo
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, data) =>
    ipcRenderer.invoke("write-file", filePath, data),

  // Eventos do menu
  onMenuImportCSV: (callback) => ipcRenderer.on("menu-import-csv", callback),
  onMenuExportCSV: (callback) => ipcRenderer.on("menu-export-csv", callback),
  onMenuConfigureBackup: (callback) =>
    ipcRenderer.on("menu-configure-backup", callback),
  onMenuBackupNow: (callback) => ipcRenderer.on("menu-backup-now", callback),

  // Utilitários
  platform: process.platform,
  versions: process.versions,

  // DB bridge
  dbIsReady: () => ipcRenderer.invoke("db:is-ready"),
  dbGetTable: (tableName) => ipcRenderer.invoke("db:get-table", tableName),
  dbSaveTable: (tableName, rows) =>
    ipcRenderer.invoke("db:save-table", tableName, rows),
  dbExportAll: () => ipcRenderer.invoke("db:export-all"),
  dbImportAll: (dump) => ipcRenderer.invoke("db:import-all", dump),

  // Backup bridge
  backupChooseDir: () => ipcRenderer.invoke("backup:choose-dir"),
  backupGetConfig: () => ipcRenderer.invoke("backup:get-config"),
  backupSetConfig: (partial) =>
    ipcRenderer.invoke("backup:set-config", partial),
  backupRunNow: () => ipcRenderer.invoke("backup:run-now"),

  // Attachments bridge
  saveAtestadoAttachment: (payload) =>
    ipcRenderer.invoke("attachments:save-atestado", payload),

  // Google Drive
  gdriveConfigure: (cfg) => ipcRenderer.invoke("gdrive:configure", cfg),
  gdriveLogin: () => ipcRenderer.invoke("gdrive:login"),
  gdriveUploadAtestado: (payload) =>
    ipcRenderer.invoke("gdrive:upload-atestado", payload),
  gdriveUploadReport: (payload) =>
    ipcRenderer.invoke("gdrive:upload-report", payload),
});

// Remover listeners quando a janela for fechada
window.addEventListener("beforeunload", () => {
  ipcRenderer.removeAllListeners("menu-import-csv");
  ipcRenderer.removeAllListeners("menu-export-csv");
  ipcRenderer.removeAllListeners("menu-configure-backup");
  ipcRenderer.removeAllListeners("menu-backup-now");
});
