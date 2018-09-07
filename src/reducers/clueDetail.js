import {
  GET_CLUE_DETAIL,
  GET_REPTBYCUSTOMERID,
  ADD_CLUE_ENTERPRISE,
  ADD_CLUE_PERSON,
  CHANGEINFO,
  UPDATE_CLUE_ENTERPRISE,
  UPDATE_CLUE_PERSON,
  CHECK_EXTERPRISE_NAME,
  CHECK_PERSONAL_NAME,
  CHECK_PERSONAL_PHONE,
  CHECK_PERSONAL_WORKPHONE,
  CHECK_PERSONAL_WECHAT,
  CHECK_PERSONAL_IDCARD,
  SELECT_LABEL_LIST,
 } from '../actions/clueDetail'

const initialState = {
  beforCompanyId:"",
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_CLUE_DETAIL:
      return {
        ...state,
        ...action.data,
      }
      case GET_REPTBYCUSTOMERID:
      return {
        ...state,
        ...action.data,
        repMoneyList:action.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
      }
      case SELECT_LABEL_LIST:
      return {
        ...state,
        ...action.data,
        selectlabelList:action.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
      }
    case ADD_CLUE_ENTERPRISE:
      return {
        ...state,
        ...action.data,
        isOK: true,
      }
    case UPDATE_CLUE_ENTERPRISE:
      return {
        ...state,
        ...action.data,
        isOK: true,
      }
    case ADD_CLUE_PERSON:
      return {
        ...state,
        ...action.data,
      }
    case UPDATE_CLUE_PERSON:
      return {
        ...state,
        ...action.data,
        isOK: true,
      }
    case CHANGEINFO:
      return {
        isOK: false,
      }
    case CHECK_EXTERPRISE_NAME:
      return {
        ...state,
        ...action.data,
      }
    case CHECK_PERSONAL_NAME:
      return {
        ...state,
        ...action.data,
      }
    case CHECK_PERSONAL_PHONE:
      return {
        ...state,
        ...action.data,
      }
    case CHECK_PERSONAL_WORKPHONE:
      return {
        ...state,
        ...action.data,
      }
    case CHECK_PERSONAL_WECHAT:
      return {
        ...state,
        ...action.data,
      }
    case CHECK_PERSONAL_IDCARD:
      return {
        ...state,
        ...action.data,
      }
    default:
      return state
  }
}
