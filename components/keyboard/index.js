// components/keyboard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    isProvince: true,
    province: [
      ['陕','京','津','沪','冀','豫','云','辽'],
      ['黑','湘','皖','鲁','新','苏','浙','赣'],
      ['鄂','桂','甘','晋','蒙','吉','闽','贵'],
      ['粤','川','青','藏','琼','宁','渝', '港'],
      ['澳', '警', '挂', '使', '领']
    ],
    number: [
      ['1','2','3','4','5','6','7','8','9','0'],
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M', 'del']
    ],
    result: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const { type , value } = e.currentTarget.dataset;
      let isProvince = false
      if(type === 0) isProvince = false

      // 判断删除
      if(value === 'del') {
        this.data.result = this.data.result.slice(0, this.data.result.length - 1)
        if(this.data.result.length === 0) isProvince = true
      } else {
        if(this.data.result.length < 8) {
          this.data.result = this.data.result + value
        }
      }

      this.setData({
        isProvince: isProvince,
        result: this.data.result
      },() => {
        // set
        // console.log(this.data.result)
        this.triggerEvent('set', this.data.result)
      })
    },

    // 关闭键盘
    onClose() {
      this.setData({
        show: !this.data.show
      })
    }
  }
})
