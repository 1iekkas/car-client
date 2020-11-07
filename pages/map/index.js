//index.js
//获取应用实例
const app = getApp()
import {  getDistance } from '../../utils/util.js'
import {
  checkToken,
  login,
  getLocation
} from "../../api/wxServer.js"

Page({
  data: {
    hasUserInfo: null,
    canIUse: true,
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
    activeRange: 0,
    // map配置
    mapSetting: {
      subkey: "YRCBZ-LO2KJ-PMHFW-FHFGT-SPEPZ-POBWB",
      layerStyle: 1,
      scale: 16,
      circles: []
    },
    markers: [],
    circles: []
  },

  onLoad: async function() {
    // 用户token回调
    app.userTokenReadyCallback = res => {
      this.setData({
        hasToken: res
      })
    }
    // 用户信息回调
    app.userInfoReadyCallback = res => {
      //console.log(res)
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }

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
  },

  onShow() {
    console.log(app.globalData.location)
    this.setData({
      location: app.globalData.location,

    })
  },

  // 视野变更
  regionchange(e) {
    // console.log(e)
  },

  // 获取用户信息 
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 筛选距离
  filterRange(e) {
    const data = this.data,
      scale = data.mapSetting.scale,
      circles = data.mapSetting.circles;
    const index = e.currentTarget.dataset.index;
    let v = index == 0 ? [] : [this.setCircles(index)]
    this.setData({
      activeRange: index,
      ['mapSetting.scale']: data.rangeList[index].scale,
      ['mapSetting.circles']: v,
    }, () => {
      console.log(circles)
    })

  },

  // 设置半径
  setCircles(key) {
    if (key) {
      let radius = (this.data.rangeList[key].scale / 16) * this.data.rangeList[key].value
      return {
        latitude: this.data.location.location.lat,
        longitude: this.data.location.location.lng,
        color: '#FF0000DD',
        fillColor: '#7cb5ec88',
        radius: this.data.rangeList[key].value,
        strokeWidth: 1
      }
    } else {
      return []
    }
  },
})
