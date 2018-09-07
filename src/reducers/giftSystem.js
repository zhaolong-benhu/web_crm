/**
 * Created by huangchao on 20/11/2017.
 */
import {
  GIFT_DEFULATE_DATA_LIST,
  GET_DELIVERY_BY_ID,
} from '../actions/giftSystem'

const initalData = {
  loading: false,
  giftList: [],
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
  columnsGift: [{
    title: '礼物名称',
    dataIndex: 'goodsName',
  }, {
    title: '收件人',
    dataIndex: 'addressee',
  }, {
    title: '送礼人',
    dataIndex: 'giverName',
  }, {
    title: '快递日期',
    dataIndex: 'expresDate',
  }, {
    title: '送礼理由',
    dataIndex: 'content',
  }, {
    title: '备注',
    dataIndex: 'remark',
  }],
}

export default (state = initalData, action = {}) => {
  switch (action.type) {
    case GIFT_DEFULATE_DATA_LIST: // 基本列表
      return {
        ...state,
        giftList: action.data.data.data.map(data => {
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
    case GET_DELIVERY_BY_ID: //查看延期理由
      return {
        ...state,
        ...action.data.data,
      }
    default:
      return state
  }
}
