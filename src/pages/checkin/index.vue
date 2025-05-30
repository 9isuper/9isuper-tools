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
          <view class="location-container">
            <view class="location-info" v-show="currentLocation && !isManualLocation">
              <text class="location-icon">📍</text>
              <text class="location-text">{{ currentLocation }}</text>
            </view>
  
            <view class="manual-location" v-if="isManualLocation">
              <input
                type="text"
                class="location-input"
                v-model="manualLocationInput"
                placeholder="请输入您的位置"
              />
              <button class="confirm-btn" @tap="setManualLocation">确认位置</button>
            </view>
  
            <view class="location-actions" v-if="!isManualLocation">
              <text class="switch-manual" @tap="isManualLocation = true">
                手动输入位置
              </text>
            </view>
          </view>

          <style lang="scss">
          .location-container {
            margin-top: 10px;
  
            .location-info {
              display: flex;
              align-items: center;
              padding: 8px;
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
    
              .location-icon {
                margin-right: 8px;
                font-size: 16px;
              }
    
              .location-text {
                font-size: 14px;
                color: #666;
              }
            }
  
            .manual-location {
              margin-top: 10px;
    
              .location-input {
                width: 100%;
                height: 36px;
                padding: 0 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                margin-bottom: 10px;
              }
    
              .confirm-btn {
                width: 100%;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background-color: #007AFF;
                color: #fff;
                border-radius: 4px;
                font-size: 14px;
              }
            }
  
            .location-actions {
              margin-top: 8px;
              text-align: right;
    
              .switch-manual {
                font-size: 12px;
                color: #007AFF;
                text-decoration: underline;
              }
            }
          }
          </style>
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
const currentLocation = ref('')

// 位置相关状态
const isManualLocation = ref(false)
const manualLocationInput = ref('')

// 获取地理位置
const getLocation = async () => {
  try {
    console.log('开始获取位置...')
    currentLocation.value = '正在获取位置...'

    // 检查是否在HTTPS环境或localhost
    const isSecureOrigin = window.location.protocol === 'https:' || 
                          window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1'
    
    if (!isSecureOrigin) {
      console.warn('非安全环境，地理位置API可能不可用')
      // 在非安全环境下，直接切换到手动输入模式
      isManualLocation.value = true
      currentLocation.value = '请手动输入位置（非HTTPS环境无法自动获取位置）'
      return
    }

    // 使用Web Geolocation API
    if (!navigator.geolocation) {
      throw new Error('浏览器不支持地理位置功能')
    }

    // 获取位置信息
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    })

    console.log('位置信息:', position)
    const { latitude, longitude } = position.coords
    
    // 先设置经纬度作为基础位置信息
    currentLocation.value = `位置: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

    // 使用腾讯地图API获取详细地址
    console.log('开始获取详细地址...')
    try {
      const response = await fetch(
        `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=XZUBZ-J2V65-AKOIL-IOXTP-GMQT6-5OF3H`
      )
      const data = await response.json()
      
      console.log('腾讯地图API响应:', data)

      if (data && data.status === 0) {
        currentLocation.value = data.result.address
        console.log('详细地址:', currentLocation.value)
      } else {
        console.warn('逆地理编码失败:', data)
      }
    } catch (error) {
      console.error('获取详细地址失败:', error)
    }
  } catch (error) {
    console.error('获取位置过程中出错:', error)
    
    // 检查错误类型
    if (error.code === 1) {
      // 权限被拒绝
      currentLocation.value = '位置权限被拒绝，请允许浏览器获取位置或手动输入'
    } else if (error.code === 2) {
      // 位置不可用
      currentLocation.value = '无法获取位置信息，请检查GPS是否开启或手动输入'
    } else if (error.code === 3) {
      // 超时
      currentLocation.value = '获取位置超时，请重试或手动输入'
    } else {
      // 其他错误
      currentLocation.value = '无法获取位置，请检查定位是否开启或手动输入'
    }
    
    // 显示手动输入选项
    isManualLocation.value = true
    
    Taro.showToast({
      title: '获取位置失败',
      icon: 'none',
      duration: 2000
    })
  }
}

// 手动设置位置
const setManualLocation = () => {
  if (manualLocationInput.value.trim()) {
    currentLocation.value = manualLocationInput.value.trim()
    isManualLocation.value = false
    Taro.showToast({
      title: '位置已更新',
      icon: 'success',
      duration: 2000
    })
  } else {
    Taro.showToast({
      title: '请输入位置',
      icon: 'none',
      duration: 2000
    })
  }
}

// 模拟日历数据
const calendarDays = ref(Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  date: `${currentYear.value}-${currentMonth.value}-${i + 1}`,
  checked: Math.random() > 0.5,
  isToday: i + 1 === new Date().getDate()
})))

const handleCheckin = async () => {
  if (hasCheckedIn.value) return

  // 获取地理位置
  await getLocation()

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
    return
  }
  
  // 页面加载时就尝试获取位置
  console.log('页面加载完成，开始获取位置')
  await getLocation()
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

        .location-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 8px;

          .location-icon {
            font-size: 16px;
          }

          .location-text {
            font-size: 14px;
            color: #666;
            flex: 1;
            word-break: break-all;
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