// components/date/index.js
const dateTimePicker = require('../../utils/dateTimePicker.js'); // components/pikerTime/index.js 
Component({
  /** * 组件的属性列表 */
  properties: {},
  /** * 组件的初始数据 */ data: {},
  lifetimes: {
    attached() {
      this.startTime()
    }
  },
  /** * 组件的方法列表 */ methods: {
    startTime() {
      var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      var lastArray = obj.dateTimeArray.pop();
      var lastTime = obj.dateTime.pop();
      this.setData({
        dateTimeArray: obj.dateTimeArray,
        dateTime: obj.dateTime
      },() => {
        const value = `${this.data.dateTimeArray[0][this.data.dateTime[0]]}-${this.data.dateTimeArray[1][this.data.dateTime[1]]}-${this.data.dateTimeArray[2][this.data.dateTime[2]]} ${this.data.dateTimeArray[3][this.data.dateTime[3]]}:${this.data.dateTimeArray[4][this.data.dateTime[4]]}`
        // console.log('初始化')
        this.triggerEvent('set', {value})
      })
    },
    changeDateTime(e) {
      this.setData({
        dateTime: e.detail.value
      }, () => {
        const value = `${this.data.dateTimeArray[0][this.data.dateTime[0]]}-${this.data.dateTimeArray[1][this.data.dateTime[1]]}-${this.data.dateTimeArray[2][this.data.dateTime[2]]} ${this.data.dateTimeArray[3][this.data.dateTime[3]]}:${this.data.dateTimeArray[4][this.data.dateTime[4]]}`
        this.triggerEvent('set', {value})
      });
    },
    changeDateTimeColumn(e) {
      var arr = this.data.dateTime,
        dateArr = this.data.dateTimeArray;
      arr[e.detail.column] = e.detail.value;
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
      this.setData({
        dateTimeArray: dateArr,
        dateTime: arr
      },() => {
        const value = `${this.data.dateTimeArray[0][this.data.dateTime[0]]}-${this.data.dateTimeArray[1][this.data.dateTime[1]]}-${this.data.dateTimeArray[2][this.data.dateTime[2]]} ${this.data.dateTimeArray[3][this.data.dateTime[3]]}:${this.data.dateTimeArray[4][this.data.dateTime[4]]}`
        this.triggerEvent('set', {value})
      });
    }
  }
})