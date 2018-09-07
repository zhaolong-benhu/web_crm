/**
 * Created by huangchao on 26/01/2018.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'

export const GET_ALL_COMPANY_PEOPLE = 'GET_ALL_COMPANY_PEOPLE' // 获取公司所有成员

export const getAllPeople = singleApi({
  url: baseURL() + '/user/dept_employee',
  action: (args, json) => {
    return {
      type: GET_ALL_COMPANY_PEOPLE,
      data: json.data,
    }
  },
})