// servicePackage/orderInfo/index.js
import {
  getWaitOrderInfo,
  getOffer
} from '../../api/order'
import {
  reverseGeocoder,
  setCalculateDistance
} from '../../api/wxServer'
import {
  IMG_HOST
} from '../../constances/server'
const app = getApp()
let data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 30 * 60 * 60 * 1000,
    filterList: [{
      name: '综合排序'
    }, {
      name: '距离'
    }, {
      name: '价格'
    }],
    info: null,
    active: 0,
    offerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
    this.getData(options.id)
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

  async getData(id) {
    let res = await getWaitOrderInfo({
      id: id
    })
    //console.log(res)
    if (!res.code) {
      // 解析地址
      let address = await reverseGeocoder({
        location: {
          latitude: res.data.lat,
          longitude: res.data.lng
        }
      })

      res.data.address = address.result ? address.result.address : '解析位置失败'
      // 保存
      this.setData({
        info: res.data
      }, () => {
        this.getOfferList()
      })
    }
  },

  async getOfferList() {
    let res = await getOffer({
      id: data.info.id
    })
    if (!res.code) {
      // 计算步行距离
      if (res.data.length) {
        // 设置同步map
        Promise.all(res.data.map(async e => {
          let d = await setCalculateDistance({
            form: {
              latitude: data.info.lat || 0,
              longitude: data.info.lnt || 0
            },
            to: [{
              latitude: e.lat,
              longitude: e.lnt
            }]
          })

          if (d.status == 0) {
            e.distance = (d.result.elements[0].distance / 1000).toFixed(0)
          } else {
            e.distance = '未定位'
          }

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
          }, () => {
            console.log(data.offerList)
          })

        })

      }

    }
  },

  // 图片预览
  onPreview(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: data.info.images,
    })
  },

  // 重新发布
  onClickButton() {
    wx.showToast({
      icon: 'none',
      title: '暂无该功能'
    })
  },


})