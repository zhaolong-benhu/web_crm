/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const CLIENT_DEFULATE_DATA_LIST = 'CLIENT_DEFULATE_DATA_LIST' // 获取初始化list
export const MYCONTACT_DEFULATE_DATA_LIST = 'MYCONTACT_DEFULATE_DATA_LIST' // 获取联系人列表初始化list
export const SELECT_CONTACT_DATA_LIST = 'SELECT_CONTACT_DATA_LIST' // 获取选中联系人全部信息
export const ADD_CONTACT_ONE = 'ADD_CONTACT_ONE' // 添加联系人
export const UPDATE_CONTACT_ONE = 'UPDATE_CONTACT_ONE' // 更新联系人基本信息
export const ADD_JOB_ONE = 'ADD_JOB_ONE' // 新增工作信息
export const UPDATE_JOB_ONE = 'UPDATE_JOB_ONE' // 更新工作信息
export const DELETECRM_JOB_ONE = 'DELETECRM_JOB_ONE' // 删除工作信息
export const INVENTED_DELETECRM_JOB_ONE = 'INVENTED_DELETECRM_JOB_ONE' // 删除工作信息（虚拟）
export const ADD_CONTACTS = 'ADD_CONTACTS' // 添加联系方式
export const REMOVE_CLIENT_ONE = 'REMOVE_CLIENT_ONE' // 移出客户
export const REMOVE_CLIENT_LIST = 'REMOVE_CLIENT_LIST' // 移出客户（多个）
export const UPDATE_CLIENT = 'UPDATE_CLIENT' // 移出客户
export const INSERT_ASSIST = 'INSERT_ASSIST' // 请求协助
export const DEL_ASSIST = 'DEL_ASSIST' // 放弃协助
export const DEL_CONTACT_ONE = 'DEL_CONTACT_ONE' // 删除联系人
export const SELECT_ALL_NAME = 'SELECT_ALL_NAME' // 删除联系人
export const ADD_NEW_JOB_INFO = 'ADD_NEW_JOB_INFO' // 新增工作信息
export const INSERT_MY_CLIENT = 'INSERT_MY_CLIENT' // 客户揽入
export const CLIENT_HEI_QUERY_LIST = 'CLIENT_HEI_QUERY_LIST' // 高级搜索
export const SELECT_CUSTOMER_TOSTOCK= 'SELECT_CUSTOMER_TOSTOCK' // 联系人查重
export const INSERT_CONTRACT_RELATION= 'INSERT_CONTRACT_RELATION' // 建立联系人关系


export const getClientList = singleApi({ // 基本搜索
  url: baseURL() + '/resources/queryCustomerByPage',
  action: (args, json) => {
    return {
      args,
      type: CLIENT_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const geiHeiList = singleApi({ // 高级搜索
  url: baseURL() + '/resources/queryAdvClientByPage',
  action: (args, json) => {
    return {
      args,
      type: CLIENT_HEI_QUERY_LIST,
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

export const selectAllContacts = singleApi({ // 获取联系人单条全部关联信息
  url: baseURL() + '/crmContacts/selectAllContacts',
  action: (args, json) => {
    return {
      args,
      type: SELECT_CONTACT_DATA_LIST,
      data: json,
    }
  },
})

export const addContactOne = singleApi({ // 添加联系人
  url: baseURL() + '/crmContacts/addContactOne',
  action: (args, json) => {
    return {
      args,
      type: ADD_CONTACT_ONE,
      data: json,
    }
  },
})

export const updateContactOne = singleApi({ // 修改联系人基本信息
  url: baseURL() + '/crmContacts/updateContactOne',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_CONTACT_ONE,
      data: json,
    }
  },
})


export const addCrmJob = singleApi({ // 添加工作信息
  url: baseURL() + '/crmContacts/addCrmJob',
  action: (args, json) => {
    return {
      args,
      type: ADD_JOB_ONE,
      data: json,
    }
  },
})

export const updateCrmJob = singleApi({ // 修改工作信息
  url: baseURL() + '/crmContacts/updateCrmJob',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_JOB_ONE,
      data: json,
    }
  },
})

export const deleteCrmJob = singleApi({ // 删除工作信息
  url: baseURL() + '/crmContacts/deleteCrmJob',
  action: (args, json) => {
    return {
      args,
      type: DELETECRM_JOB_ONE,
      data: json,
    }
  },
})

export const inventedDeleteCrmJob = singleApi({ // 删除工作信息（虚拟）
  url: baseURL() + '/search/getDefaultSearch',
  action: (args, json) => {
    return {
      args,
      type: INVENTED_DELETECRM_JOB_ONE,
      data: json,
    }
  },
})



export const addContacts = singleApi({ // 添加联系方式
  url: baseURL() + '/crmContacts/addContacts',
  action: (args, json) => {
    return {
      args,
      type: ADD_CONTACTS,
      data: json,
    }
  },
})

export const removeClient = singleApi({ // 客户移出
  url: baseURL() + '/myClient/removeClient',
  action: (args, json) => {
    return {
      args,
      type: REMOVE_CLIENT_ONE,
      data: json,
    }
  },
})

export const removeClientList = singleApi({ // 客户移出(多个)
  url: baseURL() + '/myClient/removeClientList',
  action: (args, json) => {
    return {
      args,
      type: REMOVE_CLIENT_LIST,
      data: json,
    }
  },
})

export const updateClient = singleApi({ // 客户分配
  url: baseURL() + '/myClient/updateClient',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_CLIENT,
      data: json,
    }
  },
})

export const insertAssist = singleApi({ // 请求协助
  url: baseURL() + '/myClient/insertAssist',
  action: (args, json) => {
    return {
      args,
      type: INSERT_ASSIST,
      data: json,
    }
  },
})

export const delAssist = singleApi({ // 放弃协助
  url: baseURL() + '/myClient/updateAssist',
  action: (args, json) => {
    return {
      args,
      type: DEL_ASSIST,
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

export const delContacts = singleApi({ // 联系人删除
  url: baseURL() + '/crmContacts/delContacts',
  action: (args, json) => {
    return {
      args,
      type: DEL_CONTACT_ONE,
      data: json,
    }
  },
})

export const selectAllCheneseName = singleApi({ // 联系人删除
  url: baseURL() + '/user/selectAllCheneseName',
  action: (args, json) => {
    return {
      args,
      type: SELECT_ALL_NAME,
      data: json,
    }
  },
})

export const addNewJob = () => ( // 新增工作信息
  {
    type: ADD_NEW_JOB_INFO,
  }
)

export const selectCustomerToStock = singleApi({ // 我的客户联系人查重
  url: baseURL() + '/crmContacts/selectCustomerToStock',
  action: (args, json) => {
    return {
      args,
      type: SELECT_CUSTOMER_TOSTOCK,
      data: json,
    }
  },
})

export const insertContactsRelation = singleApi({ // 建立联系人关系
  url: baseURL() + '/crmContacts/insertContactsRelation',
  action: (args, json) => {
    return {
      args,
      type: INSERT_CONTRACT_RELATION,
      data: json,
    }
  },
})
