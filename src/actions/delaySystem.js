/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const SELECT_DELAY_LIST = 'SELECT_DELAY_LIST' // 延期列表
export const INSERT_DELAY = 'INSERT_DELAY' // 申请延期
export const INSERT_DELAY_CHECK = 'INSERT_DELAY_CHECK' // 延期列表审核
export const SELECT_DELAY_RESULT = 'SELECT_DELAY_RESULT' //查看延期理由

export const selectDelayList = singleApi({ // 延期列表
  url: baseURL() + '/delay/selectDelayList',
  action: (args, json) => {
    return {
      args,
      type: SELECT_DELAY_LIST,
      data: json,
    }
  },
})

export const insertDelay = singleApi({ // 延期列表
  url: baseURL() + '/delay/insertDelay',
  action: (args, json) => {
    return {
      args,
      type: INSERT_DELAY,
      data: json,
    }
  },
})

export const insertDelayCheck = singleApi({ // 延期审核
  url: baseURL() + '/delay/insertDelayCheck',
  action: (args, json) => {
    return {
      args,
      type: INSERT_DELAY_CHECK,
      data: json,
    }
  },
})

export const selectDelayResult = singleApi({ // 延期审核
  url: baseURL() + '/delay/selectDelayResult',
  action: (args, json) => {
    return {
      args,
      type: SELECT_DELAY_RESULT,
      data: json,
    }
  },
})
