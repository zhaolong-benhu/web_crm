/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Mention,
  Upload,
  Icon,
  message,
  Checkbox,
  Radio,
  Modal,
  Table,
} from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import style from '../../containers/Detail/style.less'
import {default as ColumnRender} from '../TableColumn'
import TableHeader from '../TableHeader'
import store from 'store'
import 'moment/locale/zh-cn'
import {selectRecord,getConListByCusId} from '../../actions/followSystem'
import { getMyContactList } from '../../actions/clientSystem'
import { dictUrl } from '../../config'
import {getUrlParam,filterOption} from '../../util'
import {newWindow} from '../../util/'
import {connect} from 'react-redux'
moment.locale('zh-cn')
const queryList = store.get('crm:queryList')
const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const Dragger = Upload.Dragger
const RadioGroup = Radio.Group
const { toContentState, getMentions } = Mention
const { TextArea } = Input

// const props = {
//   name: 'file',
//   multiple: true,
//   // action: '//jsonplaceholder.typicode.com/posts/',
//   onChange(info) {
//     const status = info.file.status
//     if (status !== 'uploading') {
//     }
//     if (status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully.`)
//     } else if (status === 'error') {
//       message.error(`${info.file.name} file upload failed.`)
//     }
//   },
// }

@connect((state) => {
  return {
    followContractList:state.followSystem.followContractList,
    followSystem: state.followSystem,
  }
})
class FollowClient extends Component {
  // 企业表单提交
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
    recordModVisible:false,
    autoCompleteResult: [],
    recordidList:[],
    columns:[{
      title: '文件名',
      key: 1,
      checked:true,
      render: (text, record) => {
        const url = "http://10.10.1.9:8080/AgentRec/"+record.filename
        return <a style={{color:'#1ABC9C'}} onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
        }}><span>{record.filename}</span></a>
      },
    }, {
      title: '创建时间',
      dataIndex: 'createtime',
      key: 2,
      checked:true,
    }, {
      title: '通话时长（秒）',
      dataIndex: 'filelength',
      key: 3,
      checked:true,
    }, {
      title: '被叫号码',
      dataIndex: 'callednumber',
      key: 4,
      checked:true,
    }],
    nums: 1,
    radioValue: 0,
  }

  constructor(props){
    super(props)
    this.recordidList = [];
  }
  componentDidMount(){
      this.props.dispatch(getConListByCusId({ // 获取联系人下拉设置
        id: getUrlParam('cusId') || getUrlParam('customerId') || this.props.history.location.state.customerId,
        topicId: getUrlParam('topicId') || this.props.history.location.state.topicId,
    }))
  }
  componentWillReceiveProps(nextProps){
      if(this.props.followDetail !== nextProps.followDetail){
          if(nextProps.followDetail.dataList){
              this.recordidList = nextProps.followDetail.recordRelationList
              this.state.recordidList = nextProps.followDetail.recordRelationList
          }
          if(nextProps.followDetail.follow){
              this.props.form.setFieldsValue({
               customerId: nextProps.followDetail.follow.customerId,
              });
          }
          const {dataList}=nextProps.followDetail
          if (dataList) {
            if(dataList.length > 0) {
              dataList.map((item)=>{
                if (item.type === 1) {
                  this.props.form.setFieldsValue({
                    ['dText-' + item.itemId]: item.content,
                  })
                } else if (item.type === 2) {
                  this.props.form.setFieldsValue({
                    ['dTimeText-' + item.itemId]: item.content,
                  })
                } else if (item.type === 3) {
                  this.props.form.setFieldsValue({
                    ['dSelText-' + item.itemId]: item.content,
                  })
                } else if (item.type === 4) {
                  this.props.form.setFieldsValue({
                    ['dMention-' + item.itemId]: item.content,
                  })
                } else if (item.type === 5) {
                  this.props.form.setFieldsValue({
                    ['dRadioText-' + item.itemId]: item.content,
                  })
                } else if (item.type === 6) {
                  this.props.form.setFieldsValue({
                    ['dChkText-' + item.itemId]: item.content,
                  })
                } else {
                  this.props.form.setFieldsValue({
                    ['dText-' + item.itemId]: item.content,
                  })
                }
              })
            }
          }
      }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = e => {
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

  handleChange = value => {
  }

  onChange = (date, dateString) => {
  }

  handleSave = (action,fid) => {
    let itemId = []
    let [cid,rid,sid,mid,did,tid] = ['','','','','','',''] //cid:复选框id rid:单选框id sid:下拉框id mid:文本域 did:时间文本框id tid:文本框id
    if (this.props.followData) {
      this.props.followData.map((d,i) => {
        if (d.type === 1) {
          tid = d.id
        }
        if (d.type === 2) {
          did = d.id
        }
        if (d.type === 3) {
          sid = d.id
        }
        if (d.type === 4) {
          mid = d.id
        }
        if (d.type === 5) {
          rid = d.id
        }
        if (d.type === 6) {
          cid = d.id
        }
      })
    }

    const {dataList}=this.props.followSystem.followDetail

    this.props.form.validateFields((err, values) => {
      itemId.push(cid,rid,mid,sid,did,tid)
      if (err) return
      if (action === 1) {
        values.recordidList = this.recordidList;
        const topicId=this.props.history.location.state.topicId
        const customerId = this.props.history.location.state.customerId
        this.props.addFollowOne(values, itemId, topicId, customerId, ()=>{
          this.props.form.resetFields();
          this.setState({
              recordidList:[],
          })
        })
      }
      if (action === "2") {
          values.recordidList = this.recordidList;
          var id = getUrlParam('id')
          values.id = id
          const topicId = getUrlParam('topicId')
          const customerId = getUrlParam('customerId')
          this.props.editFollowOne(values, itemId, topicId, customerId, dataList)
      }
    })
  }

  selectRecord = () =>{
    this.setState({
      recordModVisible:true,
    })
  }
  onCancel = () =>{
    this.setState({
      recordModVisible:false,
    })
  }
  onOk = () => {
    this.setState({
      recordModVisible:false,
    })
  }
  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    this.props.dispatch(selectRecord({
      pageNum: pageNum,
      pageSize: pageSize,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    this.props.dispatch(selectRecord({
      pageNum: pageNum,
      pageSize: pageSize,
    }))
  }
  menuSure = (data) => {
    const columns = data.filter(item => item.checked)
    this.setState({columns})
  }
  renderHeaser = () => {
    return (
      <TableHeader
        dataSource={this.state.columns}
        menuSure={this.menuSure}
        upLoadFail={this.upLoadFail}
        submitMoreAudit={this.submitMoreAudit}
        exportDoc={this.exportTable}
        type="contract"
        />
    )
  }
  disabledDate = current => {
    return current && current < moment().endOf('day')
  }
  onSelectChange = (key, data) => { // 勾选表格
    var recordidList = [];
    data.map((v, i) => {
      recordidList.push({recordid:v.recordid,callednumber:v.callednumber,filelength:v.filelength,filename:v.filename})
    })
    this.recordidList = recordidList;
    this.setState({recordidList})
    // this.props. = recordidList;
  }
  //删除选中的录音
  onDeleterecord = (i) => {
    this.recordidList.splice(i,1)
    this.setState({
      recordidList:this.recordidList,
    })
  }
  disabledDate(current) {
    return current < moment().subtract(1,'days').endOf('day');
  }
  handleInputChange(e,v,i){

  }
  render() {
    let followData = []
    if (this.props.followData) {
      followData = this.props.followData
    }
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let [action] = ['']
    if (JSON.stringify(parsed) === '{}') {
      [action] = [this.props.history.location.state.action]
    } else {
      [action] = [parsed.action]
    }
    let [birthValue, followUp, sexSel, marrySel, childrenSel, statusSel] = [
      null,
      '',
      '',
      '',
    ]

    const { getFieldDecorator } = this.props.form
    let plainOptions = []
    followData.map((d,i) => {
      const keyword = d.keyword.split('\n')
      if (d.type === 6) {
        keyword.map((d,i) => {
          plainOptions.push(d)
          // plainOptions = [
          //   { label: d, value: d },
          // ]
        })
      }
    })
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
    const list = this.props.recordData
    const page = this.props.page
    const { columns } = this.state

    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: this.getCheckboxProps,
    }

    let pagination = {
      onChange: this.pageChange,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }
    const {follow,dataList}=this.props.followDetail

    const dateFormat = 'YYYY-MM-DD';
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2 style={{ marginTop: 10 }} className={style.h2Font}>
          跟进信息
        </h2>
        <FormItem {...formItemLayout} label="跟进方式" hasFeedback className={style.formItem}>
          {getFieldDecorator('type', {
            initialValue: (follow && follow.type)?follow.type.toString():"",
            rules: [{ required: true, message: '请选择跟进方式!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="VisitingMode"
              placeholder="请选择跟进方式"
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人" className={style.formItem}>
          {getFieldDecorator('customerId', {
            initialValue: (follow && follow.customerId)?follow.customerId.toString():"",
            rules: [{ required: true, message: '请选择联系人!' }],
          })(
            <Select
              showSearch
              placeholder="请选择联系人"
              optionFilterProp="children"
              onChange={this.handleChange}
              filterOption={(input, option)=>filterOption(input, option)}
            >
              {this.props.followContractList && this.props.followContractList.map((d, i) => {
                return (
                  <Option key={i} value={d.id}>{d.name}</Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        {followData.map((d,i) => {
          if (d.type === 1) {
            return (
              <FormItem {...formItemLayout} label={d.name} key={d.id} className={style.formItem}>
                {getFieldDecorator('dText-' + d.id, {
                  initialValue: '',
                  rules: [{ required: d.isRequired ? true: false, message: '请补充必填项!' }],
                })(
                  <Input />
                )}
              </FormItem>
            )
          }
          if (d.type === 2) {
            return (
              <FormItem {...formItemLayout} label={d.name} key={d.id} className={style.formItem}>
                {getFieldDecorator('dTimeText-' + d.id, {
                  initialValue: '',
                  rules: [{ required: d.isRequired ? true: false, message: '请补充必填项!' }],
                })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </FormItem>
            )
          }
          if (d.type === 3) {
            const keyword = d.keyword.split('\n')
            return (
              <FormItem {...formItemLayout} label={d.name} key={d.id} className={style.formItem}>
                {getFieldDecorator('dSelText-' + d.id, {
                  initialValue: '',
                  rules: [{ required: d.isRequired ? true: false, message: '请补充必填项!'}],
                })(
                  <Select
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) =>option.props.children.indexOf(input.trim()) >= 0}
                  >
                    {
                      keyword.map((d, i) => {
                        return (
                          <Option key={i} value={d}>{d}</Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            )
          }
          if (d.type === 4) {
            return (
              <FormItem {...formItemLayout} label={d.name} key={d.id} className={style.formItem}>
                {getFieldDecorator('dMention-' + d.id, {
                  initialValue: '',
                  rules: [{ required: d.isRequired ? true: false, message: '请补充必填项!' }],
                })(<TextArea style={{ width: '100%', height: 100 }} />)}
              </FormItem>
            )
          }
          if (d.type === 5) {
            const keyword = d.keyword.split('\n')
            return (
              <FormItem {...formItemLayout} label={d.name} key={d.id} className={style.formItem}>
                {getFieldDecorator('dRadioText-' + d.id, {
                  initialValue: '',
                  rules: [{ required: d.isRequired ? true: false, message: '请补充必填项!' }],
                })(
                  <RadioGroup name="radiogroup">
                    {
                      keyword.map((d, i) => {
                        return (
                          <Radio key={i} value={d}>{d}</Radio>
                        )
                      })
                    }
                  </RadioGroup>
                )}
              </FormItem>
            )
          }
          if (d.type === 6) {
            return (
              <FormItem {...formItemLayout} label={d.name} key={d.id} className={style.formItem}>
                {getFieldDecorator('dChkText-' + d.id, {
                  initialValue: '',
                  rules: [{ required: d.isRequired ? true: false, message: '请补充必填项!' }],
                })(
                  <CheckboxGroup options={plainOptions} />
                )}
              </FormItem>
            )
          }
        })}
        <FormItem {...formItemLayout} label="跟进状态" hasFeedback className={style.formItem}>
          {getFieldDecorator('status', {
            initialValue: follow && follow.status?follow.status.toString():"",
            rules: [{ required: false, message: '请选择跟进状态!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="FollowUpStatus"
              placeholder="请选择跟进状态"
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="下次跟进日期" hasFeedback className={style.formItem}>
          {getFieldDecorator('nextFlowTime', {
            initialValue: (follow && follow.nextFlowTime)?moment(follow.nextFlowTime,dateFormat):"",
            rules: [{ required: false, message: '请选择下次跟进日期!' }],
        })(<DatePicker style={{ width: '100%' }} disabledDate={this.disabledDate} onChange={this.onChange} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="预计成交日期" hasFeedback className={style.formItem}>
          {getFieldDecorator('ecDate', {
            initialValue: (follow && follow.ecDate)?moment(follow.ecDate,dateFormat):"",
            rules: [{ required: false, message: '请选择预计成交日期!' }],
          })(<DatePicker style={{ width: '100%' }} disabledDate={this.disabledDate} onChange={this.onChange} />)}
        </FormItem>
        {/* <FormItem {...formItemLayout} label="备注" hasFeedback className={style.formItem}>
          {getFieldDecorator('remarks', {
            initialValue: (follow && follow.remarks)?follow.remarks:"",
            rules: [{ required: false, message: '请填写备注!' }],
          })(<Input placeholder="请输入备注" />)}
        </FormItem> */}
        <FormItem {...formItemLayout} label="录音文件" className={style.formItem}>
          {getFieldDecorator('remarks', {
            // initialValue: clueDetail.remarks,
            rules: [{ required: false, message: '请选择录音文件!' }],
          })(
            <div className={style.record}>
              {this.state.recordidList && this.state.recordidList.map((v,i)=>{
                return  <div className={style.recordItem}>
                <div className={style.item}>{v.callednumber}</div>
                <div className={style.close} title="删除" onClick={(i)=>this.onDeleterecord(i)}>x</div>
              </div>
              })}
              <Button
              onClick={() => {
                this.selectRecord()
              }}>
            选择录音文件
            </Button>
            </div>
           )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Row gutter={8}>
            <Col span={4}>
              <Button
                type="primary"
                onClick={() => {
                  this.handleSave(action)
                }}
              >
                保存
              </Button>
            </Col>
          </Row>
        </FormItem>
        <Modal title={"选择录音文件"}
        visible={this.state.recordModVisible}
        onOk={()=>this.onOk()}
        onCancel={()=>this.onCancel()}
        width={800}
       >
      <div className={style.moduleText}>
         <Table
         onChange={this.handleChange}
         title={this.renderHeaser}
         className={style.table}
         rowSelection={rowSelection}
         columns={columns}
         dataSource={list}
         pagination={pagination}
       />
      </div>
      </Modal>
      </Form>
    )
  }
}

@connect((state) => {
  return {
    followContractList:state.followSystem.followContractList,
  }
})
class GiftClient extends Component {
  // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
    addWorkInfo: PropTypes.func,
    editContactBase: PropTypes.func,
    contactBaseInfo: PropTypes.object,
    location: PropTypes.object,
    giftSystem: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    nums: 1,
    defaultGiftgiver:'',
    isSubmit: false,
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    })
  }
  handleConfirmBlur = e => {
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

  handleChange = value => {
  }

  onChange = (date, dateString) => {
  }

  handleGiftSave = (action, gId) => {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    this.props.form.validateFields((err, values) => {
      values.id = parsed.id
      if (err) return
      this.setState({
        isSubmit: true,
      })
      setTimeout(() => {
        this.setState({
          isSubmit: false,
        })
      }, 3000);
      if (action == 1) {
        this.props.addGiftInfo(values)
      }
      if (action == 2) {
        this.props.editGiftInfo(values)
      }
    })
  }

  onckChange = checkedValues => {
  }
  componentDidMount(){
      this.props.dispatch(getConListByCusId({ // 获取联系人下拉设置
        id: getUrlParam('cusId') || getUrlParam('customerId') || this.props.history.location.state.customerId,
        topicId: getUrlParam('topicId') || this.props.history.location.state.topicId,
    }))

      const crm = store.get('crm')
      if (crm && crm.user && crm.user.id) {
        this.userId = crm.user.id
      }
      // this.props.clientSystem.nameList && this.props.clientSystem.nameList.map((v,i)=>{
      //     if(v.userId == this.userId){
      //         this.setState({
      //             defaultGiftgiver:v.chineseName,
      //         })
      //     }
      // })
  }
  render() {
    const {giftSystem} = this.props
    const { selectContact } = this.props.clientSystem
    const {nameList} = this.props.clientSystem
    const address = selectContact.address || ''
    const province = address.slice(0, 6)
    const city = address.slice(6, 12)
    // const { action } = this.props.parsed
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let [action] = ['']
    if (JSON.stringify(parsed) === '{}') {
      [action] = [this.props.history.location.state.action]
    } else {
      [action] = [parsed.action]
    }

    let [birthValue, sexSel, marrySel, childrenSel, statusSel] = [
      null,
      '',
      '',
      '',
    ]
    if (action === '1') {
      // [birthValue,sexSel,marrySel,childrenSel] = [null,'请选择','请选择','请选择']
    }
    if (action === '2') {
      [birthValue, sexSel, marrySel, childrenSel, statusSel] = [
        moment(selectContact.birth, 'YYYY-MM-DD'),
        String(selectContact.sex),
        String(selectContact.isMarry),
        String(selectContact.haveChildren),
        String(selectContact.status),
      ]
    }
    const { getFieldDecorator } = this.props.form
    const plainOptions = [
      { label: '服务1', value: '1' },
      { label: '服务2', value: '2' },
      { label: '服务3', value: '3' },
      { label: '服务4', value: '4' },
      { label: '服务5', value: '5' },
      { label: '服务6', value: '6' },
      { label: '服务7', value: '7' },
    ]
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
        <h2 style={{ marginTop: 10 }} className={style.h2Font}>
          礼品信息
        </h2>
        <FormItem {...formItemLayout} label="礼物名称" hasFeedback className={style.formItem}>
          {getFieldDecorator('goodsName', {
            initialValue: giftSystem.goodsName || '',
            rules: [{ required: false, message: '请填写礼物名称!' }],
          })(<Input placeholder="请输入礼物名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="礼物总数量" hasFeedback className={style.formItem}>
          {getFieldDecorator('goodsNumber', {
            initialValue: giftSystem.goodsNumber || '',
            rules: [{ required: false, message: '请填写礼物总数量!' }],
          })(<Input placeholder="请输入礼物总数量" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="单位" hasFeedback className={style.formItem}>
          {getFieldDecorator('goodsUnit', {
            initialValue: giftSystem.goodsUnit || '',
            rules: [{ required: false, message: '请填写单位!' }],
          })(<Input placeholder="请输入单位" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="礼物价值" hasFeedback className={style.formItem}>
          {getFieldDecorator('goodsWorth', {
            initialValue: giftSystem.goodsWorth || '',
            rules: [{ required: false, message: '请填写礼物价值!' }],
          })(<Input placeholder="请输入礼物价值" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="送礼人" hasFeedback className={style.formItem}>
          {getFieldDecorator('giver', {
            initialValue: giftSystem.giver?giftSystem.giver.toString() : this.userId && this.userId.toString(),
            rules: [{ required: false, message: '请填写送礼人!' }],
          })(<Select
              showSearch
              placeholder="请选择送礼人"
              optionFilterProp="children"
              onChange={this.handleChange}
              filterOption={(input, option)=>filterOption(input, option)}
            >
              {
                nameList.map((d, i) => {
                  return (
                    <Option key={i} userPinyin={d.userPinyin} value={String(d.userId)}>{d.chineseName}</Option>
                  )
                })
              }
            </Select>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="收件人"
          hasFeedback
          className={style.formItem}
        >
          {getFieldDecorator('addressee', {
            initialValue: giftSystem.addressee?giftSystem.addressee.toString():"",
            rules: [{required: false, message: '请选择收件人!'}],
          })(
            // <Input placeholder="请输入收件人" />
            <Select
              showSearch
              placeholder="请选择收件人"
              optionFilterProp="children"
              onChange={this.handleChange}
              filterOption={(input, option)=>filterOption(input, option)}
            >
              {this.props.followContractList && this.props.followContractList.map((d, i) => {
                return (
                  <Option key={i} value={String(d.id)}>{d.name}</Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="地址" hasFeedback className={style.formItem}>
          {getFieldDecorator('address', {
            initialValue: giftSystem.address,
            rules: [{ required: false, message: '请填写地址!' }],
          })(<Input placeholder="请输入地址" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="邮寄方式" hasFeedback className={style.formItem}>
          {getFieldDecorator('method', {
            initialValue: giftSystem.method ? giftSystem.method.toString() : '',
            rules: [{ required: true, message: '请选择邮寄方式!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="MailingMethod"
              placeholder="请选择邮寄方式"
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="单号" hasFeedback className={style.formItem}>
          {getFieldDecorator('courierNumber', {
            initialValue: giftSystem.courierNumber || '',
            rules: [{ required: false, message: '请填写单号!' }],
          })(<Input placeholder="请输入单号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="快递日期" hasFeedback className={style.formItem}>
          {getFieldDecorator('expresDate', {
            initialValue: giftSystem.expresDate?moment(giftSystem.expresDate, 'YYYY-MM-DD'):'',
            rules: [{ required: false, message: '请选择快递日期!' }],
          })(<DatePicker style={{ width: '100%' }} onChange={this.onChange} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="送礼理由" hasFeedback className={style.formItem}>
          {getFieldDecorator('content', {
            initialValue: giftSystem.content || '',
            rules: [{ required: false, message: '请填写送礼理由!' }],
          })(<Input placeholder="请输入送礼理由" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注" hasFeedback className={style.formItem}>
          {getFieldDecorator('remark', {
            initialValue: giftSystem.remark || '',
            rules: [{ required: false, message: '请填写备注!' }],
          })(<Input placeholder="请输入备注" />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          {/* <Row gutter={8}> */}
            {/* <Col span={6}> */}
              <Button
                type="primary"
                className={style.infoSave3}
                disabled={this.state.isSubmit}
                onClick={() => {
                  this.handleGiftSave(action, selectContact.id)
                }}
              >
                保存
              </Button>&emsp;
            {/* </Col> */}
          {/* </Row> */}
        </FormItem>
      </Form>
    )
  }
}

const FollowClientForm = Form.create()(FollowClient)
const GiftClientForm = Form.create()(GiftClient)
export {
  FollowClientForm,
  GiftClientForm,
}
