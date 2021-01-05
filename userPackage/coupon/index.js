// userPackage/coupon/index.js
import { getCouponList } from '../../api/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      name: '未使用',
      id: 0
    },{
      name: '已使用',
      id: 1
    }],
    list: [],
    page: 1,
    total: 1,
    triggered: false,
    loading: true
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
  onShow: async function () {
    setTimeout(() => {
      this.setData({
        loading: false
      })
    }, 1000)
    this.getCouponList()
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
    await this.getList()
    this._freshing = false
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },

  async changeTabs(e) {
    const { index } = e.detail
    this.setData({
      list: [],
      page: 1,
      loading: true
    })

    this.getCouponList(index)
  },

  async getCouponList(status=0) {
    let res = await getCouponList({
      status: status
    })
    if(!res.code) {
      if(res.data.length) {
        res.data.map(e => {
          e.value = parseInt(e.value)
          e.rule_money = parseInt(e.rule_money)
        })
      }

      this.setData({
        list: res.data
      })
    }
    // console.log(res)
  }
})