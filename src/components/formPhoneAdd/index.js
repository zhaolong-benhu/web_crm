/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Form, Input, Row, Col, Button } from 'antd'
import moment from 'moment'
import style from '../../containers/Detail/style.less'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const FormItem = Form.Item

class ListPhoneAdd extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
    editContactBase: PropTypes.func,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    nums: 1,
  }

  handleChange = (value) => {
  }

  onChange = (date, dateString) => {
  }

  radioOnChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  handleSave = (action) => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      if (action === 1) {
        this.props.addContactPhone(1,values);
      }
      if (action === 2) {
        this.props.addContactPhone(2,values);
      }
    })
  }

  render() {
    const { selectContact, crmPhoneList } = this.props.clientSystem
    let [contactType,personPhone,workPhone,faxPhone,weChat,qqPhone,emailPhone,fexPhone] = ['','','','','','','','']
    if(selectContact && crmPhoneList){
      crmPhoneList.map((data, index) => {
        contactType = data.type
        if(contactType === 1){
          personPhone = data.phone
        }
        if(contactType === 2){
          workPhone = data.phone
        }
        if(contactType === 3){
          faxPhone = data.phone
        }
        if(contactType === 4){
          weChat = data.phone
        }
        if(contactType === 5){
          qqPhone = data.phone
        }
        if(contactType === 6){
          emailPhone = data.phone
        }
        if(contactType === 7){
          fexPhone = data.phone
        }
      })
    }
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let [action] = ['']
    if(JSON.stringify(parsed) === "{}"){
      [action] = [this.props.history.location.state.action]
    }else{
      [action] = [parsed.action]
    }
    if (action === '1') {
    }
    if (action === '2') {
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
      <Form onSubmit={this.handleSubmit}>
        <h2 className={style.h2Font}>联系方式</h2>
        <FormItem
          {...formItemLayout}
          label="个人手机"
        >
          <Row gutter={8}>
            <Col span={20}>
              {getFieldDecorator('personPhone', {
                initialValue: personPhone,
                rules: [
                    {required: true, message: '请填写个人手机!'},
                    {
                      validator(rule, values, callback) {
                        callback(
                          !/^((1[3456789]\d{9})|)$/.test(values || '')
                            ? `个人手机格式错误!`
                            : undefined
                        )
                      },
                    },
                ],
              })(
                <Input placeholder="请输入个人手机" type="number" />
              )}
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.props.setDefault}>设为默认</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="工作手机"
        >
          <Row gutter={8}>
            <Col span={20}>
              {getFieldDecorator('workPhone', {
                initialValue: workPhone,
                rules: [
                {required: true, message: '请填写工作手机!'},
                {
                  validator(rule, values, callback) {
                    callback(
                      !/^((1[3456789]\d{9})|)$/.test(values || '')
                        ? `工作手机格式错误!`
                        : undefined
                    )
                  },
                },
            ],
              })(
                <Input placeholder="请输入工作手机" type="number" />
              )}
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.props.setDefault}>设为默认</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="固定电话"
        >
          <Row gutter={8}>
            <Col span={20}>
              {getFieldDecorator('faxPhone', {
                initialValue: faxPhone,
                rules: [
                    {required: true, message: '请填写固定电话!'},
                    {
                      validator(rule, values, callback) {
                        if (values === '' || values === null || values === undefined) {
                          callback()
                        } else {
                          callback(
                            !/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/.test(values || '') ? `固定电话格式错误!` : undefined
                          )
                        }
                      },
                    },
                ],
              })(
                <Input placeholder="请输入固定电话"/>
              )}
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.props.setDefault}>设为默认</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="微信"
        >
          <Row gutter={8}>
            <Col span={20}>
              {getFieldDecorator('weChat', {
                initialValue: weChat,
                rules: [
                    {required: false, message: '请填写微信!'},
                    {
                      validator(rule, values, callback) {
                        callback(
                          /[\u4E00-\u9FA5]/i.test(values || '') ? `微信号格式错误!` : undefined
                        )
                      },
                    },
                ],
              })(
                <Input placeholder="请输入微信" />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="QQ"
        >
          <Row gutter={8}>
            <Col span={20}>
              {getFieldDecorator('qqPhone', {
                initialValue: qqPhone,
                rules: [
                    {required: false, message: '请填写QQ!'},
                    {
                      validator(rule, values, callback) {
                        callback(
                          !/^[0-9]*$/.test(values || '') ? `QQ格式错误!` : undefined
                        )
                      },
                    },
                ],
              })(
                <Input placeholder="请输入QQ" type="number" />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Email"
        >
          <Row gutter={8}>
            <Col span={20}>
              {getFieldDecorator('emailPhone', {
                initialValue: emailPhone,
                rules: [
                    {type: 'email', message: '邮箱格式不正确!'},
                    {required: false, message: '请填写Email!'},
                ],
              })(
                <Input placeholder="请输入Email" />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="传真"
        >
          <Row gutter={8}>
            <Col span={20}>
              {getFieldDecorator('phone', {
                initialValue: fexPhone,
                rules: [
                {required: false, message: '请填写传真!'},
                {
                  validator(rule, values, callback) {
                    if (values === '' || values === null || values === undefined) {
                      callback()
                    } else {
                      callback(
                        !/^(\d{3,4}-)?\d{7,8}$/.test(values || '') ? `传真格式错误!` : undefined
                      )
                    }
                  },
                },
                ],
              })(
                <Input placeholder="请输入传真" type="number" />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Row gutter={8}>
            <Col span={4}>
              <Button type="primary" className={style.infoSave} onClick={() => { this.handleSave(action) }}>保存</Button>&emsp;
            </Col>
          </Row>
        </FormItem>
      </Form>
    )
  }
}
const ListPhoneAddForm = Form.create()(ListPhoneAdd)

export {
  ListPhoneAddForm,
}
