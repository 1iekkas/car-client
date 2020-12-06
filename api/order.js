import { $api } from '../utils/http'
module.exports = {
  getOrderList(params) {
    return $api.get('/u/order',{
      ...params,
      page_size: 10
    })
  },

  getWaitOrderInfo(params) {
    return $api.get(`/u/order/${params.id}`)
  },

  // 获取报价列表
  getOffer(params) {
    return $api.get(`/u/offer/${params.id}`)
  },

  // 选择报价
  pickOffer(data) {
    return $api.put(`/u/order/pick_offer`, data)
  },

  // 订单验收
  checkOrder(data) {
    return $api.put(`/u/order/${data.id}/check`, data)
  },

  // 获取支付配置
  getPayParams(data) {
    return $api.post(`/u/order/pay`, data)
  },

  // 取消订单
  cancelOrder(data) {
    return $api.put(`/u/order/${data.id}/cancel`, data)
  },

  // 取消原因
  cancelReason(data={}) {
    return $api.get(`/u/order/reason`, data)
  }
}