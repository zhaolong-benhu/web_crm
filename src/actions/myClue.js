/**
 * Created by ll on 20/11/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const MYCLUE_DEFULATE_DATA_LIST = 'MYCLUE_DEFULATE_DATA_LIST' // 获取详情
export const MYCLUE_CHECK_REASON = 'MYCLUE_CHECK_REASON' // 查看反馈
export const MYCLUE_GET_NUMBER = 'MYCLUE_GET_NUMBER' // 获取个数

export const getMyClueList = singleApi({
  url: baseURL() + '/resources/queryMyClueByPage',
  action: (args, json) => {
    return {
      args,
      type: MYCLUE_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const checkReason = singleApi({
  url: baseURL() + '/resources/queryCheckReasonById',
  action: (args, json) => {
    return {
      args,
      type: MYCLUE_CHECK_REASON,
      data: json,
    }
  },
})

export const getNumber = singleApi({ // 获取个数
  url: baseURL() + '/resources/queryMyToExamineCount',
  action: (args, json) => {
    return {
      type: MYCLUE_GET_NUMBER,
      data: json,
    }
  },
})
