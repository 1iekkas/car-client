// userPackage/login/index.js
import { getPhone } from '../../api/user'
const app = getApp()
let data
import {
  login
} from '../../api/wxServer.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 获取用户电话
   */
  getphonenumber(e) {
    console.log(e)
  },

  /**
   * 获取用户信息
   */
  async getUserInfo(e) {

    if (e.detail.errMsg == 'getUserInfo:ok') {
      let res = await login()
      if (res.code && res.code == 200) {
        this.getUserToken(res.value, e.detail)
        // app.globalData.userInfo =e.detail.userInfo
      }
      // do something
    }
  },

  async getUserToken(code, userInfo) {
    const body = {
      iv: userInfo.iv,
      encryptedData: userInfo.encryptedData,
      sex: userInfo.userInfo.gender,
      nickname: userInfo.userInfo.nickName,
      province: userInfo.userInfo.province,
      city: userInfo.userInfo.city,
      country: userInfo.userInfo.country,
      head: userInfo.userInfo.avatarUrl
    }

    let res = await app.$api.post(`/u/login/${code}`, body)
    // console.log(res)
    wx.setStorageSync('token', res.data.token)
    wx.setStorageSync('refresh_token', res.data.refresh_token)
    app.globalData.userInfo = userInfo.userInfo
    app.globalData.isLogin = true
    wx.navigateBack({
      delta: 1
    })
  },

  // 获取手机号
  async getphonenumber(e) {
    console.log(e)
    if(e.detail && e.detail.errMsg == "getPhoneNumber:ok") {
      let data = e.detail
      delete data.errMsg
      let res = await getPhone(data)
      console.log(res)
    }
  },

  getSms() {
    console.log(123)
  }
})