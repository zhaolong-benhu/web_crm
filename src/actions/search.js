/**
 * Created by huangchao on 20/11/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const SET_QUERY_BEST = 'SET_QUERY_BEST' // 获取基础配置
export const SET_QUERY_ITEM = 'SET_QUERY_ITEM' // 获取搜索项配置
export const SET_HAS_SELECT_QUERY_ITEM = 'SET_HAS_SELECT_QUERY_ITEM' // 获取已选择的item
export const SELECT_ROW_KEYS = 'SELECT_ROW_KEYS' // list选择的key
export const SELECT_HEI_QUERY_KEYS = 'SELECT_HEI_QUERY_KEYS' // 高级搜索选择的key
export const SAVE_USER_CHECKOUT = 'SAVE_USER_CHECKOUT' // 保存用户选择的item
export const SELECT_SORT_TABLE = 'SELECT_SORT_TABLE' // 高级搜索排序
export const DELETE_SELECT_ITEM = 'DELETE_SELECT_ITEM' // 删除勾选的状态

export const getQueyBest = singleApi({
  url: baseURL() + '/search/getDefaultSearch',
  action: (args, json) => {
    return {
      type: SET_QUERY_BEST,
      data: json.data,
    }
  },
})

export const getHasSelectitem = singleApi({
  url: baseURL() + '/search/getSearchIndiv',
  action: (args, json) => {
    return {
      type: SET_HAS_SELECT_QUERY_ITEM,
      data: json.data,
    }
  },
})

export const selectKey = (keys) => {
  return {
    type: SELECT_ROW_KEYS,
    data: keys,
  }
}

export const selectHeiKey = (data) => {
  return {
    type: SELECT_HEI_QUERY_KEYS,
    data: data,
  }
}

export const getQeryData = singleApi({
  url: baseURL() + '/search/getSearchList',
  action: (args, json) => {
    return {
      type: SET_QUERY_ITEM,
      data: json.data,
    }
  },
})
export const saveUserChecked = singleApi({
  url: baseURL() + '/search/addSearch',
  action: (args, json) => {
    return {
      args,
      type: SAVE_USER_CHECKOUT,
      data: json,
    }
  },
})

export const sortTable = singleApi({
  url: baseURL() + '/search/updateSort',
  action: (args, json) => {
    return {
      type: SELECT_SORT_TABLE,
      data: json,
    }
  },
})

export const deleteSelect = {
  type: DELETE_SELECT_ITEM,
}
