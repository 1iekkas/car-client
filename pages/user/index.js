// pages/user/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: null,
    hasUserInfo: false,
    tabs: ['已发布', '待维修', '待验收', '已完成', '已取消']
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
    if(app.globalData.isLogin && !this.data.userInfo) {
      this.setData({
        isLogin: true,
        userInfo: app.globalData.userInfo
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
      url:`/userPackage/order/index?id=${id}`
    })
  },
})