import React, { Component } from 'react'
import queryString from 'query-string'
import style from '../Detail/style.less'
import PropTypes from 'prop-types'
import Layout from '../Wrap'
import moment, { updateLocale } from 'moment'
import {connect} from 'react-redux'
// import {push} from 'react-router-redux';
import F from '../../helper/tool'
import { Redirect,Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import {
deleteSelect,
} from '../../actions/search'
import ContentWrap from '../Content'
import {getUrlParam} from '../../util'
import { Button, message, Icon, Modal } from 'antd'
import { selectAllContacts, addContactOne, updateContactOne, updateCrmJob,addCrmJob,addContacts,selectCustomerToStock,insertContactsRelation} from '../../actions/clientSystem'
import { ListContactAdd } from '../../components/formContactAdd'
import {default as ColumnRender} from '../../components/TableColumn'
import SPCommand from '../../util/SPCommand'
import ob from '../../util/ajax'
const {Wrap} = Layout

@connect((state) => {
  return {
    search: state.search,
    clueDetail: state.clueDetail,
    clientSystem: state.clientSystem,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
  }
})
class $Contact extends Component {
    state = {
        visible: false,
        value: 2,
        redirect: false,
    }
  static propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    clueDetail: PropTypes.object,
    history: PropTypes.object,
    // push: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    this.outValues = {} // 搜索条件
    this.auditID = [] // 启用禁用的id
    this.editContractBaseValues = {} //修改联系人基本数据
    this.editContractPhoneValues = {} //修改联系人联系方式数据
    this.ContactPhoneMap = [
        {"phone":"","type":"1","contractId":"","isDefault":"0"},
        {"phone":"","type":"2","contractId":"","isDefault":"0"},
        {"phone":"","type":"3","contractId":"","isDefault":"0"},
        {"phone":"","type":"4","contractId":"","isDefault":"0"},
        {"phone":"","type":"5","contractId":"","isDefault":"0"},
        {"phone":"","type":"6","contractId":"","isDefault":"0"},
        {"phone":"","type":"7","contractId":"","isDefault":"0"},
    ]
    this.seniorContact = 0
    this.isFirst = true
  }

  callback = (key) => {
  }

  onCallPhone = (number) => {
    if ('parentIFrame' in window) {
      window.parentIFrame.sendMessage({
        message: 'CRM Call Initialized',
        callNumber: number,
      })
    } else {
      const wsServerURL = 'http://10.10.1.6:8080/WSAgentServer/softphone/processCommand.do';
      const delegatorId = Cookies.get('WS.delegatorId') || ''; // 后期代理 ID
      const ins = Cookies.get('WS.ins') || '';// 获取座席实例
      const phoneNum = number; // 获取外拨的号码
      const ecommand = 'Dial'; // 设定命令为外拨
      const cmd = new SPCommand(null, ecommand, ins, delegatorId);
      cmd.pushParams("phoneNum", phoneNum); // 增加参数
      const strJson = JSON.stringify(cmd);// 生成 json 字符串
      ob.ajax({
        //实际CRM融合时，需要将url替换为WSAgentServer的实际地址
        url : wsServerURL,
        dataType : 'json',
        data : {
          jsonCommand : strJson,
        },
        success : function(data) {
         const res =  JSON.parse(data)
         if (res.errorCode === "Succ") {
          message.success('正在拨打...')
         }
         else {
          if(res.errorCode === 'InvalidIns') {
            message.error('拨打失败，话机未登录')
           }
           else if (res.errorCode === 'DelegatorIdNoMatch') {
            message.error('拨打失败，请刷新后重试')
           }
           else {
            message.error('拨打失败，原因：'+res.errorCode)
           }
         }
        },
      });
    }
  }

  showFormItem = () => { // 表单列表
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let action =getUrlParam('action')
    if (action === '1') {
      return (
        <ListContactAdd
          {...this.props}
          parsed={parsed}
          addContactBase={this.addContactBase}
          addContactPhone={this.addContactPhone}
          setDefault={this.setDefault}
          selectCustomerToStock={this.selectCustomerToStock}
        />
      )
    }
    if (action === '2') {
      return (
        <ListContactAdd
          {...this.props}
          parsed={parsed}
          onCallPhone={this.onCallPhone}
          editContactBase={this.editContactBase}
          addContactPhone={this.addContactPhone}
          setDefault={this.setDefault}
          selectCustomerToStock={this.selectCustomerToStock}
        />
      )
    }
  }

    //隐藏确定提示框
    hideConfirmModal = () => {
        if(this.action === "editContactOne"){
            this.editContactOne(this.editContractBaseValues);
        }
        if(this.action === "ContactPhone"){
            this.editContactPhone(this.editContractPhoneValues);
        }
        if(this.action === "editContactInformation"){
            //建立关系
            this.props.dispatch(insertContactsRelation({
                customerId:this.customerId,
                superiorUnit:getUrlParam('customerId'),
                topicId:getUrlParam('topicId'),
            })).then((data)=>{
                if(data && data.code === 0){
                    //跳入修改联系人页面 进行修改联系人信息
                    this.action = "editContactOne";
                    var url = '/contact/'+this.id+'?id='+this.id+'&customerId='+this.customerId+'&action=2&topName=联系人信息'
                    window.location.href = url;
                }
            })
        }
    }

    //跟进客户名称和个人手机查询是否存在该联系人
    selectCustomerToStock = (personalPhone) => {
        const search = this.props.location.search
        const parsed = queryString.parse(search)

        if(this.isFirst){
            this.props.dispatch(selectCustomerToStock({
                id:parsed.id || this.props.clientSystem.id || '',
                personalPhone:personalPhone,
            })).then((data)=>{
                if(data && data.code === 0){
                    if(data.data && data.data.state === 1){
                        this.isFirst = true;
                        this.id = data.data.crmCustomerIndividual.id;
                        this.customerId = data.data.crmCustomerIndividual.customerId;
                        this.topicId =  data.data.crmCustomerIndividual.topicId;
                        this.action = "editContactInformation";
                        Modal.confirm({
                          title: '系统检测到你输入的客户名称和手机号已存在，是否对已有的联系人进行编辑?',
                          content: '',
                          okText: '确认',
                          cancelText: '取消',
                          onOk: this.hideConfirmModal,
                          okType: 'danger',
                      })
                      setTimeout(()=>{
                          this.isFirst = false;
                      },3000)
                    }
                }else{
                    if(data){
                        return message.error(data.msg)
                    }
                }
            })
        }

    }
    //调用添加联系人接口(修改联系人基本信息)
    editContactOne =  (outValues)=> {
        outValues.seniorContact = this.seniorContact
        if(outValues.personalPhone){
          this.ContactPhoneMap[0].phone = outValues.personalPhone
        }
        if(outValues.workPhone){
            this.ContactPhoneMap[1].phone = outValues.workPhone
        }
        if(outValues.fixedPhone){
            this.ContactPhoneMap[2].phone = outValues.fixedPhone
        }
        if(outValues.weChat){
            this.ContactPhoneMap[3].phone = outValues.weChat
        }
        if(outValues.qQ){
            this.ContactPhoneMap[4].phone = outValues.qQ
        }
        if(outValues.email){
            this.ContactPhoneMap[5].phone = outValues.email
        }
        if(outValues.fax){
            this.ContactPhoneMap[6].phone = outValues.fax
        }
       outValues.phoneList = JSON.stringify(this.ContactPhoneMap)
       outValues.superiorUnit = getUrlParam('customerId'),

        this.props.dispatch(addContactOne({
          ...F.filterUndefind(outValues),
        })).then(data => {
          if (data.code === 0) {
            message.success(data.msg)
            //添加或者修改联系人信息后重新获取接口数据
            this.props.dispatch(selectAllContacts({
              contactsId: getUrlParam('id'),
            }))
            // this.props.history.go(-1)
          } else {
            message.success('修改出错！')
          }
        }).catch(err => {
          console.log(err)
        })
    }

    //联系方式设置默认
    setDefault = (type,value) => {
        if(type != "seniorContact"){
            if (type === "personPhone") {
              this.ContactPhoneMap[0].isDefault = "1";
              this.ContactPhoneMap[1].isDefault = "0";
              this.ContactPhoneMap[2].isDefault = "0";
            }else if (type === "workPhone") {
              this.ContactPhoneMap[0].isDefault = "0";
              this.ContactPhoneMap[1].isDefault = "1";
              this.ContactPhoneMap[2].isDefault = "0";
          }else if(type === "fixedPhone") {
              this.ContactPhoneMap[0].isDefault = "0";
              this.ContactPhoneMap[1].isDefault = "0";
              this.ContactPhoneMap[2].isDefault = "1";
          }
          message.success('设置成功！');
        }else{
            this.seniorContact = value;
        }
    }
    //添加联系人基本信息
    addContactBase = (contactInfo,contactType) => {
     const upData = F.filterUndefind(contactInfo)
      if(contactType === 1){
        const outValues = {
          ...upData,
          sex: parseInt(upData.sex, 10) || '',
          isMarry: parseInt(upData.isMarry, 10) || '',
          haveChildren: parseInt(upData.haveChildren, 10) || '',
          birthday: upData.birthday ? moment(upData.birthday).format('YYYY-MM-DD') : '',
          address: upData.address ? upData.address.join('') : '',
          status: parseInt(upData.status, 10) || '',
          superiorUnit:getUrlParam('customerId'),
          topicId:getUrlParam('topicId'),
        }
        if(outValues.personalPhone){
          this.ContactPhoneMap[0].phone = outValues.personalPhone
        }
        if(outValues.workPhone){
            this.ContactPhoneMap[1].phone = outValues.workPhone
        }
        if(outValues.fixedPhone){
            this.ContactPhoneMap[2].phone = outValues.fixedPhone
        }
        if(outValues.weChat){
            this.ContactPhoneMap[3].phone = outValues.weChat
        }
        if(outValues.qQ){
            this.ContactPhoneMap[4].phone = outValues.qQ
        }
        if(outValues.email){
            this.ContactPhoneMap[5].phone = outValues.email
        }
        if(outValues.fax){
            this.ContactPhoneMap[6].phone = outValues.fax
        }
       outValues.phoneList = JSON.stringify(this.ContactPhoneMap)
       outValues.seniorContact = this.seniorContact
       outValues.id = this.props.clientSystem.id||""
       outValues.customerId = this.props.clientSystem.customerId||""

       var contactWay = false;
       this.ContactPhoneMap.forEach((v,i)=>{
           if(v.phone !== ""){
               contactWay = true;
           }
       })
       if(contactWay){
            // 添加联系人基本信息
             this.props.dispatch(
               addContactOne(outValues)
             ).then(data => {
               if (data.code === 0) {
                 message.success(data.msg)
                 this.props.clientSystem.id = data.data.id
                 this.props.clientSystem.customerId = data.data.customerId
               } else {
                 message.success(data.msg)
               }
             }).catch(err => {
               console.log(err)
             })
       }else{
           return message.error("请至少选择一种联系方式");
       }

     }
      if(contactType === 2){
      let [workingHours,departureTime] = [upData.workingHours[0],upData.workingHours[1]]
      const outValues = {
        ...upData,
        workingHours: workingHours.format('YYYY-MM-DD') || '',
        departureTime: departureTime.format('YYYY-MM-DD') || '',
      }

      const search = this.props.location.search
      const parsed = queryString.parse(search)
      outValues.id = parsed.id
      this.editContractBaseValues = outValues;
      this.action = "editContactOne";
      Modal.confirm({
         title: '当前联系人已经修改，是否保存并同步联系人基本信息?',
         content: '',
         okText: '确认',
         cancelText: '取消',
         onOk: this.hideConfirmModal,
         okType: 'danger',
     })
    }
  }

   //修改联系人基本信息
    editContactBase = (contactInfo,contactType,customerId) => {
      const upData = F.filterUndefind(contactInfo);
      if(contactType === 1){ // 修改联系人基本信息
        // let [workingHours,departureTime] = [upData.workingHours[0],upData.workingHours[1]]
        const outValues = {
          ...upData,
          id:this.props.clientSystem.id || "",
          customerId: this.props.clientSystem.customerId || "",
          birthday: upData.birthday ? moment(upData.birthday).format('YYYY-MM-DD') : '',
          address: upData.address.join('') || '',
          // workingHours: workingHours.format('YYYY-MM-DD') || '',
          // departureTime: departureTime.format('YYYY-MM-DD') || '',
        }
        const search = this.props.location.search
        const parsed = queryString.parse(search)
        outValues.id = parsed.id
        outValues.customerId = parsed.customerId
        outValues.topicId = this.props.clueDetail.topicId
        this.editContractBaseValues = outValues;
        this.action = "editContactOne";
        Modal.confirm({
          title: '当前联系人已经修改，是否保存并同步联系人基本信息?',
          content: '',
          okText: '确认',
          cancelText: '取消',
          onOk: this.hideConfirmModal,
          okType: 'danger',
      })
      }
      if(contactType === 2){// 修改联系人工作信息
        let [workingHours,departureTime] = [upData.workingHours[0],upData.workingHours[1]]
        const outValues = {
          ...upData,
          id: customerId,
          workingHours: workingHours.format('YYYY-MM-DD') || '',
          departureTime: departureTime.format('YYYY-MM-DD') || '',
        }
        this.props.dispatch(updateCrmJob({ // 修改联系人工作信息
          ...F.filterUndefind(outValues),
        })).then(data => {
          if (data.code === 0) {
            message.success(data.msg)
            // this.props.history.go(-1)
          } else {
            message.success('修改出错！')
          }
        }).catch(err => {
          console.log(err)
        })
      }
  }

   //修改工作信息
   editCrmJob = (values) => {
      this.props.dispatch(addCrmJob({values}))
   }

   //添加联系方式
  addContactPhone = (type,values) => {
        if(type == 1){//新增
            // values.contactId = this.props.clientSystem.contactId;
            if(values.personalPhone){
                this.ContactPhoneMap[0].phone = values.personalPhone
            }
            if(values.workPhone){
                this.ContactPhoneMap[1].phone = values.workPhone
            }
            if(values.fixedPhone){
                this.ContactPhoneMap[2].phone = values.fixedPhone
            }
            if(values.weChat){
                this.ContactPhoneMap[3].phone = values.weChat
            }
            if(values.qQ){
                this.ContactPhoneMap[4].phone = values.qQ
            }
            if(values.email){
                this.ContactPhoneMap[5].phone = values.email
            }
            if(values.fax){
                this.ContactPhoneMap[6].phone = values.fax
            }
            this.ContactPhoneMap.forEach((v,i)=>{
                this.ContactPhoneMap[i].contractId = this.props.clientSystem.contactId;
            })
                this.props.dispatch(
                    addContacts({
                        phoneList:JSON.stringify(this.ContactPhoneMap),
                    })
                ).then((data)=>{
                      if(data && data.code ==0){
                          message.success(data.msg)
                      }else {

                      }
                })

        }else{//编辑
            this.action = "ContactPhone";
            this.editContractPhoneValues = values;
            Modal.confirm({
               title: '是否保存并同步联系人联系信息?',
               content: '',
               okText: '确认',
               cancelText: '取消',
               onOk: this.hideConfirmModal,
               okType: 'danger',
           })
        }
    }
  //修改联系方式
  editContactPhone = (values) => {
      values.contactId = this.props.clientSystem.contactId;
      this.props.dispatch(
          addContacts({...values})
      ).then((data)=>{
            if(data && data.code ==0){
                message.success(data.msg)
            }else {

            }
      })
  }

  componentDidMount() {
    this.getInitData();
  }
  getInitData = () => {
    const { page } = this.props.clientSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id,action} = parsed
    if(action === '2'){
      this.props.dispatch(selectAllContacts({ // 初始化list
        contactsId: id,
      }))
    }
  }
  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  render() {
      // if (this.state.redirect) {
      //     var url = `/contact/${this.id}?id=${this.id}&customerId=${this.customerId}&action=2&topName=联系人信息`
      //     return <Redirect push to={url} />; //or <Redirect push to="/sample?a=xxx&b=yyy" /> 传递更多参数
      // }
    return (
      <Layout>
        <Wrap>
          <div className={style.MyClueWrap}>
            <ContentWrap style={{ borderTop: 'none' }}>
              <div className={style.listTitle}>
                <div>
                  {getUrlParam('topName') === "新增联系人"?<Icon type="plus-circle-o" />:null}
                  <span style={{marginLeft:"5px"}}>联系人信息</span>
                </div>
                <div>
                   {getUrlParam('topName') === "新增联系人"?<Button onClick={() => { this.props.history.go(-1) }}>返回</Button>:null}
                </div>
              </div>
              {this.showFormItem()}
            </ContentWrap>
          </div>
        </Wrap>
      </Layout>
    )
  }
}

export default $Contact
