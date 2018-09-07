/**
 * Created by ll on 20/11/2017.
 */
import {
  QUERY_AUTO_POOL_RULE,
  ENABLE_AUTO_POOL_RULE,
  QUERY_OTHER_POOL_RULE,
  GET_FORM_LIST,
  QUERY_AUTO_POOLRULE_HANDNUMBER,
  ADD_AUTO_POOL_RULE,
  UPDATE_AUTO_POOL_RULE,
  QUERY_ONE_AUTO_POOL_RULE,
  DELETE_AUTO_POOL_RULE,
  INSERT_OTHER_POOL_RULE,
  UPDATE_OTHER_POOL_RULE,
  QUERY_ONE_OTHER_POOL_RULE,
  DELETE_OTHER_POOL_RULE,
  ENABLE_OTHER_POOL_RULE,
  SELECT_FILEDVALUETODICTIONARY,
} from '../actions/internationRule'

const initalData = {
  loading: false,
  list: [],
  handNumberList: [],
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
      case QUERY_AUTO_POOL_RULE: // 初始化list
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
        }
      case ENABLE_AUTO_POOL_RULE: // 初始化list
        const status = action.args.status
        return {
          ...state,
          status: status,
        }
      case QUERY_OTHER_POOL_RULE: // 初始化其他list
        let listNone = [], listQuit = [], listGet = [], listTime = [], listHold = [], listIn = [];
        action.data.data.map(item => {
            item.key=item.id
          if (item.ruleType === 1){
            listNone.push(item)
          }
          if (item.ruleType === 2){
            listQuit.push(item)
          }
          if (item.ruleType === 3){
            listGet.push(item)
          }
          if (item.ruleType === 4){
            listTime.push(item)
          }
          if (item.ruleType === 5){
            listHold.push(item)
          }
          if (item.ruleType === 6){
            listIn.push(item)
          }
          return null
        })
        return {
          ...state,
          listNone,
          listQuit,
          listGet,
          listTime,
          listHold,
          listIn,
        }
      case GET_FORM_LIST: // form表单
        return {
          ...state,
        }
      case QUERY_AUTO_POOLRULE_HANDNUMBER: // 序号选择列表
        return {
          ...state,
          handNumberList: action.data.data.map(item => {
            return {
              ...item,
              key: item.id,
            }
          }),
        }
      case ADD_AUTO_POOL_RULE:
        return {
          ...state,
        }
      case UPDATE_AUTO_POOL_RULE:
        return {
          ...state,
        }
      case QUERY_ONE_AUTO_POOL_RULE: // 序号选择列表
        return {
          ...state,
        }
      case DELETE_AUTO_POOL_RULE: // 删除单条自动划入公海
        return {
          ...state,
        }
      case INSERT_OTHER_POOL_RULE: //添加其他规则
        return {
          ...state,
        }
      case UPDATE_OTHER_POOL_RULE: //添加其他规则
        return {
          ...state,
        }
      case QUERY_ONE_OTHER_POOL_RULE: // 单条其他规则
        return {
          ...state,
        }
      case DELETE_OTHER_POOL_RULE: // 删除其他单条自动划入公海
        return {
          ...state,
        }
      case ENABLE_OTHER_POOL_RULE: // 启动其他规则
        return {
          ...state,
        }
      default:
        return state
    }
}
