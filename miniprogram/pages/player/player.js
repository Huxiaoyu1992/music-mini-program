// 在界面上不展示 ，只作为计算的数据，不放在data里。
let list = []
// 正在播放的歌曲的index
let nowPlayingIdx = 0
// 获取全局唯一的一个音频播放管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false // 是否正在播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    list = wx.getStorageSync('musiclist')
    nowPlayingIdx = options.index
    this._loadMusicDetail(list[nowPlayingIdx], options.id)
  },
  _loadMusicDetail(music, musicId) {
    wx.setNavigationBarTitle({
      title: music.name || '胡晓宇的音乐博客',
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicUrl',
        musicId
      }
    }).then(res => {
      const result = res.result
      backgroundAudioManager.src = result.data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
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

  }
})