/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const GET_OPERATION_LOG = 'GET_OPERATION_LOG' // 获取礼品列表

export const selectOperationLog = singleApi({ // 获取礼品列表
  url: baseURL() + '/log/selectOperationLog',
  action: (args, json) => {
    return {
      args,
      type: GET_OPERATION_LOG,
      data: json,
    }
  },
})
