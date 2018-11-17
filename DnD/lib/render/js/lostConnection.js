// get all necessary modules
const electron = require('electron')
const {ipcRenderer} = electron
let retrying = document.getElementById('retrying')
let RETRYTIME = 5000

// create a clock that changes text on the lostConnection page
let counter = setInterval(() => {
  console.log('tick', RETRYTIME)
  RETRYTIME -= 1000
  if (RETRYTIME !== -1000) {
    retrying.textContent = `retrying in ... ${RETRYTIME / 1000}`
  }else {
    clearInterval(counter)
  }
}, 1000)

// makes it so that every 5 seconds it will try to reconnect again
let interval = setTimeout(() => {
  ipcRenderer.send('lostConnection:reconnect')
}, 5000)

// If the reconnection fails it will restart the clock
ipcRenderer.on('main:reconnect_fail', () => {
  RETRYTIME = 5000
  counter = setInterval(() => {
    RETRYTIME -= 1000
    if (RETRYTIME != -1000) {
      retrying.textContent = `retrying in ... ${RETRYTIME / 1000}`
    }else {
      clearInterval(counter)
    }
  }, 1000)

  interval = setTimeout(() => {
    ipcRenderer.send('lostConnection:reconnect')
  }, 5000)
})
