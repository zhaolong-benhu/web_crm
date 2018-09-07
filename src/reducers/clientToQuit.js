/**
 * Created by zhaolong on 2018/05/18
 * File description:离职员工客户
 */

 import {
   SELECT_CLIENT_TOQUIT,
 } from '../actions/clientToQuit'

 const initalData = {
   loading: true,
   list: [],
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
    case SELECT_CLIENT_TOQUIT: // 基本搜索
      return {
        ...state,
        list: action.data.data.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
        page: {
          ...action.data.data.page,
          pageNum: action.args.pageNum,
          pageSize: action.args.pageSize,
        },
        loading:false,
      }
      default:
        return state
  }
}
