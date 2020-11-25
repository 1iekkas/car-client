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

  /**
   * 
   * @param Object {
   *  keyword: 关键词,
   *  region: 城市名， 例:佛山市,
   *  region_fix: 是否自动扩大范围到全国 0=是 1=否,
   * }  
   */
  async getSuggestion(params={}) {
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
    }catch(error){
      wx.showModal({
        content: error
      })
    }
  },

  //  
  async reverseGeocoder(params={}) {
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
    }catch(error){
      wx.showModal({
        content: error
      })
    }
  },

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
    }catch(error){
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
  searchLocation(params={}) {
    map.search()
  }
}
