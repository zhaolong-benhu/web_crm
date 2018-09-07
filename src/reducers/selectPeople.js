/**
 * Created by huangchao on 26/01/2018.
 */
import {
  GET_ALL_COMPANY_PEOPLE,
} from '../actions/selectPeople'
import F from '../helper/tool'

const initalData = {
  treeData: [],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case GET_ALL_COMPANY_PEOPLE:
      const list = action.data
      return {
        ...state,
        treeData: list,
      }
    default:
      return state
  }
}
