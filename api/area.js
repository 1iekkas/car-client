import { $api } from '../utils/http'
const host = 
module.exports = {
  getAreaList(params) {
    return $api.get(`/api/region/list`,{
      ...params
    })
  }
}