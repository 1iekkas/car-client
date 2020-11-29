// userPackage/user/index.js
import { getCarList, deleteCar, setDefaultCar } from '../../api/user'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
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

    console.log(app.$api)
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

  delCar(e) {
    const { id } = e.currentTarget.dataset;
    Dialog.confirm({
      title: '删除车辆',
      message: '是否确认删除该车辆',
      cancelButtonText: '取消'
    })
    .then(async () => {
      // on confirm
      let res = await deleteCar({id: id}) 

      if (!res.code) {
        wx.showToast({
          title: '已删除车辆',
        })
        this.getCarList()
      }

    })
    .catch(() => {
      // on cancel
    }); 
  },

  // 设为默认
  async setCar(e) {
    const { id } = e.currentTarget.dataset;
    let res = await setDefaultCar({id: id})
    
    if(!res.code) {
      wx.showToast({
        title: '已设为默认',
      })
      this.getCarList()
    }

  }, 

  // 
  linkEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/userPackage/carInfo/index?id=${id}`,
    })
  }
})