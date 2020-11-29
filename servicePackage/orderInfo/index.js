// servicePackage/orderInfo/index.js
import {
  getWaitOrderInfo,
  getOffer,
  pickOffer,
  getPayParams,
  checkOrder,
  cancelOrder
} from '../../api/order'
import {
  reverseGeocoder,
  setCalculateDistance,
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
    filterList: [{
      name: '综合排序'
    }, {
      name: '距离'
    }, {
      name: '价格'
    }],
    info: null,
    active: 0,
    offerList: [],
    loading: true,
    showCancel: false, // 取消订单弹出
    cancelType: '1', // 取消类型
    steps: [
      {
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
    activeStep: 3
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
<<<<<<< HEAD
=======
    console.log(res)
>>>>>>> 1a6ce2175172fbd4a87a52866f98e6f149425296
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
      }, () => {
        this.getOfferList()
      })
    }
  },

  // 获取报价列表
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

  // 选择预约门店
  onSelectShop(e) {
    const id = e.currentTarget.dataset.id;
    Dialog.confirm({
        title: '确认预约',
        message: '是否确认预约该门店',
        cancelButtonText: '再想想'
      })
      .then(async () => {
        // on confirm
        let res = await pickOffer({
          offer_id: id,
          order_id: data.info.id
        })

        if (!res.code) {
          /* wx.showToast({
            title: 'title',
          }) */
          this.getData(data.info.id)
        }

      })
      .catch(() => {
        // on cancel
      });
  },

  // 重新发布
  onClickButton() {
    wx.showToast({
      icon: 'none',
      title: '暂无该功能'
    })
  },

  // 付款
  async onSubmitPay() {
    // 获取支付配置
    let res = await getPayParams({
      order_id: data.info.id,
      offer_id: data.info.offer_id
    })

    if (!res.code) {
      let result = await requestPayment(res.data)
      if (!result.code) {
        wx.showToast({
          title: '支付成功',
        })
        this.getData(data.info.id)
      }
    }
  },

  // 取消订单
  onCancelOrder() {
    Dialog.confirm({
      title: '取消订单',
      message: '当前等待维修中,是否确认取消订单',
      confirmButtonText: '确定取消',
      cancelButtonText: '不，点错了'
    })
    .then(() => {
<<<<<<< HEAD
      this.setData({
        showCancel: true
      })
      // on confirm
      /* wx.navigateTo({
        url: `/servicePackage/cancel/index`,
      }) */
      
    }).catch(() => {

    }) 
  },

  onChangeCancel(e) {
    const { name } = e.currentTarget.dataset;
    this.setData({
      cancelType:name
    })
  },

  async confirmPopup() {
    let res = await cancelOrder({id: data.info.id, cancel_reason_id: data.cancelType})
    if(!res.code) {
      this.setData({
        showCancel: false
      })
    }
    
  },

  cancelPopup() {
    this.setData({
      showCancel: false
=======
      // on confirm
      wx.navigateTo({
        url: `/servicePackage/cancel/index`,
      })
>>>>>>> 1a6ce2175172fbd4a87a52866f98e6f149425296
    })
  },

  // 验收
  async onConfirmCheck(e) {
    let res = await checkOrder({id: data.info.id})
<<<<<<< HEAD
    // console.log(res)
=======
    console.log(res)
>>>>>>> 1a6ce2175172fbd4a87a52866f98e6f149425296
    if(!res.code) {
      wx.showToast({
        title: '已验收',
      })
      this.getData(data.info.id)
    }
  }

})