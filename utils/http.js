/**http请求封装 */

/** 
 * @baseUrl 服务器地址
 * 
 * */
const baseUrl = ''

/**
 * @get
 * url: 请求地址, data: 请求参数, el: 当前页面对象, stop: 未定
 * 2020-11-03 create by 1iekkas
 */
const api = {
  async get(url, data, el, stop=false) {
    let res = await new Promise((resolve, reject) => {
      wx.request({
        url: `${ url.indexOf('http') > -1 ? url : baseUrl + url }`,
        method: 'get',
        data: data,
        success(res) {
          if (res.statusCode !== 200) {
            wx.showModal({
              title: '提示',
              content: (res.statusCode).toString(),
            })
          } else {
            resolve(res)
          }
        },
        fail(err) {
          wx.showModal({
            title: 'error',
            content: err.errMsg,
          })
        }
      })
      
    })
    return res
  },
  
  /**
   * @post
   * url: 请求地址, data: 请求参数, el: 当前页面对象, stop: 未定
   * 2020-11-03 create by 1iekkas
   */
  async post(url, data, el, stop=true) {
    let res = await new Promise((resolve, reject) => {
      const requestTask = wx.request({
        url: `${baseUrl}${url}`,
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: data,
        success(res) {
          if (res.statusCode !== 200) {
            wx.showModal({
              title: '提示',
              content: (res.statusCode).toString(),
            })
          } else {
            resolve(res)
          }
        },
        fail(err) {
          console.log(err)
          if (err.errMsg == 'request:fail abort') {
            return false
          } else {
            wx.showModal({
              title: 'error',
              content: err.errMsg,
            })
          }
          
        }
      })
    })
    return res
  }
}

module.exports.$api = api