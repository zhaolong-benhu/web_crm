/**
 * Created by ll on 16/01/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const QUERY_AUTO_POOL_RULE = 'QUERY_AUTO_POOL_RULE' // 获取管理员/成员列表
export const ENABLE_AUTO_POOL_RULE = 'ENABLE_AUTO_POOL_RULE' // 获取管理员/成员列表
export const QUERY_OTHER_POOL_RULE = 'QUERY_OTHER_POOL_RULE' // 获取管理员/成员列表
export const GET_FORM_LIST = 'GET_FORM_LIST' // 所有通用表单接口
export const QUERY_AUTO_POOLRULE_HANDNUMBER = 'QUERY_AUTO_POOLRULE_HANDNUMBER' // 所有通用表单接口
export const ADD_AUTO_POOL_RULE = 'ADD_AUTO_POOL_RULE' // 添加自动划入公海规则
export const UPDATE_AUTO_POOL_RULE = 'UPDATE_AUTO_POOL_RULE' // 添加自动划入公海规则
export const QUERY_ONE_AUTO_POOL_RULE = 'QUERY_ONE_AUTO_POOL_RULE' // 添加自动划入公海规则
export const DELETE_AUTO_POOL_RULE = 'DELETE_AUTO_POOL_RULE' // 删除单条自动划入公海规则
export const INSERT_OTHER_POOL_RULE = 'INSERT_OTHER_POOL_RULE' // 添加其他规则
export const UPDATE_OTHER_POOL_RULE = 'UPDATE_OTHER_POOL_RULE' // 修改其他规则
export const QUERY_ONE_OTHER_POOL_RULE = 'QUERY_ONE_OTHER_POOL_RULE' // 查询其他规则
export const DELETE_OTHER_POOL_RULE = 'DELETE_OTHER_POOL_RULE' // 查询其他规则
export const ENABLE_OTHER_POOL_RULE = 'ENABLE_OTHER_POOL_RULE' // 启动其他规则
export const SELECT_FILEDVALUETODICTIONARY = 'SELECT_FILEDVALUETODICTIONARY' // 业务字段列表
export const SELECT_EXTERPRISE_NAME = 'SELECT_EXTERPRISE_NAME' // 上级单位列表

export const queryAutoPoolRule = singleApi({
  url: baseURL() + '/pool/queryAutoPoolRule',
  action: (args, json) => {
    return {
      args,
      type: QUERY_AUTO_POOL_RULE,
      data: json,
    }
  },
})

export const enableAutoPoolRule = singleApi({
  url: baseURL() + '/pool/enableAutoPoolRule',
  action: (args, json) => {
    return {
      args,
      type: ENABLE_AUTO_POOL_RULE,
      data: json,
    }
  },
})

export const queryOtherPoolRule = singleApi({
  url: baseURL() + '/pool/queryOtherPoolRule',
  action: (args, json) => {
    return {
      args,
      type: QUERY_OTHER_POOL_RULE,
      data: json,
    }
  },
})

export const getFormList = singleApi({
  url: baseURL() + '/from/fromList',
  action: (args, json) => {
    return {
      args,
      type: GET_FORM_LIST,
      data: json,
    }
  },
})

export const querAutoPoolRuleHandNumber = singleApi({
  url: baseURL() + '/pool/querAutoPoolRuleHandNumber',
  action: (args, json) => {
    return {
      args,
      type: QUERY_AUTO_POOLRULE_HANDNUMBER,
      data: json,
    }
  },
})

export const addAutoPoolRule = singleApi({
  url: baseURL() + '/pool/addAutoPoolRule',
  action: (args, json) => {
    return {
      args,
      type: ADD_AUTO_POOL_RULE,
      data: json,
    }
  },
})

export const queryOneAutoPoolRule = singleApi({
  url: baseURL() + '/pool/queryOneAutoPoolRule',
  action: (args, json) => {
    return {
      args,
      type: QUERY_ONE_AUTO_POOL_RULE,
      data: json,
    }
  },
})

export const updateAutoPoolRule = singleApi({
  url: baseURL() + '/pool/updateAutoPoolRule',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_AUTO_POOL_RULE,
      data: json,
    }
  },
})

export const deleteAutoPoolRule = singleApi({
  url: baseURL() + '/pool/deleteAutoPoolRule',
  action: (args, json) => {
    return {
      args,
      type: DELETE_AUTO_POOL_RULE,
      data: json,
    }
  },
})

export const insertOtherPoolRule = singleApi({
  url: baseURL() + '/pool/insertOtherPoolRule',
  action: (args, json) => {
    return {
      args,
      type: INSERT_OTHER_POOL_RULE,
      data: json,
    }
  },
})

export const updateOtherPoolRule = singleApi({
  url: baseURL() + '/pool/updateOtherPoolRule',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_OTHER_POOL_RULE,
      data: json,
    }
  },
})

export const queryOneOtherPoolRule = singleApi({
  url: baseURL() + '/pool/queryOneOtherPoolRule',
  action: (args, json) => {
    return {
      args,
      type: QUERY_ONE_OTHER_POOL_RULE,
      data: json,
    }
  },
})

export const deleteOtherPoolRule = singleApi({
  url: baseURL() + '/pool/deleteOtherPoolRule',
  action: (args, json) => {
    return {
      args,
      type: DELETE_OTHER_POOL_RULE,
      data: json,
    }
  },
})

export const enableOtherPoolRule = singleApi({
  url: baseURL() + '/pool/enableOtherPoolRule',
  action: (args, json) => {
    return {
      args,
      type: ENABLE_OTHER_POOL_RULE,
      data: json,
    }
  },
})

export const selectFiledValueToDictionary = singleApi({
  url: baseURL() + '/pool/selectFiledValueToDictionary',
  action: (args, json) => {
    return {
      args,
      type: SELECT_FILEDVALUETODICTIONARY,
      data: json,
    }
  },
})

export const selectExterpriseName = singleApi({
  url: baseURL() + '/customer/selectExterpriseName',
  action: (args, json) => {
    return {
      args,
      type: SELECT_EXTERPRISE_NAME,
      data: json,
    }
  },
})
