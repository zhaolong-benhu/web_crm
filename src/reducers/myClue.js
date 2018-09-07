/**
 * Created by huangchao on 20/11/2017.
 */
import {
  MYCLUE_DEFULATE_DATA_LIST,
  MYCLUE_CHECK_REASON,
  MYCLUE_GET_NUMBER,
} from '../actions/myClue'

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
  feadBack: {},
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case MYCLUE_DEFULATE_DATA_LIST: // 初始化list
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
    case MYCLUE_GET_NUMBER:
      return {
        ...state,
        count: {
          ...action.data.data,
        },
      }
    case MYCLUE_CHECK_REASON:
      return {
        ...state,
        feadBack: {
          ...action.data.data,
        },
      }
    default:
      return state
  }
}
