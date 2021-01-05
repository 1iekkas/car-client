/**http请求封装 */
import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';
const md5 = require('../utils/md5.js')
// console.log(md5)

/** 
 * @baseUrl 服务器地址
 * 
 * */

const env = wx.getAccountInfoSync().miniProgram.envVersion

let baseUrl = ''
switch (env) {
  case 'develop':
    baseUrl = 'https://cartest.coasewash.com'
    break;
  case 'trial':
    baseUrl = 'https://cartest.coasewash.com'
    break;
  default:
    baseUrl = 'https://car.coasewash.com'
    break;
}


let url = ''

const getStr = (data = null) => {
  /** */
  let signature = '';
  const timestamp = (parseInt(new Date().getTime() / 1000))
  const rand1 = (parseInt(Math.random(1, 1) * 1000)).toString()
  const rand2 = (parseInt(Math.random(1, 2) * 10000)).toString()
  const nonce = timestamp + rand1 + rand2
  signature = data ? md5.md5(timestamp + nonce + data + 'Zgc3a7jNqANK2nbVBluSgxKKaXZs0A') : md5.md5(timestamp + nonce + 'Zgc3a7jNqANK2nbVBluSgxKKaXZs0A')
  //console.log(signature)
  return {
    timestamp: timestamp,
    rand1: rand1,
    rand2: rand2,
    nonce: timestamp + rand1 + rand2,
    signature: signature.toLocaleLowerCase(),
  }

}


/**
 * @get
 * url: 请求地址, data: 请求参数, el: 当前页面对象, stop: 未定
 * 2020-11-03 create by 1iekkas
 */
const api = {
  async get(url, data, isSignature = true, el, stop = false) {
    const cacheUrl = url
    const token = wx.getStorageSync('token') || ''
    if (isSignature) {
      const signature = getStr()
      url = `${baseUrl}${url}?timestamp=${signature.timestamp}&nonce=${signature.nonce}&signature=${signature.signature}`
    } else {
      url = `${url}`
    }
    //console.log(signature)
    let res = await new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'get',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": isSignature ? token : ''
        },
        data: data,
        success(res) {
          if (res.statusCode == 401 || res.statusCode == 110) {
            // 刷新token
            refreshToken(cacheUrl, data, isSignature = true, resolve)
          } else if (res.statusCode !== 200) {
            wx.showModal({
              title: '提示',
              content: (`${res.data.error}`).toString(),
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
  async post(url, data, isSignature = true, el, stop = true) {
    console.log(url)
    const cacheUrl = url
    const token = wx.getStorageSync('token') || ''
    if (isSignature) {
      let str = ''
      Object.keys(data).map(e => {
        str += `${e}=${data[e]}&`
      })
      // key = value &
      data.data = str.slice(0, -1)
      const signature = getStr(data.data)
      url = `${baseUrl}${url}?timestamp=${signature.timestamp}&nonce=${signature.nonce}&signature=${signature.signature}`
    } else {
      url = `${url}`
    }
    // console.log(signature)
    let res = await new Promise((resolve, reject) => {
      const requestTask = wx.request({
        url: url,
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": isSignature ? token : ''
        },
        data: data,
        success(res) {
          if (res.statusCode == 401 || res.statusCode == 110) {
            // 刷新token
            refreshToken(cacheUrl, data, isSignature = true, resolve)
          } else if (res.statusCode !== 200) {
            wx.showModal({
              title: '提示',
              content: (`${res.data.error}`).toString(),
            })

            // resolve(res)
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
  },

  /**
   * @put
   * url: 请求地址, data: 请求参数, el: 当前页面对象, stop: 未定
   * 2020-11-03 create by 1iekkas
   */
  async put(url, data, isSignature = true, el, stop = true) {
    const cacheUrl = url
    const token = wx.getStorageSync('token') || ''
    if (isSignature) {
      let str = ''
      Object.keys(data).map(e => {
        str += `${e}=${data[e]}&`
      })
      // key = value &
      data.data = str.slice(0, -1)
      const signature = getStr(data.data)
      url = `${baseUrl}${url}?timestamp=${signature.timestamp}&nonce=${signature.nonce}&signature=${signature.signature}`
    } else {
      url = `${url}`
    }
    // console.log(signature)
    let res = await new Promise((resolve, reject) => {
      const requestTask = wx.request({
        url: url,
        method: 'put',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": isSignature ? token : ''
        },
        data: data,
        success(res) {
          if (res.statusCode == 401 || res.statusCode == 110) {
            // 刷新token
            refreshToken(cacheUrl, data, isSignature = true, resolve)
          } else if (res.statusCode !== 200) {
            wx.showModal({
              title: '提示',
              content: (`${res.data.error}`).toString(),
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
  },

  async delete(url, data, isSignature = true, el, stop = true) {
    const cacheUrl = url
    const token = wx.getStorageSync('token') || ''
    if (isSignature) {
      let str = ''
      Object.keys(data).map(e => {
        str += `${e}=${data[e]}&`
      })
      // key = value &
      data.data = str.slice(0, -1)
      const signature = getStr(data.data)
      url = `${baseUrl}${url}?timestamp=${signature.timestamp}&nonce=${signature.nonce}&signature=${signature.signature}`
    } else {
      url = `${url}`
    }

    let res = await new Promise((resolve, reject) => {
      const requestTask = wx.request({
        url: url,
        method: 'DELETE',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": isSignature ? token : ''
        },
        data: data,
        success(res) {

          if (res.statusCode == 401 || res.statusCode == 110) {
            // 刷新token
            refreshToken(cacheUrl, data, isSignature = true, resolve)
          } else if (res.statusCode !== 200) {
            wx.showModal({
              title: '提示',
              content: (`${res.data.error}`).toString(),
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

        },

        complete: c => {
          console.log(c)
        }
      })
    })
    return res
  },

  // 上传图片
  async uploadImage(file) {
    const signature = getStr(),
      url = `${baseUrl}/u/upload?timestamp=${signature.timestamp}&nonce=${signature.nonce}&signature=${signature.signature}`
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
    });
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    let res = await new Promise((resolve, reject) => {
      wx.uploadFile({
        url: url, 
        filePath: file.url,
        name: 'file',
        formData: signature,
        success: result => {
          if(result.statusCode === 202) {
            wx.showToast({
              icon: 'none',
              title: '图片不能大于2MB'
            })
            return false
          }
          
          res = JSON.parse(result.data).map(e => {
            return `${baseUrl}/${e}`
          })
          // 上传完成需要更新 fileList
          resolve(res)
        },
        complete: c => {
          Toast.clear()
        }
      });
    })

    return res
  }

}

// 刷新token
const refreshToken = (url, data, isSignature = true, callback) => {
  let refresh_token = wx.getStorageSync('refresh_token')
  // console.log(refresh_token)
  api.get(`/auth/wechat/token/${refresh_token}`).then(async res => {
    wx.setStorageSync('token', res.data)
    // console.log(url)
    let result = await api.get(url, data, isSignature = true)
    callback(result)
  })
}

module.exports.$api = api