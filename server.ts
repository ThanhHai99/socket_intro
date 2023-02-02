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
  sockets.forEach((socket, index) => {
    if (socket.websocket == ws) {
      sockets.splice(index, 1)
    }
  })
})

setInterval(() => {
  sendTimeBroadcast()
  console.log(`Sockets size: ${sockets.length}`)
}, 1000)

const sendTimeBroadcast = () => {
  sockets.forEach((socket, index) => {
    const currentTime = new Date()
    if (socket.websocket) {
      socket.websocket.send(currentTime)
    } else {
      if (!socket.socket.destroyed) {
        socket.socket.write(Buffer.from(currentTime.toString() + '\n', 'utf-8'), 'utf-8')
        console.log(`Send time broadcast ${currentTime}`)
      } else {
        // delete socket from sockets
        sockets.splice(index, 1)
      }
    }
  })
}
