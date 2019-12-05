import { app, BrowserWindowConstructorOptions, BrowserWindow } from 'electron'
import install, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

export const WindowHost =
  process.env.NODE_ENV === 'development'
    ? `${process.env.PROTOCOL}://${process.env.ADDRESS}:${process.env.PORT}`
    : `file://${__dirname}`

app.on('ready', () => {
  const config: BrowserWindowConstructorOptions = {
    title: '主页',
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  }
  const url = `${WindowHost}/index.html`
  const win = new BrowserWindow(config)
  win.loadURL(url)
  install([REACT_DEVELOPER_TOOLS])
})
