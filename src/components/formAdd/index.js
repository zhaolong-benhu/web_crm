/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
  Cascader,
  Button,
  Tooltip,
  Icon,
  Row,
  Col,
  Spin,
  message,
  Modal,
} from 'antd'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import DfwsCascader from 'dfws-antd-cascader'
import debounce from 'lodash/debounce';
import { dictUrl } from '../../config'
import style from '../../containers/Detail/style.less'
import store from 'store'
import 'moment/locale/zh-cn'
import {getUrlParam} from '../../util'
import {permissionNamesHas} from '../../util/isAuth'
import { selectExterpriseName } from '../../actions/internationRule'
import {addLabelToCustomer,delLabelToCustomer} from '../../actions/clueDetail'
moment.locale('zh-cn')
const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search;
const { TextArea } = Input;

class ListTextEnterpriseAdd extends Component {
  constructor(props) {
    super(props);
    this.search = debounce(this.search, 800);
    this.labelId = ""
  }
  // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    clueDetail: PropTypes.object,
    parsed: PropTypes.object,
    addClue: PropTypes.func,
    editClue: PropTypes.func,
    checkExterpriseName: PropTypes.func,
    location: PropTypes.object,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    isDisabled: false,
    superiorUnitRequired: false,
    openingTimeRequired: false,
    bShowexterpriseNameList: false,
    exterpriseNameList:[],
    fetching: false,
    addModvisible:false,
    type:1,
    status:1,
    labels:[
        {"name":"大客户","id":"1"},
        {"name":"续约客户","id":"2"},
        {"name":"贵宾","id":"3"},
        {"name":"常联系的客户","id":"4"},
        {"name":"浙江富豪客户张总","id":"5"},
        {"name":"霸气","id":"6"},
    ],
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

  handleWebsiteChange = value => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(
        domain => `${value}${domain}`
      )
    }
    this.setState({ autoCompleteResult })
  }

  handleChange = value => {
  }

  onChange = (date, dateString) => {
  }
  radioOnChange = e => {
    this.setState({
      value: e.target.value,
    })
  }
  operateClue = (action,id,cid) => {
    // const id = this.props.location.state.id
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    // const { id } = parsed

    if (String(action) === '1') {
      this.props.addClue()
    }
    if (String(action) === '2') {
      this.props.editClue(id,cid)
    }
  }

  relaxChange = e => {
    this.props.clueDetail.isBuild = e.target.value;
    if(e.target.value == "1"){
      this.setState({
        openingTimeRequired:true,
      })
    }else{
      this.setState({
        openingTimeRequired:false,
      })
    }
  }
  isCompanyChange = e => {
    this.props.clueDetail.isGroup = e.target.value;

    if(e.target.value === "1"){
      this.setState({
        superiorUnitRequired:true,
      })
    }else{
      this.setState({
        superiorUnitRequired:false,
      })
    }
  }
  companyChange = (value)=> {
    this.setState({
      exterpriseNameList: [],
      fetching: false,
    });
  }

  search = (value) => {
    this.setState({ exterpriseNameList: [], fetching: true });
    this.props.dispatch(
        selectExterpriseName({
            str:value,
        })
    ).then((data)=>{
        if(data && data.data){
          this.setState({ exterpriseNameList:data.data, fetching: false });
        }
    })
  }

  addLabel = (type) => {
      this.setState({
        addModvisible:true,
        mod_title:"新增标签",
        labelName:"",
        type:type,
      })
  }
  editLabel = (v) => {
      this.setState({
          labelName:v.name,
          addModvisible:true,
          labelRemarks:v.remark,
          mod_title:"修改标签",
          defaultConceal:v.status,
          status:v.status,
          type:2,
      })
      this.labelId = v.id;
  }

  hideDeleteModal = () => {
      this.props.dispatch(delLabelToCustomer({
          customerId:getUrlParam('id'),
          poolId:getUrlParam('poolId'),
          id:this.cus_labelId,
      })).then((data)=>{
          if(data && data.code ===0){
              this.props.reFresh();
              return message.success(data.msg);
          }else{
              if(data){
                 return message.error(data.msg);
              }
          }
      })
  }
  deleteLabel = (id) => {
      Modal.confirm({
        title: '确定删除此标签吗?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: this.hideDeleteModal,
        okType: 'danger',
      })
      this.cus_labelId = id;
  }
  onCancel = () => {
      this.setState({
        addModvisible:false,
        labelName:"",
        labelRemarks:"",
      })
      this.labelId = "";
  }
  onOk = () => {
      var values = {
          customerId:getUrlParam('id'),
          poolId:getUrlParam('poolId'),
          type:this.state.type||"",
          labelId:this.state.labelId||this.labelId || "",
          name:this.state.labelName||"",
          status:this.state.type === 1 ? "":this.state.status,
          remark:this.state.labelRemarks||"",
      }
      if(this.state.type === 1){
          if(!this.state.labelId || this.state.labelId === ""){
              return message.error("请选择标签");
          }if(this.state.labelRemarks && this.state.labelRemarks.length>100){
              return message.error("备注内容过长(不超过100个文字)");
          }else {
              this.props.dispatch(addLabelToCustomer({
                  ...values,
              })).then((data)=>{
                  this.setState({
                      addModvisible:false,
                      labelName:"",
                      labelRemarks:"",
                  })
                  this.props.reFresh();
                  return message.success(data.msg);
              })
         }
     }

      if(this.state.type === 2){
          if(!this.state.labelName || this.state.labelName === ""){
              return message.error("请输入标签名称");
          } else if(this.state.labelName && this.state.labelName.length>8){
              return message.error("标签名称内容过长(不超过8个文字)");
          }if(this.state.labelRemarks && this.state.labelRemarks.length>100){
              return message.error("备注内容过长(不超过100个文字)");
          }else {
              this.props.dispatch(addLabelToCustomer({
                  ...values,
              })).then((data)=>{
                  if(data && data.code ===0){
                      this.setState({
                          addModvisible:false,
                          labelName:"",
                          labelRemarks:"",
                      })
                       this.props.reFresh();
                       return message.success(data.msg);
                  }
              })
        }
      }
  }
  handleChange = (value)=> {
      this.setState({
          labelId:`${value}`,
      })
  }
  handleInputChange = (e,type) => {
      if(type === "labelRemarks"){
          this.setState({
              labelRemarks:e.target.value,
          })
      }
      if(type === "labelName"){
          this.setState({
              labelName:e.target.value,
          })
      }
  }
  isConceal = (e) => {
      this.setState({
          status:e.target.value,
      })
  }
  render() {
    const { clueDetail } = this.props
    var repMoneyList = []
    var labelList = []
    var selectlabelList = []
     if(clueDetail){
         repMoneyList = clueDetail.repMoneyList
         labelList = clueDetail.labelList
         selectlabelList = clueDetail.selectlabelList
     }
    const address = clueDetail.address || ''
    const province = address.slice(0, 6)
    const city = address.slice(6, 12)
    const area = address.slice(12, 18)
    // const { action } = this.props.parsed
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let [action] = ['']
    if (JSON.stringify(parsed) === '{}') {
      [action] = [this.props.history.location.state.action]
    } else {
      [action] = [parsed.action]
    }

    const { getFieldDecorator } = this.props.form
    // const { autoCompleteResult } = this.state
    const dateFormat = 'YYYY-MM-DD';
    var superiorUnitStr = " ";
    if(clueDetail){
      superiorUnitStr = clueDetail.superiorUnitStr;
    }
    const topName = getUrlParam('topName');
    var input_disabled = false;
    if((getUrlParam('from') === "0" && getUrlParam('auditStatus') == "2")
    || (getUrlParam('from') === "0" && getUrlParam('status') == "2")
    || (getUrlParam('topName') === "我的公海")
    || (getUrlParam('topName') === "离职员工客户")){
        input_disabled = true;
    }
    return (
      <Form onSubmit={this.handleSubmit}>
      <fieldset disabled={input_disabled}>
        <FormItem className={style.formItem} label="企业名称" disabled={input_disabled}>
        <Row gutter={8}>
        <Col span={22}>
          {getFieldDecorator('enterpriseName', {
            initialValue: clueDetail.enterpriseName,
            rules: [{ required: true, message: '请填写企业名称!' }],
          })(<Input placeholder="请输入企业名称" disabled={input_disabled}/>)}
          </Col>
          <Col span={2}>
            <Button shape="circle" icon="search" onClick={this.props.checkExterpriseName} disabled={input_disabled}>
            </Button>
          </Col>
           </Row>
        </FormItem>
        <FormItem className={style.formItem} label="执照名称" disabled={input_disabled}>
        <Row gutter={8}>
        <Col span={22}>
          {getFieldDecorator('licenseName', {
            initialValue: clueDetail.licenseName,
            rules: [{ required: true, message: '请填写执照名称!' }],
        })(<Input placeholder="请输入执照名称" disabled={input_disabled}/>)}
          </Col>
          <Col span={2}>
            <Button shape="circle" icon="search" onClick={this.props.checkLicenseName} disabled={input_disabled}>
            </Button>
          </Col>
           </Row>
        </FormItem>
        <FormItem className={style.formItem} label="企业所在地">
        <Row gutter={8}>
            {getFieldDecorator('address', {
              initialValue: province ? [province, city, area] : null,
              rules: [
                { type: 'array', required: true, message: '请选择企业所在地!' },
              ],
            })(<DfwsCascader url={dictUrl()} placeholder="请选择企业所在地" changeOnSelect code={['province','city','area']} disabled={input_disabled}/>)}
          </Row>
        </FormItem>
        <FormItem className={style.formItem} label="企业所在地详细地址" hasFeedback>
          {getFieldDecorator('addressDetail', {
            initialValue: clueDetail.addressDetail,
            rules: [{ required: false, message: '请填写企业所在地详细地址!' }],
          })(<Input placeholder="请输入企业所在地详细地址" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="行业类别/企业类型" hasFeedback>
          {getFieldDecorator('industryTypeAndcategory', {
            initialValue: clueDetail.industryType ? [clueDetail.industryType, clueDetail.category] : null,
            rules: [{ type: 'array', required: true, message: '请选择行业类别/企业类型' },{
              validator: (rule, values, callback) => {
                if (values && values[0]) {
                  callback();
                } else {
                  callback('');
                }
              },
            }],
          })(
            <DfwsCascader url={dictUrl()} showSearch placeholder="请选择行业类别/企业类型" changeOnSelect code={['IndustryCategory','FormOfBusinessEnterprise']} disabled={input_disabled} />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="所属类别" hasFeedback>
          {getFieldDecorator('star', {
            initialValue: clueDetail.star||'',
            rules: [{ required: true, message: '请选择所属类别!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="Category"
              placeholder="请选择类别"
              onChange={this.handleChange}
              disabled={input_disabled}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="企业规模" hasFeedback>
          {getFieldDecorator('scale', {
            initialValue: clueDetail.scale||'',
            rules: [{ required: false, message: '请选择企业规模!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="EnterpriseScale"
              placeholder="请选择企业规模"
              onChange={this.handleChange}
              disabled={input_disabled}
              allowClear={false}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="注册资金" hasFeedback>
          {getFieldDecorator('capital', {
            initialValue: clueDetail.capital,
            rules: [{pattern:/^(0|([1-9]\d*))$/,message:'注册资金必须大于0'}],
          })(
            <Input
              type="number"
              style={{ width: '100%' }}
              placeholder="请输入注册资金"
              disabled={input_disabled}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="法人代表" hasFeedback>
          {getFieldDecorator('legalRe', {
            initialValue: clueDetail.legalRe,
            rules: [{ required: false, message: '请填写法人代表!' }],
          })(<Input placeholder="请输入法人代表" disabled={input_disabled}/>)}
        </FormItem>
        <FormItem className={style.formItem} label="成立日期" hasFeedback>
          {getFieldDecorator('establDate', {
            initialValue: clueDetail.establDate?moment(clueDetail.establDate,dateFormat):"",
            rules: [{ required: false, message: '请选择成立日期!' }],
          })(
            <DatePicker style={{width: '100%'}}　format={dateFormat} disabled={input_disabled} />
          )}
        </FormItem>
        <FormItem
          className={style.formItem}
          label={
            <span>
              公司网址&nbsp;
              <Tooltip title="示例：www.veryeast.cn">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          hasFeedback
        >
          {getFieldDecorator('companyWebsite', {
            initialValue: clueDetail.companyWebsite,
            rules: [
              {
                required: false,
                message: '请填写公司网址!',
              },
              {
                pattern: /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
                message: '公司网址格式不正确!',
              },
            ],
          })(<Input placeholder="请输入公司网址" disabled={input_disabled}/>)}
        </FormItem>

        <FormItem className={style.formItem} label="是否筹建" hasFeedback>
          {getFieldDecorator('isBuild', {
            initialValue: clueDetail.isBuild,
            rules: [
              {
                required: true,
                message: '请选择是否筹建',
              },
            ],
          })(
            <RadioGroup style={{width: '100%'}} onChange={this.relaxChange} disabled={input_disabled}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>

        {(()=>{
            if(clueDetail.isBuild === "1"){
                return <FormItem className={style.formItem} label="开业时间" hasFeedback>
                  {getFieldDecorator('openingTime', {
                    initialValue: clueDetail.openingTime?moment(clueDetail.openingTime,dateFormat):"",
                    rules: [{ required: this.state.openingTimeRequired, message: '请选择开业时间!' }],
                  })(
                    <DatePicker style={{width: '100%'}}
                      onChange={this.onChange}
                      disabled={this.state.isDisabled}
                      format={dateFormat}
                      disabled={input_disabled}
                    />
                  )}
                </FormItem>
            }
        })()}

        <FormItem className={style.formItem} label="是否集团" hasFeedback>
          {getFieldDecorator('isGroup', {
            initialValue: clueDetail.isGroup || "0",
          })(
            <RadioGroup style={{width: '100%'}} onChange={this.isCompanyChange} disabled={input_disabled}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem className={clueDetail.isGroup === "1" ? style.formItem:style.hideformItem} label="上级单位" hasFeedback>
          {getFieldDecorator('superiorUnit', {
            initialValue: clueDetail.superiorUnit ? {key:clueDetail.superiorUnit, label:superiorUnitStr} : {key:'', label:''},
            rules: [{ required: this.state.superiorUnitRequired, message: '请选择上级单位!' }],
          })(<Select placeholder="请选择" labelInValue onSearch={this.search} disabled={input_disabled} onChange={this.companyChange} notFoundContent={this.state.fetching ? <Spin size="small" /> : null} filterOption={false} showSearch>
                <Option value="">无</Option>
                {this.state.exterpriseNameList.map((v,i)=>{
                    return <Option key={v.id}>{v.name}</Option>
                })}
            </Select>
          )}
        </FormItem>
        <FormItem className={style.formItem} label="客户来源" hasFeedback>
          {getFieldDecorator('customerSource', {
            initialValue: clueDetail.customerSource||'',
            rules: [{ required: true, message: '请选择客户来源!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="CustomerSource"
              placeholder="请选择客户来源"
              onChange={this.handleChange}
              disabled={input_disabled}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="账号编码" hasFeedback>
          {getFieldDecorator('accountCode', {
            initialValue: clueDetail.accountCode,
            rules: [{ required: false, message: '请填写账号编码!' }],
          })(<Input placeholder="请输入账号编码" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="企业简介" hasFeedback>
          {getFieldDecorator('enterpriseProfile', {
            initialValue: clueDetail.enterpriseProfile,
            rules: [{ required: false, message: '请填写企业简介!' }],
          })(
            <TextArea
              placeholder="请输入企业简介"
              autosize={{ minRows: 5, maxRows: 5 }}
              disabled={input_disabled}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="备注" hasFeedback>
          {getFieldDecorator('remarks', {
            initialValue: clueDetail.remarks,
            rules: [{ required: false, message: '请填写备注!' }],
          })(
            <TextArea
              placeholder="请输入备注"
              autosize={{ minRows: 5, maxRows: 5 }}
              disabled={input_disabled}
            />
          )}
        </FormItem>

        {(topName == "客户管理" || topName == "资源管理" || topName == "我的公海") ?
            <FormItem style={{ minHeight: '40px'}} className={style.formItem} label="客户标签" >
                <div className={style.labels}>
                   {labelList && labelList.map((v,i)=>{
                       if(v.type === 1){
                           return <div className={style.items} title={v.poolName||v.remark||""}>{v.name}</div>
                       }
                   })}
               </div>
            </FormItem>:null
      }

        {(topName == "客户管理" || topName == "资源管理" || topName == "我的公海") ?
            <FormItem style={{ minHeight: '40px'}} className={style.formItem} label="自定义标签" >
                 <div className={style.labels}>
                    {labelList && labelList.map((v,i)=>{
                        if(v.type === 2){
                            return <div className={v.status == 1 ? style.items:style.items2} title={v.poolName||v.remark||""}>{v.name}</div>
                        }
                    })}
                </div>
            </FormItem>:null
         }


       {topName == "我的客户" ?
           <FormItem style={{ minHeight: '40px'}} className={style.formItem} label="客户标签" hasFeedback>
             {getFieldDecorator('label', {
               initialValue: clueDetail.remarks,
               rules: [{ required: false, message: '' }],
             })(
               <div className={style.labels}>
                   {labelList && labelList.map((v,i)=>{
                       if(v.type === 1){
                           return <div className={style.item} key={"label"+i}>
                               <div className={style.labelName} title={v.remark}>{v.name}</div>
                               <Icon
                                 type="delete"
                                 className={style.delete2}
                                 onClick={()=>this.deleteLabel(v.id)}
                                 title="删除"
                               />
                           </div>
                       }
                   })}
                   <div className={style.add} onClick={()=>this.addLabel(1)} title="添加标签">+</div>
               </div>
             )}
           </FormItem>:null
       }
       {topName == "我的客户" ?
           <FormItem style={{ minHeight: '40px'}} className={style.formItem} label="自定义标签" hasFeedback>
             {getFieldDecorator('label', {
               initialValue: clueDetail.remarks,
               rules: [{ required: false, message: '' }],
             })(
               <div className={style.labels}>
                   {labelList && labelList.map((v,i)=>{
                       if(v.type === 2){
                           return <div className={style.item} key={"label"+i}>
                               <div className={style.labelName} title={v.remark}>{v.name}</div>
                               <Icon
                                 type="edit"
                                 className={style.edit}
                                 onClick={()=>this.editLabel(v)}
                                 title="编辑"
                               />
                               <Icon
                                 type="delete"
                                 className={style.delete}
                                 onClick={()=>this.deleteLabel(v.id)}
                                 title="删除"
                               />
                           </div>
                       }
                   })}
                   <div className={style.add} onClick={()=>this.addLabel(2)} title="添加标签">+</div>
               </div>
             )}
           </FormItem>:null
      }

        {repMoneyList && repMoneyList.map((v,i)=>{
          return <FormItem className={style.formItem} label={v.repType === "1"?"推荐价格":"人均价格"} hasFeedback>
          {getFieldDecorator('repMoney', {
            initialValue: v.repMoney,
          })(
            <Input disabled={true} />
          )}
        </FormItem>
        })}


        {/*添加标签弹窗*/}
        <Modal title={this.state.mod_title}
          visible={this.state.addModvisible}
          onOk={this.onOk}
          onCancel={this.onCancel}
          width={600}
        >
        <div className={style.labelMod}>
          {this.state.type === 1 ?
              <div className={style.contrain}>
                  <div className={style.key}>标签名称：</div>
                  <Select className={style.select} placeholder="请选择" onChange={(e)=>this.handleChange(e)}>
                    {selectlabelList && selectlabelList.map((v,i)=>{
                        return <Option key={"labe"+i} value={v.id}>{v.labelName}</Option>
                    })}
                  </Select>
              </div>:
              <div>
                  <div className={style.contrain}>
                      <div className={style.key}>标签名称：</div>
                      <Input placeholder="请输入" className={style.labelInput} value={this.state.labelName} onChange={(e)=>this.handleInputChange(e,"labelName")}/>
                  </div>
                  <div className={style.contrain}>
                      <div className={style.key}>是否公开：</div>
                      <RadioGroup className={style.labelConceal} defaultValue="1"  onChange={this.isConceal}>
                        <Radio value="1">是</Radio>
                        <Radio value="0">否</Radio>
                      </RadioGroup>
                  </div>
              </div>

          }
            <div className={style.contrain}>
                <div className={style.key}>备注：</div>
                <TextArea autosize={{ minRows: 2, maxRows: 4 }} value={this.state.labelRemarks} className={style.value} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,"labelRemarks")} />
            </div>
        </div>
        </Modal>
       {/* <FormItem className={style.formButton}>
          <Button
            type="primary"
            onClick={() => {
              this.operateClue(action,clueDetail.id,clueDetail.customerId)
            }}
            disabled={(getUrlParam('from') === "0" && getUrlParam('auditStatus') == "2") || (getUrlParam('from') === "0" && getUrlParam('status') == "2") ?true:false}
          >
            提交企业线索
          </Button>
          </FormItem>*/}
          </fieldset>
      </Form>
    )
  }
}

class ListTextPersonAdd extends PureComponent {
  // 个人表单提交
  static propTypes = {
    clueDetail: PropTypes.object,
    form: PropTypes.any,
    parsed: PropTypes.object,
    location: PropTypes.object,
    addClue: PropTypes.func,
    editClue: PropTypes.func,
    checkCustomerName: PropTypes.func,
    checkPersonalPhone: PropTypes.func,
    checkWorkPhone: PropTypes.func,
    checkWeChat: PropTypes.func,
    checkIdCard: PropTypes.func,
  }

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    addModvisible:false,
    type:1,
    status:1,
    defaultConceal:"1",
  }
  constructor(props){
      super(props);
      this.labelId = ""
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

  disabledDate = current => {
    return current && current > moment().endOf('day')
  }

  handleWebsiteChange = value => {
    let autoCompleteResult
    if (!value) {
      autoCompleteResult = []
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(
        domain => `${value}${domain}`
      )
    }
    this.setState({ autoCompleteResult })
  }

  handleChange = value => {
  }

  radioOnChange = e => {
    this.setState({
      value: e.target.value,
    })
  }
  operateClue = (action,id,cId) => {
    // const id = this.props.location.state.id
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    // const { id } = parsed
    if (String(action) === '1') {
      this.props.addClue()
    }
    if (String(action) === '2') {
      this.props.editClue(id,cId)
    }
  }
  addLabel = (type) => {
      this.setState({
        addModvisible:true,
        mod_title:"新增标签",
        labelName:"",
        type:type,
      })
  }
  editLabel = (v) => {
      this.setState({
          labelName:v.name,
          addModvisible:true,
          labelRemarks:v.remark,
          mod_title:"修改标签",
          defaultConceal:v.status,
          status:v.status,
          type:2,
      })
      this.labelId = v.id;
  }
  hideDeleteModal = () => {
      this.props.dispatch(delLabelToCustomer({
          customerId:getUrlParam('id'),
          poolId:getUrlParam('poolId'),
          id:this.cus_labelId,
      })).then((data)=>{
          if(data && data.code ===0){
              this.props.reFresh();
              return message.success(data.msg);
          }else{
              if(data){
                 return message.error(data.msg);
              }
          }
      })
  }
  deleteLabel = (id) => {
      Modal.confirm({
        title: '确定删除此标签吗?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: this.hideDeleteModal,
        okType: 'danger',
      })
      this.cus_labelId = id;
  }
  onCancel = () => {
      this.setState({
        addModvisible:false,
        labelName:"",
        labelRemarks:"",
      })
      this.labelId = "";
  }
  onOk = () => {
      var values = {
          customerId:getUrlParam('id'),
          poolId:getUrlParam('poolId'),
          type:this.state.type||"",
          id:this.state.labelId||this.labelId || "",
          name:this.state.labelName||"",
          status:this.state.status,
          remark:this.state.labelRemarks||"",
      }
      if(this.state.type === 1){
          if(!this.state.labelId || this.state.labelId === ""){
              return message.error("请选择标签");
          }if(this.state.labelRemarks && this.state.labelRemarks.length>100){
              return message.error("备注内容过长(不超过100个文字)");
          }else {
              this.props.dispatch(addLabelToCustomer({
                  ...values,
              })).then((data)=>{
                  this.setState({
                      addModvisible:false,
                      labelName:"",
                      labelRemarks:"",
                  })
                  this.props.reFresh();
                  return message.success(data.msg);
              })
         }
     }

      if(this.state.type === 2){
          if(!this.state.labelName || this.state.labelName === ""){
              return message.error("请输入标签名称");
          } else if(this.state.labelName && this.state.labelName.length>8){
              return message.error("标签名称内容过长(不超过8个文字)");
          }if(this.state.labelRemarks && this.state.labelRemarks.length>100){
              return message.error("备注内容过长(不超过100个文字)");
          }else {
              this.props.dispatch(addLabelToCustomer({
                  ...values,
              })).then((data)=>{
                  if(data && data.code ===0){
                      this.setState({
                          addModvisible:false,
                          labelName:"",
                          labelRemarks:"",
                      })
                       this.props.reFresh();
                       return message.success(data.msg);
                  }
              })
        }
      }
  }
  handleChange = (value)=> {
      this.setState({
          labelId:`${value}`,
      })
  }
  handleInputChange = (e,type) => {
      if(type === "labelRemarks"){
          this.setState({
              labelRemarks:e.target.value,
          })
      }
      if(type === "labelName"){
          this.setState({
              labelName:e.target.value,
          })
      }
  }
  isConceal = (e) => {
      this.setState({
          status:e.target.value,
      })
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
  render() {
    const { clueDetail } = this.props
    var labelList = []
    if(clueDetail){
        labelList = clueDetail.labelList
    }
    const [residence, address] = [
      clueDetail.residence || '',
      clueDetail.address || '',
    ]
    const [residenceProvince, residenceCity, residenceArea, addressProvince, addressCity, addressArea] = [
      residence.slice(0, 6),
      residence.slice(6, 12),
      residence.slice(12, 18),
      address.slice(0, 6),
      address.slice(6, 12),
      address.slice(12, 18),
    ]
    const { getFieldDecorator } = this.props.form
    // const { autoCompleteResult } = this.state
    const [props] = [this.props]

    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let [action] = ['']
    if (JSON.stringify(parsed) === '{}') {
      [action] = [this.props.history.location.state.action]
    } else {
      [action] = [parsed.action]
    }
    if (action === '1') {
    }
    let [birthDate, graduateValue, workingLifeStr] = [null, null, null]
    if (action === '2') {
      if (clueDetail.birthday === null || clueDetail.graduationTime === null || clueDetail.workingLifeStr === null) {
        birthDate = clueDetail.birthday?moment(clueDetail.birthday, 'YYYY-MM-DD'):''
        graduateValue = clueDetail.graduationTime?moment(clueDetail.graduationTime, 'YYYY-MM-DD'):''
        workingLifeStr = clueDetail.workingLifeStr?moment(clueDetail.workingLifeStr, 'YYYY-MM-DD'):''
      } else {
        birthDate = moment(clueDetail.birthday, 'YYYY-MM-DD')
        graduateValue = moment(clueDetail.graduationTime, 'YYYY-MM-DD')
        workingLifeStr = moment(clueDetail.workingLifeStr, 'YYYY-MM-DD')
      }
    }
    const dateFormat = "YYYY-MM-DD"
    const topName = getUrlParam('topName');
    var bShowLabel = false
    if(topName === "客户管理" || topName === "资源管理"){
        bShowLabel = true
    }
    var input_disabled = false;
    if((getUrlParam('from') === "0" && getUrlParam('auditStatus') == "2")
    || (getUrlParam('from') === "0" && getUrlParam('status') == "2")
    || (getUrlParam('topName') === "我的公海")
    || (getUrlParam('topName') === "离职员工客户")){
        input_disabled = true;
    }

    return (
      <Form onSubmit={this.handleSubmit} >
       <fieldset disabled={input_disabled}>
        <FormItem className={style.formItem} label="客户姓名">
          <Row gutter={8}>
            <Col xxl={{span: 18}} xl={{span: 16}} md={{ span: 15 }}>
              {getFieldDecorator('customerName', {
                initialValue: clueDetail.customerName,
                rules: [{ required: false, message: '请填写客户姓名!' }],
            })(<Input placeholder="请输入客户姓名" maxLength="40" disabled={input_disabled}/>)}
            </Col>
            {/*
            <Col xxl={{span: 6}} xl={{span: 8}} md={{ span: 9 }}>
              <Button shape="circle" icon="search" onClick={this.props.checkCustomerName}
              disabled={input_disabled}>
              </Button>
            */}
          </Row>
        </FormItem>
        <FormItem className={style.formItem} label="个人手机">
          <Row gutter={8}>
            <Col xxl={{span: 18}} xl={{span: 16}} md={{ span: 15 }}>
              {getFieldDecorator('personalPhone', {
                initialValue: (getUrlParam('from') === "myinternation" && clueDetail.notHide != "1") ? clueDetail.personalPhone&&clueDetail.personalPhone.substr(0,3)+"*********":permissionNamesHas('sys:client:phone')?clueDetail.personalPhone:clueDetail.personalPhone&&clueDetail.personalPhone.substr(0,3)+"*********",
                rules: [
                  {
                    required: false,
                    message: '请填写个人手机!',
                  },
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
            })(<Input placeholder="请输入个人手机" maxLength="11" disabled={input_disabled}/>)}
            </Col>
            <Col xxl={{span: 6}} xl={{span: 8}} md={{ span: 9 }}>
              <Button style={{marginRight:8}} shape="circle" icon="search" onClick={this.props.checkPersonalPhone} disabled={input_disabled}>
              </Button>
              <Button shape="circle" icon={this.state.isPersonCall ? "shake" : "customer-service"}
               style={{display: (action === '2' && clueDetail.personalPhone && clueDetail.callPersonalPhone && (topName==='我的客户' || topName==='协同客户')) ? 'inline-block' : 'none'}} onClick={()=>this.handleCallPhone(clueDetail.callPersonalPhone, 1)}
              disabled={input_disabled || this.state.isPersonCall}>
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem className={style.formItem} label="工作手机">
          <Row gutter={8}>
            <Col xxl={{span: 18}} xl={{span: 16}} md={{ span: 15 }}>
              {getFieldDecorator('workPhone', {
                initialValue: getUrlParam('from') === "myinternation" && clueDetail.notHide != "1" ? clueDetail.workPhone&&clueDetail.workPhone.substr(0,3)+"*********":permissionNamesHas('sys:client:phone')?clueDetail.workPhone:clueDetail.workPhone&&clueDetail.workPhone.substr(0,3)+"*********",
                rules: [
                  {
                    required: false,
                    message: '请填写工作手机!',
                  },
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
            })(<Input placeholder="请输入工作手机" maxLength="11" disabled={input_disabled}/>)}
            </Col>
            <Col xxl={{span: 6}} xl={{span: 8}} md={{ span: 9 }}>
              <Button style={{marginRight:8}} shape="circle" icon="search" onClick={this.props.checkWorkPhone} disabled={input_disabled}>
              </Button>
              <Button shape="circle" icon={this.state.isWorkCall ? "shake" : "customer-service"}
               style={{display: (action === '2' && clueDetail.workPhone &&clueDetail.callWorkPhone && (topName==='我的客户' || topName==='协同客户')) ? 'inline-block' : 'none'}} onClick={()=> this.handleCallPhone(clueDetail.callWorkPhone, 2)} disabled={input_disabled || this.state.isWorkCall}>
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem className={style.formItem} label="微信">
          <Row gutter={8}>
            <Col xxl={{span: 18}} xl={{span: 16}} md={{ span: 15 }}>
              {getFieldDecorator('weChat', {
                initialValue: getUrlParam('from') === "myinternation" && clueDetail.notHide != "1" ? clueDetail.weChat&&clueDetail.weChat.substr(0,3)+"*********":permissionNamesHas('sys:client:phone')?clueDetail.weChat:clueDetail.weChat&&clueDetail.weChat.substr(0,3)+"*********",
                rules: [
                  {
                    required: false,
                    message: '请填写微信!',
                  },
                  {
                    validator(rule, values, callback) {
                      callback(
                        /[\u4E00-\u9FA5]/i.test(values || '') ? `微信号格式错误!` : undefined
                      )
                    },
                  },
                ],
            })(<Input placeholder="请输入微信" maxLength="11" disabled={input_disabled}/>)}
            </Col>
            <Col xxl={{span: 6}} xl={{span: 8}} md={{ span: 9 }}>
              <Button shape="circle" icon="search" onClick={this.props.checkWeChat} disabled={input_disabled}>
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem className={style.formItem} label="身份证">
          <Row gutter={8}>
            <Col xxl={{span: 18}} xl={{span: 16}} md={{ span: 15 }}>
              {getFieldDecorator('idCard', {
                initialValue: clueDetail.idCard,
                rules: [
                  {
                    required: false,
                    message: '请填写身份证!',
                  },
                  {
                    validator(rule, values, callback) {
                      if (values === '' || values === null || values === undefined) {
                        callback()
                      } else {
                        callback(
                          !/^\d{18}|\d{18}$/.test(values || '') ? `身份证格式错误!` : undefined
                        )
                      }
                    },
                  },
                ],
            })(<Input placeholder="请输入身份证" maxLength="18" type="number" disabled={input_disabled} />)}
            </Col>
            <Col xxl={{span: 6}} xl={{span: 8}} md={{ span: 9 }}>
              <Button shape="circle" icon="search" onClick={this.props.checkIdCard} disabled={input_disabled}>
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem className={style.formItem} label="性别" hasFeedback>
          {getFieldDecorator('sex', {
            initialValue: String(clueDetail.sex) || "",
            rules: [{ required: false, message: '请选择性别!' }],
          })(
            <RadioGroup style={{width: '100%'}} onChange={this.handleChange} disabled={input_disabled}>
              <Radio value="1">男</Radio>
              <Radio value="0">女</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem className={style.formItem} label="固定电话">
        <Row gutter={8}>
        <Col xxl={{span: 18}} xl={{span: 16}} md={{ span: 15 }}>
          {getFieldDecorator('fixedPhone', {
            initialValue: getUrlParam('from') === "myinternation" && clueDetail.notHide != "1" ? clueDetail.fixedPhone&&clueDetail.fixedPhone.substr(0,3)+"*********":permissionNamesHas('sys:client:phone')?clueDetail.fixedPhone:clueDetail.fixedPhone&&clueDetail.fixedPhone.substr(0,3)+"*********",
            rules: [
              {
                required: false,
                message: '请填写固定电话!',
              },
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
        })(<Input placeholder="请输入固定电话" maxLength="15" disabled={input_disabled}/>)}
        </Col>
        <Col xxl={{span: 6}} xl={{span: 8}} md={{ span: 9 }}>
        <Button shape="circle" icon={this.state.isFixedCall ? "shake" : "customer-service"}
        style={{marginRight:8,display: (action === '2' && clueDetail.fixedPhone &&clueDetail.callFixedPhone && (topName==='我的客户' || topName==='协同客户')) ? 'inline-block' : 'none'}} onClick={()=>this.handleCallPhone(clueDetail.callFixedPhone, 3)}
        disabled={input_disabled || this.state.isFixedCall}>
        </Button>
      </Col>
      </Row>
        </FormItem>
        <FormItem className={style.formItem} label="QQ" hasFeedback>
          {getFieldDecorator('qQ', {
            initialValue: getUrlParam('from') === "myinternation" && clueDetail.notHide != "1" ? clueDetail.qQ&&clueDetail.qQ.substr(0,3)+"*********":permissionNamesHas('sys:client:phone')?clueDetail.qQ:clueDetail.qQ&&clueDetail.qQ.substr(0,3)+"*********",
            rules: [
              {
                required: false,
                message: '请填写QQ!',
              },
              {
                validator(rule, values, callback) {
                  callback(
                    !/^[0-9]*$/.test(values || '') ? `QQ格式错误!` : undefined
                  )
                },
              },
            ],
        })(<Input placeholder="请输入QQ" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="邮箱" hasFeedback>
          {getFieldDecorator('email', {
            initialValue:  getUrlParam('from') === "myinternation" && clueDetail.notHide != "1" ? clueDetail.email&&clueDetail.email.substr(0,3)+"*********":permissionNamesHas('sys:client:phone')?clueDetail.email:clueDetail.email&&clueDetail.email.substr(0,3)+"*********",
            rules: [
              {
                type: 'email',
                message: '邮箱格式不正确!',
              },
              { required: false, message: '请填写邮箱!' },
            ],
        })(<Input placeholder="请输入邮箱" maxLength="30" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="传真" hasFeedback>
          {getFieldDecorator('fax', {
            initialValue: getUrlParam('from') === "myinternation" && clueDetail.notHide != "1" ? clueDetail.fax&&clueDetail.fax.substr(0,3)+"*********":permissionNamesHas('sys:client:phone')?clueDetail.fax:clueDetail.fax&&clueDetail.fax.substr(0,3)+"*********",
            rules: [
              {
                required: false,
                message: '请填写传真!',
              },
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
        })(<Input placeholder="请输入传真" maxLength="15" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="客户来源" hasFeedback>
          {getFieldDecorator('customerSource', {
            initialValue: clueDetail.customerSource,
            rules: [{ required: true, message: '请选择客户来源!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="CustomerSource"
              placeholder="请选择客户来源"
              onChange={this.handleChange}
              disabled={input_disabled}
              allowClear={false}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="行业类别" hasFeedback>
          {getFieldDecorator('industryType', {
            initialValue: clueDetail.industryType?String(clueDetail.industryType):"",
            rules: [{ required: false, message: '请选择行业类别!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="IndustryCategory"
              placeholder="请选择行业类别"
              onChange={this.handleChange}
              disabled={input_disabled}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="出生年月" hasFeedback>
          {getFieldDecorator('birthday', {
            initialValue: birthDate,
            rules: [{ required: false, message: '请选择出生年月!' }],
        })(<DatePicker style={{width: '100%'}} disabledDate={this.disabledDate} format={dateFormat} disabled={input_disabled} allowClear={false} />)}
        </FormItem>
        <FormItem className={style.formItem} label="毕业院校" hasFeedback>
          {getFieldDecorator('school', {
            initialValue: clueDetail.school,
            rules: [{ required: false, message: '请填写毕业院校!' }],
        })(<Input placeholder="请输入毕业院校" maxLength="30" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="学历" hasFeedback>
          {getFieldDecorator('education', {
            initialValue: clueDetail.educationStr,
            rules: [{ required: false, message: '请选择学历!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="RecordOfFormalSchooling"
              placeholder="请选择学历"
              onChange={this.handleChange}
              disabled={input_disabled}
              allowClear={false}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="毕业时间" hasFeedback>
          {getFieldDecorator('graduationTime', {
            initialValue: graduateValue,
            rules: [{ required: false, message: '请选择毕业时间!' }],
          })(<DatePicker style={{width: '100%'}} onChange={this.onChange} format={dateFormat} disabled={input_disabled} allowClear={false} />)}
        </FormItem>
        <FormItem className={style.formItem} label="工作开始时间" hasFeedback>
          {getFieldDecorator('attackTime', {
            initialValue: workingLifeStr ? moment(workingLifeStr,dateFormat):"",
          })(
            <DatePicker style={{width: '100%'}} placeholder="请选择工作开始时间" format={dateFormat} disabled={input_disabled} allowClear={false}/>
          )}
        </FormItem>
        <FormItem className={style.formItem} label="户口所在地">
          {getFieldDecorator('residence', {
            initialValue: residenceProvince ? [residenceProvince, residenceCity, residenceArea] : null,
            rules: [
              { type: 'array', required: false, message: '请选择户口所在地!' },
            ],
          })(<DfwsCascader url={dictUrl()} placeholder="请选择户口所在地" changeOnSelect code={['province','city','area']} disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="户口所在地详细地址" hasFeedback>
          {getFieldDecorator('residenceDetail', {
            initialValue: clueDetail.residenceDetail,
            rules: [{ required: false, message: '请填写户口所在地详细地址!' }],
        })(<Input placeholder="请输入户口所在地详细地址" maxLength="50" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="现住址">
          {getFieldDecorator('address', {
            initialValue: [addressProvince, addressCity, addressArea],
            rules: [
              { type: 'array', required: false, message: '请选择现住址!' },
            ],
          })(<DfwsCascader url={dictUrl()} changeOnSelect code={['province','city','area']} disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="现住址详细地址">
          {getFieldDecorator('addressDetail', {
            initialValue: clueDetail.addressDetail,
            rules: [{ required: false, message: '请填写现住址详细地址!' }],
          })(<Input placeholder="请输入现住址详细地址" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="民族" hasFeedback>
          {getFieldDecorator('nation', {
            initialValue: clueDetail.nation,
            rules: [{ required: false, message: '请填写民族!' }],
        })(
          <DfwsSelect
            showSearch
            url={dictUrl()}
            code="nation"
            placeholder="请填写民族"
            onChange={this.handleChange}
            disabled={input_disabled}
          />
        )}
        </FormItem>
        <FormItem className={style.formItem} label="性格" hasFeedback>
          {getFieldDecorator('nature', {
            initialValue: clueDetail.nature,
            rules: [{ required: false, message: '请填写性格!' }],
        })(<Input placeholder="请输入性格" maxLength="50" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="血型" hasFeedback>
          {getFieldDecorator('bloodType', {
            initialValue: clueDetail.bloodType,
            rules: [{ required: false, message: '请填写血型!' }],
          })(
            <DfwsSelect
              showSearch
              url={dictUrl()}
              code="BloodGroup"
              placeholder="请填写血型"
              onChange={this.handleChange}
              disabled={input_disabled}
            />
          )}
        </FormItem>
        <FormItem className={style.formItem} label="账号编码" hasFeedback>
          {getFieldDecorator('accountCode', {
            initialValue: clueDetail.accountCode,
            rules: [{ required: false, message: '请填写账号编码!' }],
        })(<Input placeholder="请输入账号编码" maxLength="20" disabled={input_disabled} />)}
        </FormItem>
        <FormItem className={style.formItem} label="备注">
          {getFieldDecorator('remarks', {
            initialValue: clueDetail.remarks,
            rules: [{ required: false, message: '请填写备注!' }],
        })(<TextArea autosize={{ minRows: 2, maxRows: 8 }} placeholder="请输入备注" maxLength="100"  disabled={input_disabled}/>)}
        </FormItem>

        {(topName == "客户管理" || topName == "资源管理" || topName == "我的公海") ?
            <FormItem style={{ minHeight: '40px'}} className={style.formItem} label="客户标签" hasFeedback>
                   <div className={style.labels}>
                       {labelList && labelList.map((v,i)=>{
                           if(v.type === 1){
                               return <div className={style.items}>{v.name}</div>
                           }
                       })}
                   </div>
            </FormItem>:null
        }
        {(topName == "客户管理" || topName == "资源管理" || topName == "我的公海") ?
            <FormItem style={{ minHeight: '40px'}} className={style.formItem} label="自定义标签" hasFeedback>
                    <div className={style.labels}>
                        {labelList && labelList.map((v,i)=>{
                            if(v.type === 2){
                                return <div className={v.type == 1?style.items:style.items2}>{v.name}</div>
                            }
                        })}
                    </div>
            </FormItem>:null
        }

       {topName == "我的客户" ?
           <FormItem style={{ minHeight: '40px'}} className={style.formItem} label="客户标签" hasFeedback>
               <div className={style.labels}>
                   {labelList && labelList.map((v,i)=>{
                       if(v.type === 1){
                           return <div className={style.item} key={"label"+i}>
                               <div className={style.labelName} title={v.name}>{v.name}</div>
                               <Icon
                                 type="delete"
                                 className={style.delete2}
                                 onClick={()=>this.deleteLabel(v.id,i)}
                                 title="删除"
                               />
                           </div>
                       }
                   })}
                   <div className={style.add} onClick={()=>this.addLabel(1)} title="添加标签">+</div>
               </div>
           </FormItem>:null
       }
       {topName == "我的客户" ?
           <FormItem style={{ minHeight: '40px'}} className={style.formItem} label="自定义标签" hasFeedback>
               <div className={style.labels}>
                   {labelList && labelList.map((v,i)=>{
                       if(v.type === 2){
                           return <div className={style.item} key={"label"+i}>
                               <div className={style.labelName} title={v.name}>{v.name}</div>
                               <Icon
                                 type="edit"
                                 className={style.edit}
                                 onClick={()=>this.editLabel(v)}
                                 title="编辑"
                               />
                               <Icon
                                 type="delete"
                                 className={style.delete}
                                 onClick={()=>this.deleteLabel(v.id,i)}
                                 title="删除"
                               />
                           </div>
                       }
                   })}
                   <div className={style.add} onClick={()=>this.addLabel(2)} title="添加标签">+</div>
               </div>
           </FormItem>:null
      }
      {/*  <FormItem className={style.formButton}>
          <Button
            type="primary"
            onClick={() => {
              this.operateClue(action,clueDetail.id,clueDetail.customerId)
            }}
            disabled={(getUrlParam('from') === "0" && getUrlParam('auditStatus') == "2") || (getUrlParam('from') === "0" && getUrlParam('status') == "2") ?true:false}
          >
            提交个人线索
          </Button>
          </FormItem>*/}

          {/*添加标签弹窗*/}
          <Modal title={this.state.mod_title}
            visible={this.state.addModvisible}
            onOk={this.onOk}
            onCancel={this.onCancel}
            width={600}
          >
          <div className={style.labelMod}>
            {this.state.type === 1 ?
                <div className={style.contrain}>
                    <div className={style.key}>标签名称：</div>
                    <Select className={style.select} placeholder="请选择"  onChange={(e)=>this.handleChange(e)}>
                      {labelList && labelList.map((v,i)=>{
                          return <Option key={"labe"+i} id={v.id}>{v.labelName}</Option>
                      })}
                    </Select>
                </div>:
                <div>
                    <div className={style.contrain}>
                        <div className={style.key}>标签名称：</div>
                        <Input placeholder="请输入" className={style.labelInput} value={this.state.labelName} onChange={(e)=>this.handleInputChange(e,"labelName")}/>
                    </div>
                    <div className={style.contrain}>
                        <div className={style.key}>是否公开：</div>
                        <RadioGroup className={style.labelConceal} defaultValue={this.state.defaultConceal.toString()}  onChange={this.isConceal}>
                          <Radio value="1">是</Radio>
                          <Radio value="0">否</Radio>
                        </RadioGroup>
                    </div>
                </div>

            }
              <div className={style.contrain}>
                  <div className={style.key}>备注：</div>
                  <TextArea autosize={{ minRows: 2, maxRows: 4 }} value={this.state.labelRemarks} className={style.value} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,"labelRemarks")} />
              </div>
          </div>
          </Modal>
          </fieldset>
      </Form>
    )
  }
}

class ListTime extends Component {
  // 日期选择器
  static propTypes = {
    data: PropTypes.object,
  }

  state = {}

  render() {
    const data = this.props.data
    return (
      <div className={style.formGroup}>
        <label>{data.name}：</label>
        <div className={style.formItem}>
          <DatePicker style={{width: '100%'}} onChange={this.onChange} />
        </div>
      </div>
    )
  }
}

class ListRadio extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  state = {
    value: 1,
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    const data = this.props.data
    const list = data.list
    const props = { ...this.props }
    return (
      <div className={style.formGroup}>
        <label>{data.name}：</label>
        <div className={style.formItem}>
          <RadioGroup
            {...props}
            name="radiogroup"
            style={{width: '100%'}}
            defaultValue={String(data.defaultValue)}
          >
            {list.map((d, i) => {
              return (
                <Radio style={{width: '100%'}} disabled={d.disabled} key={i} value={String(d.value)}>
                  {d.value}
                </Radio>
              )
            })}
          </RadioGroup>
        </div>
      </div>
    )
  }
}

export { ListTextEnterpriseAdd, ListTextPersonAdd, ListTime, ListRadio }
