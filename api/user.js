//
import { $api } from '../utils/http'
module.exports = {
  getCarList() {
    return $api.get('/u/car')
  }
}