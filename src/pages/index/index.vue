<template>
  <view class="home-container">
    <view class="header">
      <view class="welcome">
        <text class="greeting">你好，{{ username }}</text>
        <text class="date">{{ currentDate }}</text>
      </view>
      <view class="avatar">
        <image src="/assets/avatar.svg" mode="aspectFit" class="avatar-icon" />
      </view>
    </view>

    <view class="dashboard">
      <view class="card">
        <view class="card-title">
          <text class="icon">📊</text>
          <text>数据概览</text>
        </view>
        <view class="stats">
          <view class="stat-item">
            <text class="number">28</text>
            <text class="label">连续打卡</text>
          </view>
          <view class="stat-item">
            <text class="number">96%</text>
            <text class="label">完成率</text>
          </view>
          <view class="stat-item">
            <text class="number">12</text>
            <text class="label">本月任务</text>
          </view>
        </view>
      </view>

      <view class="quick-actions">
        <view class="action-item" @tap="navigateToCheckin">
          <text class="icon">✅</text>
          <text>打卡签到</text>
        </view>
        <view class="action-item">
          <text class="icon">📝</text>
          <text>任务列表</text>
        </view>
        <view class="action-item">
          <text class="icon">📈</text>
          <text>数据统计</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'

const username = ref('用户')
const currentDate = ref('')

onMounted(() => {
  const date = new Date()
  currentDate.value = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

const navigateToCheckin = () => {
  Taro.navigateTo({
    url: '/pages/checkin/index'
  })
}
</script>

<style lang="scss">
.home-container {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .welcome {
      .greeting {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        display: block;
      }

      .date {
        font-size: 14px;
        color: #666;
        margin-top: 5px;
        display: block;
      }
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      overflow: hidden;
      border: 2px solid #4facfe;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;

      .avatar-icon {
        width: 100%;
        height: 100%;
      }
    }
  }

  .dashboard {
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      .card-title {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #333;

        .icon {
          margin-right: 10px;
        }
      }

      .stats {
        display: flex;
        justify-content: space-around;

        .stat-item {
          text-align: center;

          .number {
            font-size: 24px;
            font-weight: bold;
            color: #4facfe;
            display: block;
          }

          .label {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
        }
      }
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;

      .action-item {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s;

        &:active {
          transform: scale(0.95);
        }

        .icon {
          font-size: 24px;
          display: block;
          margin-bottom: 8px;
        }

        text {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
</style>
