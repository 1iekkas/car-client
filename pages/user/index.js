// pages/user/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      console.log(`userInfo:${JSON.stringify(res)}`)
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
    
    // 用户token回调
    app.userTokenReadyCallback = res => {
      this.setData({
        hasToken: res
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
  onShareAppMessage: function () {

  },
  
  // 获取用户信息
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  // 跳转订单
  orderLink(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:`/userPackage/order/index?id=${id}`
    })
  },
})