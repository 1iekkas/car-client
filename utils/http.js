/**http请求封装 */
const md5 = require('../utils/md5.js')
console.log(md5)
/** 
 * @baseUrl 服务器地址
 * 
 * */
const baseUrl = 'https://car.coasewash.com'

const getStr = () => {
  let signature = '';
  const timestamp = (parseInt(new Date().getTime() / 1000))
  const rand1 = (parseInt(Math.random(1, 1) * 1000)).toString()
  const rand2 = (parseInt(Math.random(1, 2) * 10000)).toString()
  const nonce = timestamp + rand1 + rand2
  console.log(nonce)
  signature = md5.md5(timestamp + nonce + 'Zgc3a7jNqANK2nbVBluSgxKKaXZs0A')
 
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
  async get(url, data, el, stop=false) {
    const signature = getStr()
    console.log(signature)
    let res = await new Promise((resolve, reject) => {
      wx.request({
        url: `${ url && url.indexOf('http') > -1 ? url : baseUrl + url }`,
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
    const signature = getStr()
    console.log(signature)
    let res = await new Promise((resolve, reject) => {
      const requestTask = wx.request({
        url: `${baseUrl}${url}?timestamp=${signature.timestamp}&nonce=${signature.nonce}&key=Zgc3a7jNqANK2nbVBluSgxKKaXZs0A&signature=${signature.signature}`,
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
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