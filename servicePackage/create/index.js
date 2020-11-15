// servicePackage/create/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autosize: {
      minHeight: 150
    },
    isLocation: false,
    fileList: [{
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        name: '图片1',
        isImage: true,
        deletable: true,
      },
      // Uploader 根据文件后缀来判断是否为图片文件
      // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      {
        url: 'http://iph.href.lu?text=default',
        url: 'http://iph.href.lu/60x60?text=default',
        name: '图片2',
        isImage: true,
        deletable: true,
      },
      {
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        name: '图片1',
        isImage: true,
        deletable: true,
      },
      {
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        name: '图片1',
        isImage: true,
        deletable: true,
      },
      {
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        name: '图片1',
        isImage: true,
        deletable: true,
      },
    ]
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
  onShow: function() {

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

  /**
   * 上传图片
   */
  afterRead(event) {
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      formData: {
        user: 'test'
      },
      success(res) {
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = this.data;
        fileList.push({ ...file,
          url: res.data
        });
        this.setData({
          fileList
        });
      },
    });
  },

  /** */
  onChange(event) {
    this.setData({
      isLocation: event.detail,
    });
  },

})
