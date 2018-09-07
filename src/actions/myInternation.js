/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const MYPOOL_DEFULATE_DATA_LIST = 'MYPOOL_DEFULATE_DATA_LIST' // 获取我的客户初始化list
export const INSERT_MYCLIENT_TOPOOL = 'INSERT_MYCLIENT_TOPOOL' // 分配到公海
export const SELECT_POOL_BYUSERID = 'SELECT_POOL_BYUSERID' // 查询所属公海

export const getMyPoolCus = singleApi({ // 我的客户列表
  url: baseURL() + '/pool/getMyPoolCus',
  action: (args, json) => {
    return {
      args,
      type: MYPOOL_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const insertMyClientToPool = singleApi({
  url: baseURL() + '/pool/insertMyClientToPool',
  action: (args, json) => {
    return {
      args,
      type: INSERT_MYCLIENT_TOPOOL,
      data: json,
    }
  },
})

export const selectPoolByUserId = singleApi({
  url: baseURL() + '/pool/selectPoolByUserId',
  action: (args, json) => {
    return {
      args,
      type: SELECT_POOL_BYUSERID,
      data: json,
    }
  },
})
