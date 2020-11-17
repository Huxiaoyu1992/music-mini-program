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
    musiclist: Array,
    isPlaying: false, // 是否正在播放
    isLyricShow: false,
    lyric: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    list = wx.getStorageSync('musiclist')
    this.setData({
      musiclist: list
    })
    nowPlayingIdx = options.index
    this._loadMusicDetail(list[nowPlayingIdx], options.id)
  },
  _loadMusicDetail(music, musicId) {
    // 切换上下首歌的时候 需要把当前首歌给停掉
    backgroundAudioManager.stop()
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
      // 请求歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'lyric',
          id: musicId
        }
      }).then(res => {
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if (lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  /**
   * 切换播放状态
   */
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  /**
   * 切换到上一首
   */
  onPrev() {
    const musiclist = this.data.musiclist
    nowPlayingIdx--
    if (nowPlayingIdx < 0) {
      nowPlayingIdx = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIdx], musiclist[nowPlayingIdx].id)
  },
  /**
   * 切换到下一首
   */
  onNext() {
    const musiclist = this.data.musiclist
    nowPlayingIdx ++
    if (nowPlayingIdx > musiclist.length - 1) {
      nowPlayingIdx = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIdx], musiclist[nowPlayingIdx].id)
  },
  /**
   * 切换歌词是否显示
   */
  toggleLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  }
})