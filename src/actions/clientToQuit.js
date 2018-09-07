/**
 * Created by zhaolong on 2018/05/18
 * File description:离职员工客户
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const SELECT_CLIENT_TOQUIT = 'SELECT_CLIENT_TOQUIT' // 离职员工客户

export const getInitList = singleApi({ // 离职员工列表
  url: baseURL() + '/myClient/selectClientToQuit',
  action: (args, json) => {
    return {
      args,
      type: SELECT_CLIENT_TOQUIT,
      data: json,
    }
  },
})
