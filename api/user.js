//
import { $api } from '../utils/http'
module.exports = {
  getCarList() {
    return $api.get('/u/car')
  },

  deleteCar(data) {
    return $api.delete(`/u/car/${data.id}/delete`, data)
  },

  setDefaultCar(data) {
    return $api.put(`/u/car/${data.id}/focus`, data)
  },

  editCar(data) {
    return $api.put(`/u/car/${data.id}/edit`, data)
  },

  getPhone(data) {
    return $api.put(`/auth/wechat/phone`, data)
  },

  getCouponList(params) {
    return $api.get(`/u/coupon/self`, params)
  },

  getCoupon(data) {
    return $api.post(`/u/coupon/receive_random`, data)
  },

  // 提交投诉建议
  sendFeedback(data) {
    return $api.post(`/feedback/add`, data)
  }
}