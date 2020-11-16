// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tracks: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect: function (e) {
      // target和currantTarget的区别：target指的是真正的事件源，此时点击的是name，事件源是name，currentTarget指的是当前绑定事件的元素，所以在这个地方，只有currentTarget上有值
      const ds = e.currentTarget.dataset
      this.setData({
        currentId: ds.musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?id=${ds.musicid}&&index=${ds.index}`
      })
    }
  }
})
