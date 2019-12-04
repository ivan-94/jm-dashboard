import { app, BrowserWindowConstructorOptions, BrowserWindow } from 'electron'

export const WindowHost =
  process.env.NODE_ENV === 'development'
    ? `${process.env.PROTOCOL}://${process.env.ADDRESS}:${process.env.PORT}`
    : `file://${__dirname}`

app.on('ready', () => {
  const config: BrowserWindowConstructorOptions = {
    title: '主页',
    webPreferences: {
      nodeIntegration: true,
    },
  }
  const url = `${WindowHost}/index.html`
  const win = new BrowserWindow(config)
  win.loadURL(url)
})
