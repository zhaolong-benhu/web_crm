/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Form, Input, DatePicker, Select, Cascader, Button, Row, Col, Radio,message } from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import DfwsCascader from 'dfws-antd-cascader'
import { dictUrl } from '../../config'
import style from '../../containers/Detail/style.less'
import store from 'store'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const { TextArea } = Input;

class ListContactBaseAdd extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
    addWorkInfo: PropTypes.func,
    editContactBase: PropTypes.func,
    contactBaseInfo: PropTypes.object,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    nums: 1,
    btnText:"设置为高级联系人",
    isPersonPhoneDefault: false,
    isWorkPhoneDefault: false,
    isFaxPhoneDefault: false,
    isUpdate: false,
    isSubmit: false,
  }
  constructor(props){
      super(props);
      this.isSeniorContact = 0
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

  handleChange = (value) => {
  }

  onChange = (date, dateString) => {
  }
  setDefault = () =>{
      if(this.isSeniorContact === 0){
          this.setState({
              btnText:"已设置为高级联系人",
          })
          this.isSeniorContact = 1;
          message.success("设置成功")

      }else{
          this.setState({
              btnText:"设置为高级联系人",
          })
          this.isSeniorContact = 0;
          message.success("取消成功")
      }
      this.props.setDefault("seniorContact",this.isSeniorContact)
  }
  handleSave = (action,contactId) => {
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
      if (action == '1') {
        this.props.addContactBase(values,1)
      }
      if (action == '2') {
        this.props.editContactBase(values,1)
      }
    })
  }

  componentWillReceiveProps(nextProps){
      if(this.props.clientSystem !== nextProps.clientSystem){
          if(nextProps.clientSystem.selectContact && nextProps.clientSystem.selectContact.seniorContact === 1){
              this.state.btnText = "已设置为高级联系人"
              this.isSeniorContact = 1;
          }else{
              this.state.btnText = "设置为高级联系人"
              this.isSeniorContact = 0;
          }
      }
  }

  onBlur = () => {
      setTimeout(()=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
            }
            if(/^((1[3456789]\d{9})|)$/.test(values.personalPhone)  && values.personalPhone != ""){
                this.props.selectCustomerToStock(values.personalPhone);
            }
          })
      },2000)
  }

    handleCallPhone = (number, type) => {
    this.setState({
      isPersonCall: type === 1,
      isWorkCall: type === 2,
      isFixedCall: type === 3,
    })
    setTimeout(() => {
      this.setState({
        isPersonCall: false,
        isWorkCall: false,
        isFixedCall: false,
      })
    }, 3000);
    this.props.onCallPhone(number)
  }

  handleDefault = (field, type) => {
    const val = this.props.form.getFieldValue(field)
    if (val) {
      this.setState({
        isUpdate: true,
        isPersonPhoneDefault: type === 1,
        isWorkPhoneDefault: type === 2,
        isFaxPhoneDefault: type === 3,
      })
      this.props.setDefault(field)
    }
    else {
      message.error("默认联系方式不能为空")
    }
  }

  render() {
    const {selectContact } = this.props.clientSystem
    const address = selectContact.address || ''
    const province = address.slice(0, 6)
    const city = address.slice(6, 12)
    const area = address.slice(12, 18)
    // const { action } = this.props.parsed
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let [action] = ['']
    if(JSON.stringify(parsed) === "{}"){
      [action] = [this.props.history.location.state.action]
    }else{
      [action] = [parsed.action]
    }

    let [birthValue,sexSel,marrySel,childrenSel,statusSel,personalPhone,workPhone,fixedPhone,        callPersonalPhone,callWorkPhone,callFixedPhone,isDefault,weChat,qQ,email,fax,remarks] = ['','','','','','','','','','','','','','','','']
    if (action === '1') {
      // [birthValue,sexSel,marrySel,childrenSel] = [null,'请选择','请选择','请选择']
    }
    if (action === '2') {
      [
        birthValue,
        sexSel,
        marrySel,
        childrenSel,
        statusSel,
        personalPhone,
        workPhone,
        fixedPhone,
        callPersonalPhone,
        callWorkPhone,
        callFixedPhone,
        isDefault,
        weChat,
        qQ,
        email,
        fax,
        remarks,
      ] = [
        selectContact.birthday?moment(selectContact.birthday, 'YYYY-MM-DD'):null,
        String(selectContact.sex),
        String(selectContact.isMarry),
        String(selectContact.haveChildren),
        String(selectContact.category),
        String(selectContact.personalPhone),
        String(selectContact.workPhone),
        String(selectContact.fixedPhone),
        String(selectContact.callPersonalPhone),
        String(selectContact.callWorkPhone),
        String(selectContact.callFixedPhone),
        String(selectContact.isDefault),
        String(selectContact.weChat),
        String(selectContact.qQ),
        String(selectContact.email),
        String(selectContact.fax),
        String(selectContact.remarks)]
    }
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 18 },
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
        <h2 style={{marginTop: 10}} className={style.h2Font}>联系人基本信息</h2>
        <FormItem
        {...formItemLayout}
        label="个人手机"
        className={style.formItem}
      >
        <Row gutter={8}>
          <Col span={20}>
            {getFieldDecorator('personalPhone', {
              initialValue: personalPhone,
              rules: [
                  {required: false, message: '请填写个人手机!'},
                  {
                    validator(rule, values, callback) {
                      callback(
                        !/^1[1|2|3|4|5|6|7|8|9][0-9]\d{4,8}$/i.test(values || '') || values.length !=11
                          ? `个人手机格式错误!`
                          : undefined
                      )
                    },
                  },
              ],
            })(
              <Input placeholder="请输入个人手机" type="number" onBlur={this.onBlur}/>
            )}
          </Col>
          <Col span={4}>
            <Button shape="circle" disabled={this.state.isPersonCall} icon={this.state.isPersonCall ? "shake" : "customer-service"} style={{display: (action === '2' && personalPhone && callPersonalPhone) ? 'inline-block' : 'none'}} onClick={()=>this.handleCallPhone(callPersonalPhone, 1)}>
            </Button>
          </Col>
        </Row>
      </FormItem>
        <FormItem
        {...formItemLayout}
        label="联系人姓名"
        className={style.formItem}
      >
      <Row gutter={8}>
        <Col span={20}>
        {getFieldDecorator('customerName', {
          initialValue: selectContact.customerName,
          rules: [{required: true, message: '请填写联系人姓名!'}],
        })(
          <Input placeholder="请输入联系人姓名" />
        )}
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={()=>this.setDefault()}>{this.state.btnText}</Button>
        </Col>
      </Row>
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="联系人性别"
        hasFeedback
        className={style.formItem}
      >
        {getFieldDecorator('sex', {
          initialValue: sexSel||"",
          rules: [{required: true, message: '请选择联系人性别!'}],
        })(
          <Select
          className={style.select}
          placeholder="请选择联系人性别"
        >
          <Option value="">请选择</Option>
          <Option value="1">男</Option>
          <Option value="0">女</Option>
        </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="婚否"
        hasFeedback
        className={style.formItem}
      >
        {getFieldDecorator('isMarry', {
          initialValue: marrySel || '',
          rules: [{required: false, message: '请选择婚否!'}],
        })(
          <Select
            showSearch
            placeholder="请选择婚否"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) => option.props.children.indexOf(input.trim()) >= 0}
          >
            <Option value="">请选择</Option>
            <Option value="0">否</Option>
            <Option value="1">是</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="是否有子女"
        hasFeedback
        className={style.formItem}
      >
        {getFieldDecorator('haveChildren', {
          initialValue: childrenSel || '',
          rules: [{required: false, message: '请选择是否有子女!'}],
        })(
          <Select
            showSearch
            placeholder="请选择是否有子女"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) => option.props.children.indexOf(input.trim()) >= 0}
          >
            <Option value="">请选择</Option>
            <Option value="0">否</Option>
            <Option value="1">是</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="联系人所在地"
        className={style.formItem}
      >
        {getFieldDecorator('address', {
          initialValue: province ? [province, city, area] : null,
          rules: [{ type: 'array', required: true, message: '请选择联系人所在地!' },{
            validator: (rule, values, callback) => {
              if (values && values[0]) {
                callback();
              } else {
                callback('');
              }
            },
          }],
        })(
          <DfwsCascader url={dictUrl()} placeholder="请选择联系人所在地" code={['province', 'city', 'area']}
        />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="出生年月"
        hasFeedback
        className={style.formItem}
      >
        {getFieldDecorator('birthday', {
          initialValue: birthValue,
          rules: [{required: false, message: '请选择出生年月!'}],
        })(
          <DatePicker style={{width: '100%'}} onChange={this.onChange} />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="简历编号"
        className={style.formItem}
      >
        {getFieldDecorator('accountCode', {
          initialValue: selectContact.accountCode,
          rules: [{required: false, message: '请填写简历编号!'}],
        })(
          <Input placeholder="请输入简历编号" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="联系人类别"
        hasFeedback
        className={style.formItem}
      >
        {getFieldDecorator('category', {
          initialValue: statusSel,
          rules: [{required: false, message: '请选择联系人类别!'}],
        })(
          <DfwsSelect
            showSearch
            url={dictUrl()}
            code="ContactType"
            placeholder="请选择类别"
            onChange={this.handleChange}
          />
        )}
      </FormItem>
      <FormItem
      {...formItemLayout}
      label="工作手机"
      className={style.formItem}
    >
      <Row gutter={8}>
        <Col span={20}>
          {getFieldDecorator('workPhone', {
            initialValue: workPhone,
            rules: [
            {required: false, message: '请填写工作手机!'},
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
        <Button shape="circle" disabled={this.state.isWorkCall} icon={this.state.isWorkCall ? "shake" : "customer-service"} style={{display: (action === '2' && workPhone && callWorkPhone) ? 'inline-block' : 'none'}} onClick={()=>this.handleCallPhone(callWorkPhone, 2)}>
        </Button>
        </Col>
      </Row>
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="固定电话"
      className={style.formItem}
    >
      <Row gutter={8}>
        <Col span={20}>
          {getFieldDecorator('fixedPhone', {
            initialValue: fixedPhone,
            rules: [
                {required: false, message: '请填写固定电话!'},
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
            <Input placeholder="请输入固定电话" />
          )}
        </Col>
        <Col span={4}>
          <Button shape="circle" disabled={this.state.isFixedCall} icon={this.state.isFixedCall ? "shake" : "customer-service"} style={{display: (action === '2' && fixedPhone && callFixedPhone) ? 'inline-block' : 'none'}} onClick={()=>this.handleCallPhone(callFixedPhone, 3)}>
          </Button>
        </Col>
      </Row>
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="微信"
      className={style.formItem}
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
      className={style.formItem}
    >
      <Row gutter={8}>
        <Col span={20}>
          {getFieldDecorator('qQ', {
            initialValue: qQ,
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
      className={style.formItem}
    >
      <Row gutter={8}>
        <Col span={20}>
          {getFieldDecorator('email', {
            initialValue: email,
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
      className={style.formItem}
    >
      <Row gutter={8}>
        <Col span={20}>
          {getFieldDecorator('fax', {
            initialValue: fax,
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
            <Input placeholder="请输入传真" />
          )}
        </Col>
      </Row>
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="备注"
      className={style.formItem}
    >
      <Row gutter={8}>
        <Col span={20}>
          {getFieldDecorator('remarks', {
            initialValue: remarks,
            rules: [
            {required: false, message: '请填写备注!'},
            ],
          })(
            <TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }}/>
          )}
        </Col>
      </Row>
    </FormItem>
    <FormItem {...tailFormItemLayout}>
      <Row gutter={8}>
        <Col span={4}>
          <Button type="primary" disabled={this.state.isSubmit} className={style.infoSave} onClick={() => { this.handleSave(action) }}>保存</Button>&emsp;
        </Col>
      </Row>
    </FormItem>
      </Form>
    )
  }
}
const ListContactBaseAddForm = Form.create()(ListContactBaseAdd)

export {
  ListContactBaseAddForm,
}
