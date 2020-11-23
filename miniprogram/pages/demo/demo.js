// miniprogram/pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 在已授权的情况下才能使用
    wx.getUserInfo({
      success: res => {
        console.log(res)
      }
    })
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
  getMusicInfo: function () {
    wx.cloud.callFunction({
      name: 'tcbRouter',
      data: {
        $url: 'music' // 如果使用tcbRouter的方式 ，必须加上这个参数$url指向对应的router
      }
    }).then(res => {
      console.log(res)
    })
  },
  getMovieInfo: function() {
    wx.cloud.callFunction({
      name: 'tcbRouter',
      data: {
        $url: 'movie' // 如果使用tcbRouter的方式 ，必须加上这个参数$url指向对应的router
      }
    }).then(res => {
      console.log(res)
    })
  },
  getOpenId() {
    wx.login({
      success: res => {
        let appid = ''
        let secret = ''
        if (res.code) {
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              
            }
          })
        }
      }
    })
  }
})