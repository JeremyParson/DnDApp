// var express = require('express')
// const app = express()
// var server = require("http").createServer(app)
// var io = require('socket.io')(server)

const store = require('configstore')
const net = require('net')
const DB = new store('DB')
const PORT = 3000

// server.listen(3000, () => {
//   console.log("Server started on port 3000")
// })

// io.on("connect",(client) => {
//   console.log("A client has connected...")
//   client.on("msg", (data) => {
//       console.log(data)
//   })

//   client.on("disconnect", () => {
//       console.log("A client disconeected")
//   })
// })

const server = net.createServer((socket) => {
  console.log(`Client connected ${socket.remoteAddress} | connected: ${server.connections}`)
  socket.write('Echo server\r\n')
  socket.pipe(socket)

  socket.on('data', (data) => {
    console.log('received data')
    let protocol = data.toString().slice(0, 3)
    let pdata = JSON.parse(data.toString().substring(3));
    console.log(pdata)
    console.log(`protocol : |${protocol}|`);
    switch (protocol) {
      case '001':
        login(pdata, socket)
        break

      case '002':
        register(pdata, socket)
        break

      case '003':
        message(pdata, socket)
        break
    }  
  })
})

function login (data, client) {
  console.log("logging in user");
  if (DB.has(data.username)) {
    console.log(DB.get(data.username))
    if (DB.get(data.username).userData.password == data.password) {
      console.log('loggin success');
      client.write(JSON.stringify(DB.get(data.username).userData));
    }
  }
}

function register (data, client) {
  console.log("registering user");
  DB.set(data.username, data)
  console.log(DB.get(data.username))
}

function message (data, client) {
}

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server started, listening on port ${PORT}`)
})
