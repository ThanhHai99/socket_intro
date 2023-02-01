const {WebSocket} = require('ws')
const net = require("net");
const server = net.createServer({})
const websocketPort = 3000
const wss = new WebSocket.Server({port: websocketPort});

let sockets = []

wss.on('connection', function connection(ws) {
    console.log("one client connected")

    // Send by websocket server
    setInterval(() => {
        wss.clients.forEach(ws => {
            const currentTime = new Date()
            console.log('Sending broadcast: ', currentTime)
            ws.send(currentTime)
        })
    }, 1000)
});

const socketPort = 3001
server.listen({port: socketPort}, (socket) => {
    console.log(`Server socket listening at port ${socketPort}`)

    server.on("connection", (socket) => {
        sockets.push(socket)
    })

    // server.emit("message", () => {
    //   console.log("co connection")
    // })

})

server.on("error", (err) => {
    console.log(err)
})

server.on("close", (socket) => {
    console.log(socket)
    // remove this socket closed
})

// send broadcast by socket server
setInterval(() => {
    sockets.forEach(client => {
        const currentTime = new Date()
        const data = Buffer.from(currentTime, 'utf-8')


    })
}, 1000)

