const electron = require('electron')
const { format } = require('url')
const { join } = require('path')
const configstore = require('configstore')
var io = require('socket.io-client');

const store = new configstore('Delve')
// This remember me will grab the users last inputed username and password (if they ticked remember on login.html)
let rememberMe = store.get('rememberMe')
// Get modules necessary for connecting socket to server
const net = require('net')
const client = new net.Socket()
// get all constants (netStates, appStates, etc.)
const states = require('./framework/constants')
// extract all necesary objects from electron and set up app States
const {ipcMain, Menu, BrowserWindow, app} = electron
let mainWindow
let appState = states.appStates.login
let netState = states.netStates.offline

// set up port num and host
const PORT = 3000
const HOST = '127.0.0.1'

// SET ENV
// process.env.NODE_ENV = 'production'

// wait for app to be ready before creating BrowserWindow
app.on('ready', () => {
  console.log('App is ready!')
  mainWindow = new BrowserWindow({
      minHeight : 680,
      minWidth : 700
  })

  // Set closed event
  mainWindow.on('closed', () => {
    app.quit()
  })
})



// Connect to server

// var socket = io('http://localhost:3000');

// socket.on('connect'), () => {
//   socket.emit('msg', 'hello');
// }

// socket.on('connect', () => {

// })

client.connect(PORT, HOST, () => {
  console.log('connected to server!')
  netState = states.netStates.online
  // load login page when app connects to server
  // client.write(JSON.stringify({"Hello":"World"}));

  mainWindow.loadURL(format({
    pathname: join(__dirname, 'lib', 'render', 'html', 'login.html'),
    protocol: 'file:',
    slashes: true
  }))
})

client.on('data', (data) => {
  console.log(data.toString());
})

// Checks if there are any connection errors, if so it will redirect user to reconnecting page and try to resolve connection issues
client.on('error', (err) => {
  console.log(err)

  if (netState !== states.netStates.timeout) {
    netState = states.netStates.timeout
    mainWindow.loadURL(format({
      pathname: join(__dirname, 'lib', 'render', 'html', 'lostConnection.html'),
      protocol: 'file:',
      slashes: true
    }))
  }else {
    mainWindow.webContents.send('main:reconnect_fail')
  }
})

// set loginKey when user bubbles "remember me" in login form
ipcMain.on('login:loginKey', (e, data) => {
  store.set('loginKey', data)
  console.log(store.get('loginKey'))
  client.write(`001${JSON.stringify(data)}`)
// Send data to server
})

// send loginKey back when login page requests it
ipcMain.on('login:getKey', (e) => {
  console.log('got request for loginKey')
  if (store.get('rememberMe') !== false && store.get('loginKey') !== null || undefined) {
    console.log(store.get('loginKey'))
    mainWindow.webContents.send('main:loginKey', store.get('loginKey'))
  }else {
    console.log('No key found')
  }
})

// Sets whether the ap will remember users username and password
ipcMain.on('register:remember', (e, data) => {
  console.log(data)
  store.set('rememberMe', data)
})

// Changes current page on app to register.html
ipcMain.on('register:GOTOregister', () => {
  mainWindow.loadURL(format({
    pathname: join(__dirname, 'lib', 'render', 'html', 'register.html'),
    protocol: 'file:',
    slashes: true
  }))
})

// Changes current page on app to login.html
ipcMain.on('register:GOTOlogin', () => {
  mainWindow.loadURL(format({
    pathname: join(__dirname, 'lib', 'render', 'html', 'login.html'),
    protocol: 'file:',
    slashes: true
  }))
})

// this will wait for the reconnect page to ask for a reconnection to the server. if it fails it will start the process over again, else it will return to login.html
ipcMain.on('lostConnection:reconnect', () => {
  client.connect(PORT, HOST, () => {
    console.log('connected to server!')
    netState = states.netStates.online
    mainWindow.loadURL(format({
      pathname: join(__dirname, 'lib', 'render', 'html', 'login.html'),
      protocol: 'file:',
      slashes: true
    }))
  })
})

ipcMain.on('register:register', (e, data) => {
    console.log(data);
    client.write(`002${JSON.stringify(data)}`);
});