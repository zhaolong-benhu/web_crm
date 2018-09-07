import React, { Component } from 'react'
import queryString from 'query-string'
import style from './style.less'
import StepBar from '../../components/StepBar'
import PropTypes from 'prop-types'
import Layout from '../Wrap'
import moment, { isMoment } from 'moment'
import {connect} from 'react-redux'
import _ from 'lodash'
import DfwsSelect from 'dfws-antd-select'
import TableHeaderInternation from '../../components/TableHeaderInternation'
import {AutoForm,NoneForm,QuitForm,GetForm,TimeForm,HoldForm,InForm} from '../../components/ruleFormAdd'
import ContentWrap from '../Content'
import { Table, Button, message, Switch, Input, Select, Icon, Modal, Form } from 'antd'
import { createForm } from 'rc-form'
import { Link } from 'react-router-dom'
import F from '../../helper/tool'
import {
  queryAutoPoolRule,
  enableAutoPoolRule,
  queryOtherPoolRule,
  getFormList,
  querAutoPoolRuleHandNumber,
  addAutoPoolRule,
  queryOneAutoPoolRule,
  updateAutoPoolRule,
  deleteAutoPoolRule,
  insertOtherPoolRule,
  updateOtherPoolRule,
  queryOneOtherPoolRule,
  deleteOtherPoolRule,
  enableOtherPoolRule,
  selectExterpriseName,
} from '../../actions/internationRule'
import TextArea from 'antd/lib/input/TextArea';

const {Wrap} = Layout
const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@connect((state) => {
  return {
    search: state.search,
    internationRule: state.internationRule,
    queryBest: state.search.queryBest,
    businessList: state.businessList,
    autoRuleDetail: state.autoRuleDetail,
    otherRuleDetail: state.otherRuleDetail,
    maction: state.maction,
    ruleType: state.ruleType,
  }
})

class $InternationRule extends Component {
  static propTypes = {
    autoRuleDetail: PropTypes.object,
    otherRuleDetail: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.queryCondition = {} // 搜索条件
    this.poolID = [] // 修改的id
  }
  state = {
    ModalText: 'Content of the modal',
    visible0: false,
    visible1: false,
    visible2: false,
    visible3: false,
    visible4: false,
    visible5: false,
    visible6: false,
    confirmLoading: false,
    value: 2,
    checkNick: false,
    defaultCheckedSwitch: true,
    loding: false,
    formLayout: 'inline',
  }

  autoColumns = [{
    title: '客户类型',
    dataIndex: 'customerType',
    render: (text, record) => {
      if (record.customerType === 1) {
        return <span>个人客户</span>
      }
      if (record.customerType === 2) {
        return <span>企业客户</span>
      }
    },
  }, {
    title: 'SQL',
    dataIndex: 'sqlContent',
    render:(text,record) => {
      // return <div style={{width:"600px"}}>{record.sqlContent}</div>
      return <TextArea value={record.sqlContent} autosize={{ minRows: 5, maxRows: 10 }} disabled/>
    },
  }, {
    title: '备注',
    dataIndex: 'remarks',
  }, {
    title: '是否启用',
    dataIndex: 'isEnable',
    render: (text, record) => {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.isEnable === 1 ? true : false} defaultChecked={record.isEnable === 1 ? true : false} onChange={ ()=> this.onChangeEnable(record.id,record.isEnable,0)} />
    },
 }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      if (record.status !== 1) {
        return <span><a onClick={() => { this.removeRule(record.id,0) }}>删除</a> | <a onClick={() => { this.updateRule(record.id,2,0) }}>修改</a></span>
      }
    },
  }]

  noneColumns = [{
    title: '揽入后未跟进天数',
    dataIndex: 'getDay',
  }, {
    title: '跟进时间未跟进天数',
    dataIndex: 'followDay',
  }, {
    title: '回收公海时间',
    dataIndex: 'recoveryTime',
  }, {
    title: '提醒时间',
    dataIndex: 'remindTime',
  }, {
    title: '是否启用',
    dataIndex: 'isEnable',
    render: (text, record) => {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.isEnable === 1 ? true : false} defaultChecked={record.isEnable === 1 ? true : false} onChange={ ()=> this.onChangeEnable(record.id,record.isEnable,1)} />
    },
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      if (record.status !== 1) {
        return <span><a onClick={() => { this.removeRule(record.id,1) }}>删除</a> | <a onClick={() => { this.updateRule(record.id,2,1) }}>修改</a></span>
      }
    },
  }]

  quitColumns = [{
    title: '客户状态',
    dataIndex: 'customerStatus',
    render: (text, record) => {
      if (record.customerStatus === 0) {
        return <span>全部</span>
      }
      if (record.customerStatus === 1) {
        return <span>部分</span>
      }
    },
  }, {
    title: '离职天数',
    dataIndex: 'followDay',
  }, {
    title: '回收公海时间',
    dataIndex: 'recoveryTime',
  }, {
    title: '提醒管理员时间',
    dataIndex: 'remindTime',
  }, {
    title: '是否启用',
    dataIndex: 'isEnable',
    render: (text, record) => {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.isEnable === 1 ? true : false} defaultChecked={record.isEnable === 1 ? true : false} onChange={ ()=> this.onChangeEnable(record.id,record.isEnable,2)} />
    },
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      if (record.status !== 1) {
        return <span><a onClick={() => { this.removeRule(record.id,2) }}>删除</a> | <a onClick={() => { this.updateRule(record.id,2,2) }}>修改</a></span>
      }
    },
  }]

  getColumns = [{
    title: '不能连续“揽”同一个客户的天数',
    dataIndex: 'getDay',
  }, {
    title: '被踢出的客户再次被其他人揽入的天数设置',
    dataIndex: 'followDay',
  }, {
    title: '是否启用',
    dataIndex: 'isEnable',
    render: (text, record) => {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.isEnable === 1 ? true : false} defaultChecked={record.isEnable === 1 ? true : false} onChange={ ()=> this.onChangeEnable(record.id,record.isEnable,3)} />
    },
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      if (record.status !== 1) {
        return <span><a onClick={() => { this.removeRule(record.id,3) }}>删除</a> | <a onClick={() => { this.updateRule(record.id,2,3) }}>修改</a></span>
      }
    },
  }]

  timeColumns = [{
    title: '揽入客户时间设置',
    dataIndex: 'recoveryTime',
    render: (text, record) => {
      const recoveryTime = record.recoveryTime + '-'
      const remindTime = record.remindTime
      const startTime = record.startTime?record.startTime + '-':""
      const endTime = record.endTime
      const time = recoveryTime + remindTime
      const time2 = startTime + endTime

      return(
        <span>
          {time}  {time2}
        </span>
      )
    },
  }, {
    title: '开放周期',
    dataIndex: 'openCycle',
    render: (text, record) => {
      const openCycleText = (record.openCycle).split(",")
      let openCycleHtml = ''
      openCycleText.map((d,i) => {
        if (d === "1") {
          openCycleHtml = '周一,'
          return null;
        }
        if (d === "2") {
          openCycleHtml += '周二,'
          return null;
        }
        if (d === "3") {
          openCycleHtml += '周三,'
          return null;
        }
        if (d === "4") {
          openCycleHtml += '周四,'
          return null;
        }
        if (d === "5") {
          openCycleHtml += '周五,'
          return null;
        }
        if (d === "6") {
          openCycleHtml += '周六,'
          return null;
        }
        if (d === "7") {
          openCycleHtml += '周日,'
          return null;
        }
        return null
      })
      return(
        <div>
          {openCycleHtml}
        </div>
      )
    },
  }, {
    title: '是否启用',
    dataIndex: 'isEnable',
    render: (text, record) => {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.isEnable === 1 ? true : false} defaultChecked={record.isEnable === 1 ? true : false} onChange={ ()=> this.onChangeEnable(record.id,record.isEnable,4)} />
    },
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      if (record.status !== 1) {
        return <span><a onClick={() => { this.removeRule(record.id,4) }}>删除</a> | <a onClick={() => { this.updateRule(record.id,2,4) }}>修改</a></span>
      }
    },
  }]

  holdColumns = [{
    title: '拥有最大客户数量',
    dataIndex: 'getDay',
  }, {
    title: '是否启用',
    dataIndex: 'isEnable',
    render: (text, record) => {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.isEnable === 1 ? true : false} defaultChecked={record.isEnable === 1 ? true : false} onChange={ ()=> this.onChangeEnable(record.id,record.isEnable,5)} />
    },
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      if (record.status !== 1) {
        return <span><a onClick={() => { this.removeRule(record.id,5) }}>删除</a> | <a onClick={() => { this.updateRule(record.id,2,5) }}>修改</a></span>
      }
    },
  }]

  inColumns = [{
    title: '客户在库最大天数设置',
    dataIndex: 'getDay',
  }, {
    title: '是否启用',
    dataIndex: 'isEnable',
    render: (text, record) => {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.isEnable === 1 ? true : false} defaultChecked={record.isEnable === 1 ? true : false} onChange={ ()=> this.onChangeEnable(record.id,record.isEnable,6)} />
    },
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      if (record.status !== 1) {
        return <span><a onClick={() => { this.removeRule(record.id,6) }}>删除</a> | <a onClick={() => { this.updateRule(record.id,2,6) }}>修改</a></span>
      }
    },
  }]

  componentWillMount(){
      // this.props.dispatch(
      //     selectExterpriseName({})
      // ).then((data)=>{
      //     if(data && data.data){
      //         this.setState({
      //             exterpriseNameList:data.data,
      //         })
      //     }
      // })
  }
  renderHeaser = () => { // 表格头部
    return (
      <TableHeaderInternation />
    )
  }

  onChangeEnable = (id,isEnable,ruleType) => {
    Modal.confirm({
       title: '确定是否更改状态?',
       content: '',
       okText: '确认',
       cancelText: '取消',
       onOk: this.hideChangeModal,
       onCancel: this.cancelModal,
   })
   this.id = id
   this.isEnable = isEnable
   this.ruleType = ruleType
  }

  hideChangeModal = () => {
    if(this.isEnable === 0){
      this.isEnable = "1"
    }
    if(this.isEnable === 1){
      this.isEnable = "0"
    }
    this.setState({
      defaultCheckedSwitch: true,
      isEnable: this.isEnable,
    })
    const { page } = this.props.internationRule
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {poolId} = parsed
    const params={
      "id":this.id,
      "isEnable":this.isEnable,
    }
    if(this.ruleType === 0){
      this.props.dispatch(enableAutoPoolRule({...params})).then(data => {
        if (data) {
          message.success(data.msg)
          this.props.dispatch(queryAutoPoolRule({
            poolId: Number(poolId),
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          }))
        }
      })
    }
    if(this.ruleType === 1 || this.ruleType === 2 || this.ruleType === 3 || this.ruleType === 4 || this.ruleType === 5 || this.ruleType === 6){
      this.props.dispatch(enableOtherPoolRule({...params})).then(data => {
        if (data) {
          message.success(data.msg)
          this.props.dispatch(queryOtherPoolRule({
            poolId: Number(poolId),
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          }))
        }
      })
    }
  }

  cancelModal = () => {
    this.setState({
      loding: true,
      visible: false,
    })
  }

  handleQueryBest = (value) => { // 初级查询
    const { page } = this.props.internationRule
    const ss = F.filterUndefind(value)
    this.props.dispatch(queryAutoPoolRule({
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...ss,
    }))
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    this.props.dispatch(queryAutoPoolRule({
      pageNum,
      pageSize,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {poolId} = parsed
    this.props.dispatch(queryAutoPoolRule({
      poolId: Number(poolId),
      pageNum,
      pageSize,
    }))
  }

  componentDidMount() {
    const { page } = this.props.internationRule
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {poolId} = parsed
    this.props.dispatch(queryAutoPoolRule({
      poolId: Number(poolId),
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    this.props.dispatch(queryOtherPoolRule({
      poolId: Number(poolId),
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    // this.props.dispatch(querAutoPoolRuleHandNumber({
    //   poolId: Number(poolId),
    // }))
  }

  showModal = (ruleType) => {
    if (ruleType === 0) {
      this.setState({
        visible0: true,
        maction: 1,
        ruleType: ruleType,
      })
    }
    if (ruleType === 1) {
      this.setState({
        visible1: true,
        maction: 1,
        ruleType: ruleType,
      })
    }
    if (ruleType === 2) {
      this.setState({
        visible2: true,
        maction: 1,
        ruleType: ruleType,
      })
    }
    if (ruleType === 3) {
      this.setState({
        visible3: true,
        maction: 1,
        ruleType: ruleType,
      })
    }
    if (ruleType === 4) {
      this.setState({
        visible4: true,
        maction: 1,
        ruleType: ruleType,
      })
    }
    if (ruleType === 5) {
      this.setState({
        visible5: true,
        maction: 1,
        ruleType: ruleType,
      })
    }
    if (ruleType === 6) {
      this.setState({
        visible6: true,
        maction: 1,
        ruleType: ruleType,
      })
    }
  }

  checkForm = () => {
     this.props.form.validateFields(
       (err) => {
         if (!err) {
           console.info('success')
         }
       },
     )
   }

   updateRule = (id,action,ruleType) => {
     this.poolID.push(id)
     // this.setState({
     //   visible0: true,
     //   id: id,
     //   maction: 2,
     //   ruleType: ruleType,
     // })
     if (ruleType === 0) {
       this.setState({
         visible0: true,
         id: id,
         maction: 2,
         ruleType: ruleType,
       })
       this.props.dispatch(queryOneAutoPoolRule({
         id: id,
       })).then(data => {
         let autoRuleDetail = data.data || ''
         this.setState({
           autoRuleDetail: autoRuleDetail,
         })
         const customerType = this.state.autoRuleDetail.customerType
         this.props.dispatch(getFormList({menuId: customerType})).then(data => {
           const businessList = data.data
           this.setState({
             businessList:businessList,
           })
         })
       })
     }
     if (ruleType === 1 || ruleType === 2 || ruleType === 3 || ruleType === 4 || ruleType === 5 || ruleType === 6) {
       if (ruleType === 1) {
         this.setState({
           visible1: true,
           id: id,
           maction: 2,
           ruleType: ruleType,
         })
       }
       if (ruleType === 2) {
         this.setState({
           visible2: true,
           id: id,
           maction: 2,
           ruleType: ruleType,
         })
       }
       if (ruleType === 3) {
         this.setState({
           visible3: true,
           id: id,
           maction: 2,
           ruleType: ruleType,
         })
       }
       if (ruleType === 4) {
         this.setState({
           visible4: true,
           id: id,
           maction: 2,
           ruleType: ruleType,
         })
       }
       if (ruleType === 5) {
         this.setState({
           visible5: true,
           id: id,
           maction: 2,
           ruleType: ruleType,
         })
       }
       if (ruleType === 6) {
         this.setState({
           visible6: true,
           id: id,
           maction: 2,
           ruleType: ruleType,
         })
       }
       this.props.dispatch(queryOneOtherPoolRule({
         id: id,
       })).then(data => {
         const otherRuleDetail = data.data
         this.setState({
           otherRuleDetail: otherRuleDetail,
         })
       })
     }
   }

   removeRule = (id,ruleType) => {
     Modal.confirm({
        title: '确定删除这条规则吗?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: this.hideModal,
        okType: 'danger',
    })
    this.id = id
    this.ruleType = ruleType
   }

   hideModal = () => {
     const { page } = this.props.internationRule
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     const {poolId} = parsed
     const id = this.id
     const ruleType = this.ruleType
     if (ruleType === 0) {
       this.props.dispatch(deleteAutoPoolRule({
         id: id,
       })).then(data => {
         if(data.code !== 0) return message.error(data.msg)
         if(data.code === 0) {
           this.props.dispatch(queryAutoPoolRule({
             poolId: Number(poolId),
             pageNum: page.pageNum,
             pageSize: page.pageSize,
             total: page.total,
         })).then((data)=>{
            //  if(data.code == 0 && data.data.data.length == 0){//如果获取的当前页 数据为空 而上一页有数据 就获取上一页的数据
            //      var maxPage = parseInt(data.data.page.total/data.data.page.pageSize);
            //      if(data.data.page.total/data.data.page.pageSize > parseInt(data.data.page.total/data.data.page.pageSize)){
            //          maxPage = parseInt(data.data.page.total/data.data.page.pageSize)+1
            //      }
            //      this.props.dispatch(queryAutoPoolRule({
            //        poolId: Number(poolId),
            //        pageNum: maxPage,
            //        pageSize: page.pageSize,
            //        total: page.total,
            //    }))
            //  }
         })

           // this.props.dispatch(querAutoPoolRuleHandNumber({
           //      poolId: Number(poolId),
           // }))

           this.setState({
             visible: false,
           })
           return message.success(data.msg)
         }
       })
     }
     if (ruleType === 1 || ruleType === 2 || ruleType === 3 || ruleType === 4 || ruleType === 5 || ruleType === 6) {
       this.props.dispatch(deleteOtherPoolRule({
         id: id,
       })).then(data => {
         if(data.code !== 0) return message.error(data.msg)
         if(data.code === 0) {
           this.props.dispatch(queryOtherPoolRule({
             poolId: Number(poolId),
           }))
           this.setState({
             visible: false,
           })
           return message.success(data.msg)
         }
       })
     }
   }

   saveOk = (e, id) => {
    const { page } = this.props.internationRule
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {poolId} = parsed
    if (this.state.ruleType === 0) {
      if (this.state.maction === 1) {
        this.props.form.validateFields((err, values) => {
          if(err) return
          // if(!values.handNumber) {
          //   return message.warning('请输入序号')
          // }
          // if (values.CascaderValue) {
          //   const key = values.CascaderValue.key.join('')
          //   const label = values.CascaderValue.label
          //   values.fieldValues = key
          //   values.extendedField = label
          // } else if(values.fieldValues && values.fieldValues.key) {
          //   const key = values.fieldValues.key
          //   const label = values.fieldValues.label
          //   values.fieldValues = key
          //   values.extendedField = label
          // }
          // else if (isMoment(values.fieldValues)) {
          //   values.fieldValues = values.fieldValues.format("YYYY-MM-DD")
          // }
          const upData = F.filterUndefind(values)
          const outValues = {
            ...upData,
          }
          this.props.dispatch(addAutoPoolRule({ // 添加企业线索
            poolId: Number(poolId),
            ...F.filterUndefind(outValues),
          })).then(data => {
            if (data.code === 0) {
              message.success(data.msg)
              this.setState({
                visible0: false,
              })

              const parsed = queryString.parse(search)
              const {poolId} = parsed
              // this.props.dispatch(querAutoPoolRuleHandNumber({
              //      poolId: Number(poolId),
              // }))

              this.props.dispatch(queryAutoPoolRule({
                poolId: Number(poolId),
                pageNum: page.pageNum,
                pageSize: page.pageSize,
              }))
              this.props.form.resetFields()

            } else {
              message.success('新增出错！')
            }
          }).catch(err => {
            console.log(err)
          })
        })
      }
      if (this.state.maction === 2) {
        this.props.form.validateFields((err, values) => {
          if(err) return
          // if(!values.handNumber) {
          //   return message.warning('请输入序号')
          // }
          // if (values.CascaderValue) {
          //   const key = values.CascaderValue.key.join('')
          //   const label = values.CascaderValue.label
          //   values.fieldValues = key
          //   values.extendedField = label
          // } else if(values.fieldValues && values.fieldValues.key) {
          //   const key = values.fieldValues.key
          //   const label = values.fieldValues.label
          //   values.fieldValues = key
          //   values.extendedField = label
          // }
          // else if (isMoment(values.fieldValues)) {
          //   values.fieldValues = values.fieldValues.format("YYYY-MM-DD")
          // }
          const upData = F.filterUndefind(values)
          const outValues = {
            ...upData,
            id: this.state.id,
          }
          this.props.dispatch(updateAutoPoolRule({ // 添加企业线索
            poolId: Number(poolId),
            ...F.filterUndefind(outValues),
          })).then(data => {
            if (data.code === 0) {
              message.success(data.msg)
              this.setState({
                visible0: false,
              })
              this.props.dispatch(queryAutoPoolRule({
                poolId: Number(poolId),
                pageNum: page.pageNum,
                pageSize: page.pageSize,
              }))
              this.props.form.resetFields()
            } else {
              message.success('新增出错！')
            }
          }).catch(err => {
            console.log(err)
          })
        })
      }
    }
    if (this.state.ruleType === 1 || this.state.ruleType === 2 || this.state.ruleType === 3 || this.state.ruleType === 4 || this.state.ruleType === 5 || this.state.ruleType === 6) {
      if (this.state.maction === 1) {
        this.props.form.validateFields((err, values) => {
          // console.log(err);
          // if(err) return
          const upData = F.filterUndefind(values)
          const outValues = {
            ...upData,
            recoveryTime: moment(upData.recoveryTime || moment()).format('HH:mm'),
            remindTime: moment(upData.remindTime || moment()).format('HH:mm'),
            startTime: upData.startTime &&  upData.startTime != ""?moment(upData.startTime || moment()).format('HH:mm'):"",
            endTime: upData.endTime && upData.endTime !=""?moment(upData.endTime || moment()).format('HH:mm'):"",
          }
          this.props.dispatch(insertOtherPoolRule({ // 添加企业线索
            poolId: Number(poolId),
            ruleType: this.state.ruleType,
            ...F.filterUndefind(outValues),
          })).then(data => {
            if (data.code === 0) {
              message.success(data.msg)
              this.props.dispatch(queryOtherPoolRule({
                poolId: Number(poolId),
                pageNum: page.pageNum,
                pageSize: page.pageSize,
              }))
              this.props.form.resetFields()
              if (this.state.ruleType === 1) {
                this.setState({
                  visible1: false,
                })
              }
              if (this.state.ruleType === 2) {
                this.setState({
                  visible2: false,
                })
              }
              if (this.state.ruleType === 3) {
                this.setState({
                  visible3: false,
                })
              }
              if (this.state.ruleType === 4) {
                this.setState({
                  visible4: false,
                })
              }
              if (this.state.ruleType === 5) {
                this.setState({
                  visible5: false,
                })
              }
              if (this.state.ruleType === 6) {
                this.setState({
                  visible6: false,
                })
              }
            } else {
              message.success('新增出错！')
            }
          }).catch(err => {
            console.log(err)
          })
        })
      }
      if (this.state.maction === 2) {
        this.props.form.validateFields((err, values) => {
          const upData = F.filterUndefind(values)
          const outValues = {
            ...upData,
            recoveryTime: moment(upData.recoveryTime || moment()).format('HH:mm'),
            remindTime: moment(upData.remindTime || moment()).format('HH:mm'),
            startTime: upData.startTime &&  upData.startTime != ""?moment(upData.startTime || moment()).format('HH:mm'):"",
            endTime: upData.endTime && upData.endTime !=""?moment(upData.endTime || moment()).format('HH:mm'):"",
            id: this.state.id,
          }
          this.props.dispatch(updateOtherPoolRule({ // 添加企业线索
            poolId: Number(poolId),
            ruleType: this.state.ruleType,
            ...F.filterUndefind(outValues),
          })).then(data => {
            if (data.code === 0) {
              message.success(data.msg)
              this.props.dispatch(queryOtherPoolRule({
                poolId: Number(poolId),
                pageNum: page.pageNum,
                pageSize: page.pageSize,
              }))
              this.props.form.resetFields()
              if (this.state.ruleType === 1) {
                this.setState({
                  visible1: false,
                })
              }
              if (this.state.ruleType === 2) {
                this.setState({
                  visible2: false,
                })
              }
              if (this.state.ruleType === 3) {
                this.setState({
                  visible3: false,
                })
              }
              if (this.state.ruleType === 4) {
                this.setState({
                  visible4: false,
                })
              }
              if (this.state.ruleType === 5) {
                this.setState({
                  visible5: false,
                })
              }
              if (this.state.ruleType === 6) {
                this.setState({
                  visible6: false,
                })
              }
            } else {
              message.success('新增出错！')
            }
          }).catch(err => {
            console.log(err)
          })
        })
      }
    }
   }
   handleCancel = () => {
    this.setState({
      visible0: false,
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      visible6: false,
    })
    this.props.form.resetFields()
   }

   // showFormItem0 = () => { // 表单列表
   //   const search = this.props.location.search
   //   const parsed = queryString.parse(search)
   //   // const {action, customerCategory} = parsed
   //   if (this.state.maction === 1) {
   //     return (
   //       <AutoForm
   //         {...this.props}
   //         parsed={parsed}
   //         selectChange={this.selectChange}
   //         businessList={this.state.businessList}
   //         maction="1"
   //       />
   //     )
   //   }
   //   if (this.state.maction === 2) {
   //     return (
   //       <AutoForm
   //         {...this.props}
   //         parsed={parsed}
   //         selectChange={this.selectChange}
   //         businessList={this.state.businessList}
   //         autoRuleDetail={this.state.autoRuleDetail}
   //         maction="2"
   //       />
   //     )
   //   }
   //   if (this.state.ruleType === 1) {
   //     if (this.state.maction === 1) {
   //       return (
   //         <NoneForm
   //           {...this.props}
   //           parsed={parsed}
   //           maction="1"
   //         />
   //       )
   //     }
   //     if (this.state.maction === 2) {
   //       return (
   //         <NoneForm
   //           {...this.props}
   //           parsed={parsed}
   //           otherRuleDetail={this.state.otherRuleDetail}
   //           maction="2"
   //         />
   //       )
   //     }
   //   }
   //   if (this.state.ruleType === 2) {
   //     if (this.state.maction === 1) {
   //       return (
   //         <QuitForm
   //           {...this.props}
   //           parsed={parsed}
   //           maction="1"
   //         />
   //       )
   //     }
   //     if (this.state.maction === 2) {
   //       return (
   //         <QuitForm
   //           {...this.props}
   //           parsed={parsed}
   //           otherRuleDetail={this.state.otherRuleDetail}
   //           maction="2"
   //         />
   //       )
   //     }
   //   }
   //   if (this.state.ruleType === 3) {
   //     if (this.state.maction === 1) {
   //       return (
   //         <GetForm
   //           {...this.props}
   //           parsed={parsed}
   //           maction="1"
   //         />
   //       )
   //     }
   //     if (this.state.maction === 2) {
   //       return (
   //         <GetForm
   //           {...this.props}
   //           parsed={parsed}
   //           otherRuleDetail={this.state.otherRuleDetail}
   //           maction="2"
   //         />
   //       )
   //     }
   //   }
   //   if (this.state.ruleType === 4) {
   //     if (this.state.maction === 1) {
   //       return (
   //         <TimeForm
   //           {...this.props}
   //           parsed={parsed}
   //           maction="1"
   //         />
   //       )
   //     }
   //     if (this.state.maction === 2) {
   //       return (
   //         <TimeForm
   //           {...this.props}
   //           parsed={parsed}
   //           otherRuleDetail={this.state.otherRuleDetail}
   //           maction="2"
   //         />
   //       )
   //     }
   //   }
   //   if (this.state.ruleType === 5) {
   //     if (this.state.maction === 1) {
   //       return (
   //         <HoldForm
   //           {...this.props}
   //           parsed={parsed}
   //           maction="1"
   //         />
   //       )
   //     }
   //     if (this.state.maction === 2) {
   //       return (
   //         <HoldForm
   //           {...this.props}
   //           parsed={parsed}
   //           otherRuleDetail={this.state.otherRuleDetail}
   //           maction="2"
   //         />
   //       )
   //     }
   //   }
   //   if (this.state.ruleType === 6) {
   //     if (this.state.maction === 1) {
   //       return (
   //         <InForm
   //           {...this.props}
   //           parsed={parsed}
   //           maction="1"
   //         />
   //       )
   //     }
   //     if (this.state.maction === 2) {
   //       return (
   //         <InForm
   //           {...this.props}
   //           parsed={parsed}
   //           otherRuleDetail={this.state.otherRuleDetail}
   //           maction="2"
   //         />
   //       )
   //     }
   //   }
   // }

   showFormItem0 = () => { // 表单列表
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     // const {action, customerCategory} = parsed
     if (this.state.maction === 1) {
       return (
         <AutoForm
           {...this.props}
           parsed={parsed}
           visible={this.state.visible0}
           selectChange={this.selectChange}
           businessList={this.state.businessList}
           maction="1"
           // exterpriseNameList={this.state.exterpriseNameList}//上级单位列表
         />
       )
     }
     if (this.state.maction === 2) {
       return (
         <AutoForm
           {...this.props}
           parsed={parsed}
           visible={this.state.visible0}
           selectChange={this.selectChange}
           businessList={this.state.businessList}
           autoRuleDetail={this.state.autoRuleDetail}
           maction="2"
         />
       )
     }
   }

   showFormItem1 = () => { // 表单列表
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     // const {action, customerCategory} = parsed
     if (this.state.maction === 1) {
       return (
         <NoneForm
           {...this.props}
           parsed={parsed}
           maction="1"
         />
       )
     }
     if (this.state.maction === 2) {
       return (
         <NoneForm
           {...this.props}
           parsed={parsed}
           otherRuleDetail={this.state.otherRuleDetail}
           maction="2"
         />
       )
     }
   }

   showFormItem2 = () => { // 表单列表
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     // const {action, customerCategory} = parsed
     if (this.state.maction === 1) {
       return (
         <QuitForm
           {...this.props}
           parsed={parsed}
           maction="1"
         />
       )
     }
     if (this.state.maction === 2) {
       return (
         <QuitForm
           {...this.props}
           parsed={parsed}
           otherRuleDetail={this.state.otherRuleDetail}
           maction="2"
         />
       )
     }
   }

   showFormItem3 = () => { // 表单列表
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     // const {action, customerCategory} = parsed
     if (this.state.maction === 1) {
       return (
         <GetForm
           {...this.props}
           parsed={parsed}
           maction="1"
         />
       )
     }
     if (this.state.maction === 2) {
       return (
         <GetForm
           {...this.props}
           parsed={parsed}
           otherRuleDetail={this.state.otherRuleDetail}
           maction="2"
         />
       )
     }
   }

   showFormItem4 = () => { // 表单列表
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     // const {action, customerCategory} = parsed
     if (this.state.maction === 1) {
       return (
         <TimeForm
           {...this.props}
           parsed={parsed}
           maction="1"
         />
       )
     }
     if (this.state.maction === 2) {
       return (
         <TimeForm
           {...this.props}
           parsed={parsed}
           otherRuleDetail={this.state.otherRuleDetail}
           maction="2"
         />
       )
     }
   }

   showFormItem5 = () => { // 表单列表
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     // const {action, customerCategory} = parsed
     if (this.state.maction === 1) {
       return (
         <HoldForm
           {...this.props}
           parsed={parsed}
           maction="1"
         />
       )
     }
     if (this.state.maction === 2) {
       return (
         <HoldForm
           {...this.props}
           parsed={parsed}
           otherRuleDetail={this.state.otherRuleDetail}
           maction="2"
         />
       )
     }
   }

   showFormItem6 = () => { // 表单列表
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     // const {action, customerCategory} = parsed
     if (this.state.maction === 1) {
       return (
         <InForm
           {...this.props}
           parsed={parsed}
           maction="1"
         />
       )
     }
     if (this.state.maction === 2) {
       return (
         <InForm
           {...this.props}
           parsed={parsed}
           otherRuleDetail={this.state.otherRuleDetail}
           maction="2"
         />
       )
     }
   }

   selectChange = (value) => {
     this.props.dispatch(getFormList({menuId: value})).then(data => {
       const businessList = data.data
       this.setState({
         businessList:businessList,
       })
     })
   }

   autoSearch = () => {
     const { page } = this.props.internationRule
     const search = this.props.location.search
     const parsed = queryString.parse(search)
     const {poolId} = parsed
     this.props.form.validateFields((err, values) => {
       if(err) return
       const upData = F.filterUndefind(values)
       const outValues = {
         poolId: Number(poolId),
         ...upData,
       }
       this.props.dispatch(queryAutoPoolRule({
         pageNum: page.pageNum,
         pageSize: page.pageSize,
         ...outValues,
       }))
       this.outValues = outValues
     })
   }

  render() {
    // const { getFieldProps } = this.props.form // getFieldError
    const { visible0, visible1, visible2, visible3, visible4, visible5, visible6, confirmLoading } = this.state
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName} = parsed //id, action, customerCategory, status,
    const { list, listNone, listQuit, listGet, listTime, listHold, listIn, page, loading } = this.props.internationRule // count
    const { formLayout } = this.state
    const { getFieldDecorator } = this.props.form
    let pagination = {
      onChange: this.pageChange,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }
    return (
      <Layout className={style.LogsWrap}>
        <Wrap>
          <ContentWrap>
            {/* {topName === '我的线索' && <StepBar />} */}
            <div className={style.listTitle}>
              <div>
                <Icon type="plus-circle-o" /> 添加公海规则
              </div>
              <div>
                <Button><Link to={"/CRM/internationSystem"}>返回</Link></Button>
              </div>
            </div>
            <div className={style.listPane}>
              {/* <div className={style.listTop}>
                <Form layout={formLayout}>
                  <FormItem {...formItemLayout} label="输入搜索">
                    {getFieldDecorator('label', {
                      initialValue: '',
                    })(
                      <Input style={{ width: 220 }} placeholder="请输入业务字段" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="客户类型">
                    {getFieldDecorator('customerType', {
                      initialValue: '',
                    })(
                      <Select style={{ width: 220 }} placeholder="请选择客户类型">
                        <Option value="">请选择</Option>
                        <Option value="1">个人客户</Option>
                        <Option value="2">企业客户</Option>
                      </Select>
                    )}
                  </FormItem>
                  &emsp;<Icon type="search" className={style.search} onClick={this.autoSearch} style={{fontSize: '18px',lineHeight: '32px'}}/>
                </Form>
              </div> */}
              <p>* 自动划入客户规则<Button style={{ float:'right' }}  onClick={() => { this.showModal(0) }}>新增规则</Button></p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.autoColumns}
                  dataSource={list}
                  pagination={pagination}
                />
                <Modal title="新增自动划入客户规则"
                  visible={visible0}
                  onOk={this.saveOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                  businessList={this.state.businessList}
                >
                  {this.showFormItem0()}
                </Modal>
              </div>
            </div>
            <div className={style.listPane}>
              <p>* 未跟进客户回收规则<Button style={{ float:'right' }} onClick={() => { this.showModal(1) }}>新增规则</Button></p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.noneColumns}
                  dataSource={listNone}
                  pagination={false}
                />
                <Modal title="新增未跟进客户回收规则"
                  visible={visible1}
                  onOk={this.saveOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                  businessList={this.state.businessList}
                >
                  {this.showFormItem1()}
                </Modal>
              </div>
            </div>
            <div className={style.listPane}>
              <p>* 离职员工客户回收规则<Button style={{ float:'right' }} onClick={() => { this.showModal(2) }}>新增规则</Button></p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.quitColumns}
                  dataSource={listQuit}
                  pagination={false}
                />
                <Modal title="新增离职员工客户回收规则"
                  visible={visible2}
                  onOk={this.saveOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                  businessList={this.state.businessList}
                >
                  {this.showFormItem2()}
                </Modal>
              </div>
            </div>
            <div className={style.listPane}>
              <p>* 揽入客户规则<Button style={{ float:'right' }} onClick={() => { this.showModal(3) }}>新增规则</Button></p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.getColumns}
                  dataSource={listGet}
                  pagination={false}
                />
                <Modal title="新增揽入客户规则"
                  visible={visible3}
                  onOk={this.saveOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                  businessList={this.state.businessList}
                >
                  {this.showFormItem3()}
                </Modal>
              </div>
            </div>
            <div className={style.listPane}>
              <p>* 揽入客户时间规则<Button style={{ float:'right' }} onClick={() => { this.showModal(4) }}>新增规则</Button></p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.timeColumns}
                  dataSource={listTime}
                  pagination={false}
                />
                <Modal title="新增揽入客户时间规则"
                  visible={visible4}
                  onOk={this.saveOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                  businessList={this.state.businessList}
                >
                  {this.showFormItem4()}
                </Modal>
              </div>
            </div>
            <div className={style.listPane}>
              <p>* 客户持有数规则<Button style={{ float:'right' }} onClick={() => { this.showModal(5) }}>新增规则</Button></p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.holdColumns}
                  dataSource={listHold}
                  pagination={false}
                />
                <Modal title="新增客户持有数规则"
                  visible={visible5}
                  onOk={this.saveOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                  businessList={this.state.businessList}
                >
                  {this.showFormItem5()}
                </Modal>
              </div>
            </div>
            <div className={style.listPane}>
              <p>* 客户在库时间规则<Button style={{ float:'right' }} onClick={() => { this.showModal(6) }}>新增规则</Button></p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.inColumns}
                  dataSource={listIn}
                  pagination={false}
                />
                <Modal title="新增客户在库时间规则"
                  visible={visible6}
                  onOk={this.saveOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                  businessList={this.state.businessList}
                >
                  {this.showFormItem6()}
                </Modal>
              </div>
            </div>
          </ContentWrap>
        </Wrap>
      </Layout>
    )
  }
}

const InternationRule = Form.create()($InternationRule)
export default InternationRule
