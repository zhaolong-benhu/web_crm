/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Form, Input, DatePicker, Radio, Select, Cascader, Button, Tooltip, Icon, Row, Col } from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import DfwsCascader from 'dfws-antd-cascader'
import {connect} from 'react-redux'
import { dictUrl } from '../../config'
import { getDepartment } from '../../actions/department'
import style from '../../containers/Detail/style.less'
import { filterOption } from '../../util'
import store from 'store'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const RadioGroup = Radio.Group
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const FormItem = Form.Item
const Option = Select.Option

@connect((state) => {
  return {
    department: state.department.list,
  }
})
class FormClientSearch extends Component { // 客户管理搜索
  static propTypes = {
    form: PropTypes.any,
    clientQuery: PropTypes.func,
  }

  state = {
    formLayout: 'inline',
  }

  handleQuery = () => {
    this.props.form.validateFields((err, value) => {
      // if (err) return
      this.props.clientQuery(value)
    })
  }

  componentDidMount() {
    const crm = store.get('crm')
    const depCode = crm && crm.user ? crm.user.depCode : '';
    this.props.dispatch(getDepartment({depCode}))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { formLayout } = this.state
    const formItemLayout = formLayout === null
    const buttonItemLayout = formLayout === null

    return (
      <Form layout={formLayout}>
        <FormItem
          {...formItemLayout}
          label="客户名称"
        >
        {getFieldDecorator('name', {
          initialValue: '',
          rules: [{
            required: false,
            message: '请填写客户名称!',
          }],
        })(
          <Input style={{width: '180px'}} placeholder="请输入客户名称" />
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属行业"
          hasFeedback
        >
          {getFieldDecorator('dictName', {
            rules: [{required: true, message: '请选择所属行业!'}],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              style={{ width: 180 }}
              code="IndustryCategory"
              placeholder="请选择所属行业"
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="部门"
          hasFeedback
        >
          {getFieldDecorator('depCode', {
            rules: [{required: true, message: '请选择部门!'}],
          })(
            <Select
              showSearch
              style={{ width: 180 }}
              code="department"
              placeholder="请选择部门"
              optionFilterProp="children"
              style={{ width: 180 }}
              onChange={this.handleChange}
              filterOption={(input, option) =>
                option.props.children
                  .indexOf(input.trim()) >= 0
              }
            >
              {this.props.department.map((d, i) => {
                return (
                  <Option key={i} value={d.departmentCode}>
                    {d.departmentName}
                  </Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属人"
        >
        {getFieldDecorator('userName', {
          rules: [{
            required: false,
            message: '请填写所属人!',
          }],
        })(
          <Input style={{ width: 180 }} placeholder="请输入所属人" />
        )}
        </FormItem>
        <FormItem {...buttonItemLayout}>
          <Button onClick={() => { this.handleQuery() }} className={style.btnSearch}><Icon className={style.icon} type="search" />搜索</Button>
        </FormItem>
      </Form>
    )
  }
}

class FormMyClientSearch extends Component { // 我的客户搜索条件
  static propTypes = {
    form: PropTypes.any,
    clientQuery: PropTypes.func,
  }

  state = {
    formLayout: 'inline',
  }

  handleQuery = () => {
    this.props.form.validateFields((err, value) => {
      const values = {
        customerName: value.customerName||"",
        type: value.type||"",
        dictName: value.dictName||"",
        poolId: value.poolId||"",
        address: value.address||"",
      }
      // if (err) return
      this.props.clientQuery(values)
    })
  }
  handleChange = (selectedData) =>{
      // console.log(selectedData);
      // if(selectedData.length>2){
      //     return;
      // }
  }
  openSelect = (value) => {
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const [nextFlowTime,nextFlowTimeStart] = [null,null]
    const { formLayout } = this.state
    const formItemLayout = formLayout === null
    const buttonItemLayout = formLayout === null
    const { poolList } = this.props.myInternation

    return (
      <Form layout={formLayout}>
        <FormItem
          {...formItemLayout}
          label="客户名称"
        >
        {getFieldDecorator('customerName', {
          initialValue: '',
          rules: [{
            required: false,
            message: '请填写客户名称!',
          }],
        })(
          <Input style={{ width: 150 }} placeholder="请输入客户名称" />
        )}
        </FormItem>
        {/* <FormItem {...formItemLayout} label="客户类型">
          {getFieldDecorator('type', {
            initialValue: '',
          })(
            <Select
              style={{ width: 150 }}
              onChange={this.handleChange}
            >
            <Option value="">请选择</Option>
            <Option value="1">个人客户</Option>
            <Option value="2">企业客户</Option>
            </Select>
          )}
        </FormItem> */}
        <FormItem
          {...formItemLayout}
          label="所属行业"
          hasFeedback
        >
          {getFieldDecorator('dictName', {
            initialValue: '',
            rules: [{required: true, message: '请选择所属行业!'}],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="IndustryCategory"
              style={{ width: 150 }}
              placeholder="请选择所属行业"
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属公海">
          {getFieldDecorator('poolId', {
            initialValue: poolList && poolList[0] && poolList[0].id || "",
          })(
            <Select
              filterOption={(input, option) => filterOption(input, option)}
              showSearch
              style={{ width: 200 }}
              placeholder="请选择"
              // mode="multiple"
              // maxTagCount={3}
              onChange={this.handleChange}
              // maxTagPlaceholder="最多支持3个公海"
            >
            {poolList && poolList.map((v,i)=>{
                return <Option value={v.id} key={v.id+i}>{v.name}</Option>
            })}
            </Select>

          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所在地区">
          {getFieldDecorator('address', {
            initialValue: "",
          })(
              <DfwsCascader  url={dictUrl()} placeholder="请选择客户所在地" code={['province','city','area']} allowClear={false} changeOnSelect/>
          )}
        </FormItem>
        <FormItem {...buttonItemLayout}>
          <Button onClick={() => { this.handleQuery() }} className={style.btnSearch}><Icon className={style.icon} type="search" />搜索</Button>
        </FormItem>
      </Form>
    )
  }
}

class FormFollowSearch extends Component { // 客户管理搜索
  static propTypes = {
    form: PropTypes.any,
    clientQuery: PropTypes.func,
  }

  state = {
    formLayout: 'inline',
  }

  handleQuery = () => {
    this.props.form.validateFields((err, value) => {
      // if (err) return
      this.props.clientQuery(value)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {topicList} = this.props
    const { formLayout } = this.state
    const formItemLayout = formLayout === null
    const buttonItemLayout = formLayout === null

    return (
      <Form layout={formLayout}>
        <FormItem
          {...formItemLayout}
          label="字段名称"
        >
        {getFieldDecorator('name', {
          initialValue: '',
          rules: [{
            required: false,
            message: '请填写字段名称!',
          }],
        })(
          <Input style={{ width: 180 }} placeholder="请输入字段名称" />
        )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="关联业务线"
          hasFeedback
        >
          {getFieldDecorator('topicId', {
            initialValue: '',
            rules: [{required: true, message: '请选择关联业务线!'}],
          })(
            <Select
              showSearch
              placeholder="请选择关联业务线"
              style={{ width: 180 }}
              optionFilterProp="children"
              onChange={this.handleChange}
              filterOption={(input, option) => option.props.children.indexOf(input.trim()) >= 0}
            >
              {
                topicList.map((d, i) => {
                  return (
                    <Option key={d.id} value={String(d.id)}>{d.name}</Option>
                  )
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem {...buttonItemLayout}>
          <Button onClick={() => { this.handleQuery() }} className={style.btnSearch}><Icon className={style.icon} type="search" />搜索</Button>
        </FormItem>
      </Form>
    )
  }
}


export {
  FormClientSearch,
  FormMyClientSearch,
  FormFollowSearch,
}
