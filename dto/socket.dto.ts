import { WebSocket } from 'ws'
import { Socket } from 'net'

export class SocketDto {
  socket?: Socket
  websocket?: WebSocket
}
