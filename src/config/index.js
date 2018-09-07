export const PRO_BASE = 'http://crmapi.admin.dfwsgroup.com'
export const PRO_TRANSFER = 'http://admin.dfwsgroup.com/#/'
export const PRO_LOGOUT = 'http://crmapi.admin.dfwsgroup.com/logout'
export const PRO_DICTURL = 'http://crmapi.admin.dfwsgroup.com/dict/get'

export const DEV_BASE = '/dfws-customer'
export const DEV_TRANSFER = 'http://10.10.50.161:8001/#/'
export const DEV_LOGOUT = 'http://10.10.29.106:8000/dfws-customer/logout'
export const DEV_DICTURL = '/dfws-customer/dict/get'

export const FAT_BASE = 'http://crmapi.admin.dfwsgroup.com'
export const FAT_TRANSFER = 'http://admin.dfwsgroup.com/#/'
export const FAT_LOGOUT = 'http://crmapi.admin.dfwsgroup.com/logout'
export const FAT_DICTURL = 'http://crmapi.admin.dfwsgroup.com/dict/get'

export const UAT_BASE = 'http://crmapi.admin.dfwsgroup.com'
export const UAT_TRANSFER = 'http://admin.dfwsgroup.com/#/'
export const UAT_LOGOUT = 'http://crmapi.admin.dfwsgroup.com/logout'
export const UAT_DICTURL = 'http://crmapi.admin.dfwsgroup.com/dict/get'
export const fileBaseurl = 'http://file-df.veimg.cn/'

export function baseURL() {
  switch (process.env.REACT_APP_API_ENV) {
    case 'pro':
      return PRO_BASE
    case 'dev':
      return DEV_BASE
    case 'fat':
      return FAT_BASE
    case 'uat':
      return UAT_BASE
    default:
      return DEV_BASE
  }
}

export function transfer() {
  switch (process.env.REACT_APP_API_ENV) {
    case 'pro':
      return PRO_TRANSFER
    case 'dev':
      return DEV_TRANSFER
    case 'fat':
      return FAT_TRANSFER
    case 'uat':
      return UAT_TRANSFER
    default:
      return DEV_TRANSFER
  }
}

export function logout() {
  switch (process.env.REACT_APP_API_ENV) {
    case 'pro':
      return PRO_LOGOUT
    case 'dev':
      return DEV_LOGOUT
    case 'fat':
      return FAT_LOGOUT
    case 'uat':
      return UAT_LOGOUT
    default:
      return DEV_LOGOUT
  }
}

export function dictUrl() {
  switch (process.env.REACT_APP_API_ENV) {
    case 'pro':
      return PRO_DICTURL
    case 'dev':
      return DEV_DICTURL
    case 'fat':
      return FAT_DICTURL
    case 'uat':
      return UAT_DICTURL
    default:
      return DEV_DICTURL
  }
}
