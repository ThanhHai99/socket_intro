// Config port
import * as net from 'net'
import { WebSocketServer } from 'ws'
import { ChatTypeEnum, TypeEnum } from './dto2/socket-data.dto.js'
// import { SocketDto } from './dto/socket.dto'
// import { UserDto } from './dto/user.dto'
// import { ChatTypeEnum, SocketDataDto, TypeEnum } from './dto/socket-data.dto'
// import { RoomDto } from './dto/room.dto'

const ssPort = 3000
const wssPort = 3001

// Init sockets & rooms

let sockets = []
let users = new Map()
let rooms = new Map()
rooms.set('room1', {
  code: 'room1',
  users: [],
})

// RawSocket
const socketServer = net.createServer()
socketServer.listen(ssPort, () => {
  console.log(`Socket server listening at ${ssPort}`)
})

socketServer.on('connection', (rs) => {
  const thisRS = {
    socket: rs,
  }
  sockets.push(thisRS)

  rs.on('data', (dataBuffer) => {
    const data = JSON.parse(dataBuffer.toString())
    const thisSocket = {
      socket: rs,
    }
    if (data.type == TypeEnum.LOGIN) {
      if (!data.chatType || data.chatType == ChatTypeEnum.PERSONAL) {
        if (users.has(data.username)) {
          const user = users.get(data.username)
          user.sockets.push(thisSocket)
          users.set(data.username, user)
        } else {
          const user = {
            username: data.username,
            sockets: [thisSocket],
          }

          users.set(data.username, user)
        }
      } else {
        const user = {
          username: data.username,
          sockets: [thisSocket],
        }

        let room1 = rooms.get('room1')
        room1.users.push(user)
        rooms.set('room1', room1)
      }
    } else if (data.type == TypeEnum.LOGOUT) {
    } else if (data.type == TypeEnum.MESSAGE) {
      if (data.chatType == ChatTypeEnum.PERSONAL) {
        sendMessage(ChatTypeEnum.PERSONAL, data.targetId, data.username, data.data)
      } else {
        sendMessage(ChatTypeEnum.ROOM, data.targetId, data.username, data.data)
      }
    } else {
      console.log('😒')
    }
  })

  rs.on('close', () => {
    const idx = sockets.findIndex((s) => s.socket == rs)
    if (idx != -1) sockets.splice(idx, 1)
  })
})

// WebSocket
const webSocketServer = new WebSocketServer({ port: wssPort })
webSocketServer.once('listening', () => {
  console.log(`Web socket server listening at ${wssPort}`)
})
webSocketServer.on('connection', (ws) => {
  const thisWS = {
    websocket: ws,
  }
  sockets.push(thisWS)
  ws.on('message', (dataBuffer) => {
    const data = JSON.parse(dataBuffer.toString())
    const thisSocket = {
      websocket: ws,
    }
    if (data.type == TypeEnum.LOGIN) {
      if (!data.chatType || data.chatType == ChatTypeEnum.PERSONAL) {
        if (users.has(data.username)) {
          const user = users.get(data.username)
          user.sockets.push(thisSocket)
          users.set(data.username, user)
        } else {
          const user = {
            username: data.username,
            sockets: [thisSocket],
          }

          users.set(data.username, user)
        }
      } else {
        const user = {
          username: data.username,
          sockets: [thisSocket],
        }

        let room1 = rooms.get('room1')
        room1.users.push(user)
        rooms.set('room1', room1)
      }
    } else if (data.type == TypeEnum.LOGOUT) {
    } else if (data.type == TypeEnum.MESSAGE) {
      if (data.chatType == ChatTypeEnum.PERSONAL) {
        sendMessage(ChatTypeEnum.PERSONAL, data.targetId, data.username, data.data)
      } else {
        sendMessage(ChatTypeEnum.ROOM, data.targetId, data.username, data.data)
      }
    } else {
      console.log('😒')
    }
  })

  ws.on('close', () => {
    const idx = sockets.findIndex((s) => s.websocket == ws)
    if (idx != -1) sockets.splice(idx, 1)
  })
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

  const r1 = rooms.get('room1')
  console.log(`Socket size: ${sockets.length} | User size: ${users.size} | Room size: ${rooms.size} | User in room1: ${r1.users.length}`)
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

const sendMessage = (chatType, targetId, senderId, data) => {
  if (chatType == ChatTypeEnum.PERSONAL) {
    if (users.has(targetId)) {
      const info = users.get(targetId)
      info.sockets.forEach((s) => {
        if (s.websocket) {
          s.websocket.send(`\n${ChatTypeEnum.PERSONAL}:: ${senderId}: ${data}`)
        } else {
          if (!s.socket.destroyed) {
            s.socket.write(`\n${ChatTypeEnum.PERSONAL}:: ${senderId}: ${data}`)
          }
        }
      })
    }
  } else {
    if (rooms.has('room1')) {
      const r1 = rooms.get('room1')
      r1.users.forEach((u) => {
        u.sockets.forEach((s) => {
          if (s.websocket) {
            s.websocket.send(`\n${ChatTypeEnum.ROOM}:: ${senderId}: ${data}`)
          } else {
            if (!s.socket.destroyed) {
              s.socket.write(`\n${ChatTypeEnum.ROOM}:: ${senderId}: ${data}`)
            }
          }
        })
      })
    }
  }
}
