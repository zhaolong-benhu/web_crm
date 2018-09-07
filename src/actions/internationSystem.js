/**
 * Created by ll on 16/01/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const INTERNATION_DEFULATE_DATA_LIST = 'INTERNATION_DEFULATE_DATA_LIST' // 获取公海列表
export const SELECT_POOLID = 'SELECT_POOLID' // list选择的key
export const UPDATE_POOL_ENABLE = 'UPDATE_POOL_ENABLE' // 启用禁用
export const MERGE_GET_CUSTOMER = 'MERGE_GET_CUSTOMER' //合并客户

export const getInternationList = singleApi({
  url: baseURL() + '/pool/poolList',
  action: (args, json) => {
    return {
      args,
      type: INTERNATION_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const selectPoolId = (keys) => {
  return {
    type: SELECT_POOLID,
    data: keys,
  }
}

export const updatePoolEnable = singleApi({
  url: baseURL() + '/pool/updatePoolEnable',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_POOL_ENABLE,
      data: json,
    }
  },
})

export const custom = (data) => {
    return {
        type: MERGE_GET_CUSTOMER,
        data: data.data,
    }
}
