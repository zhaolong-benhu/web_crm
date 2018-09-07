/**
 * Created by zhaolong on 2018/03/20
 * File description:合同管理
 */

 import {
   GET_FOLLOWTOTAL,
   GET_BUSINESSFORECAST,
   GET_SALESFUNNEL,
   GET_BUSINADD,
   SELECT_CONTRACTREPORT,
   SELECT_SALEREPORTCONTRACT,
   SELECT_CLUEREPORTCONTRACT,
 } from '../actions/reportForms'

 const initalData = {
   loading: false,
   list: [],
   contractCount:"",
   totalMoney:"",
}
 export default (state = initalData, action = {}) => {
   switch (action.type) {
       case GET_FOLLOWTOTAL:
       return {
         ...state,
         funneTotal: action.data.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
       }
       case GET_BUSINESSFORECAST:
       return {
         ...state,
         businessForecast: action.data.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
       }
      case GET_SALESFUNNEL:
      return {
        ...state,
        salesFunnel: action.data.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
      }
      case SELECT_CONTRACTREPORT:
      return {
        ...state,
        contractCount:action.data.data.contractCount,
        totalMoney:action.data.data.totalMoney,
        selectContractReport: action.data.data.contractReportList.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
      }
      case SELECT_SALEREPORTCONTRACT:
      return {
        ...state,
        totalMoney:action.data.data.totalMoney,
        selectSaleReportContract: action.data.data.contractReportList.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
      }
      case SELECT_CLUEREPORTCONTRACT:
      return {
        ...state,
        contractCount:action.data.data.contractCount,
        growthGate:action.data.data.growthGate,
        number:action.data.data.number,
        selectBlueReportContract: action.data.data.contractReportList.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
      }
      case GET_BUSINADD:
      return {
        ...state,
        clueCount:action.data.clueCount,
        clientCount:action.data.clientCount,
        businCount:action.data.businCount,
        contractCount:action.data.contractCount,
        businadd: action.data.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
      }
     default:
       return state
   }
 }
