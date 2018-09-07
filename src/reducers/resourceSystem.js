/**
 * Created by huangchao on 20/11/2017.
 */
import {
  RESOURCE_DEFULATE_DATA_LIST,
  RESOURCE_HEI_QUERY_LIST,
  MERGE_GET_CUSTOMER,
  GET_DICTIONARIES,
  SELECT_POOLLIST,
} from '../actions/resourceSystem'

const initalData = {
  loading: true,
  list: [],
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
  custorm:{
  },
  columns: [{
    title: '客户编号',
    dataIndex: 'number',
    checked: true,
    key: 1,
  }, {
    title: '客户姓名',
    dataIndex: 'name',
    checked: true,
    key: 2,
  }, {
    title: '客户类型',
    dataIndex: 'cType',
    checked: true,
    key: 3,
  }, {
    title: '所属行业',
    dataIndex: 'industryName',
    checked: true,
    key: 4,
  }, {
    title: '客户来源',
    dataIndex: 'dictName',
    checked: true,
    key: 5,
  }, {
    title: '分配状态',
    dataIndex: 'isMode',
    checked: true,
    key: 6,
  }, {
    title: '分配的公海',
    dataIndex: 'poolName',
    checked: true,
    key: 7,
  }, {
    title: '分配方式',
    dataIndex: 'disMode',
    checked: true,
    key: 8,
  }, {
    title: '分配时间',
    dataIndex: 'disTime',
    checked: true,
    key: 9,
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case RESOURCE_DEFULATE_DATA_LIST: // 基本搜索
      return {
        ...state,
        loading:false,
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
    case RESOURCE_HEI_QUERY_LIST: // 高级搜索
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
      case MERGE_GET_CUSTOMER: // 合并客户
          return {
              ...state,
              custorm: action.data,
          }
      case GET_DICTIONARIES: // 属性
          return {
              ...state,
              poolList: action.data.data.poolList.map(data => {
                return {
                  ...data,
                  key: data.id,
                }
              }),
          }
      case SELECT_POOLLIST: // 公海列表
          return {
              ...state,
              selectPoolList: action.data.data.map(data => {
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
