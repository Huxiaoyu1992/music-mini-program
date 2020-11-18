// components/lyric/lyric.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String
  },

  observers: { // 用于监听组件内properties和data的变化
    lyric(lrc) {
      this._parseLyric(lrc)
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    lyricList: [],
    curLyricLineIdx: 0, // 当前行歌词的索引
    scrollTop: 0,
    realW: 0
  },

  lifetimes: {
    ready() {
      // 在小程序里 所有设备的宽度都是750rpx
      wx.getSystemInfo({
        success: (result) => {
          const width = result.screenWidth
          const realW = (width / 750) * 64
          this.setData({ realW })
        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateTime(currentTime) {
      let lrclist = this.data.lyricList
      if (!lrclist.length) {
        return
      } else {
        for (let i = 0; i < lrclist.length; i++) {
          if (currentTime <= lrclist[i].time) {
            this.setData({
              curLyricLineIdx: i - 1,
              scrollTop: (i - 1) * this.data.realW 
            })
            break
          }
        }
      }
    },
    /**
     * 解析歌词
     * @param {*} str 
     */
    _parseLyric(lrcStr) {
      // 通过换行符对字符串进行分割
      let line =  lrcStr.split('\n')
      const list = []
      line.forEach((ele) => {
        let time = ele.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = ele.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/) //
          // 把时间格式转化为秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          list.push({
            lrc,
            time: time2Seconds
          })
        }
      })
      this.setData({
        lyricList: list
      })
    }
  }
})
