/**
 * Created by liuli on 2018.
 */
import {
  GET_OPERATION_LOG,
} from '../actions/operateSystem'

const initalData = {
  loading: true,
  operateList: [],
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
  columnsOperate: [{
    title: '动作',
    dataIndex: 'title',
  }, {
    title: '操作内容',
    dataIndex: 'content',
  }, {
    title: '操作人',
    dataIndex: 'userName',
  }, {
    title: '操作人部门',
    dataIndex: 'departmentName',
  }, {
    title: '操作时间',
    dataIndex: 'createTime',
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case GET_OPERATION_LOG: // 基本列表
      return {
        ...state,
        operateList: action.data.data.data.map(data => {
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
