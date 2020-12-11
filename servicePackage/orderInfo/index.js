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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    data = this.data
    this.oid = options.id
    this.getCancelReason()
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
    /* console.log(data)
    if(data.info && data.info.id) this.onLoad() */
    this.getData(this.oid)
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
        time: res.data.remain * 1000,
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
          /* let d = await setCalculateDistance({
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
          } */
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
    wx.previewImage({
      current: url,
      urls: data.info.images,
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
    const { lat, lng } = e.currentTarget.dataset;
    // console.log(lat, lng)
    let res = await openMap({latitude: lat, longitude: lng})
  },

  // 跳转评价
  onLinkRate() {
    wx.navigateTo({
      url: `/storePackage/rate/index`,
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