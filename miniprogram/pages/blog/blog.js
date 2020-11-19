// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBloglist()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 发布按钮
   */
  publish() {
    // 先判断是否授权过
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: result => {
              this.loginSuccess({
                detail: result.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },
  /**
   * 授权成功
   * @param {*} event 
   */
  loginSuccess(event) {
    const userInfo = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`
    })
  },
  /**
   * 授权失败
   */
  loginReject() {
    wx.showModal({
      title: '授权的用户才能发布博客'
    })
  },
  _loadBloglist() {
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'list',
        start: 0,
        count: 10
      }
    }).then(res => {
      this.setData({
        list: this.data.list.concat(res.result)
      })
    })
  }
})