// pages/user/index.js
const app = getApp()
import { login } from '../../api/wxServer'
import { getOrderCount } from '../../api/order'
import { getCarList } from '../../api/user'
let data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    isLogin: false,
    userInfo: null,
    hasUserInfo: false,
    carCount: 0,
    tabs: [{
      id: '0',
      name: '报价中'
    }, {
      id: '1,2',
      name: '待维修'
    }, {
      id: '3',
      name: '待交付'
    }, {
      id: '4',
      name: '已完成'
    }, {
      id: '5,6,7,8',
      name: '已取消'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 用户信息回调
    app.userInfoReadyCallback = res => {
      //console.log(`userInfo:${JSON.stringify(res)}`)
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
    
    // 用户token回调
    app.userTokenReadyCallback = res => {
      this.setData({
        hasToken: res,
        isLogin: true
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    data = this.data
    if(app.globalData.isLogin && !this.data.userInfo) {
      this.setData({
        isLogin: true,
        userInfo: app.globalData.userInfo
      })

      // 车辆统计
      getCarList().then(res => {
        this.setData({
          carCount: res.data.length
        })
      })

      // 订单统计
      getOrderCount().then(res => {
        data.tabs.map(tab => {
          tab.count = (res.data.filter(e => tab.id.includes(e.status)))[0]
        })
        console.log(data.tabs)
      })

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  /* onShareAppMessage: function () {

  }, */
  
  // 获取用户信息
  getUserInfo: async function(e) {  
    if(e.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.userInfo = e.detail.userInfo
      let res = await login()
      // do something
      wx.setStorageSync('token', 'token')
    }else {
      return false
    }
  },
  
  // 跳转订单
  orderLink(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:`/userPackage/order/index?status=${id}`
    })
  },

  linkLogin() {
    wx.navigateTo({
      url: '/userPackage/login/index',
    })
  }
})