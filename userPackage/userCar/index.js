// userPackage/user/index.js
import { getCarList } from '../../api/user'
const app = getApp()
let data 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, // 登录态
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
    this.setData({
      isLogin: app.globalData.isLogin
    })
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
    this.getCarList()
    this.setData({
      isLogin: app.globalData.isLogin
    })
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
   * 用户点击右上角分享, 不开启
   */
  /* onShareAppMessage: function () {

  }, */
  
  // 获取列表
  async getCarList() {
    let res = await getCarList()
    console.log(res.data)
    this.setData({
      list: res.data
    },() => {
      console.log(data.list)
    })
  },

  //
  addCar() {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '/userPackage/login/index'
      })
      
      return false
    }
    
    wx.navigateTo({
      url: '/userPackage/carList/index'
    })
  },

  // 
  linkEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/userPackage/carInfo/index?id=${id}`,
    })
  }
})