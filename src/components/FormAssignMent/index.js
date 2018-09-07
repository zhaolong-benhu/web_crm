/**
 * Created by ll on 08/03/2018.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Form, Modal, Select, Input, Mention, Button } from 'antd'
import moment from 'moment'
import {getUrlParam} from '../../util'
// import style from '../../containers/Detail/style.less'
import style from '../TableBtns/style.less'
import { filterOption } from '../../util'
import store from 'store'
import 'moment/locale/zh-cn'
import {connect} from 'react-redux'
moment.locale('zh-cn')
const FormItem = Form.Item
const Option = Select.Option
const { toString } = Mention
const { TextArea } = Input;

class FormAssignMent extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
  }

  state = {
    value: 2,
  }

  callBack = () => {
    //const {key} = this.props.location.state
    this.props.form.validateFields((err, values) => {
      let myclientList = []
      let [myClientId,poolId,topicId,name] = [[],[],[],[]]
      if (this.props.ids) {
        myClientId = this.props.ids
        poolId = this.props.poolIds
        topicId = this.props.topicIds
        name = this.props.names
      } else {
        myClientId = this.props.clueDetail.id
      }
      myClientId.map((d, i) => {
        let obj = {
          customerId: d,
          poolId: poolId[i],
          topicId:topicId[i],
          name: name[i],
          userId: values.userId,
        }
        myclientList.push(obj)
      })

      if(!this.props.disabled) {
        this.props.ok(myclientList)
      } else {
        this.props.cancle()
      }
    })
  }
  componentWillMount() {
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.id) {
      this.userId = crm.user.id
    }
}
  render() {
    let textValue = ''
    if (this.props.names) {
      textValue = (this.props.names || []).join(' , ')
    }
    // if(this.props.numbers){
    //   textValue = (this.props.numbers || []).join(' , ')
    // }else{
    //   if (this.props.clueDetail) {
    //     const search = this.props.location.search
    //     const parsed = queryString.parse(search)
    //     const {customerCategory} = parsed
    //     if (customerCategory === '1') {
    //         textValue = this.props.clueDetail.customerName
    //     }
    //     if (customerCategory === '2') {
    //         textValue = this.props.clueDetail.enterpriseName
    //     }
    //   }
    // }
    const {nameList} = this.props.clientSystem
    let nameData = []
    if(nameList){
      nameData = nameList
    }
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 18 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 14 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    }
    return (
      <Modal
        title={this.props.title || '分配至个人'}
        style={{ top: 160 }}
        visible={this.props.visible}
        onCancel={this.props.cancle}
        onOk={this.callBack}
        className={style.Modal}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="客户名称"
          >
            {getFieldDecorator('number', {
              rules: [{required: false, message: '请选择人员!'}],
            })(
              <span>{textValue}</span>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="分配至个人"
            hasFeedback
          >
            {getFieldDecorator('userId', {
              rules: [{required: true, message: '请选择人员!'}],
            })(
              <Select
                showSearch
                placeholder="请选择人员"
                optionFilterProp="children"
                dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                onChange={this.handleChange}
                filterOption={(input, option)=>filterOption(input, option)}
              >
                {
                  nameData.map((d, i) => {
                      if(d.userId != this.userId){
                         return <Option key={d.userId} userPinyin={d.userPinyin} value={String(d.userId)}>{d.chineseName}</Option>
                      }
                  })
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

class FormAssignMentList extends Component { // 分配
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
  }

  state = {
    value: 2,
    chineseName:"",
  }

  handleChange = (value) => {
    const userId = value
    this.userId = userId

    this.props.clientSystem.nameList && this.props.clientSystem.nameList.map((v,i)=>{
      if(v.userId == value){
        this.setState({
          vestingPerson:v.chineseName,
        })
      }
    })
  }

  callBack = () => {

    let myclientList = []
    let [myClientId,poolId,topicId,name] = [[],[],[],[]]

    myClientId.push(this.props.clueDetail.customerId)
    poolId.push(this.props.clueDetail.poolId)
    topicId.push(this.props.clueDetail.topicId)
    name.push(this.props.clueDetail.customerName||this.props.clueDetail.enterpriseName)
    myClientId.map((d, i) => {
      let obj = {
        customerId: d,
        poolId: poolId[i],
        topicId:topicId[i],
        name: name[i],
        userId: this.userId,
      }
      myclientList.push(obj)
    })

    // const value = {
    //   customerId: parsed.id,
    //   poolId: parsed.poolId,
    //   topicId: parsed.topicId,
    //   userId: this.userId,
    //   id:parsed.clientId,
    // }
    if(!this.props.disabled) {
      this.props.ok(myclientList)
      this.setState({
        vestingPerson:"",
      })
    } else {
      this.props.cancle()
    }
  }
  componentWillMount() {
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.id) {
      this.userId = crm.user.id
    }
}
  render() {
    let textValue = ''
    if(this.props.numbers){
      textValue = (this.props.numbers || []).join(' , ')
    }else{
      if (this.props.clueDetail) {
        const search = this.props.location.search
        const parsed = queryString.parse(search)
        const {customerCategory} = parsed
        if (customerCategory === '1') {
            textValue = this.props.clueDetail.customerName
        }
        if (customerCategory === '2') {
            textValue = this.props.clueDetail.enterpriseName
        }
      }
    }
    const {nameList} = this.props.clientSystem
    let nameData = []
    if(nameList){
      nameData = nameList
    }
    return (
      <Modal
        title={this.props.title}
        style={{ top: 160 }}
        visible={this.props.visible}
        onCancel={this.props.cancle}
        onOk={this.callBack}
        className={style.Modal}
      >
        <div className={style.number}>
          <span className={style.auditSpan}>客户名称：</span>
          <span>{textValue}</span>
        </div>
        <div>
          <span className={style.auditSpan}>归属人：</span>
          <Select
            style={{width: 220}}
            onChange={this.handleChange}
            showSearch
            placeholder="分配至个人"
            optionFilterProp="children"
            value={this.state.vestingPerson}
            filterOption={(input, option)=>filterOption(input, option)}
          >
            {
              nameData.map((d, i) => {
                   if(d.userId != this.userId){
                       return <Option key={d.userId} value={String(d.userId)} userPinyin={d.userPinyin}>{d.chineseName}</Option>
                   }
              })
            }
          </Select>
        </div>
      </Modal>
    )
  }
}

class FormRequestHelpList extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
  }

  state = {
    value: 2,
    RequestUser:"请选择",
  }

  handleChange = (value) => {
    const userId = value
    this.userId = userId

    this.props.clientSystem.nameList && this.props.clientSystem.nameList.map((v,i)=>{
      if(v.userId == value){
        this.setState({
          RequestUser:v.chineseName,
        })
      }
    })
  }

  callBack = () => {
    // this.props.form.validateFields((err, values) => {
    let myClientId = []
    if (this.props.ids) {
      myClientId = this.props.ids
    } else {
      myClientId = this.props.clueDetail.customerId
    }
    const value = {
      poolId:  this.props.clueDetail.poolId,
      customerId: myClientId,
      assistPeople: this.userId,
      remarks: this.remarks,
    }

    if(!this.props.disabled) {
      this.props.ok(value)
        setTimeout(()=>{
          this.setState({
            remarks:"",
            RequestUser:"",
          })
      },2000)
    } else {
      this.props.cancle()
    }

    // })



  }
  onInputchange = (e)=> {
    this.setState({
      remarks:e.target.value,
    })
    this.remarks = e.target.value
}
componentWillMount() {
  const crm = store.get('crm')
  if (crm && crm.user && crm.user.id) {
    this.userId = crm.user.id
  }
}
  render() {
    let textValue = ''
    if(this.props.numbers){
      textValue = (this.props.numbers || []).join(' , ')
    }else{
      if (this.props.clueDetail) {
        const search = this.props.location.search
        const parsed = queryString.parse(search)
        const {customerCategory} = parsed
        if (customerCategory === '1') {
            textValue = this.props.clueDetail.customerName
        }
        if (customerCategory === '2') {
            textValue = this.props.clueDetail.enterpriseName
        }
      }
    }
    const {nameList} = this.props.clientSystem
    let nameData = []
    if(nameList){
      nameData = nameList
    }
    return (
      <Modal
        title={this.props.title}
        style={{ top: 160 }}
        visible={this.props.visible}
        onCancel={this.props.cancle}
        onOk={this.callBack}
        className={style.Modal}
      >
        <div className={style.number}>
          <span className={style.auditSpan}>客户名称：</span>
          <span>{textValue}</span>
        </div>
        <div>
          <span className={style.auditSpan}>协助人：</span>
          <Select
            style={{width: 220}}
            onChange={this.handleChange}
            showSearch
            placeholder="请选择协助人"
            optionFilterProp="children"
            value={this.state.RequestUser}
            filterOption={(input, option)=>filterOption(input, option)}
          >
            {
              nameData.map((d, i) => {
                  if(d.userId != this.userId){
                      return <Option key={i} userPinyin={d.userPinyin} value={String(d.userId)}>{d.chineseName}</Option>
                  }
              })
            }
          </Select>
        </div>
        <div className={style.reason}>
          <span className={style.auditSpan}>协助理由：</span>
          <TextArea
            disabled={this.props.disabled}
            onChange={(e)=>this.onInputchange(e)}
            value={this.state.remarks}
            autosize={{ minRows: 3, maxRows: 6 }}
          />
        </div>
      </Modal>
    )
  }
}

class FormDeleteHelpList extends Component { // 放弃协助
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
  }

  state = {
    value: 2,
  }

  handleChange = (value) => {
    const userId = value
    this.userId = userId
  }

  mentionRemarks = editorState => {
    this.remarks = toString(editorState)
  }

  callBack = () => {
    // this.props.form.validateFields((err, values) => {
    let myClientId = []
    if (this.props.ids) {
      myClientId = this.props.ids
    } else {
      myClientId = this.props.clueDetail.customerId
    }
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {helpId} = parsed
    const value = {
      customerId: myClientId,
      id:helpId,
    }
    if(!this.props.disabled) {
      this.props.ok(value)
    } else {
      this.props.cancle()
      }
    // })
  }

  render() {
    let textValue = ''
    let requestUserName=''
    if(this.props.numbers){
      textValue = (this.props.numbers || []).join(' , ')
    }else{
      if (this.props.clueDetail) {
        const search = this.props.location.search
        const parsed = queryString.parse(search)
        const {customerCategory, requestName} = parsed
        requestUserName = requestName || '未找到申请人'
        if (customerCategory === '1') {
            textValue = this.props.clueDetail.customerName
        }
        if (customerCategory === '2') {
            textValue = this.props.clueDetail.enterpriseName
        }
      }
    }
    const {nameList} = this.props.clientSystem
    let nameData = []
    if(nameList){
      nameData = nameList
    }
    return (
      <Modal
        title={this.props.title}
        style={{ top: 160 }}
        visible={this.props.visible}
        onCancel={this.props.cancle}
        onOk={this.callBack}
        className={style.Modal}
      >
        <div className={style.number}>
          <span className={style.auditSpan}>客户名称：</span>
          <span>{textValue}</span>
        </div>
        <div className={style.number}>
        <span className={style.auditSpan}>申请人：</span>
          <span>{requestUserName}</span>
        </div>
      </Modal>
    )
  }
}

class FormViewAuditList extends Component { // 查看审核状态
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
  }

  state = {
    value: 2,
  }

  handleChange = (value) => {
    const userId = value
    this.userId = userId
  }

  mentionRemarks = editorState => {
    this.remarks = toString(editorState)
  }

  callBack = () => {
    // this.props.form.validateFields((err, values) => {
    let myClientId = []
    if (this.props.ids) {
      myClientId = this.props.ids
    } else {
      myClientId = this.props.clueDetail.customerId
    }
    const value = {
      customerId: myClientId,
      assistPeople: this.userId,
      remarks: this.remarks,
    }
    if(!this.props.disabled) {
      this.props.ok(value)
    } else {
      this.props.cancle()
      }
    // })
  }

  render() {
    const {customerName, createUser, days, remark, checkRelult} = this.props.delaySystem.feadBack
    let textValue = ''
    if(this.props.numbers){
      textValue = (this.props.numbers || []).join(' , ')
    }else{
      if (this.props.clueDetail) {
        const search = this.props.location.search
        const parsed = queryString.parse(search)
        const {customerCategory} = parsed
        if (customerCategory === '1') {
            textValue = this.props.clueDetail.customerName
        }
        if (customerCategory === '2') {
            textValue = this.props.clueDetail.enterpriseName
        }
      }
    }
    const {nameList} = this.props.clientSystem
    let nameData = []
    if(nameList){
      nameData = nameList
    }
    return (
      <Modal
        title={this.props.title}
        style={{ top: 160 }}
        visible={this.props.visible}
        onCancel={this.props.cancle}
        onOk={this.props.cancle}
        className={style.Modal}
        footer={<div><Button onClick={this.props.cancle}>关闭</Button></div>}

      >
        <div className={style.number}>
          <span className={style.auditSpan}>申请人：</span>
          <span>{createUser}</span>
        </div>
        <div className={style.number}>
          <span className={style.auditSpan}>相关客户：</span>
          <span>{customerName}</span>
        </div>
        <div className={style.number}>
          <span className={style.auditSpan}>延期天数：</span>
          <span>{days}</span>
        </div>
        <div className={style.number} style={{justifyContent:'initial'}}>
          <span className={style.auditSpan}>审核结果：</span>
          <span>{checkRelult}</span>
        </div>
        <div className={style.reason}>
          <span className={style.auditSpan}>反馈详情：</span>
          <Input.TextArea
            disabled
            rows={5}
            value={remark||this.props.delaySystem.feadBack.reason}
          />
        </div>
      </Modal>
    )
  }
}

class FormApplyDelayList extends Component { // 申请延期
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
  }

  state = {
    value: 2,
    days:'',
    reason:"",
  }

  handleChange = (value) => {
    const userId = value
    this.userId = userId
  }

  mentionRemarks = editorState => {
    this.remarks = toString(editorState)
  }

  onChangeIptValue = (e) => {
    this.days = e.target.value
  }
  onInputchange = (e,type)=> {
    if(type === "days"){
      this.setState({
        days:e.target.value,
      })
      this.days = e.target.value
    }else{
      this.setState({
        reason:e.target.value,
      })
      this.reason = e.target.value
    }

}
  callBack = () => {
    // this.props.form.validateFields((err, values) => {
    let myClientId = []
    if (this.props.ids) {
      myClientId = this.props.ids
    } else {
      myClientId = this.props.clueDetail.customerId
    }
    const value = {
      customerId: myClientId,
      poolId:  this.props.clueDetail.poolId||getUrlParam('poolId'),
      topicId:  this.props.clueDetail.topicId||getUrlParam('topicId'),
      days: this.days,
      reason: this.reason,
    }
    if(!this.props.disabled) {
      this.props.ok(value)
      setTimeout(()=>{
        this.setState({
          days:"",
          reason:"",
        })
    },2000)
    } else {
      this.props.cancle()
      }
    // })
  }

  render() {
    let textValue = ''
    if(this.props.numbers){
      textValue = (this.props.numbers || []).join(' , ')
    }else{
      if (this.props.clueDetail) {
        const search = this.props.location.search
        const parsed = queryString.parse(search)
        const {customerCategory} = parsed
        if (customerCategory === '1') {
            textValue = this.props.clueDetail.customerName
        }
        if (customerCategory === '2') {
            textValue = this.props.clueDetail.enterpriseName
        }
      }
    }
    const {nameList} = this.props.clientSystem
    let nameData = []
    if(nameList){
      nameData = nameList
    }
    return (
      <Modal
        title={this.props.title}
        style={{ top: 160 }}
        visible={this.props.visible}
        onCancel={this.props.cancle}
        onOk={this.callBack}
        className={style.Modal}
      >
        <div className={style.number}>
          <span className={style.auditSpan}>客户名称：</span>
          <span>{textValue}</span>
        </div>
        <div>
          <span className={style.auditSpan}>延期天数：</span>
          <Input
            style={{width: 220}}
            disabled={this.props.disabled}
            onChange={(e)=>this.onInputchange(e,'days')}
            placeholder="请输入延期天数"
            type="number"
            value={this.state.days}
            />
        </div>
        <div className={style.reason}>
          <span className={style.auditSpan}>延期理由：</span>
          <TextArea
          disabled={this.props.disabled}
          onChange={(e)=>this.onInputchange(e,'reason')}
          value={this.state.reason}
          autosize={{ minRows: 3, maxRows: 6 }}
        />
        </div>
      </Modal>
    )
  }
}
// const ListFormAssignMent = Form.create()(FormAssignMent)
export {
  FormAssignMent,
  FormAssignMentList,
  FormRequestHelpList,
  FormApplyDelayList,
  FormViewAuditList,
  FormDeleteHelpList,
}
