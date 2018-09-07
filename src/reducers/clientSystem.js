/**
 * Created by huangchao on 20/11/2017.
 */
import {
  CLIENT_DEFULATE_DATA_LIST,
  MYCONTACT_DEFULATE_DATA_LIST,
  CLIENT_HEI_QUERY_LIST,
  SELECT_CONTACT_DATA_LIST,
  SELECT_ALL_NAME, //查询所有个人姓名
  ADD_NEW_JOB_INFO, // 新增工作信息
  INVENTED_DELETECRM_JOB_ONE, //删除工作信息（虚拟）
  DELETECRM_JOB_ONE, //删除工作信息
  ADD_CONTACT_ONE,// 新增联系人
} from '../actions/clientSystem'

const initalData = {
  loading: true,
  list: [],
  id:"",
  customerId:"",
  phoneId:"",
  contactList: [],
  crmJobsList: [{}],
  selectContact: {age:1},
  nameList: [],
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
    title: '客户编号',
    dataIndex: 'number',
    checked: true,
    key: 1,
  }, {
    title: '客户姓名',
    dataIndex: 'name',
    checked: true,
    key: 2,
  }, {
    title: '客户类型',
    dataIndex: 'cType',
    checked: true,
    key: 3,
  }, {
    title: '审核状态',
    dataIndex: 'sta',
    checked: true,
    key: 4,
  }, {
    title: '提交时间',
    dataIndex: 'createTime',
    checked: true,
    key: 5,
  }, {
    title: '修改时间',
    dataIndex: 'modifyTime',
    checked: true,
    key: 6,
  }, {
    title: '操作',
    dataIndex: 'action',
    checked: true,
    key: 7,
  }],

  contactColumns: [{
    title: '联系人姓名',
    dataIndex: 'contactName',
    checked: true,
    key: 1,
  }, {
    title: '联系方式',
    dataIndex: 'contactType',
    checked: true,
    key: 2,
  }, {
    title: '号码',
    dataIndex: 'contactNumber',
    checked: true,
    key: 3,
  }, {
    title: '角色',
    dataIndex: 'role',
    checked: true,
    key: 4,
  }, {
    title: '职位',
    dataIndex: 'job',
    checked: true,
    key: 5,
  }, {
    title: '备注',
    dataIndex: 'remarks',
    checked: true,
    key: 6,
  },{
    title: '操作',
    dataIndex: 'action',
    checked: true,
    key: 7,
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case CLIENT_DEFULATE_DATA_LIST: // 基本搜索
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
    case MYCONTACT_DEFULATE_DATA_LIST: // 基本列表
      return {
        ...state,
        contactList: action.data.data.map(data => {
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
    case CLIENT_HEI_QUERY_LIST: // 高级搜索
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
    case SELECT_CONTACT_DATA_LIST: // 基本列表
      return {
        ...state,
        selectContact:action.data.data.crmCustomerIndividual,
        crmJobsList: action.data.data.crmJobsList.map(data => {
          return {
            ...data,
            key: data.id,
          }
        }),
        loading:false,
      }
    case SELECT_ALL_NAME: // 查询所有个人姓名
      return {
        ...state,
        nameList: action.data.data.map(item => {
          return {
            ...item,
            key: item.id,
          }
        }),
      }
    case ADD_NEW_JOB_INFO: // 新增工作信息
      return {
        ...state,
        crmJobsList: [...state.crmJobsList,{}],
      }
    case DELETECRM_JOB_ONE: // 删除工作信息
    case INVENTED_DELETECRM_JOB_ONE:
    return {
      ...state,
      crmJobsList: [...state.crmJobsList],
    }
  case ADD_CONTACT_ONE: // 新增联系人
    return {
      ...state,
      addContractOne: {
        ...action.data.data,
      },
    }
    default:
      return state
  }
}
