// components/index-campaign/index.js
Component({
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
     this.setData({
       show: true
     })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickHide() {
      this.setData({
        show: false
      })
    }
  }
})
