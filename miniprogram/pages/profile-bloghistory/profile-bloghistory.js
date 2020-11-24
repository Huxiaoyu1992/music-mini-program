// pages/profile-bloghistory/profile-bloghistory.js
const MAX_LIMIT = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyBlog()
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
    this.setData({
      list: []
    })
    this.getMyBlog()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMyBlog()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const obj = event.target.dataset
    return {
      title: obj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${obj._id}`
    }
  },
  getMyBlog() {
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'getList',
        start: this.data.list.length,
        count: MAX_LIMIT
      }
    }).then(res => {
      this.setData({
        list: this.data.list.concat(res.result)
      })
      wx.hideLoading()
    })
  },
  goComment(event) {
    const id = event.target.dataset.id
    wx.navigateTo({
      url: `../blog-comment/blog-comment?id=${id}`,
    })
  }
})