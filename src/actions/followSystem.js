/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const FOLLOW_DEFULATE_DATA_LIST = 'FOLLOW_DEFULATE_DATA_LIST' // 获取我的跟进初始化list
export const DELETE_FOLLOW_ITEM = 'DELETE_FOLLOW_ITEM' // 删除单条跟进设置
export const ADD_FOLLOW_ONE = 'ADD_FOLLOW_ONE' // 新增跟进设置
export const GET_FOLLOW_ONE = 'GET_FOLLOW_ONE' // 获取单条跟进信息进行编辑
export const GET_FOLLOWITEM_ONE = 'GET_FOLLOWITEM_ONE' // 获取跟进设置单条
export const FOLLOW_MYCLIENT_DATA_LIST = 'FOLLOW_MYCLIENT_DATA_LIST' //我的客户详情跟进信息列表
export const GET_FOLLOWITEM_BYTID = 'GET_FOLLOWITEM_BYTID' //根据业务线获取根据内容（添加跟进时用到）
export const GET_CONLIST_BYCUSID = 'GET_CONLIST_BYCUSID' //根据客户id获取联系人信息下拉项
export const ADD_FOLLOWINFO_ONE = 'ADD_FOLLOWINFO_ONE' //添加跟进信息
export const UPDATE_FOLLOWINFO_ONE = 'UPDATE_FOLLOWINFO_ONE' //添加跟进信息
export const GET_RECORD_LIST = 'GET_RECORD_LIST' //获取录音文件列表
export const FOLLOW_ITEMDISBALE = 'FOLLOW_ITEMDISBALE' //跟进状态 启用/禁用
export const MYCONTACT_DEFULATE_DATA_LIST = 'MYCONTACT_DEFULATE_DATA_LIST' //跟进状态 启用/禁用
export const TOPIC_LIST = 'TOPIC_LIST' //所有业务线列表
export const GET_RECORD_CONVERT = 'GET_RECORD_CONVERT' //查看语音
export const GET_RECORD_CONTENT = 'GET_RECORD_CONTENT' //语音转文字




export const getRecordConvert = singleApi({ // 将录音文件自动推送到oss
  url: baseURL() + '/follow/getRecordConvert',
  action: (args, json) => {
    return {
      args,
      type: GET_RECORD_CONVERT,
      data: json,
    }
  },
})

export const getRecordContent = singleApi({ // 将录音文件自动推送到oss
  url: baseURL() + '/follow/getRecordContent',
  action: (args, json) => {
    return {
      args,
      type: GET_RECORD_CONTENT,
      data: json,
    }
  },
})

export const selectFollowItemPage = singleApi({ // 获取我的跟进初始化list
  url: baseURL() + '/follow/selectFollowItemPage',
  action: (args, json) => {
    return {
      args,
      type: FOLLOW_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const deleteFollowItem = singleApi({ // 删除单条跟进设置
  url: baseURL() + '/follow/deleteFollowItem',
  action: (args, json) => {
    return {
      args,
      type: DELETE_FOLLOW_ITEM,
      data: json,
    }
  },
})

export const addOrUpdateFollowItem = singleApi({ // 新增跟进内容设置
  url: baseURL() + '/follow/addOrUpdateFollowItem',
  action: (args, json) => {
    return {
      args,
      type: ADD_FOLLOW_ONE,
      data: json,
    }
  },
})

export const getFollowById = singleApi({ // 新增跟进内容设置
  url: baseURL() + '/follow/getFollowById',
  action: (args, json) => {
    return {
      args,
      type: GET_FOLLOW_ONE,
      data: json,
    }
  },
})


export const getFollowItemById = singleApi({ // 获取跟进设置单条
  url: baseURL() + '/follow/getFollowItemById',
  action: (args, json) => {
    return {
      args,
      type: GET_FOLLOWITEM_ONE,
      data: json,
    }
  },
})

export const getFollowByContactsId = singleApi({ // 获取我的跟进初始化list
  url: baseURL() + '/follow/getFollowByContactsId',
  action: (args, json) => {
    return {
      args,
      type: FOLLOW_MYCLIENT_DATA_LIST,
      data: json,
    }
  },
})

export const getFollowItemBytopicId = singleApi({ // 根据业务线获取根据内容（添加跟进时用到）
  url: baseURL() + '/follow/getFollowItemBytopicId',
  action: (args, json) => {
    return {
      args,
      type: GET_FOLLOWITEM_BYTID,
      data: json,
    }
  },
})

export const getConListByCusId = singleApi({ // 根据业务线获取根据内容（添加跟进时用到）
  url: baseURL() + '/crmContacts/getConListByCusId',
  action: (args, json) => {
    return {
      args,
      type: GET_CONLIST_BYCUSID,
      data: json,
    }
  },
})

export const addFollow = singleApi({ // 新增跟进信息
  url: baseURL() + '/follow/addFollow',
  action: (args, json) => {
    return {
      args,
      type: ADD_FOLLOWINFO_ONE,
      data: json,
    }
  },
})

export const updateFollow = singleApi({ // 新增跟进信息
  url: baseURL() + '/follow/updateFollow',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_FOLLOWINFO_ONE,
      data: json,
    }
  },
})


export const selectRecord = singleApi({ // 新增跟进信息
  url: baseURL() + '/follow/selectRecord',
  action: (args, json) => {
    return {
      args,
      type: GET_RECORD_LIST,
      data: json,
    }
  },
})

export const followItemDisable = singleApi({ // 跟进状态 启用/禁用
  url: baseURL() + '/follow/followItemDisable',
  action: (args, json) => {
    return {
      args,
      type: FOLLOW_ITEMDISBALE,
      data: json,
    }
  },
})

export const getMyContactList = singleApi({ // 联系人列表
  url: baseURL() + '/crmContacts/selectContactList',
  action: (args, json) => {
    return {
      args,
      type: MYCONTACT_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const gettopicList   = singleApi({ // 获取我的跟进初始化list
  url: baseURL() + '/topic/topicList',
  action: (args, json) => {
    return {
      args,
      type: TOPIC_LIST,
      data: json,
    }
  },
})
