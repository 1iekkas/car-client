// userPackage/carList/index.js
import { getCarBrand } from '../../api/car'
import { IMG_HOST } from '../../constances/server'
const app = getApp()
const api = app.$api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    keys: [],
    brand: [],
    show: false,
    activeBrand: null,
    seriesList: [], // 车系列表
    activeSeries: null, // 选中的车系
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      IMG_HOST: IMG_HOST
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {
    await this.getCarBrand()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  /* onShareAppMessage: function() {

  }, */

  // 获取品牌列表
  async getCarBrand() {
    const data = this.data
    let res = await getCarBrand({
      type: 'brand',
      from: 0,
      pagesize: 300
    }, false)
    if (res.statusCode == 200) {
      // 处理数据
      let keys = res.data.map(e => e.firstletter)
      /* for(let i = 0 ; i < 26; i++) {
        keys.push(String.fromCharCode((65 + i)))
      } */
      let brand = [...new Set(keys)].map(e => ({
        key: e,
        list: []
      }))

      brand.map((el, index) => {
        res.data.filter(e => {
          if (e.firstletter == el.key) {
            brand[index].list.push(e)
          }
        })

      })

      this.setData({
        brand: brand,
        keys: [...new Set(keys)],
        loading: false
      })

    }
  },
  
  // 关闭popup
  onClosePopup() {
    this.setData({
      activeBrand: null,
      show: false
    })
  },

  // 选中项
  async select(e) {
    const item = e.currentTarget.dataset.item;
    console.log(item)
    let factory = await this.getFactory(item.id) //厂家
    let series = await this.getCarSeries(item.id) // 车系 废弃接口
    
    // 如果没有数据 终止逻辑
    if(!factory) return false
    
    // 处理数据 废弃
    factory.map((el, index) => {
      factory[index].list = []
      series.filter(e => {
        if(el.id == e.group_id) {
          factory[index].list.push(e)
        }
      })
    })
    
    // console.log(factory)
    this.setData({
      activeBrand: item,
      show: true,
      activeSeries: 0,
      seriesList: factory
    })
  },
  
  // 获取厂家
  async getFactory(id) {
    let res = await getCarFactory({
      id: id,
    }, false)
    console.log(res)
    if(res.statusCode == 200) {
      return res.data
    }else {
      wx.showModal({
        content: res.data.info
      })
      
      return false
    }
  },
  
  // 获取厂家
  async getFactory(id) {
    let res = await api.get('https://tool.bitefu.net/car/', {
      type: 'series_group',
      from: 0,
      brand_id: id,
      pagesize: 50
    }, false)
    if(res.statusCode == 200 && res.data.status == 1) {
      return res.data.info
    }else {
      wx.showModal({
        content: res.data.info
      })
      
      return false
    }
  },
  
  // 获取车型
  async getCarSeries(id) {
    let res = await api.get('https://tool.bitefu.net/car/', {
      type: 'series',
      from: 0,
      brand_id: id,
      pagesize: 50
    }, false)
    if(res.statusCode == 200) {
      return res.data.info 
    }
  },

  // 选择车系
  onSelectSeries(e) {
    let series = e.currentTarget.dataset.series;
    series.brand_logo = this.data.activeBrand.img
    
    this.setData({
      activeSeries: series
    })
  },
  
  // 确认选择
  onConfirmSelect() {
    wx.navigateTo({
      url: `/userPackage/carInfo/index?series=${JSON.stringify(this.data.activeSeries)}`
    })
  }
  
})
