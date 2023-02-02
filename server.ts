// Config port
import * as net from 'net'
import { WebSocket } from 'ws'
import { SocketDto } from './dto/socket.dto'
import { UserDto } from './dto/user.dto'
import { ChatTypeEnum, SocketDataDto, TypeEnum } from './dto/socket-data.dto'

const ssPort = 3000
const wssPort = 3001

// Init sockets & rooms

let sockets: Array<SocketDto> = []
let users = new Map()
let rooms = []

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

  rs.on('data', (dataBuffer) => {
    const data: SocketDataDto = JSON.parse(dataBuffer.toString())
    const thisSocket: SocketDto = {
      socket: rs,
    }
    if (data.type == TypeEnum.LOGIN) {
      if (users.has(data.username)) {
        const user: UserDto = users.get(data.username)
        user.sockets.push(thisSocket)
        users.set(data.username, user)
      } else {
        const user: UserDto = {
          username: data.username,
          sockets: [thisSocket],
        }

        users.set(data.username, user)
      }
    } else if (data.type == TypeEnum.LOGOUT) {
    } else if (data.type == TypeEnum.MESSAGE) {
      if (data.chatType == ChatTypeEnum.PERSONAL) {
        sendMessage(ChatTypeEnum.PERSONAL, data.targetId, data.username, data.data)
      }
    } else {
      console.log('😒')
    }
  })
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
  // sendTimeBroadcast()
  // console.log(`Sockets size: ${sockets.length}`)

  console.log(`User size: ${users.size}`)
}, 1000)

const sendTimeBroadcast = () => {
  sockets.forEach((socket, index) => {
    const currentTime = new Date()
    if (socket.websocket) {
      socket.websocket.send(currentTime)
    } else {
      if (!socket.socket.destroyed) {
        socket.socket.write(Buffer.from('\n' + currentTime.toString(), 'utf-8'), 'utf-8')
        console.log(`Send time broadcast ${currentTime}`)
      } else {
        // delete socket from sockets
        sockets.splice(index, 1)
      }
    }
  })
}

const login = () => {}

const sendMessage = (chatType: string, targetId: string, senderId: string, data: string) => {
  if (chatType == ChatTypeEnum.PERSONAL) {
    if (users.has(targetId)) {
      const info: UserDto = users.get(targetId)
      info.sockets.forEach((s) => {
        if (!s.socket.destroyed) {
          s.socket.write(`\n${senderId}: ${data}`)
        }
      })
    }
  }
}
