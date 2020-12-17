// servicePackage/searchOrder/index.js
const app = getApp()
let data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords: '',
    list: [],
    page: 1,
    total: 1,
    triggered: false,
    loading: true,
    IMG_HOST: app.globalData.IMG_HOST
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    setTimeout(() => {
      this.setData({
        loading: false
      })
    }, 1500)
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
    if (this._freshing || data.loading) return
    this.setData({
      page: 1,
      triggered: true
    })
    this._freshing = true
    // await this.getStoreList()
    setTimeout(() => {
      this._freshing = false
      this.setData({
        page: 1,
        triggered: false
      })
    }, 1000)
  },

  onRestore(e) {
    // console.log('onRestore:', e)
  },

  onAbort(e) {
    // console.log('onAbort', e)
  },

  onPulling(e) {

  },
})