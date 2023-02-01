import { WebSocket } from 'ws'
import { Socket } from 'net'

export class SocketDto {
  socket: WebSocket | Socket
  isWebsocket: boolean
}
