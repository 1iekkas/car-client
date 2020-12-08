// servicePackage/store/index.js
import {
  openMap
} from '../../api/wxServer'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight, //导航栏高度
    menuHeight: app.globalData.menuHeight,
    showNav: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      title: '曼狄卡豪车升级改装中心（广州）',
      path: '/storePackage/store/index',
      imageUrl: '../../static/img/store.jpg'
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

  openMap() {
    openMap({
      latitude: 23.00944, // 纬度，范围为-90~90，负数表示南纬
      longitude: 113.12249
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
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    console.log(pages)
    if(prevPage) {
      wx.navigateBack({
        delta: 1
      })
    }else {
      wx.redirectTo({
        url: '/pages/map/index',
      })
    }
    
  }
})