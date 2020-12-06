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
    list: [],
    page: 1,
    total: 1,
    triggered: false,
    loading: true,
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
    const location = app.globalData.location;
    this.setData({
      location: location
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

  async onRefresh() {
    console.log(123)
    if (this._freshing || data.loading) return
    this.setData({
      page: 1,
      triggered: true
    })
    this._freshing = true
    await this.getStoreList()
    this._freshing = false
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
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
        list: list,
        triggered: false,
        loading: false,
        total: res.data.last_page
      })
    }
  },

  // 分页加载
  lower() {
    if(this.loading || data.page > data.total) return false
    this.loading = true
    this.setData({
      loading: true
    },() => {
      this.getStoreList()
    })
  },

  // 跳转切换城市
  linkToCitySearch() {
    wx.navigateTo({
      url: '/userPackage/citySearch/index',
    })
  },

  linkToStore() {
    wx.navigateTo({
      url: '/storePackage/store/index',
    })
  }
})