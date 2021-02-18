/**小程序内置api封装 */
const app = getApp()
const QQMapWX = require('../utils/qqmap-wx-jssdk.js');
const map = new QQMapWX({
  key: '553BZ-MI4CW-LMXR5-OXN7Z-OMBVK-RPFMX'
});
module.exports = {
  /**
   * @function 检测token
   * 2020-11-03 create by 1iekkas
   */
  checkToken() {
    const token = wx.getStorageSync('token') || ''
    return new Promise((resolve) => {
      if (token) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  },

  /**
   * @function 检查token是否过期
   * 2020-11-03 create by 1iekkas
   */

  /**
   * @function 用户登录
   * 2020-11-03 create by 1iekkas
   */
  async login() {
    try {
      let res = await new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            resolve({
              code: 200,
              value: res.code
            })
          }
        })
      })

      // do something  
      //wx.setStorageSync('token', 'token')

      return res

    } catch (err) {
      wx.showModal({
        content: '登陆失败，请重新登录'
      })
    }
  },

  /**
   * @function 获取当前定位位置
   * 2020-11-03 create by 1iekkas
   */
  getLocation() {
    return new Promise(resolve => {
      wx.getLocation({
        type: 'gcj02',
        altitude: true,
        success: result => {
          console.log(`系统定位信息：${JSON.stringify(result)}`)
          // 地址逆解析
          map.reverseGeocoder({
            location: {
              latitude: result.latitude,
              longitude: result.longitude
            },
            success: d => {
              resolve(d)
            },
            fail: r => {
              // console.log(r)
              wx.showModal({
                content: '地址解析失败，请手动选择位置'
              })
            }
          })
        },
        fail: err => {
          // wx.openSetting
          wx.getSetting({
            success: s => {
              if (s.authSetting['scope.userLocation']) {
                wx.showModal({
                  content: '获取当前位置失败，请重试',
                  showCancel: false,
                })
              } else {
                wx.showModal({
                  content: '请先授权位置获取',
                  showCancel: false,
                })
              }

              map.reverseGeocoder({
                location: {
                  latitude: 40.22077,
                  longitude: 116.23128
                },
                success: d => {
                  resolve(d)
                },
                fail: r => {
                  // console.log(r)
                  wx.showModal({
                    content: '地址解析失败，请手动选择位置'
                  })
                }
              })
            }
          })

        }
      })
    })

  },

  /**
   * 地址关键词输入提示
   * @param Object {
   *  keyword: 关键词,
   *  region: 城市名， 例:佛山市,
   *  region_fix: 是否自动扩大范围到全国 0=是 1=否,
   * }  
   */
  async getSuggestion(params = {}) {
    let object = {
      ...params,
      region_fix: 1,
      page_size: 20,
      page_index: 1
    }
    try {
      let res = await new Promise((resolve, reject) => {
        map.getSuggestion({
          ...object,
          complete: result => {
            resolve(result)
          }
        })
      })

      return res
    } catch (error) {
      wx.showModal({
        content: error
      })
    }
  },

  // 坐标解析地址 @params { lat, lng }
  async reverseGeocoder(params = {}) {
    let object = {
      ...params
    }
    try {
      let res = await new Promise((resolve, reject) => {
        map.reverseGeocoder({
          ...object,
          complete: result => {
            resolve(result)
          }
        })
      })

      return res
    } catch (error) {
      wx.showModal({
        content: error
      })
    }
  },

  /**
   * 地址解析坐标
   * @param {*} params 
   */
  async getGeocoder(params) {
    try {
      let res = await new Promise((resolve, reject) => {
        map.geocoder({
          ...params,
          complete: result => {
            resolve(result)
          }
        })
      })

      return res
    } catch (error) {
      wx.showModal({
        content: error
      })
    }
  },

  // 计算距离
  async setCalculateDistance(params) {
    let object = {
      ...params
    }
    try {
      let res = await new Promise((resolve, reject) => {
        map.calculateDistance({
          ...object,
          complete: result => {
            resolve(result)
          }
        })
      })

      return res
    } catch (error) {
      wx.showModal({
        content: error
      })
    }
  },

  /**
   * @function 用户搜索地点
   * @params Object { 
   *  keyword: 关键词,
   *  location: 坐标点: '39.980014,116.313972' 
   * } 
   * create by liekkas 2020-11-07
   */
  searchLocation(params = {}) {
    map.search()
  },

  /**
   * 发起微信支付
   */
  requestPayment(data) {
    return new Promise(resolve => {
      wx.requestPayment({
        ...data,
        complete: res => {
          if (res.errMsg == 'requestPayment:fail cancel') {
            resolve({
              code: 1,
              message: 'requestPayment:fail cancel'
            })
          } else {
            resolve({
              code: 0,
              message: '支付成功'
            })
          }
        }
      })
    })
  },

  // 打开地图
  openMap(location) {
    return new Promise(resolve => {
      wx.openLocation({
        ...location,
        scale: 16,
        complete: res => {
          resolve(res)
        }
      })
    })
  },

  // 模拟获取周围店铺
  async searchStore(params) {
    try {
      let res = await new Promise((resolve, reject) => {
        map.search({
          ...params,
          complete: result => {
            resolve(result)
          }
        })
      })

      return res
    } catch (error) {
      wx.showModal({
        content: error
      })
    }
  },

  // 订阅消息 废弃
  requestSubscribeMessage(tmplIds = []) {
    console.log(tmplIds)
    return new Promise(resolve => {
      wx.requestSubscribeMessage({
        tmplIds: tmplIds,
        complete: res => {
          console.log(res)
          if (res.errMsg == "requestSubscribeMessage:ok") {
            resolve({
              code: 0,
              message: '订阅成功'
            })
          } else {
            resolve({
              code: 1,
              message: '订阅失败'
            })
          }
        }
      })
    })
  },

  updateListener() {
    const updateManager = wx.getUpdateManager()
    // console.log(updateManager)
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(`版本更新：${res.hasUpdate}`)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  }

}