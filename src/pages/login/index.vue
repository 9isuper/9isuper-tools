<template>
  <view class="login-container">
    <view class="login-box">
      <view class="title">
        <text class="tech-text">9iSuper</text>
        <text class="subtitle">科技改变生活</text>
      </view>
      
      <view class="input-group">
        <view class="input-item">
          <text class="icon">👤</text>
          <input 
            type="text" 
            v-model="username" 
            placeholder="请输入用户名"
            class="tech-input"
          />
        </view>
        <view class="input-item">
          <text class="icon">🔒</text>
          <input 
            type="password" 
            v-model="password" 
            placeholder="请输入密码"
            class="tech-input"
          />
        </view>
      </view>

      <button 
        class="login-btn" 
        :class="{ 'loading': loading }"
        @tap="handleLogin"
        :disabled="loading"
      >
        {{ loading ? '登录中...' : '登 录' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { useUserStore } from '../../stores/user'

const username = ref('')
const password = ref('')
const loading = ref(false)
const userStore = useUserStore()

const handleLogin = async () => {
  if (!username.value || !password.value) {
    Taro.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    })
    return
  }

  loading.value = true
  try {
    await userStore.login(username.value, password.value)
    Taro.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    // 获取来源页面
    const pages = Taro.getCurrentPages()
    const prevPage = pages[pages.length - 2]
    
    if (prevPage && prevPage.route === 'pages/checkin/index') {
      // 如果是从打卡页面跳转来的，返回打卡页面
      Taro.navigateBack()
    } else {
      // 否则跳转到首页
      Taro.switchTab({
        url: '/pages/index/index'
      })
    }
  } catch (error: any) {
    Taro.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

@keyframes subtle-pulse {
  0% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.3); }
  70% { box-shadow: 0 0 0 6px rgba(46, 125, 50, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
}

@keyframes subtle-glow {
  0% { box-shadow: 0 0 2px rgba(46, 125, 50, 0.3); }
  50% { box-shadow: 0 0 5px rgba(46, 125, 50, 0.5); }
  100% { box-shadow: 0 0 2px rgba(46, 125, 50, 0.3); }
}

.login-container {
  min-height: 100vh;
  background: linear-gradient(-45deg, #1b5e20, #2e7d32, #388e3c, #43a047);
  background-size: 400% 400%;
  animation: gradient 20s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.3;
    z-index: 1;
  }

  .login-box {
    width: 100%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.8);
    position: relative;
    z-index: 2;
    animation: float 8s ease-in-out infinite;

    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #2e7d32, #66bb6a, #81c784, #2e7d32);
      background-size: 400% 400%;
      z-index: -1;
      filter: blur(5px);
      animation: gradient 20s ease infinite;
      border-radius: 22px;
      opacity: 0.6;
    }

    .title {
      text-align: center;
      margin-bottom: 40px;

      .tech-text {
        font-size: 38px;
        font-weight: bold;
        background: linear-gradient(45deg, #1b5e20, #2e7d32);
        -webkit-background-clip: text;
        color: transparent;
        display: block;
        text-shadow: none;
        letter-spacing: 1px;
      }

      .subtitle {
        font-size: 16px;
        color: #2e7d32;
        margin-top: 10px;
        display: block;
        letter-spacing: 2px;
      }
    }

    .input-group {
      .input-item {
        display: flex;
        align-items: center;
        background: rgba(46, 125, 50, 0.1);
        border-radius: 14px;
        margin-bottom: 24px;
        padding: 0 20px;
        border: 1.5px solid rgba(46, 125, 50, 0.2);
        height: 70px;
        transition: all 0.3s ease;
        animation: subtle-glow 3s infinite alternate;

        &:focus-within {
          transform: translateY(-2px);
          border-color: #2e7d32;
          background: rgba(46, 125, 50, 0.15);
        }

        .icon {
          margin-right: 14px;
          font-size: 22px;
          color: #2e7d32;
        }

        .tech-input {
          flex: 1;
          height: 50px;
          color: #1b5e20;
          font-size: 22px;
          background: transparent;
          border: none;
          outline: none;
          padding: 0 4px;
          line-height: 50px;
          box-sizing: border-box;
          
          &::placeholder {
            color: rgba(46, 125, 50, 0.5);
          }
        }
      }
    }

    .login-btn {
      width: 100%;
      height: 56px;
      background: linear-gradient(45deg, #1b5e20, #2e7d32);
      border-radius: 14px;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      border: none;
      margin-top: 30px;
      position: relative;
      overflow: hidden;
      letter-spacing: 2px;
      text-shadow: none;
      animation: subtle-pulse 3s infinite;
      transition: all 0.3s ease;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transition: 0.5s;
      }

      &:active {
        transform: scale(0.98);
        background: linear-gradient(45deg, #3d6599, #5d9ecc);
      }

      &:active::after {
        left: 100%;
      }

      &.loading {
        opacity: 0.8;
        &::after {
          display: none;
        }
      }
    }
  }
}
</style> 