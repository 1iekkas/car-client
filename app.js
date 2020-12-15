//app.js
// appId wxa487cd75e5f05745
import {
  checkToken,
  getLocation
} from "api/wxServer.js"
import {
  $api
} from 'utils/http.js'
import { IMG_HOST } from 'constances/server'
App({
  onLaunch: function() {
    this.setNavBarInfo()
    // 获取定位
    getLocation().then(res => {
      this.globalData.location = res.result
      // console.log(res.result.ad_info)
      if (this.locationReadyCallback) {
        this.locationReadyCallback(res.result)
      }
    })


    // 检查token是否存在
    checkToken().then(result => {
      console.log(`token检测：${result}`)
      if (result) {
        // 刷新token
       /*  let refresh_token = wx.getStorageSync('refresh_token')
        // console.log(refresh_token)
        $api.get(`/u/user/token/${refresh_token}`).then(res => {
          wx.setStorageSync('token', res.data)
        }) */

        this.globalData.isLogin = true
        // 获取用户信息
        wx.getSetting({
          success: res => {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // console.log('succ')
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
      }else {
       
      }
      if (this.userTokenReadyCallback) {
        console.log('userTokenReadyCallback')
        this.userTokenReadyCallback(result)
      }
     
    })
  },

  /**
   * @description 设置导航栏信息
   */
  setNavBarInfo() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height +
      systemInfo.statusBarHeight;
    this.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuHeight = menuButtonInfo.height;
  },

  globalData: {
    isLogin: false,
    userInfo: null, //用户信息
    hasToken: false, // 是否存在token
    location: null, // 当前位置
    navBarHeight: 0, // 导航栏高度
    menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    IMG_HOST: IMG_HOST
  },

  $api

})
