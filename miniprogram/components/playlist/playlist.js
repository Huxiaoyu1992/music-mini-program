// components/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },

  /**
   * 监听器： 支持监听属性或内部数据的变化，可以同时监听多个，一次setData最多触发每个监听器一次。
   */
  observers: {
    // 监听数组里对象的属性
   ['playlist.playCount'](count) {
     // 数据监听器里更改它本身的时候，容易导致死循环, 可以在data里进行赋值
     this.setData({
       _count: this._transNumber(count, 2)
     })
   } 
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: 0 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _transNumber(num, point) {
      const numStr = num.toString().split('.')[0]
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        const decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        const result = parseInt(num / 10000) + '.' + decimal + '万'
        return result
      } else if (numStr.length > 8) {
        const decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        const result = parseInt(num / 100000000) + '.' + decimal + '亿'
        return result
      }
    },
    // 获取歌曲列表详情信息
    getMusiclist: function () {
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`
      })
    } 
  }
})
