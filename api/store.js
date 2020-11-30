import { $api } from '../utils/http'
module.exports = {
  getStoreList(params) {
    return $api.get('/u/shop',{
      ...params
    })
  }

}