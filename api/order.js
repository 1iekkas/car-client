import { $api } from '../utils/http'
module.exports = {
  getOrderList() {
    return $api.get('/u/order',{page_size: 30})
  },

  getWaitOrderInfo(params) {
    return $api.get(`/u/order/${params.id}`)
  },

  // 获取报价列表
  getOffer(params) {
    return $api.get(`/u/offer/${params.id}`)
  }
}