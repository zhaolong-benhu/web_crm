/**
 * Created by huangchao on 20/11/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const RESOURCE_DEFULATE_DATA_LIST = 'RESOURCE_DEFULATE_DATA_LIST' // 获取初始化list
export const ADD_POOL_RESOURCE = 'ADD_POOL_RESOURCE'//分配到公海
export const MERGE_GET_CUSTOMER = 'MERGE_GET_CUSTOMER'//合并客户-获取合并的两条数据
export const MERGE_TO_CUSTOMER = 'MERGE_TO_CUSTOMER'//合并勾选的客户
export const GET_DICTIONARIES = 'GET_DICTIONARIES' // 属性值接口
export const SELECT_POOLLIST = 'SELECT_POOLLIST' // 可分配的公海列表
export const RESOURCE_QUERY_LIST = 'RESOURCE_QUERY_LIST' // 基本搜索
export const RESOURCE_HEI_QUERY_LIST = 'RESOURCE_HEI_QUERY_LIST' // 高级搜索

export const getInitList = singleApi({ // 基本搜索
  url: baseURL() + '/resources/queryAllResourcesByPage',
  action: (args, json) => {
    return {
      args,
      type: RESOURCE_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const geiHeiList = singleApi({ // 高级搜索
  url: baseURL() + '/resources/queryAdvResByPage',
  action: (args, json) => {
    return {
      args,
      type: RESOURCE_HEI_QUERY_LIST,
      data: json,
    }
  },
})

export const addPoolResource = singleApi({ // 资源分配到公海
    url: baseURL() + '/resources/addPoolResource',
    action: (args, json) => {
        return {
            args,
            type: ADD_POOL_RESOURCE,
            data: json,
        }
    },
})

export const mergeGetCustomer = singleApi({ // 查询合并的客户
    url: baseURL() + '/resources/mergeGetCustomer',
    action: (args, json) => {
        return {
            args,
            type: MERGE_GET_CUSTOMER,
            data: json,
        }
    },
})

export const mergeToCustomer = singleApi({ // 确定合并客户
    url: baseURL() + '/resources/mergeToCustomer',
    action: (args, json) => {
        return {
            args,
            type: MERGE_TO_CUSTOMER,
            data: json,
        }
    },
})

// 属性接口
export const getDictionaries = singleApi({
  url: baseURL() + '/search/getDictionaries',
  action: (args, json) => {
    return {
      args,
      type: GET_DICTIONARIES,
      data: json,
    }
  },
})

// 可分配的公海列表
export const selectPoolList = singleApi({
  url: baseURL() + '/pool/selectPoolList',
  action: (args, json) => {
    return {
      args,
      type: SELECT_POOLLIST,
      data: json,
    }
  },
})
