// storePackage/rate/index.js
import {
  comment
} from '../../api/order'
import {
  getOffer
} from '../../api/order'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const md5 = require('../../utils/md5.js')
const app = getApp()
let data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: null,
    autosize: {
      minHeight: 100
    },
    message: '',
    value: 0,
    fileList: [],
    IMG_HOST: app.globalData.IMG_HOST
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
    this.setData({
      id: options.id
    },() => {
      this.getOfferList(data.id)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取报价列表
  async getOfferList(id) {
    let res = await getOffer({
      id: id
    })
    if (!res.code) {
      // 计算步行距离
      if (res.data.length) {
        // 设置同步map
        Promise.all(res.data.map(async e => {
          e.distance = (e.distance / 1000).toFixed(0)
          return e 
        })).then(result => {


          // 处理图片前缀
          if (result.facade_images && result.facade_images.length) {
            result.facade_images.map(e => {
              e = `${IMG_HOST}${e}`
            })
          }

          // 保存  
          data.offerList = result
          this.setData({
            offerList: data.offerList
          })

        })

      }

    }
  },

  changeMessage(e) {
    this.setData({
      message: e.detail
    })
  },

  onChange(e) {
    const value = e.detail
    let tips
    if(value <= 2) {
      tips = '非常不满意'
    } else if( 2 < value && value < 3 ) {
      tips = '一般'
    } else if( 3 <= value && value < 4) {
      tips = '一般'
    } else {
      tips = '非常满意'
    }
    this.setData({
      value: value,
      tips: tips
    })
  },

  getStr() {
    /** */
    let signature = '';
    const timestamp = (parseInt(new Date().getTime() / 1000))
    const rand1 = (parseInt(Math.random(1, 1) * 1000)).toString()
    const rand2 = (parseInt(Math.random(1, 2) * 10000)).toString()
    const nonce = timestamp + rand1 + rand2
    signature = md5.md5(timestamp + nonce + 'Zgc3a7jNqANK2nbVBluSgxKKaXZs0A')
    //console.log(signature)
    return {
      timestamp: timestamp,
      rand1: rand1,
      rand2: rand2,
      nonce: timestamp + rand1 + rand2,
      signature: signature.toLocaleLowerCase(),
    }

  },

  /**
   * 上传图片
   */
  afterRead(event) {

    const {
      file
    } = event.detail;

    file.map(e => {
      this.upload(e)
    })

  },

  upload(file) {
    const signature = this.getStr()
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
    });
    console.log('upload')
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: `https://car.coasewash.com/u/upload?timestamp=${signature.timestamp}&nonce=${signature.nonce}&key=Zgc3a7jNqANK2nbVBluSgxKKaXZs0A&signature=${signature.signature}`, // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: signature,
      success: res => {
        res = JSON.parse(res.data)
        // console.log(res)
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = this.data;
        fileList.push({
          ...file,
          url: 'https://car.coasewash.com/' + res[0],
          isImage: true,
          deletable: true
        });

        console.log(fileList)

        this.setData({
          fileList
        });
      },
      complete: c => {
        Toast.clear()
      }
    });
  },

  // 删除图片
  onDelImage(e) {
    const index = e.detail.index
    data.fileList.splice(index, 1)
    this.setData({
      fileList: data.fileList
    })
  },

  // 提交
  async postComment() {
    let res = await comment({
      id: data.id,
      service_rank: data.value,
      content: data.message,
      rank_images: data.fileList ? data.fileList.map(e => (e.url).replace(/https:\/\/[^\/]*/, '')).join('|') : [],
    })

    if (!res.code) {
      wx.showToast({
        duration: 3000,
        mask: true,
        title: '评价成功',
      })
    }

  }

})