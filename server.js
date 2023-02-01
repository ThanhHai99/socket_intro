const net = require('net')
const {WebSocket} = require('ws')

// Config port
const ssPort = 3000
const wssPort = 3001

// Init sockets & rooms
let sockets = []
let rooms = []

// RawSocket
const socketServer = net.createServer()
socketServer.listen(ssPort, () => {
    console.log(`Socket server listening at ${ssPort}`)
})


// WebSocket
const webSocketServer = new WebSocket.Server({port: wssPort})
webSocketServer.once("listening", () => {
    console.log(`Web socket server listening at ${wssPort}`)
})
webSocketServer.on('connection', (ws) => {
    sockets.push(ws)
})

setInterval(() => {
    sendBroadcast()
}, 1000)

const sendBroadcast = () => {
    sockets.forEach(socket => {
        const currentTime = new Date()
        console.log(`Send broadcast ${currentTime}`)
        // socket.wri(currentTime)
    })
}
