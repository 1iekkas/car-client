// servicePackage/store/index.js
import {
  getStoreInfo
} from '../../api/store'
import {
  openMap
} from '../../api/wxServer'
const app = getApp()
let data 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuHeight: app.globalData.menuHeight,
    showNav: false,
    IMG_HOST: app.globalData.IMG_HOST
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let pages = getCurrentPages();
    this.prevPage = pages[pages.length - 2];  
    console.log(`id:${JSON.stringify(options)}`)
    data = this.data
    this.storeId = options.id
    
    if(!this.prevPage) {
      console.log('执行1')
      // console.log(app.globalData.location)
      if(app.globalData.location) {
        this.getStoreInfo({
          id: options.id,
          lat: app.globalData.location.location.lat,
          lnt: app.globalData.location.location.lng
        })

        return false
      }
      // 定位回调
      app.locationReadyCallback = res => {
        // console.log('定位回调')
        this.getStoreInfo({
          id: options.id,
          lat: res.location.lat,
          lnt: res.location.lng
        })
      }
    }else {
      console.log('执行2')
      this.getStoreInfo({
        id: options.id,
        lat: app.globalData.location.location.lat,
        lnt: app.globalData.location.location.lng
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
    return {
      title: data.store.name,
      path: `/storePackage/store/index?id=${data.store.id}`,
      imageUrl: data.store.facade_images[0]
    }
  },

  onPageScroll: function (e) {
    const top = e.scrollTop;
    if (top > 200) {
      this.setData({
        showNav: true
      })
    } else {
      this.setData({
        showNav: false
      })
    }
    // Do something when page scroll
  },

  async getStoreInfo(params) {
    let res = await getStoreInfo({
      ...params
    })

    if (!res.code) {
      console.log(`店铺信息：${JSON.stringify(res.data)}`)
      res.data.distance = (res.data.distance / 1000).toFixed(0)
      this.setData({
        store: res.data
      })
    }
  },

  openMap() {
    openMap({
      latitude: data.store.lat, // 纬度，范围为-90~90，负数表示南纬
      longitude: data.store.lnt,
      name: data.store.name
    })
  },

  // 图片预览
  onPreview(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: 'https://img.yzcdn.cn/vant/cat.jpeg',
      urls: ['https://img.yzcdn.cn/vant/cat.jpeg'],
    })
  },

  onClickIcon() {
    wx.showToast({
      icon: 'none',
      mask: true,
      title: '未开放'
    })
  },

  back() {
    
    if (this.prevPage) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.redirectTo({
        url: '/pages/map/index',
      })
    }

  }
})