import { $api } from '../utils/http'
module.exports = {
  getSwipeList(params) {
    return $api.get('/u/banner/2',{
      ...params
    })
  },

}