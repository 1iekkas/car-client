// userPackage/mapSearch/index.js
import { getSuggestion } from '../../api/wxServer'
const app = getApp()
let data 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: null,
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // 定位回调
    app.locationReadyCallback = res => {
      let markers = this.data.markers
      this.setData({
        location: res,
        map: wx.createMapContext('map', this),
      }, () => {
        //console.log(this.data.markers)
        this.data.map.getCenterLocation({
          success: res => {
            console.log(res)
          }
        })
      })

    }

    data = this.data

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
    const location = app.globalData.location;
    this.setData({
      location: location
    })
    //console.log(this.data.location)
    
    
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
    let res = await getSuggestion({
      keyword: keywords,
      region: data.location.address_component.city
    })

    if(res.status == 0) {
      this.setData({
        addressList: res.data
      })
    }
  },

  onClickAddress(e) {
    
    let address = e.currentTarget.dataset.item;
    // 深复制
    let result = JSON.parse(JSON.stringify(data.location))
    result.formatted_addresses.recommend = address.title
    result.id = address.id
    Object.keys(address).map(e => {
      result[e] = address[e]
    })
    wx.setStorageSync('location', result)
    wx.navigateBack({
      delta: 1
    })
  },
})