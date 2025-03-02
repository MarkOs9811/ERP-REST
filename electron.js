const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

// Función para cargar `electron-is-dev` dinámicamente
async function loadIsDev() {
  const { default: isDev } = await import("electron-is-dev");
  return isDev;
}

// Crear la ventana principal
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Precarga si es necesaria
    },
  });

  // Cargar la URL según el entorno
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "./build/index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow.loadURL(startUrl);

  // Abrir DevTools en modo desarrollo
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }
}

// Inicializar la aplicación
app.whenReady().then(() => {
  createWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
});
