/**
 * Created by huangchao on 17/11/2017.
 */
import store from 'store'
import { baseURL } from '../config'
import { pipeline } from '../helper/fetching'

export const login = params => {
  return pipeline(baseURL() + '/login', params).then(payload => {
    if (payload.code === 0) {
      store.set('crm', payload.data)
      return payload
    }
    throw payload
  })
}

export const getDictionaries = () => {
  return pipeline(baseURL() + '/search/getDictionaries').then(data => {
    store.set('crm:queryList', data.data)
  })
}

export const queryUserInfo = params => {
  return pipeline(baseURL() + '/user/queryUserInfo', params).then(data => {
    return data.data
  })
}
