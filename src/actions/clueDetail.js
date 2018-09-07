/**
 * Created by ll on 20/11/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const GET_CLUE_DETAIL = 'GET_CLUE_DETAIL' // 获取详情
export const GET_REPTBYCUSTOMERID = 'GET_REPTBYCUSTOMERID' // 获取详情中爬出数据(推荐价格 || 人均价格)
export const ADD_CLUE_ENTERPRISE = 'ADD_CLUE_ENTERPRISE' // 添加企业线索
export const ADD_CLUE_PERSON = 'ADD_CLUE_PERSON' // 添加个人线索
export const UPDATE_CLUE_ENTERPRISE = 'UPDATE_CLUE_ENTERPRISE' // 编辑企业线索
export const UPDATE_CLUE_PERSON = 'UPDATE_CLUE_PERSON' // 编辑个人线索
export const CHANGEINFO = 'CHANGEINFO' // 改变状态
export const CHECK_EXTERPRISE_NAME = 'CHECK_EXTERPRISE_NAME' // 企业名称查重
export const CHECK_LICENSE_NAME = 'CHECK_LICENSE_NAME' // 执照查重
export const CHECK_PERSONAL_NAME = 'CHECK_PERSONAL_NAME' // 个人客户姓名查重
export const CHECK_PERSONAL_PHONE = 'CHECK_PERSONAL_PHONE' // 个人手机查重
export const CHECK_PERSONAL_WORKPHONE = 'CHECK_PERSONAL_WORKPHONE' // 工作手机查重
export const CHECK_PERSONAL_WECHAT = 'CHECK_PERSONAL_WECHAT' // 微信查重
export const CHECK_PERSONAL_IDCARD = 'CHECK_PERSONAL_IDCARD' // 身份证查重
export const SELECT_LABEL_LIST = 'SELECT_LABEL_LIST' // 下拉框中的label列表
export const ADD_LABEL_TOCUSTOMER = 'ADD_LABEL_TOCUSTOMER' // 添加/修改label
export const DEL_LABEL_TOCUSTOMER = 'DEL_LABEL_TOCUSTOMER' // 删除label

export const selectLabel = singleApi({
  url: baseURL() + '/label/selectLabel ',
  action: (args, json) => {
    return {
      type: SELECT_LABEL_LIST,
      data: json.data,
    }
  },
})

export const addLabelToCustomer = singleApi({
  url: baseURL() + '/label/addLabelToCustomer ',
  action: (args, json) => {
    return {
      type: ADD_LABEL_TOCUSTOMER,
      data: json.data,
    }
  },
})

export const delLabelToCustomer = singleApi({
  url: baseURL() + '/label/delLabelToCustomer ',
  action: (args, json) => {
    return {
      type: DEL_LABEL_TOCUSTOMER,
      data: json.data,
    }
  },
})
export const getClueDetail = singleApi({
  url: baseURL() + '/customer/queryPersonalAndEnterpriserById',
  action: (args, json) => {
    return {
      type: GET_CLUE_DETAIL,
      data: json.data,
    }
  },
})

export const getReptByCustomerId = singleApi({
  url: baseURL() + '/customer/getReptByCustomerId',
  action: (args, json) => {
    return {
      type: GET_REPTBYCUSTOMERID,
      data: json.data,
    }
  },
})

export const addClueEnterprise = singleApi({
  url: baseURL() + '/customer/addCustomerEnterprise',
  action: (args, json) => {
    return {
      type: ADD_CLUE_ENTERPRISE,
      data: json.data,
    }
  },
})

export const updateClueEnterprise = singleApi({
  url: baseURL() + '/customer/udpateCustomerExterpriseByid',
  action: (args, json) => {
    return {
      type: UPDATE_CLUE_ENTERPRISE,
      data: json.data,
    }
  },
})

export const changeInfo = {
  type: CHANGEINFO,
  isOK: false,
}

export const addCluePerson = singleApi({
  url: baseURL() + '/customer/addPersonalCustomer',
  action: (args, json) => {
    return {
      type: ADD_CLUE_PERSON,
      data: json.data,
    }
  },
})

export const updateCluePerson = singleApi({
  url: baseURL() + '/customer/udpateCustomerIndividual',
  action: (args, json) => {
    return {
      type: UPDATE_CLUE_PERSON,
      data: json.data,
    }
  },
})

export const checkExterpriseName = singleApi({
  url: baseURL() + '/customer/checkExterpriseName',
  action: (args, json) => {
    return {
      type: CHECK_EXTERPRISE_NAME,
      data: json.data,
    }
  },
})

export const checkLicenseName = singleApi({
  url: baseURL() + '/customer/checkLicenseName',
  action: (args, json) => {
    return {
      type: CHECK_LICENSE_NAME,
      data: json.data,
    }
  },
})


export const checkPersonalName = singleApi({
  url: baseURL() + '/customer/checkPersonalName',
  action: (args, json) => {
    return {
      type: CHECK_PERSONAL_NAME,
      data: json.data,
    }
  },
})

export const checkContactToPersonal = singleApi({
  url: baseURL() + '/customer/checkContactToPersonal',
  action: (args, json) => {
    return {
      type: CHECK_PERSONAL_PHONE,
      data: json.data,
    }
  },
})

export const checkContactToWork = singleApi({
  url: baseURL() + '/customer/checkContactToWork',
  action: (args, json) => {
    return {
      type: CHECK_PERSONAL_WORKPHONE,
      data: json.data,
    }
  },
})

export const checkContactToweChat = singleApi({
  url: baseURL() + '/customer/checkContactToweChat',
  action: (args, json) => {
    return {
      type: CHECK_PERSONAL_WECHAT,
      data: json.data,
    }
  },
})

export const checkContactToIdCard = singleApi({
  url: baseURL() + '/customer/checkContactToIdCard',
  action: (args, json) => {
    return {
      type: CHECK_PERSONAL_IDCARD,
      data: json.data,
    }
  },
})
