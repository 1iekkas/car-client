//
import { $api } from '../utils/http'
module.exports = {
  getCarList() {
    return $api.get('/u/car')
  },

  getPhone(data) {
    return $api.put(`/u/user/phone`, data)
  }
}