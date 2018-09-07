/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, DatePicker, Radio, Button, Row, Col, Collapse,Select,Spin } from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import DfwsCascader from 'dfws-antd-cascader'
import {getUrlParam} from '../../util'
import { dictUrl } from '../../config'
import style from '../../containers/Detail/style.less'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const RadioGroup = Radio.Group
const Option = Select.Option;
const FormItem = Form.Item
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
const Panel = Collapse.Panel
const customPanelStyle = {
  background: '#ffffff',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
}

class ListContactWorkAdd extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
    location: PropTypes.object,
    editContactBase: PropTypes.func,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    isSubmit: false,
    jobName:"",
    jobList:[
        {"id":0,"jobName":"开发"},
        {"id":1,"jobName":"测试"},
        {"id":2,"jobName":"UI"},
        {"id":3,"jobName":"运维"},
    ],
    notFoundContent:"",
  }

  handleChange = (value) => {
  }

  onChange = (date, dateString) => {
  }

  handleSave = (jobId) => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      this.setState({
        isSubmit: true,
      })
      setTimeout(() => {
        this.setState({
          isSubmit: false,
        })
      }, 3000);
      this.props.addCrmJob(getUrlParam('action'),values,this.props.index)
    })
  }
  search = () =>{

  }

  jobChange = (value)=> {
    // this.setState({
    //     jobName:`${value}`,
    //     fetching: false,
    // });
  }

  jobSearch = (value) =>{
      // this.setState({
      //     notFoundContent:`${value}`,
      // })
      // console.log(`${value}`);
  }
  render() {
    const {dataSource, Panelopen} = this.props
    const { getFieldDecorator } = this.props.form
    const open = Panelopen ? ['1'] : ['2']
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
    // const dateFormat = 'YYYY-MM-DD';
    return (
      <Form onSubmit={this.handleSubmit}>
        <Collapse bordered={false} defaultActiveKey={open} accordion>
          <Panel header="工作信息" style={customPanelStyle} key="1">
            <FormItem
              {...formItemLayout}
              label="工作单位"
              className={style.formItem}
            >
              {getFieldDecorator('workUnit', {
                initialValue: dataSource.workUnit,
                rules: [{required: false, message: '请填写工作单位!'}],
              })(
                <Input placeholder="请输入工作单位"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属行业"
              hasFeedback
              className={style.formItem}
            >
              {getFieldDecorator('industryOwned', {
                initialValue: dataSource.industryOwned?dataSource.industryOwned.toString():"",
                rules: [{required: false, message: '请填写所属行业!'}],
              })(
                <DfwsSelect
                  showSearch
                  url={dictUrl()}
                  code="IndustryCategory"
                  style={{ width: '100%' }}
                  placeholder="请选择所属行业"
                  onChange={this.handleChange}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="职位"
              hasFeedback
              className={style.formItem}
            >
              {getFieldDecorator('job', {
                initialValue: dataSource.job?dataSource.job.toString():this.state.jobName,
                rules: [{required: false, message: '请填写职位!'}],
              })(
                // <DfwsSelect
                //   showSearch
                //   url={dictUrl()}
                //   placeholder="请填写职位"
                //   code={'Station'}
                //   onBlur={this.onBlur}
                // />
                // <Select placeholder="请选择职位" showSearch onChange={(e)=>this.jobChange(e)} onSearch={(e)=>this.jobSearch(e)}>
                //     <Option value="">{this.state.notFoundContent}</Option>
                //       {this.state.jobList.map((v,i)=>{
                //           return <Option key={v.id} value={v.jobName}>{v.jobName}</Option>
                //       })}
                // </Select>
                <Input placeholder="请输入职位" maxLength={50} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色"
              hasFeedback
              className={style.formItem}
            >
              {getFieldDecorator('role', {
                initialValue: dataSource.role,
                rules: [{required: true, message: '请填写角色!'}],
              })(
                <DfwsSelect
                  showSearch
                  url={dictUrl()}
                  code="Role"
                  placeholder="请选择角色"
                  onChange={this.handleChange}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="是否在职"
              hasFeedback
              className={style.formItem}
            >
              {getFieldDecorator('hasJob', {
                initialValue: String(dataSource.hasJob||0),
                rules: [{required: true, message: '请选择是否在职!'}],
              })(
                <RadioGroup style={{width: '100%'}} name="radiogroup">
                  <Radio value="0">否</Radio>
                  <Radio value="1">是</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="在职时间"
              hasFeedback
              className={style.formItem}
            >
              {getFieldDecorator('workingHours', {
                initialValue:[dataSource.workingHours?moment(dataSource.workingHours, dateFormat):'', dataSource.departureTime?moment(dataSource.departureTime, dateFormat):''],
                rules: [{required: false, message: '请选择在职时间!'}],
              })(
                <RangePicker format={dateFormat}/>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Row gutter={8}>
                <Col span={20}>
                  <Button type="primary" disabled={this.state.isSubmit} className={style.infoSave} onClick={() => { this.handleSave(dataSource.id) }}>保存</Button>&emsp;
                  <Button type="primary" className={style.infoSave}>取消</Button>
                </Col>
                <Col span={4}>
                  <a className={style.infoSave} onClick={()=>this.props.removeItem(dataSource.id,this.props.index)}>删除本条</a>
                </Col>
              </Row>
            </FormItem>
          </Panel>
        </Collapse>
      </Form>
    )
  }
}
const ListContactWorkAddForm = Form.create()(ListContactWorkAdd)

export {
  ListContactWorkAddForm,
}
