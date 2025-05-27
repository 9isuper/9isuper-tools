export interface UserInfo {
  id: number
  username: string
  name: string
  avatar: string
}

export interface LoginResponse {
  code: number
  data: {
    token: string
    user: UserInfo
  }
  message: string
} 