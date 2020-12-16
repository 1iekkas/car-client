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

  /**
   * 上传图片
   */
  beforeRead(event) {
    const {
      file,
      callback
    } = event.detail;
    file.map(e => {
      console.log((e.url).indexOf('.gif'))
      if (e.type == 'image' && (e.url).indexOf('.gif') < 0) {
        callback(true);
      } else {
        wx.showToast({
          icon: 'none',
          mask: true,
          title: '不能上传gif',
        })
        callback(false);
      }
    })
  },

  afterRead(event) {

    const {
      file
    } = event.detail;

    file.map(async e => {
      // this.upload(e)
      let res = await app.$api.uploadImage(e)
      console.log(res)
      const {
        fileList = []
      } = this.data;
      fileList.push({
        ...file,
        url: res[0],
        isImage: true,
        deletable: true
      });
      this.setData({
        fileList
      });
    })

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