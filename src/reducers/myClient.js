/**
 * Created by huangchao on 20/11/2017.
 */
import {
  MYCLIENT_DEFULATE_DATA_LIST,
  MYCLIENT_HEI_QUERY_LIST,
  MYCLIENT_CONTACTOR_LIST,
} from '../actions/myClient'

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
  topicIds:[],
  page: {
    pageNum: 1,
    pageSize: 10,
    total: '',
  },
  contactors: [],
  contactorLoaded: false,
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case MYCLIENT_DEFULATE_DATA_LIST: // 基本列表
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
    case MYCLIENT_HEI_QUERY_LIST: // 高级搜索
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
    case MYCLIENT_CONTACTOR_LIST: // 获取联系人列表
      return {
        ...state,
        contactors: action.data.data,
        contactorLoaded: true,
      }
    default:
      return state
  }
}
