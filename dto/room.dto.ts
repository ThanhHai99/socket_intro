import { UserDto } from './user.dto'

export class RoomDto {
  code: string
  users: Array<UserDto>
}
