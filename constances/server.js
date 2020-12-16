const env = wx.getAccountInfoSync().miniProgram.envVersion


let url = ''
switch (env) {
  case 'develop':
   url = 'https://cartest.coasewash.com'
    break;
  case 'trial':
   url = 'https://cartest.coasewash.com'
    break;
  default:
    url = 'https://car.coasewash.com'
    break;
}

export const IMG_HOST = url // 请求域名
export const baseUrl = url