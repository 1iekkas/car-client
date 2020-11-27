// userPackage/carInfo/index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { validateCarNumber } from '../../utils/validator'
const app = getApp()
const api = app.$api
let data
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
    checked: true,
    miles: '',
    date: '',
    carNum: '',
    focus: false,
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    data = this.data
    const series = options.series ? JSON.parse(options.series) : null
    this.setData({
      series: series,
      from: options.from
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
  /* onShareAppMessage: function () {

  }, */
  
  // 获取车型年份
  async getCarYear() {
    let res = await api.get('https://tool.bitefu.net/car/', {
      type: 'infoyear',
      from: 0,
      series_id: this.data.series.id,
      pagesize: 50
    }, false)
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
    }, false)
    console.log(res)
    if(res.statusCode == 200) {
      this.setData({
        carList: res.data.info
      })
    }
  },
  
  // 车型年份
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
  
  // 选择车型
  bindPickerCar(e) {
    const value = e.detail.value,
    activeCarItem = this.data.carList[value];
    //
    this.setData({
      activeCar: value,
      activeCarItem: activeCarItem
    })
  },

  // 选择日期
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  // 是否默认
  onChangeDefault(e) {
    console.log(e)
    this.setData({
      focus: e.detail
    })
  },

  // 提交添加
  async onSubmit() {
  validateCarNumber(data.carNum)

    /**验证 */
    if(!data.activeCarItem) {
      Toast.fail('请选择车型')
      return false
    }

    this.setData({
      isLoading: true
    })

    let res = await app.$api.post(`/u/car/add`, {
      car_info_id: data.activeCarItem.id,
      miles: 100,
      year_check: data.date,
      focus: data.checked ? 1 : 0,
      car_num: data.carNum,
    })

    

    if(res.code) {
      wx.showModal({
        content: res.error
      })

    }else {
      Toast({
        type: 'success',
        message: '添加成功',
        onClose: () => {
          let url = data.from == 'create' ? '/servicePackage/create/index' : '/pages/user/index'
          wx.redirectTo({
            url: url,
          })
        },
      });
    }

    this.setData({
      isLoading: false
    })
  },

  // 公里数
  onChangeMiles(e) {
    this.setData({
      miles: e.detail
    })
  },

  // 车牌
  onChangeCarNum(e) {
    this.setData({
      carNum: e.detail
    })
  }
})