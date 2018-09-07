/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const SELECT_ALL_DELAY = 'SELECT_ALL_DELAY' // 获取协同客户初始化list

export const selectAllDelay = singleApi({ // 获取协同客户初始化list
  url: baseURL() + '/myClient/selectAllDelay',
  action: (args, json) => {
    return {
      args,
      type: SELECT_ALL_DELAY,
      data: json,
    }
  },
})
