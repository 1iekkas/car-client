// userPackage/carInfo/index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  validateCarNumber
} from '../../utils/validator'
import {
  editCar
} from '../../api/user'
import {
  IMG_HOST
} from '../../constances/server'
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
    miles: '',
    date: '',
    carNum: '',
    focus: true,
    isLoading: false,
    carNumberType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // console.log(options.car)
    data = this.data
    const series = options.series ? JSON.parse(options.series) : null
    const car = options.car ? JSON.parse(options.car) : null

    this.setData({
      car: car,
      series: series,
      from: options.from || '',
      carId: car ? car.id : '',
      activeYearItem: car ? car.year : '',
      activeCarItem: car ? car.name : '',
      carNum: car ? car.car_num : '',
      focus: true,
      miles: car ? car.miles : '',
      date: car ? car.year_check : '',
      logo: car ? `${IMG_HOST}${car.img}` : '',
      IMG_HOST: IMG_HOST
    }, () => {
      // console.log(data)
      if (data.from !== 'edit' && data.from !== 'createOrderManage') this.getCarYear()
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
    console.log(getCurrentPages())
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
    if (res.statusCode == 200) {
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
    if (res.statusCode == 200) {
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
    if (!data.activeCarItem) {
      Toast.fail('请选择车型')
      return false
    }

    this.setData({
      isLoading: true
    })

    let res = await app.$api.post(`/u/car/add`, {
      car_info_id: data.activeCarItem.id,
      miles: data.miles,
      year_check: data.date,
      focus: data.focus ? 1 : 0,
      car_num: data.carNum,
    })



    if (res.code) {
      wx.showModal({
        content: res.error
      })

    } else {
      Toast({
        type: 'success',
        message: '添加成功',
        onClose: () => {
          let url, pre
          // let url = data.from == 'create' ? '/servicePackage/create/index' : '/pages/user/index'
          const from = data.from
          switch (from) {
            case 'createOrder':
              url = '/servicePackage/create/index'
              pre = getCurrentPages()[getCurrentPages().length - 3]
              pre.setData({
                showCar: false,
                catchMove: false
              })
              // wx.setStorageSync('refresh', true)
              /* wx.reLaunch({
                url: url,
              }) */
              wx.navigateBack({
                delta: 2
              })
              break;
            case 'createOrderManage':
              pre = getCurrentPages()[getCurrentPages().length - 2]
              pre.setData({
                showCar: false,
                catchMove: false
              })
              wx.navigateBack({
                delta: 2
              })
              break;  
            default:
              url = '/userPackage/userCar/index'
              wx.navigateBack({
                delta: 2
              })
              break;
          }
          
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
  onChangeCarNumberType(e) {
    this.setData({
      carNumberType: e.currentTarget.dataset.value == 1 ? 0 : 1
    })
  },

  setCarNumber(e) {
    console.log(e)
    this.setData({
      carNum: e.detail
    })
  },

  onKeyboard() {
    this.selectComponent("#keyboard").onClose()
  },

  onChangeCarNum(e) {
    this.setData({
      carNum: e.detail
    })
  },

  // 编辑保存
  async onSave() {
    let res = editCar({
      id: data.carId,
      miles: data.miles,
      year_check: data.date,
      focus: data.focus ? 1 : 0,
      car_num: data.carNum
    })

    if (!res.code) {
      Toast.success('保存成功')
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})