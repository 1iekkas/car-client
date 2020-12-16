import { $api } from '../utils/http'
module.exports = {
  getStoreList(params) {
    return $api.get('/u/shop',{
      ...params
    })
  },

  getStoreInfo(params) {
    return $api.get(`/u/shop/${params.id}/read/${params.lat}/${params.lnt}`)
  },

  // 评价列表
  getCommentList(params) {
    return $api.get(`/u/shop/${params.id}/comments/${params.page_size}`, params)
  }

}