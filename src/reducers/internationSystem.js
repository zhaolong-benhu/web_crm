/**
 * Created by ll on 20/11/2017.
 */
import {
  INTERNATION_DEFULATE_DATA_LIST,
  SELECT_POOLID,
  UPDATE_POOL_ENABLE,
} from '../actions/internationSystem'

const initalData = {
  loading: true,
  poolId: 0,
  list: [],
  count: {
    notPassCount: 0,
    notaCount: 0,
    auditedCount: 0,
    passCount: 0,
    customerCount: 0,
  },
  custorm:{

  },
  page: {
    pageNum: 1,
    pageSize: 10,
    total: '',
  },
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case INTERNATION_DEFULATE_DATA_LIST: // 初始化list
      return {
        ...state,
        list: action.data.data.data.map(item => {
          return {
            ...item,
            key: item.id,
          }
        }),
        page: {
          ...action.data.data.page,
          pageNum: action.args.pageNum,
          pageSize: action.args.pageSize,
        },
        loading:false,
      }
      case SELECT_POOLID:
        return {
          ...state,
          poolId: action.data,
        }
      case UPDATE_POOL_ENABLE: // 初始化list
        const status = action.args.status
        return {
          ...state,
          status: status,
        }
    default:
      return state
  }
}
