/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Form, Modal, Select, Input, DatePicker, Button } from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import { dictUrl } from '../../config'
import style from '../../containers/Detail/style.less'
import store from 'store'
import 'moment/locale/zh-cn'
import {connect} from 'react-redux'
moment.locale('zh-cn')
const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const { TextArea } = Input;

@connect((state) => {
  return {
    busiData: state.businessSystem.busiData,
  }
})

class $FormBusiList extends Component {
  static propTypes = {
    // busiData: PropTypes.object,
  }

  state = {
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
    })
  }

  cancle = () =>{
      this.props.cancle();
      this.props.form.resetFields();
  }
  callBack = () => {
    const { busiData,action } = this.props
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id, poolId, topicId} = parsed
    this.props.form.validateFields((err, values) => {
      // if (err) return
      // this.props.form.resetFields()
      // const value = {
      //   customerId: id,
      //   busNumber: values.busNumber,
      //   customerName: values.customerName,
      //   esMoney: values.esMoney,
      //   esBillDate: values.esBillDate,
      //   products: values.products,
      //   busType: values.busType,
      //   busStatus: values.busStatus,
      //   busSource: values.busSource,
      //   remarks: values.remarks,
      // }
      if(!this.props.disabled) {
        if (action === 1) {
          this.props.ok(values,action,busiData.id)
        }
        if (action === 2) {
          this.props.form.resetFields()
        }
        if (action === 2 || action === 3) {
          this.props.ok(values,action,busiData.id)
        }
      } else {
        this.props.cancle()
      }
    })

    this.props.form.resetFields();
  }

  disabledDate(current) {
    return current < moment().subtract(1,'days').endOf('day');
  }

  render() {
    const { busiData,action } = this.props
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let [customerName,valueDate,busTypeSelct,busStatusSelct,busSourceSelct] = ['',null, , , ]
    if (action === 1) {
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {customerCategory} = parsed
      if (customerCategory === '1') {
        customerName = this.props.clueDetail.customerName
      }
      if (customerCategory === '2') {
        customerName = this.props.clueDetail.enterpriseName
      }
    }
    if (action === 2 || action === 3) {
      if (busiData.esBillDate === null) {
        valueDate = ''
      }else{
        valueDate = moment(busiData.esBillDate, dateFormat)
      }
      busTypeSelct = String(busiData.type)
      busStatusSelct = String(busiData.status)
      busSourceSelct = String(busiData.busSource)
      customerName = busiData.customerName
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
    var isDisabled = false
    if(this.props.busStatus && this.props.busStatus === "作废" ){
        isDisabled = true;
    }
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onCancel={this.cancle}
        onOk={this.callBack}
        footer={isDisabled?null:<Button onClick={this.callBack}>确定</Button>}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={"对应客户"}
          >
            {getFieldDecorator('customerName', {
              initialValue: customerName,
              rules: [{required: false, message: '请输入对应客户!'}],
            })(
              <Input disabled placeholder="请输入对应客户" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="预计销售金额"
          >
            {getFieldDecorator('esMoney', {
              initialValue: busiData.esMoney || '',
              rules: [{required: true, message: '请输入预计销售金额!'}],
            })(
              <Input placeholder="请输入预计销售金额" disabled={isDisabled}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="预计签单日期"
            hasFeedback
          >
            {getFieldDecorator('esBillDate', {
              initialValue: valueDate,
              rules: [{required: true, message: '请选择预计签单日期!'}],
            })(
              <DatePicker style={{width: '100%'}} disabledDate={this.disabledDate} onChange={this.onChange} disabled={isDisabled} />
            )}
          </FormItem>
           {this.props.productList &&
               <FormItem
                 {...formItemLayout}
                 label="关联产品"
               >
                 {getFieldDecorator('products', {
                   initialValue: busiData.products || '',
                   rules: [{required: false, message: '请输入关联产品!'}],
                 })(
                   <Select disabled={isDisabled}>
                     {this.props.productList.map((v,i)=>{
                         return <Option value={v.cname} key={i}>{v.cname}</Option>
                     })}
                   </Select>
                 )}
               </FormItem>
           }

          <FormItem
            {...formItemLayout}
            label="商机类型"
            hasFeedback
          >
            {getFieldDecorator('busType', {
              initialValue: busTypeSelct,
              rules: [{required: true, message: '请选择商机类型!'}],
            })(
              <DfwsSelect
                showSearch
                url={dictUrl()}
                code="TypesOfBusinessOpportunities"
                placeholder="请选择商机类型"
                onChange={this.handleChange}
                disabled={isDisabled}
                allowClear={false}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商机状态"
            hasFeedback
          >
            {getFieldDecorator('busStatus', {
              initialValue: busStatusSelct,
              rules: [{required: true, message: '请选择商机状态!'}],
            })(
              <DfwsSelect
                showSearch
                url={dictUrl()}
                code="BusinessOpportunityStatus"
                placeholder="请选择商机状态"
                onChange={this.handleChange}
                disabled={isDisabled}
                allowClear={false}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="商机来源"
            hasFeedback
          >
            {getFieldDecorator('busSource', {
              initialValue: busSourceSelct,
              rules: [{required: true, message: '请选择商机来源!'}],
            })(
              <DfwsSelect
                showSearch
                url={dictUrl()}
                code="SourceOfBusinessOpportunities"
                placeholder="请选择商机来源"
                onChange={this.handleChange}
                disabled={isDisabled}
                allowClear={false}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('remarks', {
              initialValue: busiData.remarks || '',
              rules: [{required: false, message: '请输入备注!'}],
            })(
              <TextArea placeholder="请输入备注" autosize={{ minRows: 4, maxRows: 6 }} disabled={isDisabled}/>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
              <Button style={{display: 'none'}} type="primary" htmlType="submit" size="large">保存</Button>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
const FormBusiList = Form.create()($FormBusiList)
export {
  FormBusiList,
}
