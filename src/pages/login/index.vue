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

      <button class="login-btn" @tap="handleLogin">登 录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const username = ref('')
const password = ref('')

const handleLogin = () => {
  // TODO: 实现登录逻辑
  Taro.showToast({
    title: '登录成功',
    icon: 'success'
  })
  Taro.switchTab({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  .login-box {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);

    .title {
      text-align: center;
      margin-bottom: 40px;

      .tech-text {
        font-size: 36px;
        font-weight: bold;
        background: linear-gradient(45deg, #00f2fe, #4facfe);
        -webkit-background-clip: text;
        color: transparent;
        display: block;
      }

      .subtitle {
        font-size: 16px;
        color: #888;
        margin-top: 10px;
        display: block;
      }
    }

    .input-group {
      .input-item {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        margin-bottom: 20px;
        padding: 0 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);

        .icon {
          margin-right: 10px;
          font-size: 20px;
        }

        .tech-input {
          flex: 1;
          height: 50px;
          color: #fff;
          font-size: 16px;
        }
      }
    }

    .login-btn {
      width: 100%;
      height: 50px;
      background: linear-gradient(45deg, #00f2fe, #4facfe);
      border-radius: 12px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      border: none;
      margin-top: 30px;
      position: relative;
      overflow: hidden;

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

      &:active::after {
        left: 100%;
      }
    }
  }
}
</style> 