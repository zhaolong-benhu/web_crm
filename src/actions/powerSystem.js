/**
 * Created by huangchao on 26/01/2018.
 */
import { baseURL } from '../config'
import { singleApi } from '../helper/reduxFetch'

export const GET_ALL_POWER_LIST_REQUEST = 'GET_ALL_POWER_LIST_REQUEST'
export const GET_ALL_POWER_LIST = 'GET_ALL_POWER_LIST'
export const GET_ALL_DEPT_LIST = 'GET_ALL_DEPT_LIST'
export const GET_ALL_PERSON_LIST = 'GET_ALL_PERSON_LIST'
export const POST_POWER = 'POST_POWER'
export const POST_POWER_ASSIGN = 'POST_POWER_ASSIGN'
export const POST_POWER_REMOVE = 'POST_POWER_REMOVE'
export const POST_SWITCH_STATUS = 'POST_SWITCH_STATUS'

export const getAllPowerListRequest = () => {
  return {
    type: GET_ALL_POWER_LIST_REQUEST,
  }
}

// export const getAllPowerList = () => {
//   return {
//     type: GET_ALL_POWER_LIST,
//     data: {
//       code: 0,
//       data: {
//         data: [
//           {
//             id: 1,
//             groupName: '联合国',
//             deparCode:
//               'C442271D-7BED-4756-B793-E026A0E35262,188C14A2-D699-42BD-A352-6CA9CC509201,446CC2CA-38F-45FC-9104-A1F754FB50C8,17E4F6EB-D1B4-43E2-BEAF-02B4ABE32C04',
//             deparName: '财务部,行政部,资源部,总裁办',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '599,102',
//           },
//           {
//             id: 2,
//             groupName: '北大西洋公约组织',
//             deparCode: '618F27F8-6532-42A4-9D78-5F8A6968CD44',
//             deparName: '乔邦猎头',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '403,102',
//           },
//           {
//             id: 3,
//             groupName: '欧洲联盟',
//             deparCode:
//               '14C83395-4569-42A5-A852-F9AE5068C027,8ED70594-45FB-4B14-8574-271D91AFDB13',
//             deparName: '产品部,用户体验部',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '403,422',
//           },
//           {
//             id: 4,
//             groupName: '世界贸易组织',
//             deparCode:
//               '412F0400-F925-4F0B-8802-8BAB9E69B7B5,B41452AE-2035-4A1D-A681-EE83A3880612,0AA8F503-281C-41FE-BF2A-B6D7A4CBF44E',
//             deparName: '人事部,培训部,招聘部',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '443,422',
//           },
//           {
//             id: 5,
//             groupName: '国际货币基金组织',
//             deparCode:
//               '8CCB63A7-E425-496E-81C5-86254F5BB80D,057CE94E-63DD-48A2-9E0E-915DA5790D5C,DA0199E8-D582-4ECE-9B84-E5608DDB4DCA',
//             deparName: 'LMS大客户销售部,LMS服务部,LMS销售部',
//             status: 0,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '443,520',
//           },
//           {
//             id: 6,
//             groupName: '石油输出国组织',
//             deparCode:
//               '89461FC7-609B-43DF-9866-11E029C8A314,D56427B2-B1CE-4425-8455-3BFF8276A349,FE1FC247-6EED-47D8-93A3-D570B0CFA585',
//             deparName: '认证一部,认证二部,认证三部',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '554,520',
//           },
//           {
//             id: 7,
//             groupName: '国际原子能机构',
//             deparCode:
//               '5DD893C2-3C80-4ABA-8F3F-A8034AAB9257,7EFFE302-7952-4467-84CB-39EB1B165DE8',
//             deparName: '教育发展部,教育研发部',
//             status: 0,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '554,595',
//           },
//           {
//             id: 8,
//             groupName: '世界卫生组织',
//             deparCode:
//               'B1AF7A68-90F9-488B-8BFD-B9D0BCB07B37,68754ADF-E35A-47F6-A1EA-4A5034DF46C9,A650D0F1-A986-462A-A2C0-1E14206E0770',
//             deparName: '前端开发部,开发部,移动开发部',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '554,595',
//           },
//           {
//             id: 9,
//             groupName: '国际奥林匹克委员会',
//             deparCode:
//               'AE217B18-E288-4E33-9270-F6FA6B7341A6,4591DAF4-254E-4684-9F4D-D1BB1AB662B2',
//             deparName: '质量部,运维部',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '554,595',
//           },
//           {
//             id: 10,
//             groupName: '世界银行',
//             deparCode:
//               '427DF6C3-09EA-403E-A822-0CC9BE25284F,AC8B6392-37ED-44AC-9174-3B09039EE8D1',
//             deparName: 'RPO项目,办事处',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '554,595',
//           },
//           {
//             id: 11,
//             groupName: '非洲联盟',
//             deparCode:
//               '22EE4A41-EDB0-432D-A871-F399FEC0CF0,30C8484E-13E9-4169-9AA2-290DECA325E6',
//             deparName: '商务部,服务部',
//             status: 1,
//             remark: '',
//             createTime: '2018-06-21 15:51:50',
//             userid: '554,595',
//           },
//         ],
//         page: { pageNum: 1, pageSize: 10, total: 11 },
//       },
//       msg: '请求成功',
//     },
//   }
// }

// export const getAllDeptList = () => {
//   return {
//     type: GET_ALL_DEPT_LIST,
//     data: {
//       data: {
//         code: 0,
//         data: [
//           {
//             title: '总裁办',
//             key: '17E4F6EB-D1B4-43E2-BEAF-02B4ABE32C04',
//           },
//           {
//             title: '财务中心',
//             key: 'C8DC050B-4A67-406F-9C17-F358BE7C1EA7',
//             children: [
//               { title: '财务部', key: 'C442271D-7BED-4756-B793-E026A0E35262' },
//             ],
//           },
//           {
//             title: '技术中心',
//             key: '424766EA-8CDC-471C-8098-331D810182BD',
//             children: [
//               {
//                 title: '前端开发部',
//                 key: 'B1AF7A68-90F9-488B-8BFD-B9D0BCB07B37',
//               },
//               { title: '开发部', key: '68754ADF-E35A-47F6-A1EA-4A5034DF46C9' },
//               {
//                 title: '移动开发部',
//                 key: 'A650D0F1-A986-462A-A2C0-1E14206E0770',
//               },
//               { title: '质量部', key: 'AE217B18-E288-4E33-9270-F6FA6B7341A6' },
//               { title: '运维部', key: '4591DAF4-254E-4684-9F4D-D1BB1AB662B2' },
//             ],
//           },
//           {
//             title: '最佳东方',
//             key: '83627F97-1E21-4970-9B0C-FD1110FB6AD9',
//             children: [
//               { title: 'RPO项目', key: '427DF6C3-09EA-403E-A822-0CC9BE25284F' },
//               { title: '办事处', key: 'AC8B6392-37ED-44AC-9174-3B09039EE8D1' },
//               {
//                 title: '最佳东方服务中心',
//                 key: '30C8484E-13E9-4169-9AA2-290DECA325E6',
//                 children: [
//                   {
//                     title: '商务部',
//                     key: '22EE4A41-EDB0-432D-A871-F399FEC0CF0',
//                   },
//                   {
//                     title: '服务部',
//                     key: 'A2DF18B2-CB46-46A3-845E-714AD7DF886C',
//                   },
//                   {
//                     title: '续签部',
//                     key: 'DCF34EF2-097F-4053-8870-06DDE3927004',
//                   },
//                 ],
//               },
//               {
//                 title: '最佳东方营销中心',
//                 key: '3C649A3B-59BB-46C4-94DD-4009B2404AE5',
//                 children: [
//                   {
//                     title: '招聘一部',
//                     key: 'C4BAD4A9-62EE-4C93-A312-188B6B6E7065',
//                   },
//                   {
//                     title: '招聘二部',
//                     key: '29679D49-6DCB-41D5-8762-22D245C7D870',
//                   },
//                   {
//                     title: '招聘三部',
//                     key: '29679D49-6DCB-41D5-8762-22D245C7D870',
//                   },
//                   {
//                     title: '招聘四部',
//                     key: '6E5C3807-72FF-4EB6-B2B6-A593A5035F13',
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//         msg: '请求成功',
//       },
//     },
//   }
// }

// export const getAllPersonList = () => {
//   return {
//     type: GET_ALL_PERSON_LIST,
//     data: {
//       data: {
//         code: 0,
//         data: [
//           {
//             userId: 599,
//             chineseName: '盛锐',
//             userPinyin: 'shengrui/sr',
//           },
//           {
//             userId: 595,
//             chineseName: '胡晋浩',
//             userPinyin: 'hujinhao/hjh',
//           },
//           {
//             userId: 554,
//             chineseName: '贺晨',
//             userPinyin: 'hechen/hc',
//           },
//           {
//             userId: 520,
//             chineseName: '张冬',
//             userPinyin: 'zhangdong/zd',
//           },
//           {
//             userId: 443,
//             chineseName: '赵文文',
//             userPinyin: 'zhaowenwen/zww',
//           },
//           {
//             userId: 422,
//             chineseName: '傅鹏鹏',
//             userPinyin: 'fupengpeng/fpp',
//           },
//           {
//             userId: 403,
//             chineseName: '吴永欢',
//             userPinyin: 'wuyonghuan/wyh',
//           },
//           {
//             userId: 102,
//             chineseName: '伍业军',
//             userPinyin: 'wuyejun/wyj',
//           },
//         ],
//         msg: '请求成功',
//       },
//     },
//   }
// }

export const getAllPowerList = singleApi({
  url: baseURL() + '/power/getPowerList',
  action: (args, json) => {
    return {
      args,
      type: GET_ALL_POWER_LIST,
      data: json,
    }
  },
})

export const getAllDeptList = singleApi({
  url: baseURL() + '/power/queryDeptList',
  action: (args, json) => {
    return {
      args,
      type: GET_ALL_DEPT_LIST,
      data: json,
    }
  },
})

export const getAllPersonList = singleApi({
  url: baseURL() + '/power/getAllUser',
  action: (args, json) => {
    return {
      args,
      type: GET_ALL_PERSON_LIST,
      data: json,
    }
  },
})

export const postSwitchStatus = singleApi({
  url: baseURL() + '/power/updatePower',
  action: (args, json) => {
    return {
      args,
      type: POST_SWITCH_STATUS,
      data: json,
    }
  },
})

export const postPower = singleApi({
  url: baseURL() + '/power/addOrUpdPowerCode',
  action: (args, json) => {
    return {
      args,
      type: POST_POWER,
      data: json,
    }
  },
})

export const postPowerWithAssign = singleApi({
  url: baseURL() + '/power/addUserDepar',
  action: (args, json) => {
    return {
      args,
      type: POST_POWER_ASSIGN,
      data: json,
    }
  },
})

export const postPowerRemove = singleApi({
  url: baseURL() + '/power/addOrUpdPowerCode',
  action: (args, json) => {
    return {
      args,
      type: POST_POWER_REMOVE,
      data: json,
    }
  },
})
