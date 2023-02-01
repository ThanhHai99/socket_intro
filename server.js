const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
let server = http.createServer(app)
let io = socketio(server)

const PORT = 3000
server.listen(PORT, () => console.log(`App running at : ${PORT}`))
