/**小程序内置api封装 */
const QQMapWX = require('../utils/qqmap-wx-jssdk.js');
const map = new QQMapWX({
  key: 'YRCBZ-LO2KJ-PMHFW-FHFGT-SPEPZ-POBWB'
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
            resolve(res.code)
          }
        })
      })

      // do something  
      wx.setStorageSync('token', 'token')
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
          console.log(result)
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
              console.log(r)
              wx.showModal({
                content: '地址解析失败，请手动选择位置'
              })
            }
          })
        },
        fail: err => {
          wx.showModal({
            content: '获取当前位置失败，请重试'
          })
        }
      })
    })
    
  },
}
