//app.js-描述整体小程序
App({
  onLaunch: function () {
    if (!wx.cloud) { // 判断是否支持云开发和判断当前基础库版本，在详情-本地设置里可以找到
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-2gbl69plc73c58ea',
        traceUser: true, // 云开发访问过小程序的用户是否都被记录下来
      })
    }
    // 全局属性或方法的配置
    this.globalData = {}
  }
})
