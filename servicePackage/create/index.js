// servicePackage/create/index.js
const md5 = require('../../utils/md5.js')
import {
  getCarList
} from '../../api/user'
import {
  validatePhone
} from '../../utils/validator'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  IMG_HOST
} from '../../constances/server'
import {
  requestSubscribeMessage
} from '../../api/wxServer';
let data
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    car: null,
    autosize: {
      minHeight: 60
    },
    content: '',
    phone: '',
    evaluate_fee: '',
    isDate: false,
    evaluate_time: '',
    isLocation: false,
    fileList: [],
    doorType: '1',
    location: null,
    isImg: false,
    showCar: false,
    catchMove: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
    this.setData({
      IMG_HOST: IMG_HOST
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
  onShow: async function () {
    this.setData({
      showCar: false,
      catchMove: false
    })

    let location = wx.getStorageSync('location') || null
    if (location) {
      this.setData({
        location: location
      })
    }

    // console.log(location)
    let res = await getCarList(),
      car = null;
    if (!res.code) car = res.data.length ? res.data.filter(e => e.focus == 1)[0] : null
    this.setData({
      car: car,
      carList: res.data.length ? res.data : [],
      location: data.location ? data.location : app.globalData.location //app.globalData.location
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // wx.setStorageSync('refresh', null)
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

  onChangeUpload(e) {
    this.setData({
      isImg: e.detail,
      fileList: []
    })
  },

  /**
   * 上传图片
   */
  afterRead(event) {
    const {
      file
    } = event.detail;

    file.map(async e => {
      // this.upload(e)
      let res = await app.$api.uploadImage(e)
      // console.log(res)
      const {
        fileList = []
      } = this.data;
      fileList.push({
        ...file,
        url: res[0],
        isImage: true,
        deletable: true
      });
      this.setData({
        fileList
      });
    })

  },

  beforeRead(event) {
    const {
      file,
      callback
    } = event.detail;
    file.map(e => {
      // console.log((e.url).indexOf('.gif'))
      if (e.type == 'image' && (e.url).indexOf('.gif') < 0) {
        callback(true);
      } else {
        wx.showToast({
          icon: 'none',
          mask: true,
          title: '不能上传gif',
        })
        callback(false);
      }
    })
  },

  /** */
  onChange(e) {
    const type = e.currentTarget.dataset.type,
      value = e.detail

    this.setData({
      //isLocation: event.detail,
      [`${type}`]: value
    }, () => {
      // console.log(data)
    });
  },

  // 提交
  async onSubmit() {
    this.setData({
      loading: true
    })
    validatePhone(data.phone)
    //validateContent(data.content)
    if (data.content == '') {
      Toast.fail('请填写您的需求')
      this.setData({
        loading: false
      })
      return false
    }

    if (!data.car) {
      Toast.fail('请先添加车辆')
      this.setData({
        loading: false
      })
      return false
    }

    // 参数body
    let body = {
      car_id: data.car.id || '',
      content: data.content,
      phone: data.phone,
      evaluate_fee: data.evaluate_fee,
      evaluate_time: data.isDate ? data.evaluate_time : '',
      on_door: data.isLocation ? data.doorType : 0, // 0 不上门 1 不取车 2 取车
      lng: data.location.location.lng || '',
      lat: data.location.location.lat || '',
      address: data.location.formatted_addresses.recommend || '',
      images: data.fileList ? data.fileList.map(e => (e.url).replace(/https:\/\/[^\/]*/, '')).join('|') : [],
    }

    let res = await app.$api.post('/u/order/add', body)

    if (!res.code) {
      Toast({
        type: 'success',
        message: '提交成功',
        onClose: async () => {
          
        },
      })

      let d = await requestSubscribeMessage([
        'dAd4A5XhCl1egKH5SkudOEo5ZjBlhuEgLw6JLn-BKmk',
        'huXLWTyuXvjNjvbJ8qktf00-DSH6TdAufUI1oYNK_ug',
        'H-1pxFY9LFOTF55qIFYIzc_4cElqKm9rw1WDDqiyPts'
      ])
      console.log(d)  
      if(!d.code) {
        wx.redirectTo({
          url: '/userPackage/order/index',
        })
      }
    }

  },

  // 删除图片
  onDelImage(e) {
    const index = e.detail.index
    data.fileList.splice(index, 1)
    this.setData({
      fileList: data.fileList
    })
  },

  //
  set(e) {
    // console.log(e)
    this.setData({
      isDate: e.detail.isDate,
      evaluate_time: e.detail.value
    })
  },

  addCar() {
    wx.navigateTo({
      url: '/userPackage/carList/index?from=create',
    })
  },

  // 
  onClick(e) {
    // console.log(e)
    const {
      name
    } = e.currentTarget.dataset;

    this.setData({
      doorType: name
    })
  },

  onShowCar() {
    this.setData({
      showCar: !data.showCar,
    })
  },

  onPopupScroll(e) {
    // console.log(e)
  },

  upper() {
    this.setData({
      catchMove: true
    })
  },

  lower() {
    this.setData({
      catchMove: true
    })
  },

  onSelectCar(e) {
    const {
      car
    } = e.currentTarget.dataset
    this.setData({
      car: car,
      showCar: false
    })
  },

  onEidtCar(e) {
    const {
      car
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/userPackage/carInfo/index?car=${JSON.stringify(car)}&from=createOrderManage`,
    })
  }

  /* linkToCar() {
    wx.navigateTo({
      url: '/userPackage/userCar/index',
    })
  } */

})