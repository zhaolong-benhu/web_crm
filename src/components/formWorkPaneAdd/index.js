/**
 * Created by ll on 08/03/2018.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import style from '../../containers/Detail/style.less'
import 'moment/locale/zh-cn'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { message, Modal } from 'antd'
import {getUrlParam} from '../../util'
import { ListContactWorkAddForm } from '../formContactWorkAdd/indexNew'
import { addNewJob, addCrmJob, deleteCrmJob,inventedDeleteCrmJob,selectAllContacts } from '../../actions/clientSystem'
moment.locale('zh-cn')

@connect(state => {
  return {}
})
class ListWorkPaneAdd extends Component {
  // 企业表单提交
  static propTypes = {
    parsed: PropTypes.object,
    editContactBase: PropTypes.func,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }

  constructor(props) {
    super(props)
    this.values = {}
    this.phoneId = []
    this.first = true
  }
  addWorkInfoData = () => {
      if(this.first){
          this.contractId = this.props.clientSystem.customerId;
          this.first = false
      }
      this.props.dispatch(addNewJob())
  }
  //中国标准时间转换
  dateFormat = (time, format) => {
    var t = new Date(time)
    var tf = function(i) {
      return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear())
          break
        case 'MM':
          return tf(t.getMonth() + 1)
          break
        case 'mm':
          return tf(t.getMinutes())
          break
        case 'dd':
          return tf(t.getDate())
          break
        case 'HH':
          return tf(t.getHours())
          break
        case 'ss':
          return tf(t.getSeconds())
          break
      }
    })
  }
  //隐藏确认框
  hideConfirmModal = () => {
    this.props.dispatch(addCrmJob({ ...this.values })).then(data => {
      if (data && data.code === 0) {
        message.success(data.msg)
      } else {
      }
    })
  }
  //添加工作信息
  addCrmJob = (type, values,index) => {
    if (type === "1") {
      //新增
      const dateFormat = 'yyyy-MM-dd'
      var workingHours = values.workingHours && values.workingHours[0]
        ? this.dateFormat(values.workingHours[0], dateFormat)
        : ''
      var departureTime = values.workingHours && values.workingHours[1]
        ? this.dateFormat(values.workingHours[1], dateFormat)
        : ''

      values.workingHours = workingHours
      values.departureTime = departureTime
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      values.id = this.phoneId[index] || ''
      values.contactsId = this.props.clientSystem.customerId || this.contractId || ''
      this.props.dispatch(addCrmJob({ ...values })).then(data => {
        if (data && data.code === 0) {
          this.props.clientSystem.phoneId = data.data
          this.phoneId[index] = data.data
          message.success(data.msg)
        } else {
        }
      })
    } else {
      //修改
      // values.id = this.props.clientSystem.phoneId || ''
      this.props.clientSystem && this.props.clientSystem.crmJobsList.forEach((v,i)=>{
          if(i === index){
              values.id  = v.id || ''
          }
      })
      values.contactsId = getUrlParam('customerId')
      const dateFormat = 'yyyy-MM-dd'
      var workingHours = values.workingHours && values.workingHours[0]
        ? this.dateFormat(values.workingHours[0], dateFormat)
        : ''
      var departureTime = values.workingHours && values.workingHours[1]
        ? this.dateFormat(values.workingHours[1], dateFormat)
        : ''

      values.workingHours = workingHours
      values.departureTime = departureTime
      this.values = values
      Modal.confirm({
        title: '是否保存并同步联系人工作信息?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: this.hideConfirmModal,
        okType: 'danger',
      })
    }
  }

  //删除一条
  removeItem = (id, index) => {
    if (id) {
      this.props.dispatch(
        deleteCrmJob({id:id})
        ).then(data => {
        if (data && data.code === 0) {
          message.success(data.msg)
          const search = this.props.location.search
          const parsed = queryString.parse(search)
            this.props.dispatch(selectAllContacts({
                contactsId:parsed.id,
                pageNum:1,
                pageSize:10,
            })
        )
        } else {
        }
      })
    } else {
      this.props.clientSystem.crmJobsList.splice(index,1)
      this.props.dispatch(
        inventedDeleteCrmJob({defaut:1})
     )
    }
  }

  render() {
    let { crmJobsList } = this.props.clientSystem
    let len = crmJobsList.length - 1
    if(crmJobsList){
        if(crmJobsList.length>0){
            this.props.clientSystem.customerId = crmJobsList[0].contactsId
        }
    }
    return (
      <div>
        <h2 className={style.h2Font}>
          工作信息
          <a
            className={style.infoSave}
            style={{ float: 'right', marginRight: 10 }}
            onClick={() => {
            this.addWorkInfoData()
            }}
          >
            新增工作信息
          </a>
        </h2>
        <div>
          {crmJobsList &&
            crmJobsList.map((item, index) => {
              return (
                <ListContactWorkAddForm
                  key={index}
                  Panelopen={index === len ? true : false}
                  dataSource={item}
                  editContactBase={this.editContactBase}
                  addCrmJob={(action,value,index)=>this.addCrmJob(action,value,index)}
                  removeItem={this.removeItem}
                  index={index}
                  length={crmJobsList.length}
                />
              )
            })}
        </div>
      </div>
    )
  }
}

export { ListWorkPaneAdd }
