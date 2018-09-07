/**
 * Created by huangchao on 20/11/2017.
 */
import {
  MYPOOL_DEFULATE_DATA_LIST,
  SELECT_POOL_BYUSERID,
} from '../actions/myInternation'

const initalData = {
  loading: true,
  list: [],
  poolList: [],
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
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case MYPOOL_DEFULATE_DATA_LIST: // 基本列表
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
      case SELECT_POOL_BYUSERID: // 所属公海列表
        return {
          ...state,
          poolList: action.data.data.map(data => {
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
