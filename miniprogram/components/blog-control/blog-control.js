// components/blog-control/blog-control.js
const db = wx.cloud.database()

let userInfo = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
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
  onShareAppMessage: function(event) {
    console.log(event)
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
    loginReject() {},
    onSend(event) {
      let formId = event.detail.formId
      let content = event.detail.value.content
      // 评论
      if (!content) {
        wx.showModal({
          title: '内容不能为空',
          content: ''
        })
        return
      }
      // 存储
      wx.showLoading({
        title: '评论中',
        mask: true
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功'
        })
        this.setData({
          commentShow: false,
          content: ''
        })
        // 父元素刷新
        this.triggerEvent('commentSuccess')
        // 云调用实现消息推送 -- todo: 微信推送消息的方式已经修改，不再支持模板信息推送，需要用户触发了订阅才能向其推送信息
        // wx.cloud.callFunction({
        //   name: 'sendMessage',
        //   data: {
        //     content,
        //     formId,
        //     blogId: this.properties.blogId
        //   }
        // }).then(res => {
        //   console.log(res)
        // })
      })
    }
  }
})
