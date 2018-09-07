/**
 * Created by ll on 20/11/2017.
 */
import {
  ADMIN_DEFULATE_DATA_LIST,
  ADMIN_CLEAR_DATA_LIST,
  MEMBER_DEFULATE_DATA_LIST,
  MEMBER_CLEAR_DATA_LIST,
  GET_TOPIC_DATA,
  GET_POOL_DATA,
  DELETE_MEMBER_DATA_LIST,
  CREAT_NEW_OPEN_SEA,
  UPDATE_MEMBER,
  SELECT_LABEL,
} from '../actions/internation'

const initalData = {
  loading: false,
  listAdmin: [],
  listMem: [],
  disabled: true,
  PoolData: {},
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
  topicList: [],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case ADMIN_DEFULATE_DATA_LIST: // 初始化list
      return {
        ...state,
        listAdmin: action.data.data.map(item => {
          return {
            ...item,
            key: item.id,
          }
        }),
      }
    case ADMIN_CLEAR_DATA_LIST: // 清空list
      return {
        ...state,
        listAdmin: [],
      }
    case MEMBER_DEFULATE_DATA_LIST: // 初始化list
      return {
        ...state,
        listMem: action.data.data.data.map(item => {
          return {
            ...item,
            key: item.id,
          }
        }),
        page: {
          ...action.data.data.page,
          pageNum: action.data.data.page.pageNum,
          pageSize: action.data.data.page.pageSize,
        },
      }
    case MEMBER_CLEAR_DATA_LIST: // 清空list
      return {
        ...state,
        listMem: [],
      }
    // case MEMBER_DEFULATE_DATA_LIST: // 初始化list
    // let listAdmin = [], listMem = [];
    // console.log(action);
    // action.data.data.data.map(item => {
    //     item.key=item.id
    //     const pagelist = action.data.data.page
    //     console.log(pagelist);
    //   if (item.role === 1){
    //     listAdmin.push(item)
    //   } else {
    //     console.log(item);
    //     listMem.push(item)
    //   }
    //   return null
    // })
    // return {
    //   ...state,
    //   listAdmin,
    //   listMem,
    //   page: {
    //     ...action.data.data.page,
    //     pageNum: action.args.pageNum || 1,
    //     pageSize: action.args.pageSize || 10,
    //   },
    // }
    case GET_TOPIC_DATA:
      return {
        ...state,
        topicList: action.data.data.map(item => {
          return {
            ...item,
            key: item.id,
          }
        }),
      }
    case GET_POOL_DATA: // 获取公海名称&业务线
      return {
        ...state,
        PoolData: action.data.data,
      }
    case DELETE_MEMBER_DATA_LIST:
      const status = action.args.status
      return {
        ...state,
        status: status,
      }
    case CREAT_NEW_OPEN_SEA:
      return {
        ...state,
        disabled: false,
      }
    case UPDATE_MEMBER: // 启用禁用
      // const status = action.args.status
      return {
        ...state,
        status: status,
      }
   case SELECT_LABEL: // 公海标签列表
    return {
      ...state,
      labelList: action.data.data.map(item => {
        return {
          ...item,
          key: item.id,
        }
      }),
    }
    default:
      return state
  }
}
