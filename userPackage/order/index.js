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
      id: 'all',
      name: '全部',
      list: [],
      page: 1,
      max: 3
    },{
      id: '0',
      name: '报价中',
      list: [],
      page: 1,
      max: 3
    },{
      id: '1,2',
      name: '待维修',
      list: [],
      page: 1,
      max: 3
    },{
      id: '3',
      name: '待交付',
      list: [],
      page: 1,
      max: 3
    },{
      id: '4',
      name: '已完成',
      list: [],
      page: 1,
      max: 3
    },{
      id: '5,6,7,8',
      name: '已取消',
      list: [],
      page: 1,
      max: 3
    }],
    active: 'all',
    list: [],
    page: 1,
    total: 1,
    triggered: false,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    data = this.data
    this.setData({
      active: options.status || 'all'
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
    this.setData({
      list: [],
      page: 1,
      loading: true
    })
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

  async onRefresh() {
    if (this._freshing || data.loading) return
    this.setData({
      page: 1,
      triggered: true
    })
    this._freshing = true
    await this.getList()
    this._freshing = false
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },

  // 切换列表
  changeTabs(e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      active: e.detail.name,
      list: [],
      loading: true
    },() => {
      this.getList()
    })
  },
  
  // 获取列表
  async getList() {
    let res = await getOrderList({
      status: data.active === 'all' ? '' : data.active,
    })
    if(!res.data.code) {
      if(data.triggered) {
        data.list = []
      }

      data.list = data.list.concat(res.data.data)
      //console.log(data.list)
      this.setData({
        list: data.list,
        triggered: false,
        loading: false,
        page: data.page + 1,
        total: res.data.last_page
      })
    }
  },

  // 跳转详情
  linkToInfo(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/servicePackage/orderInfo/index?id=${id}`,
    })
  },

  // 分页加载
  lower() {
    if(this.loading || data.page > data.total) return false
    this.loading = true
    this.setData({
      loading: true
    },() => {
      this.getList()
    })
  },
})