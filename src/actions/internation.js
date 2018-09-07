/**
 * Created by ll on 16/01/2017.
 */
import { baseURL } from '../config'
import { singleApi } from '../helper/reduxFetch'
export const ADMIN_DEFULATE_DATA_LIST = 'ADMIN_DEFULATE_DATA_LIST' // 获取管理员列表
export const ADMIN_CLEAR_DATA_LIST = 'ADMIN_CLEAR_DATA_LIST' // 清空管理员列表
export const MEMBER_DEFULATE_DATA_LIST = 'MEMBER_DEFULATE_DATA_LIST' // 获取成员列表
export const MEMBER_CLEAR_DATA_LIST = 'MEMBER_CLEAR_DATA_LIST' // 获取成员列表
export const DELETE_MEMBER_DATA_LIST = 'DELETE_MEMBER_DATA_LIST' // 删除管理员/成员列表
export const GET_TOPIC_DATA = 'GET_TOPIC_DATA' // 获取公海单条信息
export const GET_POOL_DATA = 'GET_POOL_DATA' // 获取公海单条信息
export const CREAT_NEW_OPEN_SEA = 'CREAT_NEW_OPEN_SEA' // 新增公海
export const CREAT_NEW_ADMIN = 'CREAT_NEW_ADMIN' // 新增管理员
export const CREAT_NEW_MEMBER = 'CREAT_NEW_MEMBER' // 新增成员
export const UPDATE_MEMBER = 'UPDATE_MEMBER' // 新增成员
export const ADD_LABEL = 'ADD_LABEL' // 添加标签
export const DEL_LABEL = 'DEL_LABEL' // 删除标签
export const SELECT_LABEL = 'SELECT_LABEL' // 查询标签


export const getAdminList = singleApi({
  // 获取管理员列表
  url: baseURL() + '/pool/administratorsList',
  action: (args, json) => {
    return {
      args,
      type: ADMIN_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const clearAdminList = {
  type: ADMIN_CLEAR_DATA_LIST,
}

export const getMemberList = singleApi({
  // 获取成员列表
  url: baseURL() + '/pool/memberList',
  action: (args, json) => {
    return {
      args,
      type: MEMBER_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const clearMemberList = {
  type: MEMBER_CLEAR_DATA_LIST,
}

export const deleteMemberList = singleApi({
  url: baseURL() + '/pool/deleteMember',
  action: (args, json) => {
    return {
      args,
      type: DELETE_MEMBER_DATA_LIST,
      data: json,
    }
  },
})

export const getTopicList = singleApi({
  url: baseURL() + '/topic/topicList',
  action: (args, json) => {
    return {
      args,
      type: GET_TOPIC_DATA,
      data: json,
    }
  },
})

export const getPoolById = singleApi({
  // 获取公海名称&业务线
  url: baseURL() + '/pool/getPool',
  action: (args, json) => {
    return {
      args,
      type: GET_POOL_DATA,
      data: json,
    }
  },
})

export const creatNewSea = singleApi({
  url: baseURL() + '/pool/addPool',
  action: (args, json) => {
    return {
      args,
      type: CREAT_NEW_OPEN_SEA,
      data: json,
    }
  },
})

export const creatNewAdmin = singleApi({
  url: baseURL() + '/pool/addMember',
  action: (args, json) => {
    return {
      args,
      type: CREAT_NEW_OPEN_SEA,
      data: json,
    }
  },
})

export const creatNewMenber = singleApi({
  url: baseURL() + '/pool/addMember',
  action: (args, json) => {
    return {
      args,
      type: CREAT_NEW_OPEN_SEA,
      data: json,
    }
  },
})

export const updateMember = singleApi({
  url: baseURL() + '/pool/updateMember',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_MEMBER,
      data: json,
    }
  },
})

export const selectLabel = singleApi({
  url: baseURL() + '/label/selectLabel',
  action: (args, json) => {
    return {
      args,
      type: SELECT_LABEL,
      data: json,
    }
  },
})

export const addLabel = singleApi({
  url: baseURL() + '/label/addLabel',
  action: (args, json) => {
    return {
      args,
      type: ADD_LABEL,
      data: json,
    }
  },
})

export const delLabel = singleApi({
  url: baseURL() + '/label/delLabel',
  action: (args, json) => {
    return {
      args,
      type: DEL_LABEL,
      data: json,
    }
  },
})
