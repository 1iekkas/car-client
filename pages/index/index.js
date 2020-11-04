//index.js
//获取应用实例
const app = getApp()
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
    // map
    markers: []

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
      console.log(res)
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
        console.log(this.data.markers)
        this.data.map.getCenterLocation({
          success: res => {
            console.log(res)
          }
        })
      })
      
    }
  },

  onShow() {
    this.setData({
      location: app.globalData.location
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
  }
})
