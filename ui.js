// UI utilidades globais para toasts e integrações de menu/backup
(function () {
  const TOAST_DURATION_MS = 3000;

  function ensureToastContainer() {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.style.position = "fixed";
      container.style.top = "20px";
      container.style.right = "20px";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";
      container.style.zIndex = 99999;
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type = "info") {
    const container = ensureToastContainer();
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.minWidth = "260px";
    toast.style.maxWidth = "480px";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
    toast.style.color = "#fff";
    toast.style.opacity = 0;
    toast.style.transform = "translateY(-6px)";
    toast.style.transition = "opacity .2s ease, transform .2s ease";
    const bg =
      type === "success" ? "#2e7d32" : type === "error" ? "#c62828" : "#1565c0";
    toast.style.background = bg;
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = 1;
      toast.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = 0;
      toast.style.transform = "translateY(-6px)";
      setTimeout(() => toast.remove(), 250);
    }, TOAST_DURATION_MS);
  }

  // Override não-bloqueante do alert()
  window.alert = function (msg) {
    try {
      showToast(String(msg), "info");
    } catch (_) {
      // fail-safe
      console.log("ALERT:", msg);
    }
  };

  // Helpers globais
  window.showToast = showToast;

  // Integrações de menu/backup do Electron
  if (window.electronAPI) {
    // Configurar pasta de backup
    window.electronAPI.onMenuConfigureBackup(async () => {
      const res = await window.electronAPI.backupChooseDir();
      if (res && res.success) {
        showToast("Pasta de backup configurada", "success");
      } else if (!(res && res.canceled)) {
        showToast("Não foi possível configurar o backup", "error");
      }
    });
    // Executar backup agora
    window.electronAPI.onMenuBackupNow(async () => {
      const res = await window.electronAPI.backupRunNow();
      if (res && res.success) {
        showToast("Backup realizado", "success");
      } else {
        showToast("Falha ao executar backup", "error");
      }
    });

    // Configuração automática do Google Drive (se o appConfig desejado for fornecido via ambiente/renderer)
    // Exemplo: definir no início da sessão
    window.setupGoogleDrive = async function setupGoogleDrive({
      clientId,
      clientSecret,
      folderId,
    }) {
      try {
        await window.electronAPI.gdriveConfigure({
          clientId,
          clientSecret,
          folderId,
          scope: "drive.file",
        });
        const login = await window.electronAPI.gdriveLogin();
        if (login && login.success) {
          showToast("Google Drive conectado", "success");
        } else {
          showToast("Falha ao conectar Google Drive", "error");
        }
      } catch (e) {
        showToast("Erro na configuração do Google Drive", "error");
      }
    };
  }
})();
