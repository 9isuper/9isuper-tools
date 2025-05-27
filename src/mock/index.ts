import type { UserInfo, LoginResponse } from '../types'

// 模拟用户数据
const users: UserInfo[] = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    name: '管理员',
    avatar: '/assets/avatar.svg'
  },
  {
    id: 2,
    username: 'test',
    password: '123456',
    name: '测试用户',
    avatar: '/assets/avatar.svg'
  }
]

// 模拟 JWT token
const generateToken = (user: any) => {
  // 实际项目中应该使用真实的 JWT 生成方法
  return `mock-jwt-${user.id}-${Date.now()}`
}

// 模拟登录接口
export const mockLogin = (username: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.username === username && u.password === password)
      if (user) {
        const token = generateToken(user)
        resolve({
          code: 200,
          data: {
            token,
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              avatar: user.avatar
            }
          },
          message: '登录成功'
        })
      } else {
        reject({
          code: 401,
          message: '用户名或密码错误'
        })
      }
    }, 500) // 模拟网络延迟
  })
}

// 模拟获取用户信息接口
export const mockGetUserInfo = (token: string): Promise<{ code: number; data: UserInfo }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token.startsWith('mock-jwt-')) {
        const userId = parseInt(token.split('-')[2])
        const user = users.find(u => u.id === userId)
        if (user) {
          resolve({
            code: 200,
            data: {
              id: user.id,
              username: user.username,
              name: user.name,
              avatar: user.avatar
            }
          })
        } else {
          reject({
            code: 401,
            message: '用户不存在'
          })
        }
      } else {
        reject({
          code: 401,
          message: '无效的token'
        })
      }
    }, 300)
  })
} 