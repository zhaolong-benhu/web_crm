/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, DatePicker, Radio, Button, Row, Col, Collapse } from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import DfwsCascader from 'dfws-antd-cascader'
import { dictUrl } from '../../config'
import style from '../../containers/Detail/style.less'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const RadioGroup = Radio.Group
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
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }

  handleChange = (value) => {
  }

  onChange = (date, dateString) => {
  }

  handleSave = (jobId) => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      this.props.editContactBase(values,2,jobId)
    })
  }

  deleteWorkPanel = (jobId) => {
  }

  render() {
    const {crmJobsList} = this.props.clientSystem
    let [jobData,datas]=['',[]]
    if(crmJobsList){
      datas = crmJobsList
      crmJobsList.map((data, index) => {
        return jobData = data
      })
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
        <h2 className={style.h2Font}>
          工作信息
          <a className={style.infoSave} style={{float: 'right', marginRight:10}} onClick={() => { this.addWorkInfoData() }}>新增工作信息</a>
        </h2>
        <Collapse bordered={false} defaultActiveKey={['0']} accordion>
          {
            datas.map((data, index) => {
              return (
                <Panel header="工作信息" key={index} style={customPanelStyle}>
                  <FormItem
                    {...formItemLayout}
                    label="工作单位"
                  >
                    {getFieldDecorator('workUnit', {
                      initialValue: data.workUnit,
                      rules: [{required: true, message: '请填写工作单位!'}],
                    })(
                      <Input placeholder="请输入工作单位" />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="所属行业"
                    hasFeedback
                  >
                    {getFieldDecorator('industryOwned', {
                      initialValue: data.industryOwned,
                      rules: [{required: true, message: '请填写所属行业!'}],
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
                  <FormItem
                    {...formItemLayout}
                    label="职位"
                    hasFeedback
                  >
                    {getFieldDecorator('job', {
                      initialValue: data.job ? (data.job.includes(',') ? [data.job.split(',')[0],data.job.split(',')[1]]:['','']) : ['',''],
                      rules: [{required: true, message: '请填写职位!'},{
                        validator: (rule, values, callback) => {
                          if (values && values[0]) {
                            callback();
                          } else {
                            callback('');
                          }
                        },
                      }],
                    })(
                      <DfwsCascader
                        showSearch
                        url={dictUrl()}
                        placeholder="请填写职位"
                        code={['Position', 'Station']}
                        changeOnSelect
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="角色"
                    hasFeedback
                  >
                    {getFieldDecorator('role', {
                      initialValue: data.role,
                      rules: [{required: true, message: '请填写角色!'}],
                    })(
                      <DfwsSelect
                        showSearch
                        url={dictUrl()}
                        code="Role"
                        placeholder="请填写角色"
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="是否在职"
                    hasFeedback
                  >
                    {getFieldDecorator('hasJob', {
                      initialValue: String(data.hasJob),
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
                  >
                    {getFieldDecorator('workingHours', {
                      initialValue:  [jobData.workingHours ? moment(jobData.workingHours, 'YYYY-MM-DD'):'', jobData.departureTime? moment(jobData.departureTime, 'YYYY-MM-DD'):''],
                      rules: [{required: true, message: '请选择在职时间!'}],
                    })(
                      <RangePicker format={dateFormat} />
                    )}
                  </FormItem>
                  <FormItem {...tailFormItemLayout}>
                    <Row gutter={8}>
                      <Col span={20}>
                        <Button type="primary" className={style.infoSave} onClick={() => { this.handleSave(data.id) }}>保存</Button>&emsp;
                      </Col>
                      <Col span={4}>
                        <a className={style.infoSave} onClick={() => { this.deleteWorkPanel(data.id) }}>删除本条</a>
                      </Col>
                    </Row>
                  </FormItem>
                </Panel>
              )
            })
          }
        </Collapse>
      </Form>
    )
  }
}
const ListContactWorkAddForm = Form.create()(ListContactWorkAdd)

export {
  ListContactWorkAddForm,
}
