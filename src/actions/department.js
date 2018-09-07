/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const GET_DEPARTMENT = 'GET_DEPARTMENT' // 获取部门

export const getDepartment = singleApi({ // 延期列表
  url: baseURL() + '/user/dept_select',
  action: (args, json) => {
    return {
      args,
      type: GET_DEPARTMENT,
      data: json,
    }
  },
})