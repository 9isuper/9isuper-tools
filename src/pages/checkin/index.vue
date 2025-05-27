<template>
  <view class="checkin-container">
    <view class="checkin-card">
      <view class="calendar">
        <view class="month-header">
          <text class="month">{{ currentMonth }}月</text>
          <text class="year">{{ currentYear }}年</text>
        </view>
        <view class="days-grid">
          <view 
            v-for="day in calendarDays" 
            :key="day.date"
            :class="['day-item', { 
              'checked': day.checked,
              'today': day.isToday
            }]"
          >
            <text class="date">{{ day.day }}</text>
            <text class="dot" v-if="day.checked">•</text>
          </view>
        </view>
      </view>

      <view class="checkin-status">
        <view class="status-card">
          <text class="title">今日打卡状态</text>
          <view class="status-content">
            <text class="time">{{ checkinTime || '--:--' }}</text>
            <text class="status">{{ checkinStatus }}</text>
          </view>
        </view>
      </view>

      <button 
        class="checkin-btn" 
        :class="{ 'checked': hasCheckedIn }"
        @tap="handleCheckin"
      >
        {{ hasCheckedIn ? '已打卡' : '立即打卡' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useUserStore } from '../../stores/user'

// 添加组件名称
defineOptions({
  name: 'CheckinPage'
})

const userStore = useUserStore()

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const hasCheckedIn = ref(false)
const checkinTime = ref('')
const checkinStatus = ref('未打卡')

// 模拟日历数据
const calendarDays = ref(Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  date: `${currentYear.value}-${currentMonth.value}-${i + 1}`,
  checked: Math.random() > 0.5,
  isToday: i + 1 === new Date().getDate()
})))

const handleCheckin = () => {
  if (hasCheckedIn.value) return

  const now = new Date()
  checkinTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  hasCheckedIn.value = true
  checkinStatus.value = '已打卡'

  Taro.showToast({
    title: '打卡成功',
    icon: 'success'
  })
}

onMounted(async () => {
  const isLoggedIn = await userStore.checkLogin()
  if (!isLoggedIn) {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }
})
</script>

<style lang="scss">
.checkin-container {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 20px;

  .checkin-card {
    background: #fff;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .calendar {
      margin-bottom: 30px;

      .month-header {
        text-align: center;
        margin-bottom: 20px;

        .month {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-right: 10px;
        }

        .year {
          font-size: 16px;
          color: #666;
        }
      }

      .days-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;

        .day-item {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f8f9fa;
          position: relative;

          &.checked {
            background: #e6f7ff;
            border: 1px solid #4facfe;

            .dot {
              color: #4facfe;
              font-size: 20px;
              position: absolute;
              bottom: 2px;
            }
          }

          &.today {
            background: #4facfe;
            .date {
              color: #fff;
            }
          }

          .date {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }

    .checkin-status {
      margin-bottom: 30px;

      .status-card {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 20px;

        .title {
          font-size: 16px;
          color: #666;
          margin-bottom: 10px;
          display: block;
        }

        .status-content {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .time {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }

          .status {
            font-size: 16px;
            color: #4facfe;
          }
        }
      }
    }

    .checkin-btn {
      width: 100%;
      height: 50px;
      background: linear-gradient(45deg, #00f2fe, #4facfe);
      border-radius: 12px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      border: none;
      position: relative;
      overflow: hidden;

      &.checked {
        background: #ccc;
      }

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