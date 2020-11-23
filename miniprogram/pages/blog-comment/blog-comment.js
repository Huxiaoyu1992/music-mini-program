// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    blogId: '',
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId: options.id
    })
    this._getDetail()
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
  onShareAppMessage: function (event) {
    const obj = this.data.blog
    return {
      title: obj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${obj._id}`
    }
  },
  /**
   * 查询评论详情
   * @param {*} blogId 
   */
  _getDetail() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'detail',
        blogId: this.data.blogId
      }
    }).then(res => {
      wx.hideLoading()
      let commentList = res.result.commentList.data
      for (let i = 0; i<commentList.length; i++) {
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }
      this.setData({
        commentList,
        blog: res.result.detail[0]
      })
    })
  }
})