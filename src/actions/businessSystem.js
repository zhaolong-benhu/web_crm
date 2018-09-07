/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const BUSINESS_DEFULATE_DATA_LIST = 'BUSINESS_DEFULATE_DATA_LIST' // 获取商机管理初始化list
export const ADD_BUSINESS_OPPO = 'ADD_BUSINESS_OPPO' // 添加商机
export const GET_BUSINESS_ONE = 'GET_BUSINESS_ONE' // 根据id获取单条商机
export const DELETE_BUSINESS_ONE = 'DELETE_BUSINESS_ONE' // 根据id获取单条商机
export const GET_PRODUCT_LIST = 'GET_PRODUCT_LIST' // 产品列表
export const BUSINESS_HEI_QUERY_LIST = 'BUSINESS_HEI_QUERY_LIST' // 高级搜索

export const geiHeiList = singleApi({ // 高级搜索
  url: baseURL() + '/business/opportListAdv',
  action: (args, json) => {
    return {
      args,
      type: BUSINESS_HEI_QUERY_LIST,
      data: json,
    }
  },
})

export const getBusinesstList = singleApi({ // 商机管理列表
  url: baseURL() + '/business/opportList',
  action: (args, json) => {
    return {
      args,
      type: BUSINESS_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const addOpport = singleApi({ // 添加商机
  url: baseURL() + '/business/addOpport',
  action: (args, json) => {
    return {
      args,
      type: ADD_BUSINESS_OPPO,
      data: json,
    }
  },
})

export const getOpportById = singleApi({ // 根据id获取单条商机
  url: baseURL() + '/business/getOpportById',
  action: (args, json) => {
    return {
      args,
      type: GET_BUSINESS_ONE,
      data: json,
    }
  },
})

export const deleteBusiness = singleApi({ // 作废商机
  url: baseURL() + '/business/deleteBusiness',
  action: (args, json) => {
    return {
      args,
      type: DELETE_BUSINESS_ONE,
      data: json,
    }
  },
})

export const getProductList = singleApi({ // 产品列表
  url: baseURL() + '/product/getProductList',
  action: (args, json) => {
    return {
      args,
      type: GET_PRODUCT_LIST,
      data: json,
    }
  },
})
