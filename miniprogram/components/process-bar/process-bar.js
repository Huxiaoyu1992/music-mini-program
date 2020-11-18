// components/process-bar/process-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1
let duration = 0 // 音乐总时长
let isMoving = false // 在拖拽进度条的时候，onChange事件的赋值和backgroundAudioManager的onTimeUpdate会冲突，需要设置一个锁

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
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
      if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        // 重新设置总时长
        this._setTime()
      }
      // 组件布局完成之后
      this._getMovableDistance()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // 只要在播放 就会触发change事件
      if (event.detail.source === 'touch') {
        // 判断是拖动产生的
        this.data.percent = event.detail.x / (movableAreaWidth - movableViewWidth) * 100 
        this.data.movableDistance = event.detail.x
        isMoving = true
      }
    },
    touchEnd() {
      const timeObj = this._dateFormatter(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        percent: this.data.percent,
        movableDistance: this.data.movableDistance,
        ['showTime.currentTime']: `${timeObj.min}:${timeObj.second}`
      })
      // 把音乐播放进度设置成当前拖动条的位置
      backgroundAudioManager.seek(duration * this.data.percent / 100)
      isMoving = false
    },
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
        isMoving = false
        this.triggerEvent('onPlay')
      })
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        this.triggerEvent('onPause')
      })
      // 音频加载中
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      // 进入可以播放状态
      backgroundAudioManager.onCanplay(() => {
        if (backgroundAudioManager.duration === undefined) {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        } else {
          this._setTime()
        }
      })
      // 监听音乐播放进度：只在前台执行
      backgroundAudioManager.onTimeUpdate(() => {
        if (!isMoving) {
          const ct = backgroundAudioManager.currentTime
          duration = backgroundAudioManager.duration
          // 一秒执行一次进度条的更新
          if (ct.toString().split('.')[0] != currentSec) {
            const ctFormat = this._dateFormatter(ct)
            this.setData({
              movableDistance: (movableAreaWidth - movableViewWidth) * ct / duration,
              percent: ct / duration * 100,
              ['showTime.currentTime']: `${ctFormat.min}:${ctFormat.second}`
            })
            currentSec = ct.toString().split('.')[0]
            // 联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime: ct
            })
          }
        }
      })
      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      })

      backgroundAudioManager.onError((res) => {
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },
    _setTime() {
      duration = backgroundAudioManager.duration
      const dura = this._dateFormatter(duration)
      this.setData({
        ['showTime.totalTime']: `${dura.min}:${dura.second}`
      })
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
