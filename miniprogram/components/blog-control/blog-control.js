// components/blog-control/blog-control.js
let userInfo = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  externalClasses: [
    'iconfont', 'icon-pinglun', 'icon-fenxiang'
  ],

  /**
   * 组件的初始数据
   */
  data: {
    authShow: false,
    commentShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断是否授权
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            wx.getUserInfo({
              success: result => {
                userInfo = result.userInfo
                // 显示评论的弹出层
                this.setData({
                  commentShow: true
                })
              }
            })
          } else {
            this.setData({
              authShow: true
            })
          }
        }
      })
    },
    loginSuccess(data) {
      userInfo = data.detail
      // 授权框消失，评论框显示
      this.setData({
        authShow: false
      }, () => {
        this.setData({
          commentShow: true
        })
      })
    },
    loginReject() {}
  }
})
