//index.js
//获取应用实例
const app = getApp()
import { reverseGeocoder, searchStore } from '../../api/wxServer'
import {
  getLocation
} from "../../api/wxServer.js"
import { getOrderCount } from '../../api/order'
import { getStoreList } from '../../api/store'
import { getSwipeList } from '../../api/poster'
let data 
Page({
  data: {
    hasUserInfo: null,
    isLogin: false,
    location: null,
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    orderCount: 0,
    storeList: [],
    activeRange: 0,
    contentHeight: 0,
    // map配置
    mapSetting: {
      subkey: "553BZ-MI4CW-LMXR5-OXN7Z-OMBVK-RPFMX",
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

      if(res) {
        getOrderCount({status: 0}).then(res => {
          this.setData({
            orderCount: res.data.wait_offer
          })
        })
      }
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
            this.searchStore(res)
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
      userInfo: app.globalData.userInfo,
      map: this.data.map ? this.data.map : wx.createMapContext('map', this),
    },() => {
      //console.log(app.globalData.location)
      if( !data.location) return false
      this.searchStore({
        latitude: data.location.location.lat,
        longitude: data.location.location.lng
      })
      // 清除缓存位置信息
      wx.setStorageSync('location', null)
    })
    // wx.setStorageSync('location', null)
    if(data.isLogin) {
      getOrderCount().then(res => {
        this.setData({
          orderCount: res.data.wait_offer
        })
      })
    }

    

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
    if(e.type == "begin" || e.causedBy != 'drag') return false
    this.update = true
    const location = e.detail.centerLocation
    let res = await reverseGeocoder({
      location: location
    }) 
    if (!res.status) {
      // 重置全局变量？
      this.setData({
        location: res.result
      }, () => {
        // 搜索附近店铺
        this.searchStore({
          latitude: data.location.location.lat,
          longitude: data.location.location.lng
        })
      })
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

  // 获取用户信息 已废弃
  getUserInfo: async function (e) {

  },

  // 跳转登录
  toLogin() {
    wx.navigateTo({
      url: '/userPackage/login/index'
    })
  },

  // 废弃跳转
  back() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 切换地址
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
    const type = e.currentTarget.dataset.type
    console.log(type)
    if(type === 'custom') {
      wx.setStorageSync('location', data.location)
    }

    wx.navigateTo({
      url: '/servicePackage/create/index',
    })
  },

  // 跳转车型订单搜索  
  toSearchOrder() {
    wx.navigateTo({
      url: '/servicePackage/searchOrder/index',
    })
  },

  // 跳转订单列表
  linkToOrder() {
    if(!data.isLogin) {
      wx.navigateTo({
        url: '/userPackage/login/index',
      })
    }else {
      wx.navigateTo({
        url: `/userPackage/order/index?status=0`,
      })
    }
    
  },

  // 地图移到当前定位点
  async onFocus() {
    // 清除缓存位置信息
    wx.setStorageSync('location', null)
    let obj = await getLocation()
    let myLocation = obj.result
    console.log(obj.result)
    // 简略比较相等
    // if(JSON.stringify(myLocation) === JSON.stringify(app.globalData.location)) return false
    app.globalData.location = myLocation
    this.setData({
      location: myLocation
    },() => {
      data.map.moveToLocation({
        latitude: data.location.location.lat,
        longitude: data.location.location.lng
      })
      this.searchStore({
        latitude: data.location.location.lat,
        longitude: data.location.location.lng
      })
    })
  },

  linkToStore() {
    wx.navigateTo({
      url: '/storePackage/storeList/index',
    })
  },

  // 坐标转换详细地址
  async refreshMap(location) {
    console.log(location)
    let res = await reverseGeocoder({
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    })

    if(!res.status) {
      app.globalData.location = res.result
      this.setData({
        location: res.result
      })
      wx.setStorageSync('location', null)
      /* wx.navigateBack({
        delta: 1,
      }) */
    }else {
      wx.showToast({
        title: '很抱歉，位置未能成功切换',
      })
    }
  },

  // 搜索门店
  async searchStore(location) {
    let storeList = []
    /* let res = await searchStore({
      keyword: '酒店',
      location: `${location.latitude},${location.longitude}`
    }) */

    // 店铺列表
    let res = await getStoreList({page_size: 100})

    if(!res.code) {
      //storeList = res.data
      // console.log(res.data.data)
      storeList = res.data.data.map(e => ({
        id: e.id,
        title: e.name,
        latitude: e.lat,
        longitude: e.lnt,
        height: 30,
        width: 22,
        zIndex: 2,
        iconPath: '../../static/img/store.png'
      }))
      // console.log(storeList)
      this.setData({
        markers: storeList
      })
    }
  }
})
