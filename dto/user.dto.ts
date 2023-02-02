import { SocketDto } from './socket.dto'

export class UserDto {
  username: string
  sockets: Array<SocketDto>
}
