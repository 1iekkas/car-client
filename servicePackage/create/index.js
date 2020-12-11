// servicePackage/create/index.js
const md5 = require('../../utils/md5.js')
import { getCarList } from '../../api/user'
import { validatePhone } from '../../utils/validator'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { IMG_HOST } from '../../constances/server'
import { requestSubscribeMessage } from '../../api/wxServer';
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
    content:'',
    phone: '',
    evaluate_fee: '',
    evaluate_time: '',
    isLocation: false,
    fileList: [],
    doorType: '1',
    location: null,
    isImg: false,
    showCar: false,
    catchMove: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    data = this.data
    this.setData({
      IMG_HOST: IMG_HOST
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {
    this.setData({
      showCar: false,
      catchMove: false
    })

    let location = wx.getStorageSync('location') || null
    if(location) {
      this.setData({
        location: location
      })
    }

    // console.log(location)
    let res = await getCarList(),
      car = [];
    if(!res.code) car = res.data.length ? res.data.filter(e => e.focus == 1)[0] : []
    this.setData({
      car: car,
      carList: res.data.length ? res.data : [],
      location: data.location ? data.location : app.globalData.location  //app.globalData.location
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // wx.setStorageSync('refresh', null)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onChangeUpload(e) {
    this.setData({
      isImg: e.detail,
      fileList: []
    })
  },

  //
  getStr() {
    /** */
    let signature = '';
    const timestamp = (parseInt(new Date().getTime() / 1000))
    const rand1 = (parseInt(Math.random(1, 1) * 1000)).toString()
    const rand2 = (parseInt(Math.random(1, 2) * 10000)).toString()
    const nonce = timestamp + rand1 + rand2
    signature = md5.md5(timestamp + nonce + 'Zgc3a7jNqANK2nbVBluSgxKKaXZs0A')
    //console.log(signature)
    return {
      timestamp: timestamp,
      rand1: rand1,
      rand2: rand2,
      nonce: timestamp + rand1 + rand2,
      signature: signature.toLocaleLowerCase(),
    }
  
  },
  

  /**
   * 上传图片
   */
  afterRead(event) {
    
    const {
      file
    } = event.detail;
    
    file.map(e => {
      this.upload(e)
    })
    
  },

  upload(file) {
    const signature = this.getStr()
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
    });
    console.log('upload')
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: `https://car.coasewash.com/u/upload?timestamp=${signature.timestamp}&nonce=${signature.nonce}&key=Zgc3a7jNqANK2nbVBluSgxKKaXZs0A&signature=${signature.signature}`, // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: signature,
      success:res => {
        res = JSON.parse(res.data)
        // console.log(res)
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = this.data;
        fileList.push({ ...file,
          url: 'https://car.coasewash.com/' + res[0],
          isImage: true,
          deletable: true
        });

        console.log(fileList)

        this.setData({
          fileList
        });
      },
      complete: c => {
        Toast.clear()
      }
    });
  },

  /** */
  onChange(e) {
    const type = e.currentTarget.dataset.type,
      value = e.detail

    this.setData({
      //isLocation: event.detail,
      [`${type}`]: value
    },() => {
      // console.log(data)
    });
  },

  // 提交
  async onSubmit() {
    validatePhone(data.phone)
    //validateContent(data.content)
    if(data.content == '') {
      Toast.fail('请填写您的需求')
      return false
    }

    if(!data.car) {
      Toast.fail('请先添加车辆')
      return false
    }

    // 参数body
    let body = {
      car_id: data.car.id || '',
      content: data.content,
      phone: data.phone,
      evaluate_fee: data.evaluate_fee,
      evaluate_time: data.evaluate_time,
      on_door: data.isLocation ? data.doorType : 0, // 0 不上门 1 不取车 2 取车
      lng: data.location.location.lng || '',
      lat: data.location.location.lat || '',
      address: data.location.formatted_addresses.recommend || '',
      images: data.fileList ? data.fileList.map(e => e.url).join('|') : [],
    }

    let res = await app.$api.post('/u/order/add', body)

    if(!res.code) {
      Toast({
        type: 'success',
        message: '提交成功',
        onClose: async () => {
          
          /* wx.redirectTo({
            url: '/userPackage/order/index',
          }) */
        },
      })

      /* let callback = await requestSubscribeMessage([
        'huXLWTyuXvjNjvbJ8qktf00-DSH6TdAufUI1oYNK_ug',
        'MfgN-57tlS4bcsivSK54n9B_u2cNiEGSOv1imoV5zGk',
        'u9jgWWi__K3swfJ0y8AlOPlNaZV5JsTZ16kK13Y9z88'
      ]) */

      // if(!callback.code)
      /* if(callback) {
        
      } */
      wx.redirectTo({
        url: '/userPackage/order/index',
      }) 
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
    this.setData({
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
    console.log(e)
    const { name } = e.currentTarget.dataset;

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
    console.log(e)
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
    const { car } = e.currentTarget.dataset
    this.setData({
      car: car,
      showCar: false
    })
  },

  onEidtCar(e) {
    const { car } = e.currentTarget.dataset
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
