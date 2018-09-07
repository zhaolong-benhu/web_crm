/**
 * Created by huangchao on 20/11/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const CLUE_DEFULATE_DATA_LIST = 'CLUE_DEFULATE_DATA_LIST' // 获取初始化list
export const HEI_QUERY_LIST = 'HEI_QUERY_LIST' // 高级查询
export const CLUESYSTEM_USER_ADDAUDIT = 'CLUESYSTEM_USER_ADDAUDIT' // 用户审核
export const CLUESYSTEM_SORT_TABLE = 'CLUESYSTEM_SORT_TABLE' // 高级搜索排序
export const CLUESYSTEM_GET_NUMBER = 'CLUESYSTEM_GET_NUMBER' // 获取个数

export const getInitList = singleApi({ // 基本搜索
  url: baseURL() + '/resources/queryAllClueByPage',
  action: (args, json) => {
    return {
      args,
      type: CLUE_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const userAudit = singleApi({ // 用户审核
  url: baseURL() + '/resources/customerCheck',
  action: (args, json) => {
    return {
      args,
      type: CLUESYSTEM_USER_ADDAUDIT,
      data: json,
    }
  },
})

export const getNumber = singleApi({ // 获取个数
  url: baseURL() + '/resources/queryCustomerCount',
  action: (args, json) => {
    return {
      type: CLUESYSTEM_GET_NUMBER,
      data: json,
    }
  },
})

export const geiHeiList = singleApi({ // 高级搜索
  url: baseURL() + '/resources/queryAdvancedSearchByPage',
  action: (args, json) => {
    return {
      args,
      type: HEI_QUERY_LIST,
      data: json,
    }
  },
})

export const sortTable = singleApi({
  url: baseURL() + '/search/updateSort',
  action: (args, json) => {
    return {
      type: CLUESYSTEM_SORT_TABLE,
      data: json,
    }
  },
})

export const uploadProps = { // 导入线索
  name: 'file',
  showUploadList: false,
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  action: baseURL() + '/crm/ind_importFile_check',
  headers: {
    'X-Requested-With': null,
   },
   withCredentials:true,
}
