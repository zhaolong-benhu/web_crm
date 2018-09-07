/**
 * Created by huangchao on 20/11/2017.
 */
import {
  CLUE_DEFULATE_DATA_LIST,
  HEI_QUERY_LIST,
  CLUESYSTEM_USER_ADDAUDIT,
  CLUESYSTEM_GET_NUMBER,
} from '../actions/clueSystem'

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
    title: '审核状态',
    dataIndex: 'sta',
    checked: true,
    key: 4,
  }, {
    title: '提交时间',
    dataIndex: 'createTime',
    checked: true,
    key: 5,
  }, {
    title: '修改时间',
    dataIndex: 'updateTime',
    checked: true,
    key: 6,
  }, {
    title: '操作',
    dataIndex: 'action',
    checked: true,
    key: 7,
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case CLUE_DEFULATE_DATA_LIST: // 基本搜索
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
        loading:false,
      }
    case CLUESYSTEM_GET_NUMBER:
      return {
        ...state,
        count: {
          ...action.data.data,
        },
      }
    case CLUESYSTEM_USER_ADDAUDIT:
      const customerList = action.args.customerList
      const status = action.args.status
      return {
        ...state,
        list: state.list.map(item => {
          if (customerList.indexOf(item.id) >= 0) {
            return {
              ...item,
              status: status,
              sta: status === 2 ? '审核通过' : '审核未通过',
            }
          }
          return {
            ...item,
          }
        }),
        count: {
          notaCount: Number(state.count.notaCount) - customerList.length,
          passCount: status === 2 ? Number(state.count.passCount) + customerList.length : state.count.passCount,
          notPassCount: status === 3 ? Number(state.count.notPassCount) + customerList.length : state.count.notPassCount,
        },
      }
    default:
      return state
  }
}
