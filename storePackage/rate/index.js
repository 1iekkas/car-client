// storePackage/rate/index.js
const md5 = require('../../utils/md5.js')
import { IMG_HOST } from '../../constances/server' 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: null,
    autosize: {
      minHeight: 100
    },
    fileList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      IMG_HOST: IMG_HOST,
      store: JSON.parse(options.offer)
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

  getStr() {
    /** */
    let signature = '';
    const timestamp = (parseInt(new Date().getTime() / 1000))
    const rand1 = (parseInt(Math.random(1, 1) * 1000)).toString()
    const rand2 = (parseInt(Math.random(1, 2) * 10000)).toString()
    const nonce = timestamp + rand1 + rand2
    signature = md5.md5(timestamp + nonce + 'Zgc3a7jNqANK2nbVBluSgxKKaXZs0A')
    //console.log(signature)
    return {
      timestamp: timestamp,
      rand1: rand1,
      rand2: rand2,
      nonce: timestamp + rand1 + rand2,
      signature: signature.toLocaleLowerCase(),
    }
  
  },

  /**
   * 上传图片
   */
  afterRead(event) {
    
    const {
      file
    } = event.detail;
    
    file.map(e => {
      this.upload(e)
    })
    
  },

  upload(file) {
    const signature = this.getStr()
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
    });
    console.log('upload')
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: `https://car.coasewash.com/u/upload?timestamp=${signature.timestamp}&nonce=${signature.nonce}&key=Zgc3a7jNqANK2nbVBluSgxKKaXZs0A&signature=${signature.signature}`, // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: signature,
      success:res => {
        res = JSON.parse(res.data)
        // console.log(res)
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = this.data;
        fileList.push({ ...file,
          url: 'https://car.coasewash.com/' + res[0],
          isImage: true,
          deletable: true
        });

        console.log(fileList)

        this.setData({
          fileList
        });
      },
      complete: c => {
        Toast.clear()
      }
    });
  },
})