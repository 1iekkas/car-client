// userPackage/citySearch/index.js
import city from '../../utils/city'
import {
  getGeocoder,
  reverseGeocoder
} from '../../api/wxServer'
const app = getApp()
let data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    city: [],
    keys: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
    let keys = city.map(e => e.title)
    this.setData({
      city: city,
      keys: keys,
      from: options.from || '',
      loading: false,
      location: app.globalData.location
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

  select(e) {
    const {
      item
    } = e.currentTarget.dataset;
    if (data.from == 'map') {
      wx.showModal({
        content: `当前定位${data.location.address_component.city},是否切换为${item.name}?`,
        complete: async res => {
          if (res.confirm) {
            this.getGeocoder(item)
          }
        }
      })
    } else {
      wx.setStorageSync('city', item)
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  // 解析坐标
  async getGeocoder(item) {
    let res = await getGeocoder({
      address: item.name
    })
    if (res.status == 0) {
      this.reverseGeocoder(res.result.location)
    } else {
      wx.showToast({
        title: '很抱歉，位置未能成功切换',
      })
    }
  },

  // 坐标转换详细地址
  async reverseGeocoder(location) {
    console.log(data.location)
    let res = await reverseGeocoder({
      location: {
        latitude: location.lat,
        longitude: location.lng
      }
    })

    if(!res.status) {
      app.globalData.location = res.result

      wx.navigateBack({
        delta: 1,
      })
    }else {
      wx.showToast({
        title: '很抱歉，位置未能成功切换',
      })
    }
  }
})