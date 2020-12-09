// components/nav-bar/index.js
const app = getApp()
Component({
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log(this.data)
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight || 60, //导航栏高度
    menuRight: app.globalData.menuRight, // 胶囊距右方间距（方保持左、右间距一致）
    menuBotton: app.globalData.menuBotton,
    menuHeight: app.globalData.menuHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
