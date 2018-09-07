/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, DatePicker, Select, Button,Icon } from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import DfwsCascader from 'dfws-antd-cascader'
import {connect} from 'react-redux'
import store from 'store'
import { dictUrl } from '../../config'
import { filterOption } from '../../util'
import { getDepartment } from '../../actions/department'
import style from '../../containers/Detail/style.less'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const FormItem = Form.Item
const Option = Select.Option

@connect((state) => {
  return {
    department: state.department.list,
  }
})
class FormBusinessSearch extends Component {
  // 商机管理搜索
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
    const { nameList } = this.props.clientSystem
    const { getFieldDecorator } = this.props.form
    const { formLayout } = this.state
    const formItemLayout = formLayout === null
    const buttonItemLayout = formLayout === null

    return (
      <Form layout={formLayout}>
        <FormItem {...formItemLayout} label="商机类型" hasFeedback>
          {getFieldDecorator('type', {
            initialValue: '',
            rules: [{ required: true, message: '请选择商机类型!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="TypesOfBusinessOpportunities"
              style={{ width: 180 }}
              placeholder="请选择商机类型"
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="部门" hasFeedback>
          {getFieldDecorator('depCode', {
            rules: [{ required: true, message: '请选择部门!' }],
          })(
            <Select
              showSearch
              placeholder="请选择部门"
              optionFilterProp="children"
              style={{ width: 180 }}
              onChange={this.handleChange}
              filterOption={(input, option) =>option.props.children.indexOf(input.trim()) >= 0}
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
        <FormItem {...formItemLayout} label="跟进人" hasFeedback>
          {getFieldDecorator('userId', {
            rules: [{ required: true, message: '请选择跟进人!' }],
          })(
            <Select
              showSearch
              placeholder="请选择跟进人"
              optionFilterProp="children"
              style={{ width: 180 }}
              onChange={this.handleChange}
              filterOption={(input, option)=>filterOption(input, option)}
            >
              {nameList.map((d, i) => {
                return (
                  <Option key={i} value={String(d.userId)} userPinyin={d.userPinyin}>
                    {d.chineseName}
                  </Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...buttonItemLayout}>
          <Button
            onClick={() => {
              this.handleQuery()
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    )
  }
}

class FormMyBusinessSearch extends Component {
  // 我的商机管理搜索
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
    const { nameList } = this.props.clientSystem
    const { getFieldDecorator } = this.props.form
    const [nextFlowTime, nextFlowTimeStart] = [null, null]
    const { formLayout } = this.state
    const formItemLayout = formLayout === null
    const buttonItemLayout = formLayout === null

    return (
      <Form layout={formLayout}>
        <FormItem {...formItemLayout} label="商机类型" hasFeedback>
          {getFieldDecorator('type', {
            initialValue: '',
            rules: [{ required: true, message: '请选择商机类型!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="TypesOfBusinessOpportunities"
              style={{ width: 180 }}
              placeholder="请选择商机类型"
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        {/* <FormItem {...formItemLayout} label="预计签单日期" hasFeedback>
          {getFieldDecorator('flowTime', {
            initialValue: [nextFlowTime, nextFlowTimeStart],
            rules: [{ required: false, message: '请选择预计签单日期!' }],
          })(<RangePicker style={{ width: 200 }} format={dateFormat} />)}
        </FormItem> */}
        <FormItem {...formItemLayout} label="客户名称">
          {getFieldDecorator('customerName', {
            initialValue: '',
            rules: [
              {
                required: false,
                message: '请填写客户名称!',
              },
            ],
        })(<Input style={{ width: 160 }} placeholder="请输入客户名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="所在地区">
          {getFieldDecorator('address', {
            initialValue: '',
            rules: [
              {
                required: false,
                message: '请填写所在地区!',
              },
            ],
        })(<DfwsCascader url={dictUrl()} placeholder="请选择地区" code={['province','city','area']} changeOnSelect />)}
        </FormItem>
        <FormItem {...buttonItemLayout}>
          <Button
            onClick={() => {
              this.handleQuery()
            }}
           className={style.btnSearch}
          >
          <Icon className={style.icon} type="search" />搜索
          </Button>
        </FormItem>
      </Form>
    )
  }
}

class FormHelpSearch extends Component {
  // 我的客户搜索条件
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

  openSelect = value => {}

  render() {
    const { nameList } = this.props.clientSystem
    const { getFieldDecorator } = this.props.form
    const [nextFlowTime, nextFlowTimeStart] = [null, null]
    const { formLayout } = this.state
    const formItemLayout = formLayout === null
    const buttonItemLayout = formLayout === null

    return (
      <Form layout={formLayout}>
        <FormItem {...formItemLayout} label="申请人" hasFeedback>
          {getFieldDecorator('userId', {
            rules: [{ required: true, message: '请选择申请人!' }],
          })(
            <Select
              showSearch
              placeholder="请选择申请人"
              optionFilterProp="children"
              style={{ width: 180 }}
              onChange={this.handleChange}
              filterOption={(input, option)=>filterOption(input, option)}
            >
              {nameList.map((d, i) => {
                return (
                  <Option key={i} value={String(d.userId)} userPinyin={d.userPinyin}>
                    {d.chineseName}
                  </Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="成熟度" hasFeedback>
          {getFieldDecorator('FollowUpStatus', {
            initialValue: '',
            rules: [{ required: true, message: '请选择成熟度!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="FollowUpStatus"
              style={{ width: 180 }}
              placeholder="请选择成熟度"
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="最近跟进时间" hasFeedback>
          {getFieldDecorator('flowTime', {
            initialValue: [nextFlowTime, nextFlowTimeStart],
            rules: [{ required: false, message: '请选择最近跟进时间!' }],
          })(<RangePicker style={{ width: 200 }} format={dateFormat} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="客户名称">
          {getFieldDecorator('customerName', {
            initialValue: '',
            rules: [
              {
                required: false,
                message: '请填写客户名称!',
              },
            ],
          })(<Input style={{ width: 160 }} placeholder="请输入客户名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系方式">
          {getFieldDecorator('phone', {
            initialValue: '',
            rules: [
              {
                required: false,
                message: '请填写联系方式!',
              },
            ],
          })(<Input style={{ width: 160 }} placeholder="请输入联系方式" />)}
        </FormItem>
        <FormItem {...buttonItemLayout}>
          <Button
            onClick={() => {
              this.handleQuery()
            }}
            className={style.btnSearch}
          >
            <Icon className={style.icon} type="search" />搜索
          </Button>
        </FormItem>
      </Form>
    )
  }
}

class FormDelaySearch extends Component {
  // 延期申请
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

  openSelect = value => {}

  render() {
    const { nameList } = this.props.clientSystem
    const { getFieldDecorator } = this.props.form
    const [nextFlowTime, nextFlowTimeStart] = [null, null]
    const { formLayout } = this.state
    const formItemLayout = formLayout === null
    const buttonItemLayout = formLayout === null

    return (
      <Form layout={formLayout}>
        <FormItem {...formItemLayout} label="客户名称">
        {getFieldDecorator('customerName', {
          initialValue: '',
          rules: [
            {
              required: false,
              message: '请填写客户名称!',
            },
          ],
         })(<Input style={{ width: 160 }} placeholder="请填写客户名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="申请人" hasFeedback>
          {getFieldDecorator('assistPeople', {
            rules: [{ required: true, message: '请选择申请人!' }],
          })(
            <Select
              showSearch
              placeholder="请选择申请人"
              optionFilterProp="children"
              style={{ width: 180 }}
              onChange={this.handleChange}
              filterOption={(input, option)=>filterOption(input, option)}
            >
              {nameList.map((d, i) => {
                return (
                  <Option key={i} value={String(d.userId)} userPinyin={d.userPinyin}>
                    {d.chineseName}
                  </Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="申请日期" hasFeedback>
          {getFieldDecorator('flowTime', {
            initialValue: [nextFlowTime, nextFlowTimeStart],
            rules: [{ required: false, message: '请选择申请日期区间!' }],
          })(<RangePicker style={{ width: 200 }} format={dateFormat} />)}
        </FormItem>

        <FormItem {...buttonItemLayout}>
          <Button
            onClick={() => {
              this.handleQuery()
            }}
            className={style.btnSearch}
          >
            <Icon className={style.icon} type="search" />搜索
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export {
  FormBusinessSearch,
  FormMyBusinessSearch,
  FormHelpSearch,
  FormDelaySearch,
}
