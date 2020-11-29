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

  getPhone(data) {
    return $api.put(`/u/user/phone`, data)
  }
}