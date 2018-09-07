import {
  GET_ALL_POWER_LIST_REQUEST,
  GET_ALL_POWER_LIST,
  GET_ALL_DEPT_LIST,
  GET_ALL_PERSON_LIST,
} from '../actions/powerSystem'

const initalData = {
  loading: true,
  powerList: [],
  deptList: [],
  personList: [],
  page: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case GET_ALL_POWER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case GET_ALL_POWER_LIST:
      return {
        ...state,
        powerList: action.data.data.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
        page: action.data.data.page,
        loading: false,
      }
    case GET_ALL_DEPT_LIST:
      let deptList = []
      try {
        deptList = JSON.parse(action.data.data.deptList).data
      } catch (error) {
        console.error('数据错误')
      }
      return {
        ...state,
        deptList,
      }
    case GET_ALL_PERSON_LIST:
      let personList = []
      try {
        personList = JSON.parse(action.data.data.allUser).data
      } catch (error) {
        console.error('数据错误')
      }
      return {
        ...state,
        personList,
      }
    default:
      return state
  }
}
