// userPackage/order/index.js
import { getOrderList } from '../../api/order'
const app = getApp()
let data 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: '0',
      name: '全部',
      list: [],
      page: 1,
      max: 3
    },{
      id: '1',
      name: '已发布',
      list: [],
      page: 1,
      max: 3
    },{
      id: '2',
      name: '待付款',
      list: [],
      page: 1,
      max: 3
    },{
      id: '3',
      name: '待维修',
      list: [],
      page: 1,
      max: 3
    },{
      id: '4',
      name: '待评价',
      list: [],
      page: 1,
      max: 3
    },{
      id: '5',
      name: '已完成',
      list: [],
      page: 1,
      max: 3
    }],
    list: [],
    page: 1,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
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
    this.getList()
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
  /* onShareAppMessage: function () {

  } */
  
  // 获取列表
  async getList() {
    let res = await getOrderList()
    
    if(!res.data.code) {
      console.warn('success')
      this.setData({
        list: res.data.data
      },() => {
        console.log(data.list)
      })
    }else {

    }
  },

  //
  linkToInfo(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/servicePackage/orderInfo/index?id=${id}`,
    })
  }
})