import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import { mockLogin, mockGetUserInfo } from '../mock'

// 使用 defineStore 时添加类型定义
interface UserInfo {
  id: number
  username: string
  name: string
  avatar: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => !!token.value)

  // 登录
  const login = async (username: string, password: string) => {
    try {
      const res: any = await mockLogin(username, password)
      token.value = res.data.token
      userInfo.value = res.data.user
      isLoggedIn.value = true
      
      // 保存登录状态
      Taro.setStorageSync('token', res.data.token)
      Taro.setStorageSync('userInfo', res.data.user)
      
      return res
    } catch (error: any) {
      throw error
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('userInfo')
  }

  // 检查登录状态
  const checkLogin = async () => {
    const storedToken = Taro.getStorageSync('token')
    if (storedToken) {
      try {
        const res: any = await mockGetUserInfo(storedToken)
        token.value = storedToken
        userInfo.value = res.data
        isLoggedIn.value = true
        return true
      } catch (error) {
        logout()
        return false
      }
    }
    return false
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    checkLogin
  }
}) 