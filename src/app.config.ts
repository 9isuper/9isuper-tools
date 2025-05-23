export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/index/index',
    'pages/checkin/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '9iSuper Tools',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#4facfe',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/home.svg',
        selectedIconPath: 'assets/home-active.svg'
      },
      {
        pagePath: 'pages/checkin/index',
        text: '打卡',
        iconPath: 'assets/checkin.svg',
        selectedIconPath: 'assets/checkin-active.svg'
      }
    ]
  }
})
