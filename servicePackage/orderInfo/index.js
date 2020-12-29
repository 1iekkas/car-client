// servicePackage/orderInfo/index.js
import {
  getWaitOrderInfo,
  getOffer,
  checkOrder,
  cancelOrder,
  cancelReason
} from '../../api/order'
import {
  reverseGeocoder,
  setCalculateDistance,
  openMap
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
    isLogin: app.globalData.isLogin,
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
    cancelList: [],
    cancelType: '1', // 取消类型
    IMG_HOST: IMG_HOST,
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
    activeStep: 3,

    orderSteps: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // console.log(options)
    data = this.data
    this.oid = options.id
    data.isLogin = app.globalData.isLogin
    // 清除缓存位置信息
    wx.setStorageSync('location', null)

    // 用户token回调
    app.userTokenReadyCallback = res => {
      console.log(res)
      this.setData({
        hasToken: res,
        isLogin: res
      })

      if(!res) {
        wx.redirectTo({
          url: `/userPackage/login/index?id=${this.oid}`,
        })
      }else {
        this.getData(this.oid)
        this.getCancelReason()
      }
    }

    // 用户信息回调
    app.userInfoReadyCallback = res => {
      console.log(res)
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
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
    if(!this.data.isLogin) return false
    this.getData(this.oid)
    this.getCancelReason()
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
      data.orderSteps = []
      /**处理订单流程 */
      data.orderSteps.push({
        text: '创建订单',
        desc: res.data.create_time
      })

      // 以下均为非空成立
      if(res.data.pick_car_time) {
        data.orderSteps.push({
          text: '店铺已接车',
          desc: res.data.pick_car_time
        })
      }

      if(res.data.repair_time) {
        data.orderSteps.push({
          text: '开始维修',
          desc: res.data.repair_time
        })
      }

      if(res.data.repair_complete_time) {
        data.orderSteps.push({
          text: '维修完成',
          desc: res.data.repair_complete_time
        })
      }

      if(res.data.cancel_time) {
        data.orderSteps.push({
          text: '已取消',
          desc: res.data.cancel_time
        })
      }

      if(res.data.refund_success_time) {
        data.orderSteps.push({
          text: '已退款',
          desc: res.data.refund_success_time
        })
      }

      if(res.data.complete_time) {
        data.orderSteps.push({
          text: '订单已完成',
          desc: res.data.complete_time
        })
      }


      // 保存
      this.setData({
        info: res.data,
        time: res.data.remain * 1000,
        loading: false,
        orderSteps: data.orderSteps,
        active: data.orderSteps.length - 1
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

  // 图片预览
  onPreview(e) {
    const url = e.currentTarget.dataset.url;
    let imgs = data.info.images.map(e =>  `${data.IMG_HOST}${e}`)

    wx.previewImage({
      current: data.IMG_HOST + url,
      urls: imgs,
    })
  },

  onPreviewRepair(e) {
    const url = e.currentTarget.dataset.img;
    let imgs = data.info.repair_complete_images.map(e =>  `${data.IMG_HOST}${e}`)

    wx.previewImage({
      current: data.IMG_HOST + url,
      urls: imgs,
    })
  },

  // 选择预约门店
  onSelectShop(e) {
    const { item } = e.currentTarget.dataset;
    Dialog.confirm({
        title: '确认预约',
        message: '是否确认预约该门店',
        cancelButtonText: '再想想'
      })
      .then(async () => {
        // on confirm
        wx.navigateTo({
          url: `/servicePackage/pay/index?id=${data.info.id}&offer=${JSON.stringify(item)}`,
        })

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

  // 取消订单
  onCancelOrder() {
    let message = ''
    const status = data.info.status

    switch (status) {
      case 0:
        message = '当前等待报价中，是否确认取消订单?'
        break;
      default :
        message = '当前等待维修中,是否确认取消订单?'
        break;    
    }

    Dialog.confirm({
      title: '取消订单',
      message: message,
      confirmButtonText: '确定取消',
      cancelButtonText: '不，点错了'
    })
    .then(() => {
      this.setData({
        showCancel: true
      })
      // on confirm
    }).catch(() => {

    }) 
  },

  // 
  async getCancelReason() {
    let res = await cancelReason()
    if(!res.code) {
      this.setData({
        cancelList: res.data,
        cancelType: res.data[0].id
      })
    }
  },

  onChangeCancel(e) {
    const { name } = e.currentTarget.dataset;
    this.setData({
      cancelType: name
    })
  },

  async confirmPopup() {
    let res = await cancelOrder({id: data.info.id, cancel_reason_id: data.cancelType})
    if(!res.code) {
      wx.showToast({
        title: '已提交取消申请',
      })
      this.setData({
        showCancel: false
      }, () => {
        this.getData(data.info.id)
      })
    }
  },

  cancelPopup() {
    this.setData({
      showCancel: false
    })
  },

  // 验收
  async onConfirmCheck(e) {
    let res = await checkOrder({id: data.info.id})
    // console.log(res)
    if(!res.code) {
      wx.showToast({
        title: '已验收',
      })
      this.getData(data.info.id)
    }
  },

  async openMap(e) {
    const { lat, lng, name } = e.currentTarget.dataset;
    // console.log(lat, lng)
    let res = await openMap({latitude: lat, longitude: lng, name: name})
  },

  // 跳转评价
  onLinkRate() {
    wx.navigateTo({
      url: `/storePackage/rate/index?id=${data.info.id}`,
    })
  },

  onPhone() {
    wx.makePhoneCall({
      phoneNumber: data.offerList[0].phone,
    })
  },

  storeDetails(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: `/storePackage/store/index?id=${id}`,
    })
  }

})