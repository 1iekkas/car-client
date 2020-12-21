// components/collect-tips/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    show: function(value) {
      // console.log(value)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    top: app.globalData.navBarHeight + 5
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        show: false
      })
    }
  }
})
