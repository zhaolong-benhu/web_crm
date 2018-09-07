/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Select, Checkbox, TimePicker, message,Icon } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import {connect} from 'react-redux'
import DfwsSelect from 'dfws-antd-select'
import style from './style.less'
import _ from 'lodash'
import { selectFiledValueToDictionary,selectExterpriseName } from '../../actions/internationRule'
import Field from '../Field'
import { createForm } from 'rc-form/lib';
moment.locale('zh-cn')
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input;
const format = 'HH:mm'
const Search = Input.Search;

// @connect((state) => {
//   return {
//     dictionarySelectList:state.internationRule.dictionarySelectList,
//   }
// })

const children = [];

@createForm()
class AutoForm extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    autoRuleDetail: PropTypes.object,
    parsed: PropTypes.object,
    selectChange: PropTypes.func,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    isDisabled: false,
    feldValueType:0,
    bShowexterpriseNameList:false,
    Item:null,
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    }
    this.setState({ autoCompleteResult })
  }

  handleSelectChange = (value) => {
  }
  search = (value) => {
      this.props.dispatch(
          selectExterpriseName({
              str:value,
          })
      ).then((data)=>{
          if(data && data.data){
            this.setState({
                exterpriseNameList:data.data,
                bShowexterpriseNameList:true,
            })
          }
      })
  }
  handleChange = (value) => {
    // this.props.businessList.forEach((v,i)=>{
    //     if(v.name == `${value}`){
    //         if(v.dictionary != ""){
    //             this.props.form.setFieldsValue({
    //               fieldValues: '',
    //             });
    //             if(v.dictionary == "superiorUnit"){//上级单位
    //                 this.setState({
    //                     feldValueType:1,
    //                 })
    //             }else{
    //                 this.setState({
    //                     feldValueType:2,
    //                     bShowexterpriseNameList:false,
    //                 })
    //                 this.props.dispatch(
    //                     selectFiledValueToDictionary({
    //                         key:v.dictionary,
    //                     })
    //                 ).then((data)=>{
    //                     if(data.data && data.data.codes){
    //                         this.setState({
    //                             dictionarySelectList:data.data.codes[0].items,
    //                         })
    //                     }
    //                 })
    //             }

    //         }else{
    //             this.setState({
    //                 feldValueType:0,
    //                 bShowexterpriseNameList:false,
    //             })
    //         }
    //     }
    // })
    let Item = null;
    this.props.businessList.forEach((item)=>{
      if(item.name == value) {
        Item=item
      }
    })
    this.setState({
      Item,
    })
  }

  radioOnChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

   openSelect = (value) => {
     this.props.selectChange(value)
   }

   onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }
  relaxChange = (value) => {
    if (value === "0") {
      this.setState({
        isDisabled: true,
      })
      this.props.form.setFieldsValue({
        relationNumber: '',
      });
    }
    if (value === "2") {
      this.setState({
        isDisabled: false,
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.visible && nextProps.autoRuleDetail && nextProps.businessList){
      nextProps.businessList.forEach((item)=>{
        if(item.name === nextProps.autoRuleDetail.businessField) {
          this.setState({
            Item:item,
          })
        }
      })
    }
  }

  render() {
    const { autoRuleDetail={}, maction } = this.props
    let [customerTypeSelct,sqlContent,remarks,ruleRelationshipSelect,relationNumberSelect,isEnableRadio] = [ , , ,"0"]
    if (maction === '1') {
      // this.props.form.resetFields()
    }
    if (maction === '2') {
      customerTypeSelct = String(autoRuleDetail.customerType)
      sqlContent = String(autoRuleDetail.sqlContent)
      remarks = String(autoRuleDetail.remarks)
      ruleRelationshipSelect = String(autoRuleDetail.ruleRelationship)
      relationNumberSelect = String(autoRuleDetail.relationNumber)
      isEnableRadio = String(autoRuleDetail.isEnable)
    }
    // const { action } = this.props.parsed
    const { getFieldDecorator } = this.props.form
    // const { autoCompleteResult } = this.state

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    // const formTailLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 16, offset: 6 },
    // }
    const { businessList } = this.props
    const handNumberList = this.props.internationRule.handNumberList
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="客户类型">
          {getFieldDecorator('customerType', {
            initialValue: customerTypeSelct,
            rules:[{
                required:true,
                message: '请选择客户类型',
            }],
          })(
            <Select onChange={this.openSelect} placeholder="请选择客户类型">
              <Option value="1">个人客户</Option>
              <Option value="2">企业客户</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="SQL">
          {getFieldDecorator('sqlContent', {
            initialValue: sqlContent,
            rules: [{
              required: true,
              message: '请输入SQL语句',
            }],
          })(
            <TextArea placeholder="请输入SQL语句" autosize={{ minRows: 5, maxRows: 10 }} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remarks', {
            initialValue: remarks,
            rules: [{
              message: '请选择序号',
            }],
          })(
            <Input placeholder="请输入备注"/>
          )}
        </FormItem>
      </Form>
    )
  }
}

class NoneForm extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    otherRuleDetail: PropTypes.object,
    parsed: PropTypes.object,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    }
    this.setState({ autoCompleteResult })
  }

  handleChange = (value) => {
  }

  radioOnChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

   onChange = (date, dateString) => {
   }
  render() {
    const { otherRuleDetail={}, maction } = this.props
    // typeof otherRuleDetail.customerType
    let [customerTypeSelect,isEnableRadio,recoveryTime,remindTime] = [ ,"0",null,null]
    if (maction === '1') {
      // this.props.form.resetFields()
    }
    if (maction === '2') {
      [recoveryTime, remindTime] = [moment(otherRuleDetail.recoveryTime, 'HH:mm'), moment(otherRuleDetail.remindTime, 'HH:mm')]
      customerTypeSelect = String(otherRuleDetail.customerType)
      isEnableRadio = String(otherRuleDetail.isEnable)
    }
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="揽入后未跟进天数">
          {getFieldDecorator('getDay', {
            initialValue: otherRuleDetail.getDay || '',
            rules: [{
              required: this.state.checkNick,
              message: '请填写揽入后未跟进天数',
            }],
          })(
            <Input placeholder="请填写揽入后未跟进天数" type="number" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="跟进时间未跟进天数">
          {getFieldDecorator('followDay', {
            initialValue: otherRuleDetail.followDay || '',
            rules: [{
              required: this.state.checkNick,
              message: '请填写跟进时间未跟进天数',
            }],
          })(
            <Input placeholder="请填写跟进时间未跟进天数" type="number" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="回收公海时间">
          {getFieldDecorator('recoveryTime', {
            initialValue: recoveryTime,
            rules: [{
              required: false,
              message: '请选择回收公海时间!',
            }],
          })(
            <TimePicker format={format} style={{width: '100%'}} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="提醒时间">
          {getFieldDecorator('remindTime', {
            initialValue: remindTime,
            rules: [{
              required: false,
              message: '请选择提醒时间!',
            }],
          })(
            <TimePicker format={format} style={{width: '100%'}} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="">
          {getFieldDecorator('isEnable', {
            initialValue: isEnableRadio,
          })(
            <RadioGroup name="radiogroup" onChange={this.onChange} {...getFieldDecorator('isEnable')} style={{display: 'none'}}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    )
  }
}

class QuitForm extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    otherRuleDetail: PropTypes.object,
    parsed: PropTypes.object,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    }
    this.setState({ autoCompleteResult })
  }

  handleChange = (value) => {
  }

  radioOnChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

   onChange = (date, dateString) => {
   }
  render() {
    const { otherRuleDetail={}, maction } = this.props
    // typeof otherRuleDetail.customerType
    let [customerStatusSelect,isEnableRadio,recoveryTime,remindTime] = [ ,"0",null,null]
    if (maction === '1') {
      // this.props.form.resetFields()
    }
    if (maction === '2') {
      [recoveryTime, remindTime] = [moment(otherRuleDetail.recoveryTime, 'HH:mm'), moment(otherRuleDetail.remindTime, 'HH:mm')]
      customerStatusSelect = String(otherRuleDetail.customerStatus)
      isEnableRadio = String(otherRuleDetail.isEnable)
    }
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="客户状态">
          {getFieldDecorator('customerStatus', {
            initialValue: customerStatusSelect,
          })(
            <Select placeholder="请选择客户状态" {...getFieldDecorator('customerStatus')}>
              <Option value="0">全部</Option>
              <Option value="1">部分</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="离职天数">
          {getFieldDecorator('followDay', {
            initialValue: otherRuleDetail.followDay || '',
          })(
            <Input placeholder="请填写离职天数" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="回收公海时间">
          {getFieldDecorator('recoveryTime', {
            initialValue: recoveryTime,
            rules: [{
              required: false,
              message: '请选择回收公海时间!',
            }],
          })(
            <TimePicker format={format} style={{width: '100%'}} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="提醒时间">
          {getFieldDecorator('remindTime', {
            initialValue: remindTime,
            rules: [{
              required: false,
              message: '请选择提醒时间!',
            }],
          })(
            <TimePicker format={format} style={{width: '100%'}} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="">
          {getFieldDecorator('isEnable', {
            initialValue: isEnableRadio,
          })(
            <RadioGroup name="radiogroup" onChange={this.onChange} {...getFieldDecorator('isEnable')} style={{display: 'none'}}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    )
  }
}

class GetForm extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    otherRuleDetail: PropTypes.object,
    parsed: PropTypes.object,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    }
    this.setState({ autoCompleteResult })
  }

  handleChange = (value) => {
  }

  radioOnChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

   onChange = (date, dateString) => {
   }
  render() {
    const { otherRuleDetail={}, maction } = this.props
    // typeof otherRuleDetail.customerType
    let [isEnableRadio] = ["0"]
    if (maction === '1') {
      // this.props.form.resetFields()
    }
    if (maction === '2') {
      isEnableRadio = String(otherRuleDetail.isEnable)
    }
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="揽同天数">
          {getFieldDecorator('getDay', {
            initialValue: otherRuleDetail.getDay || '',
            rules: [{
              required: this.state.checkNick,
              message: '请填写不能连续“揽”同一个客户的天数',
            }],
          })(
            <Input placeholder="请填写不能连续“揽”同一个客户的天数" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="踢再揽天数">
          {getFieldDecorator('followDay', {
            initialValue: otherRuleDetail.followDay || '',
            rules: [{
              required: this.state.checkNick,
              message: '请填写被踢出的客户再次被其他人揽入的天数设置',
            }],
          })(
            <Input placeholder="请填写被踢出的客户再次被其他人揽入的天数设置" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="">
          {getFieldDecorator('isEnable', {
            initialValue: isEnableRadio,
          })(
            <RadioGroup name="radiogroup" onChange={this.onChange} {...getFieldDecorator('isEnable')} style={{display: 'none'}}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    )
  }
}

class TimeForm extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    otherRuleDetail: PropTypes.object,
    parsed: PropTypes.object,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    bShowTime:false,
    bShowPlusBtn:true,
    bShowMinusBtn:true,
    bClickedMinusbtn:true,
    isClicked:-1,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    }
    this.setState({ autoCompleteResult })
  }

  handleChange = (value) => {
  }

  radioOnChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

   onChange = (date, dateString) => {
   }

   addTime = (action) => {
       if(action == "plus"){
           this.setState({
               bShowPlusBtn:false,
               bShowTime:true,
               bClickedMinusbtn:true,
               bClickedPlusbtn:false,
               isClicked:1,
           })
       }else{
           this.setState({
               bShowPlusBtn:true,
               bShowTime:false,
               bClickedMinusbtn:false,
               bClickedPlusbtn:true,
               isClicked:0,
           })
       }

   }
  render() {
    const { otherRuleDetail={}, maction } = this.props
    let optionsList=[]
    if(otherRuleDetail.openCycle){
        const openCycleCheck = otherRuleDetail.openCycle
        optionsList = openCycleCheck.split(',')
    }

    let [isEnableRadio,recoveryTime,remindTime,startTime,endTime] = ["0","","","",""]
    if (maction === '1') {
      // this.props.form.resetFields()
    }
    if (maction === '2') {
        if(otherRuleDetail.startTime && otherRuleDetail.startTime != ""){
            [recoveryTime,remindTime,startTime,endTime] = [moment(otherRuleDetail.recoveryTime, 'HH:mm'), moment(otherRuleDetail.remindTime, 'HH:mm'),moment(otherRuleDetail.startTime, 'HH:mm'), moment(otherRuleDetail.endTime, 'HH:mm')]
        }else{
            [recoveryTime,remindTime,startTime,endTime] = [moment(otherRuleDetail.recoveryTime, 'HH:mm'), moment(otherRuleDetail.remindTime, 'HH:mm'),"", ""]
        }
        if(otherRuleDetail.startTime && otherRuleDetail.startTime != ""){
            this.state.bShowPlusBtn = false
            this.state.bShowTime = true
            this.bClickedMinusbtn = true
        }else{
            this.state.bShowPlusBtn = true
        }
        if(this.state.isClicked == 1){
            this.state.bShowPlusBtn = false
        }
      isEnableRadio = String(otherRuleDetail.isEnable)
    }

    const plainOptions = [
      { label: '周一', value: '1' },
      { label: '周二', value: '2' },
      { label: '周三', value: '3' },
      { label: '周四', value: '4' },
      { label: '周五', value: '5' },
      { label: '周六', value: '6' },
      { label: '周日', value: '7' },
    ]
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className={style.title}>揽入时间：</div>
        <div className={style.items}>
          <FormItem {...formItemLayout} label="" className={style.item}>
              {getFieldDecorator('recoveryTime', {
                initialValue: recoveryTime,
                rules: [{
                  required: false,
                  message: '请选择揽入客户开始时间设置!',
                }],
              })(
                <TimePicker format={format} style={{width: '100%'}} />
              )}
            </FormItem>
            <div className={style.line}>-</div>
            <FormItem {...formItemLayout} label="" className={style.item2}>
              {getFieldDecorator('remindTime', {
                initialValue: remindTime,
                rules: [{
                  required: false,
                  message: '请选择揽入客户结束时间设置!',
                }],
              })(
                <TimePicker format={format} style={{width: '100%'}} />
              )}
            </FormItem>
            <div className={this.state.bShowPlusBtn || this.state.bClickedPlusbtn ?style.icon:style.hideicon} onClick={()=>this.addTime('plus')}>
                <Icon type="plus-circle-o" />
            </div>
        </div>

        {this.state.bShowTime && this.state.bClickedMinusbtn?
        <div className={style.items}>
            <FormItem {...formItemLayout} label="" className={style.item}>
              {getFieldDecorator('startTime', {
                initialValue: startTime,
                rules: [{
                  required: false,
                  message: '请选择揽入客户开始时间设置!',
                }],
              })(
                <TimePicker format={format} style={{width: '100%'}} />
              )}
            </FormItem>
            <div className={style.line}>-</div>
            <FormItem {...formItemLayout} label="" className={style.item2}>
              {getFieldDecorator('endTime', {
                initialValue: endTime,
                rules: [{
                  required: false,
                  message: '请选择揽入客户结束时间设置!',
                }],
              })(
                <TimePicker format={format} style={{width: '100%'}} />
              )}
            </FormItem>
            <div className={this.state.bShowTime?style.icon:style.hideicon} onClick={()=>this.addTime('minus')}>
                <Icon type="minus-circle-o" />
            </div>

        </div>:null
       }


        <FormItem {...formItemLayout} label="开放周期">
          {getFieldDecorator('openCycle', {
            initialValue: optionsList,
          })(
            <CheckboxGroup options={plainOptions} onChange={this.onChange} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="">
          {getFieldDecorator('isEnable', {
            initialValue: isEnableRadio,
          })(
            <RadioGroup name="radiogroup" onChange={this.onChange} {...getFieldDecorator('isEnable')} style={{display: 'none'}}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    )
  }
}

class HoldForm extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    otherRuleDetail: PropTypes.object,
    parsed: PropTypes.object,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    }
    this.setState({ autoCompleteResult })
  }

  handleChange = (value) => {
  }

  radioOnChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

   onChange = (date, dateString) => {
   }
  render() {
    const { otherRuleDetail={}, maction } = this.props
    // typeof otherRuleDetail.customerType
    let [isEnableRadio] = ["0"]
    if (maction === '1') {
      // this.props.form.resetFields()
    }
    if (maction === '2') {
      isEnableRadio = String(otherRuleDetail.isEnable)
    }
    const { form } = this.props
    const { getFieldDecorator } = form

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="拥有最大客户数量">
          {getFieldDecorator('getDay', {
            initialValue: otherRuleDetail.getDay || '',
            rules: [{
              required: this.state.checkNick,
              message: '请填写拥有最大客户数量',
            }],
          })(
            <Input placeholder="请填写拥有最大客户数量" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="">
          {getFieldDecorator('isEnable', {
            initialValue: isEnableRadio,
          })(
            <RadioGroup name="radiogroup" onChange={this.onChange} style={{display: 'none'}}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    )
  }
}

class InForm extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    otherRuleDetail: PropTypes.object,
    parsed: PropTypes.object,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    }
    this.setState({ autoCompleteResult })
  }

  handleChange = (value) => {
  }

  radioOnChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

   onChange = (date, dateString) => {
   }
  render() {
    const { otherRuleDetail={}, maction } = this.props
    // typeof otherRuleDetail.customerType
    let [isEnableRadio] = ["0"]
    if (maction === '1') {
      // this.props.form.resetFields()
    }
    if (maction === '2') {
      isEnableRadio = String(otherRuleDetail.isEnable)
    }
    // const { action } = this.props.parsed
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="拥有最大天数">
          {getFieldDecorator('getDay', {
            initialValue: otherRuleDetail.getDay || '',
            rules: [{
              required: this.state.checkNick,
              message: '请填写拥有最大天数',
            }],
          })(
            <Input placeholder="请填写拥有最大天数" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="">
          {getFieldDecorator('isEnable', {
            initialValue: isEnableRadio,
          })(
            <RadioGroup name="radiogroup" onChange={this.onChange} style={{display: 'none'}}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    )
  }
}

export {
  AutoForm,
  NoneForm,
  QuitForm,
  GetForm,
  TimeForm,
  HoldForm,
  InForm,
}
