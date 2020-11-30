import { $api } from '../utils/http'
module.exports = {
  getCarBrand(params) {
    return $api.get('/u/car/brand',{
      ...params
    })
  },

  getCarFactory(params) {
    return $api.get(`/u/car/series_group/${params.id}`)
  },

  getCarSeries(params) {
    return $api.get(`/u/car/series/${params.id}`)
  }

}