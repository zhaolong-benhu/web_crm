/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const MYCLIENT_DEFULATE_DATA_LIST = 'MYCLIENT_DEFULATE_DATA_LIST' // 获取我的客户初始化list
export const INSERT_MY_CLIENT = 'INSERT_MY_CLIENT' // 获取我的客户初始化list
export const MYCLIENT_HEI_QUERY_LIST = 'MYCLIENT_HEI_QUERY_LIST' // 高级搜索
export const ADD_REMIND = 'ADD_REMIND' // 预设跟进提醒
export const MYCLIENT_CONTACTOR_LIST = 'MYCLIENT_CONTACTOR_LIST' // 联系人列表

export const geiHeiList = singleApi({ // 高级搜索
  url: baseURL() + '/myClient/queryMyClientAdv',
  action: (args, json) => {
    return {
      args,
      type: MYCLIENT_HEI_QUERY_LIST,
      data: json,
    }
  },
})

export const getMyClientList = singleApi({ // 我的客户列表
  url: baseURL() + '/myClient/queryMyClientByPage',
  action: (args, json) => {
    return {
      args,
      type: MYCLIENT_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const insertMyClient = singleApi({ // 揽入客户
  url: baseURL() + '/myClient/insertMyClient',
  action: (args, json) => {
    return {
      args,
      type: INSERT_MY_CLIENT,
      data: json,
    }
  },
})

export const addRemind = singleApi({ // 预设跟进提醒
  url: baseURL() + '/remind/addRemind',
  action: (args, json) => {
    return {
      args,
      type: ADD_REMIND,
      data: json,
    }
  },
})

export const getContactorNames = singleApi({ // 预设跟进提醒
  url: baseURL() + '/customer/selectAllPersonPhone',
  action: (args, json) => {
    return {
      args,
      type: MYCLIENT_CONTACTOR_LIST,
      data: json,
    }
  },
})