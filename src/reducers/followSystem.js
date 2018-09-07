/**
 * Created by ll on 20/11/2018.
 */
import {
  FOLLOW_DEFULATE_DATA_LIST,
  GET_FOLLOWITEM_ONE,
  FOLLOW_MYCLIENT_DATA_LIST,
  GET_FOLLOWITEM_BYTID,
  GET_CONLIST_BYCUSID,
  GET_FOLLOW_ONE,
  GET_RECORD_LIST,
  MYCONTACT_DEFULATE_DATA_LIST,
  TOPIC_LIST,
} from '../actions/followSystem'

const initalData = {
  loading: true,
  list: [],
  followInfo: [],
  followDetail:{},
  count: {
    notPassCount: 0,
    notaCount: 0,
    auditedCount: 0,
    passCount: 0,
    customerCount: 0,
  },
  followContractList:[],
  page: {
    pageNum: 1,
    pageSize: 20,
    total: '',
  },
  topicList:[],
  columnsFollowInfo: [{
    title: '跟进方式',
    dataIndex: 'typeStr',
  }, {
    title: '跟进人',
    dataIndex: 'userName',
  }, {
    title: '跟进人部门',
    dataIndex: 'department',
  }, {
    title: '跟进的联系人',
    dataIndex: 'contactsName',
  }, {
    title: '跟进内容',
    dataIndex: 'dataList',
  }, {
    title: '跟进时长',
    dataIndex: 'lengthTime',
  }, {
    title: '跟进次数',
    dataIndex: 'flowCount',
  }, {
    title: '跟进状态',
    dataIndex: 'statusStr',
  }, {
    title: '操作',
    dataIndex: 'action',
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case FOLLOW_DEFULATE_DATA_LIST: // 基本列表
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
    case GET_FOLLOWITEM_ONE: //获取单条
      return {
        ...state,
        ...action.data.data,
      }
    case FOLLOW_MYCLIENT_DATA_LIST: // 跟进信息基本列表
      return {
        ...state,
        followInfo: action.data.data.data.map(data => {
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
    case GET_FOLLOWITEM_BYTID: //获取单条
      return {
        ...state,
        ...action.data.data,
      }
    case GET_CONLIST_BYCUSID: //获取联系人信息
      return {
        ...state,
        ...action.data.data,
        followContractList:action.data.data.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
      }
    case GET_FOLLOW_ONE: //根据id获取单条跟进信息进行编辑
      return {
        ...state,
        ...action.data.data,
        followDetail:action.data.data,
      }
      case GET_RECORD_LIST: //录音文件列表
      return {
        ...state,
        recordList:action.data.data.data.map(data => {
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
      }
      case TOPIC_LIST: //业务线列表
      return {
        ...state,
        topicList:action.data.data.map(data => {
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
