export enum ChatTypeEnum {
  PERSONAL = 'PERSONAL',
  ROOM = 'ROOM',
}

export enum TypeEnum {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  MESSAGE = 'MESSAGE',
}

export class SocketDataDto {
  username: string
  chatType?: string
  type: string
  targetId?: string
  data?: string
}
