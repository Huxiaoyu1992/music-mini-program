// pages/blog-edit/blog-edit.js
const IMG_LIMIT = 9
const MAX_IPT_NUM = 200
// 数据库初始化
const db = wx.cloud.database()
let content = ''
let userinfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    footerBottom: 0,
    imgs: [],
    selectphoto: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    userinfo = options
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
    content = event.detail.value
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
  onChoseImg() {
    // 还能再上传几张图片
    let max = IMG_LIMIT - this.data.imgs.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res)
        this.setData({
          imgs: this.data.imgs.concat(res.tempFilePaths)
        })
        max = IMG_LIMIT - this.data.imgs.length
        this.setData({
          selectphoto: max <= 0 ? false : true
        })
      }
    })
  },
  onDel(event) {
    this.data.imgs.splice(event.target.dataset.index, 1)
    this.setData({
      imgs: this.data.imgs
    })
    if (this.data.imgs.length === IMG_LIMIT - 1) {
      this.setData({
        selectphoto: true
      })
    }
  },
  previewImg(event) {
    // 这块的显示在IOS和Android上有不同的显示
    const current = this.data.imgs[event.target.dataset.itemsrc]
    wx.previewImage({
      urls: this.data.imgs,
      current
    })
  },
  send() {
    if (!content.trim()) {
      wx.showModal({
        title: '请输入内容'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true
    })
    let promiselist = []
    let fileids = []
    this.data.imgs.forEach(item => {
      let p = new Promise((resolve, reject) => {
        // 获取文件扩展名
        const suffix = /\.\w+$/.exec(item)[0]
        // 云存储一次只能上传一个文件
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: res => {
            // fileIds = fileIds.concat(res.fileID)
            fileids = fileids.concat(res.fileID)
            resolve()
          },
          fail: res => {
            reject()
          }
        })
      })
      promiselist.push(p)
    })
    // 云存储
    Promise.all(promiselist).then(res => {
      db.collection('blog').add({
        data: {
          content,
          img: fileids,
          ...userinfo,
          createTime: db.serverDate()

        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功'
        })
        // 返回发布列表页并刷新
        wx.navigateBack()
        // 刷新父界面
        const currentPage = getCurrentPages()
        console.log(currentPage) // 返回的是两个值的数组
        const prePage = currentPage[currentPage.length - 2]
        prePage.onPullDownRefresh()
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败'
        })
      })
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