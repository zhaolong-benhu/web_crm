/**
 * Created by ll on 2018.
 */
import {
  SELECT_DELAY_LIST,
  SELECT_DELAY_RESULT,
} from '../actions/delaySystem'

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
  feadBack: {},
  columns: [{
    title: '客户名称',
    dataIndex: 'customerName',
  }, {
    title: '审核状态',
    dataIndex: 'statusName',
  }, {
    title: '申请人',
    dataIndex: 'chineseName',
  }, {
    title: '延期天数',
    dataIndex: 'days',
  }, {
    title: '申请日期',
    dataIndex: 'delayDate',
  }, {
    title: '操作区',
    dataIndex: 'action',
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case SELECT_DELAY_LIST: // 基本列表
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
    case SELECT_DELAY_RESULT: //查看延期审核结果
      return {
        ...state,
        feadBack: {
          ...action.data.data,
        },
      }
    default:
      return state
  }
}
