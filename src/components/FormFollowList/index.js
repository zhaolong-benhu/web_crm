/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import {
  Form,
  Modal,
  Select,
  Input,
  DatePicker,
  Button,
  Radio,
  message,
} from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import style from '../../containers/Detail/style.less'
import store from 'store'
import 'moment/locale/zh-cn'
import { connect } from 'react-redux'
import ColumnGroup from 'antd/lib/table/ColumnGroup';
moment.locale('zh-cn')
const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker
const RadioGroup = Radio.Group
const dateFormat = 'YYYY-MM-DD'
const { TextArea } = Input

class $FormFollowList extends Component {

    constructor(props){
        super(props);
    }
  static propTypes = {}

  state = {
      keyword:'',
  }

  TrimStr(str,is_global){
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g,"");
      if(is_global.toLowerCase()=="g")
      {
          result = result.replace(/\s/g,"");
       }
      return result;
  }
  callBack = () => {
    const { followData, action } = this.props
    this.props.form.validateFields((err, values) => {
      var arr = new Array();
      arr = values.keyword.split(" ");
      if(arr.length !=1 ){
        return message.error('参数列表不能输入空格！');
      }

      // if(/(\r)*\n/g.test(values.keyword)){
      //   return message.error('参数列表不能输入空格！');
      // }
      // if (values.keyword.indexOf("\\n") >= 0){
      //   return message.error('参数列表不能输入回车符！');
      // }

      this.props.form.resetFields()
      // if (err) return
      const value = {
        name: values.name || '',
        topicId: values.topicId || '',
        type: values.type || '',
        isRequired: values.isRequired || '',
        sort: values.sort || '',
        keyword: values.keyword || '',
      }
      // if(!this.props.disabled) {
      if (action === 1) {
        this.props.ok(value, action)
      }
      if (action === 2) {
        this.props.ok(value, action, followData.id)
      }
      // } else {
      //   this.props.cancle()
      // }
    })
  }

  cancle = () => {
    this.props.cancle()
  }
  onKeyUp = (event) => {
      // return
      if(event.keyCode === 32){
          // console.log("有空格");
         //  this.props.form.setFieldsValue({
         //   keyword: '',
         // });
          return message.error('参数列表不能输入空格！');
      }else{

      }

 }

  render() {
    const { followData, action, topicList } = this.props
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let topicSel = ''
    if (action === 2) {
      topicSel = String(followData.topicId) || ''
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
        title={this.props.title}
        visible={this.props.visible}
        onCancel={this.cancle}
        onOk={this.callBack}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="字段名称">
            {getFieldDecorator('name', {
              initialValue: followData.name || '',
              rules: [{ required: true, message: '请输入字段名称!' }],
            })(<Input placeholder="请输入字段名称"　width={220} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="关联业务线" hasFeedback>
            {getFieldDecorator('topicId', {
              initialValue: topicSel || '1',
              rules: [{ required: true, message: '请选择关联业务线!' }],
            })(
              <Select
                showSearch
                placeholder="请选择关联业务线"
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
          <FormItem {...formItemLayout} label="字段类型" hasFeedback>
            {getFieldDecorator('type', {
              initialValue: String(followData.type),
              rules: [{ required: false, message: '请选择字段类型!' }],
            })(
              <RadioGroup style={{width: '100%'}} name="radiogroup">
                <Radio value="1">文本框</Radio>
                <Radio value="2">时间文本框</Radio>
                <Radio value="3">下拉框</Radio>
                <Radio value="4">文本域</Radio>
                <Radio value="5">单选</Radio>
                <Radio value="6">复选</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否必填" hasFeedback>
            {getFieldDecorator('isRequired', {
              initialValue: String(followData.isRequired),
              rules: [{ required: false, message: '请选择是否必填!' }],
            })(
              <RadioGroup name="radiogroup">
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="参数排序">
            {getFieldDecorator('sort', {
              initialValue: followData.sort || '',
              rules: [{ required: false, message: '请输入参数排序!' }],
            })(<Input placeholder="请输入参数排序" type="number"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="参数列表">
            {getFieldDecorator('keyword', {
              initialValue: followData.keyword || '',
          })(<TextArea style={{ width: '100%', height: 100 }} onKeyUp={this.onKeyUp} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
const FormFollowList = Form.create()($FormFollowList)
export { FormFollowList }
