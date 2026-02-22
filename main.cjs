const { app, BrowserWindow, Notification } = require('electron')

const messagesNoapte = [
  "E miezul nopții. Ai terminat tot ce ți-ai propus azi?",
  "00:00 — o nouă zi începe. Cea veche cum s-a încheiat?",
  "Ziua s-a terminat. Deschide Strivo și vezi unde ai ajuns.",
  "Miezul nopții a sosit. Task-urile tale te așteaptă să le evaluezi.",
  "Timp de bilanț. Cum a arătat ziua ta azi?",
]

const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)]
}

function scheduleNightNotification() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const msUntilMidnight = midnight - now

  setTimeout(() => {
    new Notification({
      title: '⚡ Strivo',
      body: getRandomMessage(messagesNoapte)
    }).show()

    scheduleNightNotification()
  }, msUntilMidnight)
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
  createWindow()
  scheduleNightNotification()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})