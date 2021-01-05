// activityPackage/coupon/index.js
import { getCoupon } from '../../api/user'
const app = getApp()
let data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG_HOST: app.globalData.IMG_HOST,
    coupon: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
    // 用户token回调
    app.userTokenReadyCallback = res => {
      // console.log(res)
      this.setData({
        hasToken: res,
        isLogin: res
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
    return {
      title: '嗨,元旦快乐!快来领取优惠券',
      path: `/activityPackage/coupon/index`,
      imageUrl: `${data.IMG_HOST}/storage/coupon_bg.jpg`
    }
  },

  //
  async onClickCoupon() {
    if(!app.globalData.isLogin) {
      wx.navigateTo({
        url: `/userPackage/login/index`,
      })
      return false
    }
    // console.log(getCoupon)
    let res = await getCoupon({})

    if(!res.code) {
      wx.showModal({
        content: '领取成功'
      })

      res.data.value = parseInt(res.data.value)

      this.setData({
        coupon: res.data
      })
    }
  },

  onUseCoupon() {
    wx.redirectTo({
      url: `/servicePackage/create/index`,
    })
  },
})