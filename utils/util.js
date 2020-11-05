const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const EARTH_RADIUS = 6378.137
const range = 500

const rad = d => {
  return d * Math.PI / 180.0;
}

const getDistance = (lng1, lat1, lng2, lat2) => {

}

module.exports = {
  formatTime: formatTime,
  getDistance: getDistance
}
