// servicePackage/orderInfo/index.js
import {
  pickOffer,
  getWaitOrderInfo,
  getPayParams
} from '../../api/order'
import {
  getCouponList
} from '../../api/user'
import {
  reverseGeocoder,
  requestPayment
} from '../../api/wxServer'
import {
  IMG_HOST
} from '../../constances/server'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp()
let data

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 30 * 60 * 60 * 1000,
    info: null,
    offer: null,
    active: 0,
    offerList: [],
    loading: true,
    showCancel: false, // 取消订单弹出
    cancelType: '1', // 取消类型
    steps: [{
        text: '联系商家',
        desc: '描述信息',
      },
      {
        text: '协商退款金额',
      },
      {
        text: '退款成功',
      }
    ],
    activeStep: 3,
    showPayment: false,
    payment: {
      id: 1,
      name: '微信支付'
    },
    paymentActions: [{
      id: 1,
      name: '微信支付'
    },{
      id: 2,
      name: '线下支付'
    },],
    showCoupon: false,
    couponList: [],
    couponItem: '',
    selectedCoupon: '',
    IMG_HOST: IMG_HOST
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    data = this.data
    this.getData(options.id)
  
    this.setData({
      offer: JSON.parse(options.offer),
      price: JSON.parse(options.offer).fee
    })

    let res = await getCouponList({
      status: 0,
      order_id: JSON.parse(options.offer).id,
      offer_id: options.id
    })

    if(!res.code) {
      if(res.data.length) {
        res.data.map(e => {
          e.value = parseInt(e.value)
          e.rule_money = parseInt(e.rule_money)
        })
      }
      this.setData({
        couponList: res.data
      })
    }

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
    if (!res.status) {
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
        info: res.data,
        loading: false
      })
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

  onPostForm() {
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];
    if (data.payment.id == 2) {
      this.appointment()
    } else {
      this.onSubmitPay()
    }
  },

  // 线下交易
  async appointment() {
    let res = await pickOffer({
      order_id: data.info.id,
      offer_id: data.offer.id
    })

    if (!res.code) {
      wx.showToast({
        title: '预约成功',
        duration: 1500,
        complete: c => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {

    }
  },


  // 线上交易付款
  async onSubmitPay() {
    // 获取支付配置
    let res = await getPayParams({
      order_id: data.info.id,
      offer_id: data.offer.id,
      coupon_id: data.couponItem ? data.couponItem.id : ''
    })

    if (!res.code) {
      let result = await requestPayment(res.data)
      if (!result.code) {
        let pages = getCurrentPages();
        //获取所需页面
        let prevPage = pages[pages.length - 2]; //上一页
        prevPage.getData(data.info.id)
        wx.showToast({
          title: '支付成功',
          duration: 1500,
          complete: c => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },

  showActions() {
    this.setData({
      showPayment: !data.showPayment
    })
  },

  onSelectActions(e) {
    const item = e.detail;
    this.setData({
      payment: item
    })
  },

  // 选择优惠券
  onSelectCoupon(e) {
    const {
      name
    } = e.currentTarget.dataset;
    data.offer.fee = data.offer.fee - data.couponList[name].value < 0 ? 0 : data.offer.fee - data.couponList[name].value

    this.setData({
      couponItem: data.couponList[name],
      showCoupon: false,
      selectedCoupon: name,
      'offer.fee': data.offer.fee
    },() => {
      
    })
  },

  onShowCoupon() {
    if (data.payment.id == 2) return false
    this.setData({
      showCoupon: !data.showCoupon
    })
  },

  onCancelCoupon() {
    this.setData({
      couponItem: '',
      showCoupon: false,
      'offer.fee': data.price
    })
  }
})