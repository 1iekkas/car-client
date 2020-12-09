import { $api } from '../utils/http'
module.exports = {
  getStoreList(params) {
    return $api.get('/u/shop',{
      ...params
    })
  },

  getStoreInfo(params) {
    return $api.get(`/u/shop/${params.id}/read/${params.lat}/${params.lnt}`)
  }

}