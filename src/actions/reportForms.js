/**
 * Created by zhaolong on 2018/04/10
 * File description:报表中心
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const GET_FOLLOWTOTAL = 'GET_FOLLOWTOTAL' // 跟进记录表
export const GET_BUSINESSFORECAST = 'GET_BUSINESSFORECAST' // 销售预测表
export const GET_SALESFUNNEL = 'GET_SALESFUNNEL' // 销售漏斗表
export const GET_BUSINADD = 'GET_BUSINADD' // 业务新增汇总表
export const SELECT_CONTRACTREPORT = 'SELECT_CONTRACTREPORT' // 合同汇总表
export const SELECT_SALEREPORTCONTRACT = 'SELECT_SALEREPORTCONTRACT' // 销售额排名表
export const SELECT_CLUEREPORTCONTRACT = 'SELECT_CLUEREPORTCONTRACT' // 线索转化率表



//获取跟进客户个数报表数据
export const getFollowTotal = singleApi({
  url: baseURL() + '/report/getFollowTotal',
  action: (args, json) => {
    return {
      args,
      type: GET_FOLLOWTOTAL,
      data: json,
    }
  },
})

//获取销售预测表数据
export const getBusinessForecast = singleApi({
  url: baseURL() + '/report/getBusinessForecast',
  action: (args, json) => {
    return {
      args,
      type: GET_BUSINESSFORECAST,
      data: json,
    }
  },
})

//获取销售漏斗表数据
export const getfunnelotal = singleApi({
  url: baseURL() + '/report/getfunnelotal',
  action: (args, json) => {
    return {
      args,
      type: GET_SALESFUNNEL,
      data: json,
    }
  },
})


//获取业务新增汇总表数据
export const getBusinAdd = singleApi({
  url: baseURL() + '/report/getBusinAdd',
  action: (args, json) => {
    return {
      args,
      type: GET_BUSINADD,
      data: json,
    }
  },
})


//合同报表汇总
export const selectContractReport = singleApi({
  url: baseURL() + '/report/selectContractReport',
  action: (args, json) => {
    return {
      args,
      type: SELECT_CONTRACTREPORT,
      data: json,
    }
  },
})

//销售额排名表
export const selectSaleReportContract = singleApi({
  url: baseURL() + '/report/selectSaleReportContract',
  action: (args, json) => {
    return {
      args,
      type: SELECT_SALEREPORTCONTRACT,
      data: json,
    }
  },
})

//线索转化率表
export const selectClueReportContract = singleApi({
  url: baseURL() + '/report/selectClueReportContract',
  action: (args, json) => {
    return {
      args,
      type: SELECT_CLUEREPORTCONTRACT,
      data: json,
    }
  },
})