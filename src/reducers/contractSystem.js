/**
 * Created by zhaolong on 2018/03/20
 * File description:合同管理
 */
import moment from 'moment'
 import {
   GET_CONTRACT_NUMBER,
   CONTRACT_SYSTEM_LIST,
   HEI_QUERY_LIST,
   CLUESYSTEM_GET_NUMBER,
   NEW_CONTRACT,
   SELECT_CONTRACT_AND_PRODUCT,
   SELECT_RECEIPT,
   SELECT_RECEIPT_LIST,
   INSERT_RECEIPT,
   SELECT_BILL_LIST,
   OPERATION_LOG_LIST,
   UPDATE_CONTRACT,
   UPDATE_CONTRACT_STATUS,
   INSERT_SEND_BILL,
   SELECT_PAYMENT,
   UPDATE_PAYMENT,
   INSERT_BILL,
   DELETE_RECIPIT,
   INSERT_PAYMENT,
   SELECT_BILL,
   UPDATE_BILL,
   CONTRACT_HEI_QUERY_LIST,
   SELECT_SUBSIDIARYLIST,
   GET_PROLIST_BYCONTID,
   SELECT_CONTRACT_METERIAL_PAGE,
 } from '../actions/contractSystem'

 const initalData = {
   loading: true,
   list: [],
   contractType:0,
   appendixId:11,
   productList:[],
   newproductList:[],
   count: {
     notPassCount: 0,
     notaCount: 0,
     auditedCount: 0,
     passCount: 0,
     customerCount: 0,
   },
   page: {
     pageNum: 1,
     pageSize: 10,
     total: '',
   },
   log_page:{
       pageNum: 1,
       pageSize: 10,
       total: '',
   },
   columns: [{
     title: '合同编号',
     dataIndex: 'contractNumber',
     checked: true,
     key: 1,
   }, {
     title: '对应客户',
     dataIndex: 'customerName',
     checked: true,
     key: 2,
   }, {
     title: '合同总金额',
     dataIndex: 'totalAmount',
     checked: true,
     key: 3,
   }, {
     title: '剩余回款金额',
     dataIndex: 'remainAmount',
     checked: true,
     key: 4,
   }, {
     title: '支付情况',
     dataIndex: 'paymentSitStr',
     checked: true,
     key: 5,
   }, {
     title: '合同状态',
     dataIndex: 'statusStr',
     checked: true,
     key: 6,
   }, {
     title: '添加时间',
     dataIndex: 'createTime',
     checked: true,
     key: 7,
   }],
   columns2: [{
     title: '合同编号',
     dataIndex: 'contractNumber',
     checked: true,
     key: 1,
   }, {
     title: '客户名称',
     dataIndex: 'customerName',
     checked: true,
     key: 2,
   }, {
     title: '合同状态',
     dataIndex: 'statusStr',
     checked: true,
     key: 3,
  },{
     title: '支付情况',
     dataIndex: 'paymentSitStr',
     checked: true,
     key: 4,
   }, {
     title: '合同开始日期',
     dataIndex: 'startTime',
     checked: true,
     key: 5,
     render: (text, record) => {
      return text ? moment(text).format("YYYY-MM-DD") : ''
    },
   }, {
     title: '合同结束日期',
     dataIndex: 'endTime',
     checked: true,
     key: 6,
     render: (text, record) => {
      return text ? moment(text).format("YYYY-MM-DD") : ''
    },
   }, {
     title: '合同添加人',
     dataIndex: 'createUser',
     checked: true,
     key: 7,
   }, {
     title: '合同添加时间',
     dataIndex: 'createTime',
     checked: true,
     key: 8,
   }],
   subcontract:null,
 }

 export default (state = initalData, action = {}) => {
   switch (action.type) {
     case GET_CONTRACT_NUMBER:
          return {
           ...state,
           id: action.data.data.id,
           contractNumber: action.data.data.contractNumber,
           businessOpportList: action.data.data.businessOpportList.map(data => {
             return {
               ...data,
               key: data.id,
             }
         }),
       }
     case CONTRACT_SYSTEM_LIST: // 基本搜索
       return {
         ...state,
         list: action.data.data.data.map(data => {
           return {
             ...data,
             key: data.id,
           }
         }),
         page: {
           ...action.data.data.page,
           pageNum: action.args.pageNum,
           pageSize: action.args.pageSize,
         },
         loading:false,
       }
     case CONTRACT_HEI_QUERY_LIST: // 高级搜索
       return {
         ...state,
         list: action.data.data.data.map(data => {
           return {
             ...data,
             key: data.id,
           }
         }),
         loading:false,
         page: {
           ...action.data.data.page,
           pageNum: action.args.pageNum,
           pageSize: action.args.pageSize,
         },
       }
     case HEI_QUERY_LIST: // 高级搜索
       return {
         ...state,
         list: action.data.data.data.map(data => {
           return {
             ...data,
             key: data.id,
           }
         }),
         page: {
           ...action.data.data.page,
           pageNum: action.args.pageNum,
           pageSize: action.args.pageSize,
         },
       }
     case CLUESYSTEM_GET_NUMBER:
       return {
         ...state,
         count: {
           ...action.data.data,
         },
       }
       case NEW_CONTRACT:
         return {
           ...state,
           newContract: {
             ...action.data.data,
           },
         }
         case INSERT_PAYMENT:
           return {
             ...state,
             insertPayment: {
               ...action.data.data,
             },
           }
       case SELECT_CONTRACT_AND_PRODUCT:
          return {
             ...state,
             selectContract: {
               ...action.data.data.contract,
             },
             topicId:action.data.data.topicId,
          }
          case SELECT_RECEIPT:
             return {
                ...state,
                selectreceipt: {
                  ...action.data.data,
                },
             }
       case SELECT_RECEIPT_LIST:
         return {
            ...state,
            receiptList: action.data.data.paymentList.map(data => {
              return {
                ...data,
                key: data.id,
              }
          }),
          totalAmount:action.data.data.totalAmount,
          totalAmountBack:action.data.data.totalAmountBack,
          residue:action.data.data.residue,
          // receipt:action.data.data.receipt,
         }
         case INSERT_RECEIPT:
            return {
               ...state,
               insertReceipt: {
                 ...action.data.data,
               },
            }
        case SELECT_BILL_LIST:
           return {
              ...state,
              billList:  action.data.data.billList.map(data => {
                return {
                  ...data,
                  key: data.id,
                }
            }),
            bill_hasBillMoney:action.data.data.hasBillMoney,
            bill_residue:action.data.data.residue,
            bill_totalAmount:action.data.data.totalAmount,
            userId:action.data.data.userId,
           }
       case OPERATION_LOG_LIST:
          return {
             ...state,
             operationLogList:  action.data.data.data.map(data => {
               return {
                 ...data,
                 key: data.id,
               }
           }),
           log_page: {
             ...action.data.data.page,
             pageNum: action.args.pageNum,
             pageSize: action.args.pageSize,
           },
          }
          case SELECT_CONTRACT_METERIAL_PAGE:
          return {
             ...state,
             meterialList:  action.data.data.data.map(data => {
               return {
                 ...data,
                 key: data.id,
               }
           }),
           meterial_page: {
            total: action.data.data.page.total,
            pageNum: action.data.data.page.pageNum,
            pageSize: action.data.data.page.pageSize,
          },
          }
          case UPDATE_CONTRACT:
             return {
                ...state,
                updateContract:  {
                    ...action.data.data,
                },
              }
          case UPDATE_CONTRACT_STATUS:
             return {
                ...state,
                updateContractStatus:  {
                    ...action.data.data,
                },
              }
          case INSERT_BILL:
             return {
                ...state,
                insertBill:  {
                    ...action.data.data,
                },
              }
          case SELECT_BILL:
             return {
                ...state,
                selectBill:  {
                    ...action.data.data,
                },
              }
          case INSERT_SEND_BILL:
             return {
                ...state,
                insertSendBill:  {
                    ...action.data.data,
                },
              }
          case UPDATE_BILL:
             return {
                ...state,
                updateBill:  {
                    ...action.data.data,
                },
              }
          case SELECT_PAYMENT:
             return {
                ...state,
                selectPayment:  {
                    ...action.data.data,
                },
              }
          case UPDATE_PAYMENT:
             return {
                ...state,
                updatePayment:  {
                    ...action.data.data,
                },
              }
          case DELETE_RECIPIT:
             return {
                ...state,
                deleteReceipt:  {
                    ...action.data.data,
                },
              }
          case SELECT_SUBSIDIARYLIST:
             return {
                ...state,
                subsidiaryList:  action.data.data.contractList.map(data => {
                  return {
                    ...data,
                    key: data.id,
                }
            }),
            collecContractAmount:action.data.data.collecContractAmount,
            subsidiaryAmount:action.data.data.subsidiaryAmount,
            amountBack:action.data.data.amountBack,
             }
         case GET_PROLIST_BYCONTID:
            return {
               ...state,
               productList:  action.data.data.map(data => {
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
