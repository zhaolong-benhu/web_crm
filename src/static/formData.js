/**
 * Created by ll on 15/11/2017.
 */

const queryData = [{
  query: 'query1',
  id: 11,
  type: 1,
  name: '输入搜索',
  disabled: false,
  placeholder: '请输入内容',
  defaultValue: 'sdsd',
  list: [],
}, {
  query: 'query2',
  id: 22,
  type: 2,
  name: '客户类型',
  defaultValue: 1,
  placeholder: '请选择客户类型',
  disabled: false,
  list: [{
    id: 1,
    value: '大客户',
    disabled: false,
  }, {
    id: 2,
    value: '小客户',
    disabled: false,
  }, {
    id: 3,
    value: '中国客户',
    disabled: false,
  }],
}, {
  query: 'query3',
  id: 33,
  type: 3,
  name: '开业时间',
  disabled: false,
  defaultValue: [],
  list: [],
}]

const options = [{
  value: '12',
  label: 'Zhejiang',
  children: [{
    value: '23',
    label: 'Hangzhou',
    children: [{
      value: '23',
      label: 'West Lake',
    }],
  }],
}, {
  value: '12s',
  label: 'Jiangsu',
  children: [{
    value: '45',
    label: 'Nanjing',
    children: [{
      value: '36',
      label: 'Zhong Hua Men',
    }],
  }],
}]

const heiQueryData = [{
  query: 'query4',
  id: 11,
  type: 1,
  name: '输入搜索',
  disabled: false,
  placeholder: '请输入内容',
  checked: true,
  list: [],
}, {
  query: 'query5',
  id: 22,
  type: 2,
  name: '客型类型',
  defaultValue: '大客户',
  placeholder: '请选择客户类型',
  disabled: false,
  checked: false,
  list: [{
    id: 1,
    value: '大客户',
    disabled: false,
  }, {
    id: 2,
    value: '小客户',
    disabled: false,
  }, {
    id: 3,
    value: '中国客户',
    disabled: true,
  }],
}, {
  query: 'query6',
  id: 323,
  type: 3,
  name: '开业时间',
  disabled: false,
  defaultValue: [],
  checked: false,
  list: [],
}, {
  query: 'query7',
  id: 33,
  type: 2,
  name: '客户类型',
  defaultValue: '2',
  placeholder: '请选择客户类型',
  disabled: false,
  checked: true,
  list: [{
    id: 1,
    value: '大客户',
    disabled: false,
  }, {
    id: 2,
    value: '小客户',
    disabled: false,
  }, {
    id: 3,
    value: '中国客户',
    disabled: true,
  }],
}, {
  query: 'query8',
  id: 44,
  type: 2,
  name: '客户类型',
  defaultValue: 1,
  placeholder: '请选择客户类型',
  disabled: false,
  checked: true,
  list: [{
    id: 1,
    value: '大客户',
    disabled: false,
  }, {
    id: 2,
    value: '小客户',
    disabled: false,
  }, {
    id: 3,
    value: '中国客户',
    disabled: true,
  }],
}, {
  query: 'query9',
  id: 55,
  type: 2,
  name: '客户类型',
  defaultValue: 3,
  placeholder: '请选择客户类型',
  disabled: false,
  checked: true,
  list: [{
    id: 1,
    value: '大客户',
    disabled: false,
  }, {
    id: 2,
    value: '小客户',
    disabled: false,
  }, {
    id: 3,
    value: '中国客户',
    disabled: true,
  }],
}, {
  query: 'query10',
  id: 66,
  type: 2,
  name: '客户类型',
  defaultValue: 2,
  placeholder: '请选择客户类型',
  disabled: false,
  checked: true,
  list: [{
    id: 1,
    value: '大客户',
    disabled: false,
  }, {
    id: 2,
    value: '小客户',
    disabled: false,
  }, {
    id: 3,
    value: '中国客户',
    disabled: true,
  }],
}, {
  query: 'query11',
  id: 77,
  type: 2,
  name: '客户类型',
  defaultValue: 1,
  placeholder: '请选择客户类型',
  disabled: false,
  checked: true,
  list: [{
    id: 1,
    value: '大客户',
    disabled: false,
  }, {
    id: 2,
    value: '小客户',
    disabled: false,
  }, {
    id: 3,
    value: '中国客户',
    disabled: true,
  }],
}, {
  query: 'query12',
  id: 1232,
  type: 4,
  name: '地区选择',
  defaultValue: 1,
  placeholder: '请选择地区',
  disabled: false,
  checked: true,
  list: [],
}]

export {
  queryData,
  options,
  heiQueryData,
}
