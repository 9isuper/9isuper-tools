import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/user'
import './app.scss'

const pinia = createPinia()

const App = createApp({
  onLaunch() {
    // 检查登录状态
    const userStore = useUserStore()
    userStore.checkLogin()
  },
  onShow (options) {
    console.log('App onShow.')
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

// 在创建应用后使用 pinia
App.use(pinia)

export default App
