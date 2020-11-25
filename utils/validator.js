import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';

module.exports = {
  validatePhone(phone) {
    if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
      Toast.fail('手机号码不正确')
      return false;
    }
  }
}