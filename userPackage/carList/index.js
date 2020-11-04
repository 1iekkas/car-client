// userPackage/carList/index.js
const app = getApp()
const api = app.$api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keys: [],
    brand: [],
    show: false,
    activeBrand: null,
    seriesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  onShareAppMessage: function() {

  },

  // 获取品牌列表
  async getCarBrand() {
    const data = this.data
    let res = await api.get('https://tool.bitefu.net/car/', {
      type: 'brand',
      from: 0,
      pagesize: 300
    })
    if (res.statusCode == 200) {
      // 处理数据
      let keys = res.data.info.map(e => e.firstletter)
      /* for(let i = 0 ; i < 26; i++) {
        keys.push(String.fromCharCode((65 + i)))
      } */
      let brand = [...new Set(keys)].map(e => ({
        key: e,
        list: []
      }))

      brand.map((el, index) => {
        res.data.info.filter(e => {
          if (e.firstletter == el.key) {
            brand[index].list.push(e)
          }
        })

      })

      this.setData({
        brand: brand,
        keys: [...new Set(keys)]
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
    
    let factory = await this.getFactory(item.id) //厂家
    let series = await this.getCarSeries(item.id)
    
    //
    factory.map((el, index) => {
      factory[index].list = []
      series.filter(e => {
        if(el.id == e.group_id) {
          factory[index].list.push(e)
        }
      })
    })
    
    console.log(factory)
    this.setData({
      activeBrand: item,
      show: true,
      seriesList: factory
    })
  },
  
  // 获取厂家
  // https://tool.bitefu.net/car/?type=series_group&from=0&brand_id=33&pagesize=50
  async getFactory(id) {
    let res = await api.get('https://tool.bitefu.net/car/', {
      type: 'series_group',
      from: 0,
      brand_id: id,
      pagesize: 50
    })
    if(res.statusCode == 200) {
      return res.data.info
    }
  },
  
  // 获取车型
  async getCarSeries(id) {
    let res = await api.get('https://tool.bitefu.net/car/', {
      type: 'series',
      from: 0,
      brand_id: id,
      pagesize: 50
    })
    if(res.statusCode == 200) {
      return res.data.info 
    }
  },
  
})
