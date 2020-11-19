// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  }
})