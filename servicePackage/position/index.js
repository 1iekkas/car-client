// servicePackage/position/index.js
import { getSuggestion } from '../../api/wxServer'
const app = getApp()
let data 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // map配置
    mapSetting: {
      subkey: "553BZ-MI4CW-LMXR5-OXN7Z-OMBVK-RPFMX",
      layerStyle: '1',
      scale: 16,
      circles: [],
      address: null
    },
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
    data = this.data
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.location)
    this.setData({
      address: {
        address: app.globalData.location.address,
        location: app.globalData.location.location
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 输入框键入
   */
  async onChange(e) {
    const keywords = e.detail,
      data = this.data;
    console.log(e)
    let res = await getSuggestion({
      keyword: keywords,
      region:'佛山' //data.location.address_component.city
    })

    console.log(res)
    if(res.status == 0) {
      this.setData({
        addressList: res.data
      })
    }
  },

  onClickAddress(e) {
    let address = e.currentTarget.dataset.item;
    
    this.setData({
      address: address
    })
  },

  back() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    console.log(prevPage)
    prevPage.setData({
      location: data.address,
    }, () => {
      console.log(prevPage.data)
      wx.navigateBack({
        delta: 1,
      })
    })
    
  }
})