// userPackage/carInfoList/index.js
const app = getApp()
const api = app.$api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seriesId: null, // 车系
    carYearList: [], //年份
    activeYear: 0,
    activeYearItem: null,
    carList: [], // 车型列表
    activeCar: 0,
    activeCarItem: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const series = options.series ? JSON.parse(options.series) : null
    this.setData({
      series: series
    }, () => {
      this.getCarYear()
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
  
  // 获取车型年份
  async getCarYear() {
    let res = await api.get('https://tool.bitefu.net/car/', {
      type: 'infoyear',
      from: 0,
      series_id: this.data.series.id,
      pagesize: 50
    })
    console.log(res)
    if(res.statusCode == 200) {  
      this.setData({
        carYearList: res.data.info
      })
    }
    
  },
  
  // 获取车型
  async getCarList() {
    let res = await api.get('https://tool.bitefu.net/car/', {
      type: 'info',
      from: 0,
      series_id: this.data.series.id,
      year: this.data.activeYearItem,
      pagesize: 300
    })
    console.log(res)
    if(res.statusCode == 200) {
      this.setData({
        carList: res.data.info
      })
    }
  },
  
  // 
  bindPickerYear(e) {
    const value = e.detail.value,
    activeYearItem = this.data.carYearList[value];
    //
    this.setData({
      activeYear: value,
      activeYearItem: activeYearItem
    })
    this.getCarList()
  },
  
  bindPickerCar(e) {
    const value = e.detail.value,
    activeCarItem = this.data.carList[value];
    //
    this.setData({
      activeCar: value,
      activeCarItem: activeCarItem
    })
  }
})