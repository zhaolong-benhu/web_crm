/**
 * Created by huangchao on 20/11/2017.
 */
import moment from 'moment'
 import {
  BUSINESS_DEFULATE_DATA_LIST,
  GET_BUSINESS_ONE,
  GET_PRODUCT_LIST,
  BUSINESS_HEI_QUERY_LIST,
} from '../actions/businessSystem'

const initalData = {
  loading: true,
  businesstList: [],
  productList:[],
  busiData:{},
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

  columns: [{
    title: '商机编号',
    dataIndex: 'busNumber',
  }, {
    title: '商机类型',
    dataIndex: 'busType',
  }, {
    title: '商机状态',
    dataIndex: 'busStatus',
  }, {
    title: '商机添加人',
    dataIndex: 'userName',
  }, {
    title: '对应客户',
    dataIndex: 'customerName',
  }, {
    title: '行业类别',
    dataIndex: 'industryType',
  }, {
    title: '预计销售金额',
    dataIndex: 'esMoney',
  }, {
    title: '添加时间',
    dataIndex: 'createTime',
  }],

  columnsMyBusi: [{
    title: '商机编号',
    dataIndex: 'busNumber',
  }, {
    title: '商机类型',
    dataIndex: 'busType',
  }, {
    title: '商机状态',
    dataIndex: 'busStatus',
  }, {
    title: '客户名称',
    dataIndex: 'customerName',
  }, {
    title: '预计销售金额',
    dataIndex: 'esMoney',
  }, {
    title: '预计签单日期',
    dataIndex: 'esBillDate',
    render: (text, record) => {
      return text ? moment(text).format("YYYY-MM-DD") : ''
    },
  }, {
    title: '添加时间',
    dataIndex: 'createTime',
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case BUSINESS_DEFULATE_DATA_LIST: // 基本列表
      return {
        ...state,
        businesstList: action.data.data.data.map(data => {
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
    case BUSINESS_HEI_QUERY_LIST: // 高级搜索
      return {
        ...state,
        businesstList: action.data.data.data.map(data => {
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
    case GET_BUSINESS_ONE: // 查询所有个人姓名
    console.log(action.data);
      return {
        ...state,
        ...action.data.data,
        busiData:action.data.data,
      }
   case GET_PRODUCT_LIST: // 获取产品列表
     return {
       ...state,
       productList: action.data.data.map(data => {
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
