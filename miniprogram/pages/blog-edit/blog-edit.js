// pages/blog-edit/blog-edit.js
const MAX_IPT_NUM = 200
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    footerBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onInput(event) {
    let val = event.detail.value.length
    if(MAX_IPT_NUM < val.length) {
      val = `最大字数为${MAX_IPT_NUM}`
    }
    this.setData({
      num: val
    })
  },

  onfocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onblur() {
    this.setData({
      footerBottom: 0
    })
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

  }
})