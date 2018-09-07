/**
 * Created by huangchao on 20/11/2017.
 */
import {
  SET_QUERY_ITEM,
  SET_QUERY_BEST,
  SELECT_ROW_KEYS,
  SELECT_HEI_QUERY_KEYS,
  SAVE_USER_CHECKOUT,
  SET_HAS_SELECT_QUERY_ITEM,
  DELETE_SELECT_ITEM,
} from '../actions/search'

const initalData = {
  queryBest: [],
  queryHeiBest: [],
  queryData: [],
  selectedRowKeys: [],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case SET_QUERY_BEST: // 基本搜索
      return {
        ...state,
        queryBest: action.data.list,
      }
    case SET_HAS_SELECT_QUERY_ITEM: // 高级搜索已选择
      return {
        ...state,
        queryHeiBest: action.data,
      }
    case SET_QUERY_ITEM: // 高级搜索 all
      return {
        ...state,
        queryData: action.data,
      }
    case SELECT_HEI_QUERY_KEYS:
      return {
        ...state,
        queryData: state.queryData.map(item => {
          if (item.id === action.data.id) {
            item.checked = action.data.check
          }
          return item
        }),
      }
    case SELECT_ROW_KEYS:
      return {
        ...state,
        selectedRowKeys: action.data,
      }
    case SAVE_USER_CHECKOUT:
      const selectArr = action.args.searchList
      return {
        ...state,
        queryData: state.queryData.map(data => {
          if (selectArr.indexOf(data.id) >= 0) {
            return {
              ...data,
              checked: true,
            }
          } else {
            return {
              ...data,
              checked: false,
            }
          }
        }),
      }
    case DELETE_SELECT_ITEM:
      return {
        ...state,
        selectedRowKeys: [],
      }
    default:
      return state
  }
}
