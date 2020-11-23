// 在界面上不展示 ，只作为计算的数据，不放在data里。
let list = []
// 正在播放的歌曲的index
let nowPlayingIdx = 0
// 获取全局唯一的一个音频播放管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    musiclist: Array,
    isPlaying: false, // 是否正在播放
    isLyricShow: false,
    lyric: '',
    isSame: false
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
    // 判断是否为同一首歌曲
    if (musicId === app.getPlayingMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
     // 切换上下首歌 需要把当前首歌给停掉
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    wx.setNavigationBarTitle({
      title: music.name || '胡晓宇的音乐博客',
    })
    app.setPlayingMusicId(musicId)
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
      if (result.data[0].url == null) {
        wx.showToast({
          title: '当前无权播放'
        })
        return
      }
      if (!this.data.same) {
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
        
        // 存储播放历史
        this.savePlayHistory()
      }
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
  },
  /**
   * 播放一直更新时间，为了同步更新歌词，获取到当前时间，并传递到歌词组件内
   * @param {*} currentTime 
   */
  timeUpdate(event) {
    // 实现组件之间的传值
    this.selectComponent('.lyric').updateTime(event.detail.currentTime)
  },
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
    })
  },
  /**
   * 保存播放历史
   */
  savePlayHistory() {
    // 当前播放的歌曲
    const current = this.data.musiclist[nowPlayingIdx]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    // 判断是否已经存储当前歌曲
    let isExit = false
    for(let i = 0; i < history.length; i++) {
      if (history[i].id == current.id) {
        isExit = true
        break
      }
    }
    if (!isExit) {
      history.unshift(current)
      wx.setStorageSync(openid, history)
    }
  }
})