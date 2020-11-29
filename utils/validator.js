import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';

module.exports = {
  validatePhone(phone) {
    if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
      Toast.fail('手机号码不正确')
      return false;
    }
  },

  validateCarNumber(str) {
    if(!(/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/).test(str)) {
      Toast.fail('请输入正确车牌')
      return false
    }
  }
}