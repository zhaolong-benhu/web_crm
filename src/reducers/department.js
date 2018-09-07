/**
 * Created by huangchao on 20/11/2017.
 */
import {
  GET_DEPARTMENT, // 获取部门
} from '../actions/department'

const initalData = {
  loading: false,
  list: [],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case GET_DEPARTMENT: 
      return {
        ...state,
        list: action.data.data.map(data => {
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
