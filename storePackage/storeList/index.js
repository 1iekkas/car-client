// servicePackage/storeList/index.js
import { getStoreList } from '../../api/store'
const app = getApp()
let data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterList: [{
      name: '综合排序'
    }, {
      name: '距离'
    }, {
      name: '评分'
    }],
    active: 0,
    value1: 0,
    value2: 'a',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
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

    this.getStoreList()
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
   * 
   */
  async getStoreList() {
    let list = data.list
    let res = await getStoreList({
      type: 2,
      page_size: 10
    })
    if(!res.code) {
      // console.log(res)
      list = list.concat(res.data.data)
      this.setData({
        list: list
      })
    }
  }
})