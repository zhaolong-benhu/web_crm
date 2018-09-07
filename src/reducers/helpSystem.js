/**
 * Created by huangchao on 20/11/2017.
 */
import moment from 'moment'
import {
  SELECT_ALL_DELAY,
} from '../actions/helpSystem'

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

  columns: [{
    title: '客户名称',
    dataIndex: 'customerName',
  }, {
    title: '行业类别',
    dataIndex: 'dictName',
  }, {
    title: '申请人',
    dataIndex: 'userName',
  }, {
    title: '跟进状态',
    dataIndex: 'fStatus',
  }, {
    title: '最近跟进时间',
    dataIndex: 'createTime',
  }, {
    title: '下次跟进时间',
    dataIndex: 'fTime',
    render: (text, record) => {
      return text ? moment(text).format("YYYY-MM-DD") : ''
    },
  }, {
    title: '标签',
    dataIndex: 'labelName',
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case SELECT_ALL_DELAY: // 基本列表
      return {
        ...state,
        list: action.data.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
        page: {
          ...action.data.page,
          pageNum: action.args.pageNum,
          pageSize: action.args.pageSize,
        },
        loading:false,
      }
    default:
      return state
  }
}
