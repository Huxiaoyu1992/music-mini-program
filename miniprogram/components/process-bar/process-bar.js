// components/process-bar/process-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDistance: 0,
    percent: 0
  },

  lifetimes: {
    ready () {
      // 组件布局完成之后
      this._getMovableDistance()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取元素的宽度
     */
    _getMovableDistance () {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width

      })
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
      })
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
      })
      // 音频加载中
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      // 进入可以播放状态
      backgroundAudioManager.onCanplay(() => {
        if (backgroundAudioManager.duration === undefined) {
          setTimeout(() => {
            this.setData({
              ['showTime.totalTime']: `${this._setTime().min}:${this._setTime().second}`
            })
          }, 1000)
        } else {
          this.setData({
            ['showTime.totalTime']: `${this._setTime().min}:${this._setTime().second}`
          })
        }        
      })
      // 监听音乐播放进度：只在前台执行
      backgroundAudioManager.onTimeUpdate(() => {
        const ct = backgroundAudioManager.currentTime
        const duration = backgroundAudioManager.duration
        // 一秒执行一次进度条的更新
        if (ct.toString.split('.')[0] != currentSec) {
          const ctFormat = this._dateFormatter(ct)
          this.setData({
            movableDistance: (movableAreaWidth - movableViewWidth) * ct / duration,
            percent: ct / duration * 100,
            ['showTime.currentTime']: `${ctFormat.min}:${ctFormat.second}`
          })
          currentSec = ct.toString.split('.')[0]
        }
      })
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
      })

      backgroundAudioManager.onError((res) => {
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },
    _setTime() {
      const duration = backgroundAudioManager.duration
      const dura = this._dateFormatter(duration)
      return dura
    },
    _dateFormatter(sec) {
      const min = Math.floor(sec / 60)
      const second = Math.floor(sec % 60)
      return { min : this._parse0(min), second: this._parse0(second) }
    },
    // 补零
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})
