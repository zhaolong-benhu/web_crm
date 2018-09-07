/**
 * Created by zhaolong on 2018/03/20
 * File description:合同管理
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const GET_CONTRACT_NUMBER = 'GET_CONTRACT_NUMBER' // 我的客户初始化list
export const CONTRACT_SYSTEM_LIST = 'AGREE_DEFULATE_DATA_INFO' // 我的客户初始化list
export const HEI_QUERY_LIST = 'HEI_QUERY_LIST' // 高级查询
export const CLUESYSTEM_SORT_TABLE = 'CLUESYSTEM_SORT_TABLE' // 高级搜索排序
export const CLUESYSTEM_GET_NUMBER = 'CLUESYSTEM_GET_NUMBER' // 获取个数
export const NEW_CONTRACT = 'NEW_CONTRACT' // 新增合同
export const SELECT_CONTRACT_AND_PRODUCT = 'SELECT_CONTRACT_AND_PRODUCT' // 查看合同
export const SELECT_RECEIPT_LIST = 'SELECT_RECEIPT_LIST' // 查看回执/回款信息列表
export const SELECT_RECEIPT = 'SELECT_RECEIPT' // 查看回执信息
export const INSERT_RECEIPT = 'INSERT_RECEIPT' // 查看回执/回款信息列表
export const SELECT_BILL_LIST = 'SELECT_BILL_LIST' // 发票/寄送记录
export const OPERATION_LOG_LIST = 'OPERATION_LOG_LIST' // 操作日志列表
export const UPDATE_CONTRACT = 'UPDATE_CONTRACT' // 修改合同信息
export const UPDATE_CONTRACT_STATUS = 'UPDATE_CONTRACT_STATUS' // 修改合同状态
export const INSERT_SEND_BILL = 'INSERT_SEND_BILL' // 寄送发票
export const SELECT_PAYMENT = 'SELECT_PAYMENT' // 查询回款回执的详细信息
export const UPDATE_PAYMENT = 'UPDATE_PAYMENT' // 修改回款回执的详细信息
export const ADD_BILL = 'ADD_BILL' //新增发票
export const INSERT_BILL = 'INSERT_BILL' //申请开票
export const UPDATE_BILL = 'UPDATE_BILL' // 修改发票/寄送记录
export const DELETE_RECIPIT = 'DELETE_RECIPIT' // 删除回执信息
export const INSERT_PAYMENT = 'INSERT_PAYMENT' // 新增回款
export const SELECT_BILL = 'SELECT_BILL' // 查询发票及寄送详细信息
export const CONTRACT_HEI_QUERY_LIST = 'CONTRACT_HEI_QUERY_LIST' // 高级搜索
export const GET_CONTRACT_LIST = 'GET_CONTRACT_LIST' // 获取合同列表
export const SELECT_SUBSIDIARYLIST = 'SELECT_SUBSIDIARYLIST' // 获取子公司合同列表
export const INSERT_SUBSIDIARY = 'INSERT_SUBSIDIARY' // 添加合同子账号
export const DELETE_SUBSIDIARY = 'DELETE_SUBSIDIARY' // 删除合同子账号
export const GET_SUBSIDIARY_CONTRACTNUMBER = 'GET_SUBSIDIARY_CONTRACTNUMBER' // 根据合同子账号编号查询
export const GET_PROLIST_BYCONTID = 'GET_PROLIST_BYCONTID' // 根据合同编号查询产品列表
export const DELETE_PRODUCT = 'DELETE_PRODUCT' // 删除产品
export const UPDATE_PRODUCT_BYID = 'UPDATE_PRODUCT_BYID' // 更新产品
export const INSERT_PRODUCT = 'INSERT_PRODUCT' // 选择服务人员
export const GET_CONTRACT_URL = 'GET_CONTRACT_URL' // 选择合同ＵＲＬ
export const REFRESH_PRODUCT_FOR3 = 'REFRESH_PRODUCT_FOR3' // 选择合同ＵＲＬ
export const UPDATE_CONTRACT_METERIAL = 'UPDATE_CONTRACT_METERIAL' // 新增/修改合同资料明细
export const SELECT_CONTRACT_METERIAL_ONE = 'SELECT_CONTRACT_METERIAL_ONE' // 查询合同资料明细
export const DELETE_CONTRACT_METERIAL = 'DELETE_CONTRACT_METERIAL' // 删除合同资料明细
export const SELECT_CONTRACT_METERIAL_PAGE = 'SELECT_CONTRACT_METERIAL_PAGE' // 合同资料明细列表



export const geiHeiList = singleApi({ // 高级搜索
  url: baseURL() + '/contract/selectContractAdv',
  action: (args, json) => {
    return {
      args,
      type: CONTRACT_HEI_QUERY_LIST,
      data: json,
    }
  },
})

export const uploadProps = { // 上次文件
  name: 'file',
  showUploadList: false,
  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  action: baseURL() + '/crm/uploadFile',
  headers: {
    authorization: 'authorization-text',
  },
}
//获取合同编号
export const getContractNumber = singleApi({
  url: baseURL() + '/contract/getContractNumber',
  action: (args, json) => {
    return {
      args,
      type: GET_CONTRACT_NUMBER,
      data: json,
    }
  },
})

// 基本搜索
export const getInitList = singleApi({
  url: baseURL() + '/contract/selectContractByPage',
  action: (args, json) => {
    return {
      args,
      type: CONTRACT_SYSTEM_LIST,
      data: json,
    }
  },
})

// 获取个数
export const getNumber = singleApi({
  url: baseURL() + '/resources/queryCustomerCount',
  action: (args, json) => {
    return {
      type: CLUESYSTEM_GET_NUMBER,
      data: json,
    }
  },
})

//个性化搜索排序
export const sortTable = singleApi({
  url: baseURL() + '/search/updateSort',
  action: (args, json) => {
    return {
      type: CLUESYSTEM_SORT_TABLE,
      data: json,
    }
  },
})

//新增/修改合同资料明细
export const updateContractMeterial = singleApi({
  url: baseURL() + '/contract/updateContractMeterial',
  action: (args, json) => {
    return {
      type: UPDATE_CONTRACT_METERIAL,
      data: json,
    }
  },
})

//删除合同资料明细
export const deleteContractMeterial = singleApi({
  url: baseURL() + '/contract/deleteContractMeterial',
  action: (args, json) => {
    return {
      type: DELETE_CONTRACT_METERIAL,
      data: json,
    }
  },
})

//查询合同资料明细
export const selectContractMeterialOne = singleApi({
  url: baseURL() + '/contract/selectContractMeterialOne',
  action: (args, json) => {
    return {
      type: SELECT_CONTRACT_METERIAL_ONE,
      data: json,
    }
  },
})

//合同资料明细列表
export const selectContractMeterialPage = singleApi({
  url: baseURL() + '/contract/selectContractMeterialPage',
  action: (args, json) => {
    return {
      type: SELECT_CONTRACT_METERIAL_PAGE,
      data: json,
    }
  },
})
// 新增合同
export const newContract = singleApi({
  url: baseURL() + '/contract/insertContract',
  action: (args, json) => {
    return {
      args,
      type: NEW_CONTRACT,
      data: json,
    }
  },
})

// 新增合同
export const selectBill = singleApi({
  url: baseURL() + '/contract/selectBill',
  action: (args, json) => {
    return {
      args,
      type: SELECT_BILL,
      data: json,
    }
  },
})
// 新增回款
export const insertPayment = singleApi({
  url: baseURL() + '/contract/insertPayment',
  action: (args, json) => {
    return {
      args,
      type: INSERT_PAYMENT,
      data: json,
    }
  },
})


// 申请开票
export const insertBill = singleApi({
  url: baseURL() + '/contract/insertBill',
  action: (args, json) => {
    return {
      args,
      type: INSERT_BILL,
      data: json,
    }
  },
})

//添加发票
export const addBill = singleApi({
  url: baseURL() + '/contract/addBill',
  action: (args, json) => {
    return {
      args,
      type: ADD_BILL,
      data: json,
    }
  },
})

// 寄送发票
export const insertSendBill = singleApi({
  url: baseURL() + '/contract/insertSendBill',
  action: (args, json) => {
    return {
      args,
      type: INSERT_SEND_BILL,
      data: json,
    }
  },
})

//删除回执信息
export const deleteReceipt = singleApi({
  url: baseURL() + '/contract/deleteReceipt',
  action: (args, json) => {
    return {
      args,
      type: DELETE_RECIPIT,
      data: json,
    }
  },
})

//修改发票/寄送记录
export const updateBill = singleApi({
  url: baseURL() + '/contract/updateBill',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_BILL,
      data: json,
    }
  },
})

// 查看合同
export const selectContractAndProduct = singleApi({
  url: baseURL() + '/contract/selectContractAndProduct',
  action: (args, json) => {
    return {
      args,
      type: SELECT_CONTRACT_AND_PRODUCT,
      data: json,
    }
  },
})

// 查看回执/回款信息列表
export const selectReceiptList = singleApi({
  url: baseURL() + '/contract/selectReceiptList',
  action: (args, json) => {
    return {
      args,
      type: SELECT_RECEIPT_LIST,
      data: json,
    }
  },
})

// 查看回执信息
export const selectReceipt = singleApi({
  url: baseURL() + '/contract/selectReceipt',
  action: (args, json) => {
    return {
      args,
      type: SELECT_RECEIPT,
      data: json,
    }
  },
})

// 查看合同
export const insertReceipt = singleApi({
  url: baseURL() + '/contract/insertReceipt',
  action: (args, json) => {
    return {
      args,
      type: INSERT_RECEIPT,
      data: json,
    }
  },
})

 // 查看发票/寄送记录
export const selectBillList = singleApi({
  url: baseURL() + '/contract/selectBillList',
  action: (args, json) => {
    return {
      args,
      type: SELECT_BILL_LIST,
      data: json,
    }
  },
})

// 查看发票/寄送记录
export const selectContractOperationLog = singleApi({
  url: baseURL() + '/log/selectContractOperationLog',
  action: (args, json) => {
    return {
      args,
      type: OPERATION_LOG_LIST,
      data: json,
    }
  },
})

// 修改合同信息
export const updateContract = singleApi({
  url: baseURL() + '/contract/updateContract',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_CONTRACT,
      data: json,
    }
  },
})

// 修改合同状态 执行合同、中止合同、作废合同
export const updateContractStatus = singleApi({
  url: baseURL() + '/contract/updateContractStatus',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_CONTRACT_STATUS,
      data: json,
    }
  },
})

// 查询回款回执的详细信息
export const selectPayment = singleApi({
  url: baseURL() + '/contract/selectPayment',
  action: (args, json) => {
    return {
      args,
      type: SELECT_PAYMENT,
      data: json,
    }
  },
})

//修改回款回执的详细信息
export const updatePayment = singleApi({
  url: baseURL() + '/contract/updatePayment',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_PAYMENT,
      data: json,
    }
  },
})

//获取合同记录列表
export const getContractList = singleApi({
  url: baseURL() + '/contract/updatePayment',
  action: (args, json) => {
    return {
      args,
      type: GET_CONTRACT_LIST,
      data: json,
    }
  },
})

//获取子公司合同列表
export const selectSubsidiaryList = singleApi({
  url: baseURL() + '/contract/selectSubsidiaryList',
  action: (args, json) => {
    return {
      args,
      type: SELECT_SUBSIDIARYLIST,
      data: json,
    }
  },
})

//添加合同子账号
export const insertSubsidiaryContract = singleApi({
  url: baseURL() + '/contract/insertSubsidiaryContract',
  action: (args, json) => {
    return {
      args,
      type: INSERT_SUBSIDIARY,
      data: json,
    }
  },
})

//删除合同子账号
export const deleteSubsidiaryContract = singleApi({
  url: baseURL() + '/contract/deleteSubsidiaryContract',
  action: (args, json) => {
    return {
      args,
      type: DELETE_SUBSIDIARY,
      data: json,
    }
  },
})

//根据合同子账号编号查询
export const getSubsidiaryContractNumber = singleApi({
  url: baseURL() + '/contract/getSubsidiaryContractNumber',
  action: (args, json) => {
    return {
      args,
      type: DELETE_SUBSIDIARY,
      data: json,
    }
  },
})


//根据合同编号查询产品列表
export const getProListByContId = singleApi({
  url: baseURL() + '/product/getProListByContId',
  action: (args, json) => {
    return {
      args,
      type: GET_PROLIST_BYCONTID,
      data: json,
    }
  },
})

export const deleteProduct = singleApi({ // 删除产品
  url: baseURL() + '/product/deleteProduct',
  action: (args, json) => {
    return {
      args,
      type: DELETE_PRODUCT,
      data: json,
    }
  },
})

export const updateProductById = singleApi({ // 更新产品
  url: baseURL() + '/product/updateProductById',
  action: (args, json) => {
    return {
      args,
      type: UPDATE_PRODUCT_BYID,
      data: json,
    }
  },
})

export const insertProduct = singleApi({ // 选择服务人员
  url: baseURL() + '/product/insertProduct',
  action: (args, json) => {
    return {
      args,
      type: INSERT_PRODUCT,
      data: json,
    }
  },
})

export const getContractUrl = singleApi({
  url: baseURL() + '/register/selectSysCustomerIdAndContractId',
  action: (args, json) => {
    return {
      args,
      type: GET_CONTRACT_URL,
      data: json,
    }
  },
})

export const refreshProductFor3 = singleApi({
  url: baseURL() + '/product/selectSonContractToProductList',
  action: (args, json) => {
    return {
      args,
      type: GET_PROLIST_BYCONTID,
      data: json,
    }
  },
})