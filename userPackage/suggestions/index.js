// userPackage/suggestions/index.js
import { sendFeedback } from '../../api/user'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '',
    autosize: {
      minHeight: 150
    },
    loading: false
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

  },

  onChange(e) {
    this.setData({
      message: e.detail.value
    })
  },

  async onSubmit() {
    this.setData({
      loading: true
    })
    let res = await sendFeedback({
      content: this.data.message
    }) 

    if(!res.code) {
      wx.showToast({
        mask: true,
        duration: 2000,
        title: '提交成功',
        success: () => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }

    this.setData({
      loading: false
    })
  }
})