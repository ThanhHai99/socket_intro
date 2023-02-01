// Config port
import * as net from 'net'
import { WebSocket } from 'ws'
import { SocketDto } from './dto/socket.dto'

const ssPort = 3000
const wssPort = 3001

// Init sockets & rooms

let sockets: Array<SocketDto> = []
let rooms = []
let isWebSocket: boolean

// RawSocket
const socketServer = net.createServer()
socketServer.listen(ssPort, () => {
  console.log(`Socket server listening at ${ssPort}`)
})

socketServer.on('connection', (rs) => {
  const thisRS: SocketDto = {
    socket: rs,
  }
  sockets.push(thisRS)
})

// WebSocket
const webSocketServer = new WebSocket.Server({ port: wssPort })
webSocketServer.once('listening', () => {
  console.log(`Web socket server listening at ${wssPort}`)
})
webSocketServer.on('connection', (ws) => {
  const thisWS: SocketDto = {
    websocket: ws,
  }
  sockets.push(thisWS)
})
webSocketServer.on('close', (ws) => {
  sockets.forEach((socket) => {
    if (socket.websocket == ws) {
      const idx = sockets.indexOf(ws)
      sockets.splice(idx, 1)
    }
  })
})

setInterval(() => {
  sendBroadcast()
  console.log('sockets.length')
  console.log(sockets.length)
}, 2000)

const sendBroadcast = () => {
  sockets.forEach((socket) => {
    const currentTime = new Date()
    if (socket.websocket) {
      socket.websocket.send(currentTime)
    } else {
      if (!socket.socket.isPaused()) {
        socket.socket.write(Buffer.from(currentTime.toString() + '\n', 'utf-8'), 'utf-8')
      } else {
        // console.log('mat connect')
        // sockets.forEach((socket) => {
        //   if (socket.socket == socket) {
        //     const idx = sockets.indexOf(socket)
        //     sockets.splice(idx, 1)
        //   }
        // })
      }
    }
    console.log(`Send broadcast ${currentTime}`)
  })
}
