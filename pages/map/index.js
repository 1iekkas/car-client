//index.js
//获取应用实例
const app = getApp()
import { reverseGeocoder } from '../../api/wxServer'
import {
  checkToken,
  login,
  getLocation
} from "../../api/wxServer.js"
import { getSwipeList } from '../../api/poster'
let data 
Page({
  data: {
    hasUserInfo: null,
    isLogin: false,
    location: null,
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    storeList: ['同时呼叫', '洗美店', '维修店', '快修员', '维修厂'], // 商家类型
    rangeList: [{
      id: '0',
      name: '全部',
      value: '0',
      scale: 16
    }, {
      id: '1',
      name: '500米',
      value: 500,
      scale: 15
    }, {
      id: '2',
      name: '3公里内',
      value: 3000,
      scale: 13
    }, {
      id: '3',
      name: '5公里',
      value: 5000,
      scale: 12
    }, {
      id: '4',
      name: '10公里',
      value: 10000,
      scale: 11
    }],
    tips: 1,
    activeRange: 0,
    contentHeight: 0,
    // map配置
    mapSetting: {
      subkey: "553BZ-MI4CW-LMXR5-OXN7Z-OMBVK-RPFMX",
      minScale: 16,
      maxScale: 16,	
      layerStyle: '1',
      scale: 16,
      circles: [],
      showLocation: true
    },
    markers: [],
    circles: []
  },

  onLoad: async function () {
    data = this.data
    // 清除缓存位置信息
    wx.setStorageSync('location', null)

    // 用户token回调
    app.userTokenReadyCallback = res => {
      this.setData({
        hasToken: res,
        isLogin: res
      })
    }
    // 用户信息回调
    app.userInfoReadyCallback = res => {
      console.log(res)
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }

    // 定位回调
    app.locationReadyCallback = res => {
      // console.log(res)
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
    //
    this.getSwipeList()
  },

  onShow() {
    let location = wx.getStorageSync('location') || null
    this.setData({
      location: location ? location : app.globalData.location,
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo
    })
    // wx.setStorageSync('location', null)
   
  },

  onReady() {
    setTimeout(() => {
      let query = wx.createSelectorQuery();
      query.select('.content').boundingClientRect(rect => {
        let height = rect.height;
        //console.log(height);
        this.setData({
          contentHeight: height - 30
        })
      }).exec();
    }, 0)
  },

  // 获取banner
  async getSwipeList(e) {
    let res = await getSwipeList() 
  },

  // 视野变更
  async regionchange(e) {
    if(e.type == "begin") return false

    const location = e.detail.centerLocation
    let res = await reverseGeocoder({
      location: location
    }) 

    if (!res.status) {
      this.location = res.result
    }

  },

  // 获取用户信息 
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 筛选距离 已废弃
  filterRange(e) {
    const data = this.data,
      scale = data.mapSetting.scale,
      circles = data.mapSetting.circles;
    const index = e.currentTarget.dataset.index;
    let v = index == 0 ? [] : [this.setCircles(index)]
    this.setData({
      activeRange: index,
      ['mapSetting.scale']: data.rangeList[index].scale,
      ['mapSetting.circles']: [{
        latitude: this.data.location.location.lat,
        longitude: this.data.location.location.lng,
        color: '#FF0000',
        fillColor: '#7cb5ec',
        radius: this.data.rangeList[index].value,
        strokeWidth: 1
      }],
    }, () => {
    })

  },

  // 设置半径 已废弃
  setCircles(key) {
    if (key) {
      let radius = (this.data.rangeList[key].scale / 16) * this.data.rangeList[key].value
      return {
        latitude: this.data.location.location.lat,
        longitude: this.data.location.location.lng,
        color: '#FF0000',
        fillColor: '#7cb5ec',
        radius: this.data.rangeList[key].value,
        strokeWidth: 1
      }
    } else {
      return []
    }
  },

  // 获取用户信息
  getUserInfo: async function (e) {

  },

  toLogin() {
    wx.navigateTo({
      url: '/userPackage/login/index'
    })
  },

  back() {
    wx.navigateBack({
      delta: 1
    })
  },

  mapSearch() {
    wx.navigateTo({
      url: '/userPackage/mapSearch/index'
    })
  },

  // 个人中心
  linkUserInfo() {
    wx.navigateTo({
      url: '/pages/user/index',
    })
  },

  // 创建订单
  toCreate(e) {
    console.log('create')
    const type = e.currentTarget.dataset.type
    // console.log(type)
    if(type === 'custom') {
      // console.log(this.location)
      wx.setStorageSync('location', this.location)
    }
    wx.navigateTo({
      url: '/servicePackage/create/index',
    })
  },

  toSearchOrder() {
    wx.navigateTo({
      url: '/servicePackage/searchOrder/index',
    })
  },

  // 
  linkToOrder() {
    wx.navigateTo({
      url: `/userPackage/order/index`,
    })
  },

  // 
  onFocus() {
    data.map.moveToLocation();
    /* this.setData({
      location: app.globalData.location
    }) */
    wx.setStorageSync('location', null)
  }
})
