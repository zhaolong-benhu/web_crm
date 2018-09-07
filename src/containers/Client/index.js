import React, { Component } from 'react'
import queryString from 'query-string'
import style from '../Contact/style.less'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import store from 'store'
// import { goBack } from 'react-router-redux';
import Layout from '../Wrap'
import {connect} from 'react-redux'
import { createForm } from 'rc-form'
import Cookies from 'js-cookie'
import F from '../../helper/tool'
import {newWindow} from '../../util/'
import {selectKey,deleteSelect} from '../../actions/search'
import {TableHeaderClient} from '../../components/TableHeaderClient'
import ClientOpreateBtn from '../../components/ClientOpreateBtn'
import AuthRequire from '../../components/AuthRequire'
import { ListTextPersonAdd, ListTextEnterpriseAdd } from '../../components/formAdd'
import {FormBusiList} from '../../components/FormBusiList'
import {FormAssignMentList,FormRequestHelpList,FormApplyDelayList,FormViewAuditList,FormDeleteHelpList} from '../../components/FormAssignMent'
import {default as ColumnRender} from '../../components/TableColumn'
import {FollowDataList,ContactDataList,BusinessDataList,AgreementDataList,GiftDataList,OperateDataList} from '../../components/FormDataList'
import ContentWrap from '../Content'
import { Form, Table, Button, message, Icon, Tabs, Modal, Select, Message, Spin,Row, Col } from 'antd'
import {insertDelay,insertDelayCheck,selectDelayResult} from '../../actions/delaySystem'
import {getClientList, getMyContactList, delContacts, removeClient,selectAllCheneseName,insertAssist,delAssist,insertMyClient} from '../../actions/clientSystem'
import {insertMyClientToPool} from '../../actions/myInternation'
import {getBusinesstList, addOpport, getOpportById,getProductList} from '../../actions/businessSystem'
import {getDeliveryList} from '../../actions/giftSystem'
import {selectOperationLog} from '../../actions/operateSystem'
import {getFollowByContactsId,gettopicList,getRecordConvert,getRecordContent} from '../../actions/followSystem'
import {getInitList} from '../../actions/contractSystem'
import {selectPoolList,addPoolResource} from '../../actions/resourceSystem'
import SPCommand from '../../util/SPCommand'
import {getUrlParam} from '../../util'
import ob from '../../util/ajax'
import {
  getContactorNames,
} from '../../actions/myClient'
import {
  getClueDetail,
  getReptByCustomerId,
  updateClueEnterprise,
  updateCluePerson,
  checkExterpriseName,
  checkLicenseName,
  checkPersonalName,
  checkContactToPersonal,
  checkContactToWork,
  checkContactToweChat,
  checkContactToIdCard,
  selectLabel,
 } from '../../actions/clueDetail'
const {Wrap} = Layout
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItem = Form.Item

@connect((state) => {
  return {
    search: state.search,
    clueDetail: state.clueDetail,
    clientSystem: state.clientSystem,
    businessSystem: state.businessSystem,
    contractSystem: state.contractSystem,
    giftSystem: state.giftSystem,
    operateSystem: state.operateSystem,
    followSystem: state.followSystem,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
    delaySystem: state.delaySystem,
    productList:state.businessSystem.productList,
    selectPoolList:state.resourceSystem.selectPoolList,
    myClient: state.myClient,
  }
})
@createForm()
class $Client extends Component {
  static propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    clueDetail: PropTypes.object,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.outValues = {} // 搜索条件
    this.auditID = [] // 启用禁用的id
  }

  state = {
    visible: false,
    visibleBusi: false,
    visibleAss: false,
    bShowDelayResult:false,
    value: 2,
    columns: [],
    showTitle: '',
    busiData: '',
    showBtnTitle: '',
    tabKey: 0,
    recorText:'录音文件获取中，预计时间1分钟，请耐心等待...',
    call_visible: false,
    phone: '',
    phones: [],
    isCall: false,
    distrBtn:false,
    recordMusic:'',
  }

  deleteClient = (contactId) => {
    Modal.confirm({
       title: '确定删除此联系人吗?',
       content: '',
       okText: '确认',
       cancelText: '取消',
       onOk: this.hideDeleteModal,
       okType: 'danger',
   })
   this.contactId = contactId
  }

  hideDeleteModal = () => {
    const { page } = this.props.clientSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    const contactId = this.contactId
    this.props.dispatch(delContacts({
      id: contactId,
      topicId:this.getUrlParam('topicId'),
    })).then(data => {
      if(data && data.code === -1) message.error(data.msg)
      if(data && data.code === 0) {
        this.props.dispatch(getMyContactList({ // 初始化list
          customerId: id,
          topicId: this.getUrlParam('topicId'),
          pageNum: page.pageNum,
          pageSize: page.pageSize,
        }))
        this.setState({
          visible: false,
        })
        message.success(data.msg)
        // setTimeout(()=>{
        //   window.location.reload()
        // }, 1000)
      }
    })
  }

  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }

  onSelectChange = (key, data) => { // 勾选表格
    data.map((item, index) => {
      // item.length === index ? number += item.number : number += item.number + ','
      const poolId = item.id
      this.poolId = poolId
      this.dataLength = data.length
      return {}
    })
    this.props.dispatch(selectKey(key))
    // this.props.dispatch(selectPoolId(key))
  }

  renderHeaser = () => { // 表格头部
    return (
      <TableHeaderClient />
    )
  }

  handleQuery = () => { // 基本搜索
    const { page } = this.props.clientSystem
    this.props.form.validateFields((err, value) => {
      if(err) return
      const upData = F.filterUndefind(value)
      const outValues = {
        ...upData,
      }
      // this.props.dispatch(getClientList({
      //   pageNum: page.pageNum,
      //   pageSize: page.pageSize,
      //   ...outValues,
      // }))
      this.outValues = outValues
    })
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    // this.props.dispatch(getClientList({
    //   pageNum,
    //   pageSize,
    //   ...this.outValues,
    // }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const crm = store.get('crm')
    let departments = []
    if(crm && crm.user && crm.user.department) {
      departments.push(crm.user.department.deptCode)
      if (crm.user.department.children.length>0) {
        crm.user.department.children.forEach(item=>{
          departments.push(item.deptCode)
        })
      }
    }
    const {id, poolId, topicId, customerCategory, action} = parsed
    if (this.state.tabKey === 2) {
      this.props.dispatch(getMyContactList({ // 联系人信息列表点击分页
        customerId: parsed.id,
        topicId: this.getUrlParam('topicId'),
        pageNum,
        pageSize,
      }))
    }
    if (this.state.tabKey === 3) {

      this.props.dispatch(getFollowByContactsId({ // 跟进信息列表点击分页
        customerId: parsed.id,
        topicId: parsed.topicId,
        pageNum,
        pageSize,
        topicIds:this.props.myClient.topicIds,
      }))
    }
    if (this.state.tabKey === 4) {
      this.props.dispatch(getBusinesstList({ // 商机列表点击分页
        topicId: getUrlParam('topicId'),
        deps: departments,
        customerId: parsed.id,
        pageNum,
        pageSize,
      }))
    }
    if (this.state.tabKey === 5) {
      this.props.dispatch(getInitList({ // 合同记录列表点击分页
        topicId: getUrlParam('topicId'),
        contractClass:3,
        pageNum,
        pageSize,
      }))
    }
    if (this.state.tabKey === 6) {
      this.props.dispatch(getDeliveryList({ // 礼品列表点击分页
        topicId: getUrlParam('topicId'),
        customerId: parsed.id,
        pageNum,
        pageSize,
      }))
    }
    if(this.state.tabKey ===7){
        const { page } = this.props.clientSystem

        const search = this.props.location.search
        const parsed = queryString.parse(search)
        const {id, poolId, topicId, customerCategory, action} = parsed
        this.props.dispatch(selectOperationLog({ // 操作记录
          topicId: getUrlParam('topicId'),
          customerId: parsed.id,
          pageNum,
          pageSize,
        }))
    }
  }

  callback = (key) => {
    if (key === '2') {
      this.setState({
        tabKey: 2,
      })
    }
    if (key === '3') {
      this.setState({
        tabKey: 3,
      })
    }
    if (key === '4') {
      this.setState({
        tabKey: 4,
      })
    }
    if (key === '5') {
      this.setState({
        tabKey: 5,
      })
    }
    if (key === '6') {
      this.setState({
        tabKey: 6,
      })
    }
    if (key === '7') {
      this.setState({
        tabKey: 7,
      })
      const { page } = this.props.clientSystem

      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {id, poolId, topicId, customerCategory, action} = parsed
      this.props.dispatch(selectOperationLog({ // 操作记录
        topicId: getUrlParam('topicId'),
        customerId: parsed.id,
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      }))
    }
  }

  callbackRecord = (key) => {
      this.setState({
        recordtabKey: key,
      })
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

reFresh = () =>{
    const { page } = this.props.clientSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id, poolId, topicId, customerCategory, action} = parsed

    this.props.dispatch(getClueDetail({ // 初级查询详情 数据
      id: id,
      poolId: parsed.poolId || '1',
      topicId: parsed.topicId || '1',
      customerCategory: customerCategory,
    })).then((data)=>{
      if(data && data.code == 0){
        this.setState({
          id:data.data.id,
          customerId:data.data.customerId,
          topicId:data.data.topicId,
        })
      }
    })
}
  showFormItem = () => { // 表单列表
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let action, customerCategory
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
      customerCategory = this.props.history.location.state.customerCategory
    }else{
      action = parseInt(parsed.action)
      customerCategory = parseInt(parsed.customerCategory)
    }
    if (action === 1 && customerCategory === 1) { // 添加个人线索
      return (
        <ListTextPersonAdd
          {...this.props}
          parsed={parsed}
          addClue={this.addClue}
          checkCustomerName={this.checkPersonalName}
          checkPersonalPhone={this.checkContactToPersonal}
          checkWorkPhone={this.checkContactToWork}
          checkWeChat={this.checkContactToweChat}
          checkIdCard={this.checkContactToIdCard}
          reRresh={this.reRresh}
        />
      )
    }
    if (action === 1 && customerCategory === 2) { // 添加企业线索
      return (
        <ListTextEnterpriseAdd
          {...this.props}
          parsed={parsed}
          addClue={this.addClue}
          checkExterpriseName={this.checkExterpriseName}
          checkLicenseName={this.checkLicenseName}
        />
      )
    }
    if (action === 2 && customerCategory === 1) { // 编辑个人线索
      return (
        <ListTextPersonAdd
          {...this.props}
          parsed={parsed}
          clueDetail={this.props.clueDetail}
          form={this.props.form}
          editClue={this.editClue}
          onCallPhone={this.onCallPhone}
          checkCustomerName={this.checkPersonalName}
          checkPersonalPhone={this.checkContactToPersonal}
          checkWorkPhone={this.checkContactToWork}
          checkWeChat={this.checkContactToweChat}
          checkIdCard={this.checkContactToIdCard}
          reFresh={this.reFresh}
        />
      )
    }
    if (action === 2 && customerCategory === 2) { // 编辑企业线索
      return (
        <ListTextEnterpriseAdd
          {...this.props}
          parsed={parsed}
          clueDetail={this.props.clueDetail}
          form={this.props.form}
          editClue={this.editClue}
          checkExterpriseName={this.checkExterpriseName}
          checkLicenseName={this.checkLicenseName}
          reFresh={this.reFresh}
        />
      )
    }
  }


  checkExterpriseName = (rule, value, callback) => { // 企业名称查重
    const form = this.props.form
    const enterpriseName = form.getFieldValue('enterpriseName')
    const address = form.getFieldValue('address')?form.getFieldValue('address').join(''):""
    if (enterpriseName === undefined || enterpriseName === '') {
      message.error('请填写企业名称!')
    } else if(address === undefined || address === ''){
        message.error('请选择企业地址!')
    } else {
      this.props.dispatch(checkExterpriseName({ // 企业线索名称
        exterpriseName: enterpriseName,
        address: address,
      })).then(data => {
        if (data.code === 0) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
        }
      }).catch(err => {
      })
    }
  }

  checkLicenseName = (rule, value, callback) => {
      const form = this.props.form
      const licenseName = form.getFieldValue('licenseName')
      const address = form.getFieldValue('address')?form.getFieldValue('address').join(''):""
      if (licenseName === undefined || licenseName === '') {
        message.error('请填写营业执照!')
    } else if(address === undefined || address === ''){
        message.error('请选择企业地址!')
    }else {
        this.props.dispatch(checkLicenseName({ // 企业线索名称
          licenseName: licenseName,
          address: address,
        })).then(data => {
          if (data.code === 0) {
            message.success(data.msg)
          } else {
            message.success(data.msg)
          }
        }).catch(err => {
        })
      }
  }

  checkPersonalName = (rule, value, callback) => { // 客户姓名查重
    const form = this.props.form
    const customerName = form.getFieldValue('customerName')
    if (customerName === undefined || customerName === '') {
      message.error('请填写客户姓名!')
    } else {
      this.props.dispatch(checkPersonalName({
        customerName: customerName,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkContactToPersonal = (rule, value, callback) => { // 个人手机查重
    const form = this.props.form
    const personalPhone = form.getFieldValue('personalPhone')
    if (personalPhone === undefined || personalPhone === '') {
      message.error('请填写个人手机!')
    } else {
      this.props.dispatch(checkContactToPersonal({
        personalPhone: personalPhone,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkContactToWork = (rule, value, callback) => { // 工作手机查重
    const form = this.props.form
    const workPhone = form.getFieldValue('workPhone')
    if (workPhone === undefined || workPhone === '') {
      message.error('请填写工作手机!')
    } else {
      this.props.dispatch(checkContactToWork({
        workPhone: workPhone,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkContactToweChat = (rule, value, callback) => { // 个人微信号查重
    const form = this.props.form
    const weChat = form.getFieldValue('weChat')
    if (weChat === undefined || weChat === '') {
      message.error('请填写微信!')
    } else {
      this.props.dispatch(checkContactToweChat({
        weChat: weChat,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkContactToIdCard = (rule, value, callback) => { // 个人身份证查重
    const form = this.props.form
    const idCard = form.getFieldValue('idCard')
    if (idCard === undefined || idCard === '') {
      message.error('请填写身份证!')
    } else {
      this.props.dispatch(checkContactToIdCard({
        idCard: idCard,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  editClue = (id,customerId) => { // 编辑线索
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {customerCategory} = parsed
    this.props.form.validateFields((err, values) => {
      if (err) return
      const upData = F.filterUndefind(values)
      if (customerCategory === '2') {
        const outValues = {
          ...upData,
          id: getUrlParam('topName') == "我的客户"? this.state.id:id,
          customerId:customerId||getUrlParam('id'),
          industryType: parseInt(upData.industryTypeAndcategory[0], 10) || '',
          category: parseInt(upData.industryTypeAndcategory[1], 10) || '',
          star: parseInt(upData.star, 10) || '',
          scale: parseInt(upData.scale, 10) || '',
          capital: parseInt(upData.capital, 10) || '',
          isBuild: parseInt(upData.isBuild, 10) || 0,
          isGroup: parseInt(upData.isGroup, 10) || 0,
          customerSource: parseInt(upData.customerSource, 10) || '',
          superiorUnit: upData.superiorUnit && upData.superiorUnit.key ? parseInt(upData.superiorUnit.key, 10) : 0,
          establDate: upData.establDate ? upData.establDate.format('YYYY-MM-DD') : '',
          openingTime: upData.openingTime ? upData.openingTime.format('YYYY-MM-DD') : '',
          address: upData.address ? upData.address.join('') : '',
        }
        this.props.dispatch(updateClueEnterprise({ // 编辑企业线索
          ...customerCategory,
          ...F.filterUndefind(outValues),
        })).then(data => {
          if (data) {
            message.success(data.msg)
            setTimeout(()=>{
                this.props.history.go(-1)
            },1000)
          }
        })
      }
      if (customerCategory === '1') {
        //  birthday: moment(upData.birthday || moment()).format('YYYY-MM-DD'),
        const outValues = {
          ...upData,
          id: getUrlParam('topName') == "我的客户"? this.state.id:id,
          customerId:customerId||getUrlParam('id'),
          sex: parseInt(upData.sex, 10) === 1 ? 1 : parseInt(upData.sex, 10) === 0 ? 0:'',
          customerSource: parseInt(upData.customerSource, 10) || '',
          education: parseInt(upData.education, 10) || '',
          workingLife: parseInt(upData.workingLife, 10) || '',
          birthday: upData.birthday ? upData.birthday.format('YYYY-MM-DD') : '',
          graduationTime: upData.graduationTime ? upData.graduationTime.format('YYYY-MM-DD') : '',
          attackTime: upData.attackTime ? upData.attackTime.format('YYYY-MM-DD') : '',
          residence: upData.residence ? upData.residence.join('') : '',
          address: upData.address ? upData.address.join('') : '',
        }
        this.props.dispatch(updateCluePerson({ // 编辑个人线索
          ...customerCategory,
          ...F.filterUndefind(outValues),
        })).then(data => {
          if (data && data.code === 0) {
            message.success(data.msg)
            setTimeout(()=>{
                this.props.history.go(-1)
            },1000)
          } else {
              if(data){
                  message.error(data.msg)
              }
          }
        })
      }
    })
  }

  showFormBusi =() => {
    const { visibleBusi, showTitle, action, busiData} = this.state
    if (action === 1 || action == 3) { //新增商机
      return (
        <FormBusiList
          ref={(form) => this.formBusi = form}
          title={showTitle}
          visible={visibleBusi}
          {...this.props}
          cancle={this.handleCancel}
          ok={this.saveOk}
          busiData={busiData}
          action={action}
          zl="zl"
        />
      )
    }
    if (action === 2) { //修改商机
      return (
        <FormBusiList
          ref={(form) => this.formBusi = form}
          title={showTitle}
          visible={visibleBusi}
          {...this.props}
          cancle={this.handleCancel}
          ok={this.saveOk}
          busiData={busiData}
          action={action}
        />
      )
    }
  }

  saveOk = (value,action,bId) => {
    if (value.esMoney === undefined || value.esMoney === '') {
      message.error('请填写预计销售金额')
      return
    }
    if (value.esBillDate === undefined || value.esBillDate === '') {
      message.error('请选择预计签单日期')
      return
    }
    // if (value.products === undefined || value.products === '') {
    //   message.error('请填写关联产品')
    //   return
    // }
    if (value.busType === undefined || value.busType === '') {
      message.error('请选择商机类型')
      return
    }
    if (value.busStatus === undefined || value.busStatus === '') {
      message.error('请选择商机状态')
      return
    }
    if (value.busSource === undefined || value.busSource === '') {
      message.error('请选择商机来源')
      return
    }
    const { page } = this.props.clientSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    const crm = store.get('crm')
    let departments = []
    if(crm && crm.user && crm.user.department) {
      departments.push(crm.user.department.deptCode)
      if (crm.user.department.children.length>0) {
        crm.user.department.children.forEach(item=>{
          departments.push(item.deptCode)
        })
      }
    }
    const upData = F.filterUndefind(value)
    const outValues = {
      customerId: id,
      topicId:this.getUrlParam('topicId')||"",
      userName: value.userName || '',
      esMoney: value.esMoney || '',
      esBillDate: upData.esBillDate ? upData.esBillDate.format('YYYY-MM-DD') : '',
      products: value.products || '',
      type: value.busType || '',
      status: value.busStatus || '',
      busSource: value.busSource || '',
      remarks: value.remarks || '',
    }
    if (action === 1 || action === 3) {
      this.props.dispatch(addOpport({
        ...F.filterUndefind(outValues),
      })).then(data => {
        if (data) {
          message.success(data.msg)
          this.handleCancel()
          this.props.dispatch(getBusinesstList({ // 初始化list
            topicId: getUrlParam('topicId'),
            deps: departments,
            customerId: id,
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          }))
        }
      })
    }
    if (action === 2) {
      this.props.dispatch(addOpport({
        id: bId,
        ...F.filterUndefind(outValues),
      })).then(data => {
        if (data) {
          message.success(data.msg)
          this.handleCancel()
          this.props.dispatch(getBusinesstList({ // 初始化list
            topicId: getUrlParam('topicId'),
            deps: departments,
            customerId: parsed.id,
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          }))
        }
      })
    }
  }

  addBusiness = () => {
    this.setState({
      visibleBusi: true,
      showTitle: '新增商机',
      action: 1,
    })
  }

  addContract = () => {
      const url = `/CRM/contractSystem`
      return <ColumnRender.NewTable text="text"  url={url} />
  }


  updateBusiness = (bId) => {
    this.props.dispatch(getOpportById({
      id:bId,
    })).then(data => {
      this.setState({
        busiData: data.data,
        visibleBusi: true,
        showTitle: '修改商机',
        action: 2,
      })
    })
  }

  onOk = () =>{
      this.setState({
          recordModvisible:false,
      })
  }

  componentDidMount() {
    const { page } = this.props.clientSystem

    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id, poolId, topicId, customerCategory, action} = parsed

    // this.props.dispatch(getClientList({ // 初始化lis
    //   pageNum: page.pageNum,
    //   pageSize: page.pageSize,
    // }))
    this.props.dispatch(getMyContactList({ // 联系人信息
      topicId: getUrlParam("topName") === "资源管理"?"":getUrlParam('topicId'),
      customerId: parsed.id,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    const crm = store.get('crm')
    let departments = []
    let code = ''
    if(crm && crm.user && crm.user.department) {
      code = crm.user.department.deptCode
      departments.push(crm.user.department.deptCode)
      if (crm.user.department.children.length>0) {
        crm.user.department.children.forEach(item=>{
          departments.push(item.deptCode)
        })
      }
    }
    let topicList = [];
    let topicIds = [];
    if (crm && crm.user && crm.user.permissions) {
      crm.user.permissions.forEach((item)=>{
        if (item.type === 'O' && item.permCode.indexOf('sys:myclient:tp') > -1) {
          topicList.push({id:item.id, name: item.name, checked: false})
        }
      })
    }
    topicList.forEach((v,i)=>{
        topicIds.push(v.id);
    })
    this.props.myClient.topicIds = topicIds;
    this.props.dispatch(getBusinesstList({ // 商机列表
      topicId: getUrlParam("topName") === "资源管理"?"":getUrlParam('topicId'),
      deps: departments,
      customerId: parsed.id,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    this.props.dispatch(getInitList({ // 合同记录
      topicId: getUrlParam('topicId'),
      customerId:this.getUrlParam('id'),
      contractClass:3,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    this.props.dispatch(getDeliveryList({ // 礼品列表
      topicId: getUrlParam("topName") === "资源管理"?"":getUrlParam('topicId'),
      customerId: parsed.id,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    this.props.dispatch(selectOperationLog({ // 操作记录
      topicId: getUrlParam("topName") === "资源管理"?"":getUrlParam('topicId'),
      customerId: parsed.id,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    this.props.dispatch(gettopicList({})) // 所有业务线

    this.props.dispatch(getFollowByContactsId({ // 跟进信息添加获取联系人
      customerId: parsed.id,
      topicId: parsed.topicId,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      topicIds: this.props.myClient.topicIds,
    }))
    // this.props.dispatch(selectAllCheneseName({
    //   code,
    // }))
    this.props.dispatch(selectAllCheneseName({ // 分配至个人
      code,
    })).then(data => {
      const nameData = data.data
      this.nameData = nameData
      this.setState({
        nameList: this.nameData,
      })
    }).catch(err => {
      console.log(err)
    })

    this.props.dispatch(selectPoolList({})) //当公海项发生更改后 需重新获取属性

    // this.props.dispatch(selectDelayResult({
    //   poolId: parsed.poolId,
    //   customerId: parsed.id,
    //   topicId: parsed.topicId,
    // }))

    if (action === '2') {
      this.props.dispatch(getReptByCustomerId({ // 获取爬虫数据
        customerId: id,
      }))

      this.props.dispatch(selectLabel({ // 获取label列表
        poolId: parsed.poolId || '1',
      }))

      this.props.dispatch(getProductList({}))// 获取产品列表

      this.props.dispatch(getClueDetail({ // 初级查询详情 数据
        id: id,
        poolId: parsed.poolId || "",
        topicId: parsed.topicId || "",
        customerCategory: customerCategory,
      })).then((data)=>{
        if(data && data.code == 0){
          this.setState({
            id:data.data.id,
            customerId:data.data.customerId,
            topicId:data.data.topicId,
          })
        }
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  removeClient = (from) => {
    Modal.confirm({
       title: '客户移出之后一段时间内无法再次揽入，是否确认移出?',
       content: '',
       okText: '确认',
       cancelText: '取消',
       onOk: this.hideRemoveModal,
       okType: 'danger',
   })
   this.from = from;
  }

  getInto = () => {
    const {customerId,poolId,topicId} = this.props.clueDetail
    this.props.dispatch(insertMyClient({
      customerId: customerId,
      poolId: poolId,
      topicId: topicId,
      // poolId:
    })).then(data => {
      if(data && data.code != 0) return message.error(data.msg)
      if(data) {
        this.setState({
          visible: false,

        })
        return message.success(data.msg)
      }
    })
  }
  //获取url参数
  getUrlParam = (name )=> {
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
       var r = window.location.search.substr(1).match(reg);
       if (r != null) return unescape(r[2]); return null;
  }
  hideRemoveModal = () => {
    const { page } = this.props.clientSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {clientId} = parsed
    const poolId = this.getUrlParam('poolId')
    const topicId = this.getUrlParam('topicId')
    const customerId = this.getUrlParam('id')

    // return message.error(poolId)

    this.props.dispatch(removeClient({
      // id: clientId,
      poolId:poolId,
      topicId:topicId,
      customerId:customerId,
    })).then(data => {
        if(data && data.code === -1){
            return message.error(data.msg)
        }
      // if(data.code !== 0) return message.error(data.msg)
      if(data) {
        const crm = store.get('crm')
        let departments = []
        if(crm && crm.user && crm.user.department) {
          departments.push(crm.user.department.deptCode)
          if (crm.user.department.children.length>0) {
            crm.user.department.children.forEach(item=>{
              departments.push(item.deptCode)
            })
          }
        }
        this.props.dispatch(getClientList({
          deps: departments,
          pageNum: page.pageNum,
          pageSize: page.pageSize,
        }))
        this.setState({
          visible: false,
        })
         message.success(data.msg)
         setTimeout(() => {
          window.opener=null
          window.close()
          }, 1000);
         // this.props.history.go(-1)
         if(this.from === "我的客户"){
             window.location.href = "/CRM/myClient"
         }else if(this.from === "离职员工客户"){
             window.location.href = "/personnel/ClientToQuit"
         }
      }
    })
  }

  showModalForm = (id, helpId) => {
    const { showBtnTitle,visibleAss,modalType } = this.state
    if (modalType === 1) {
      return (
        <FormApplyDelayList
          title={showBtnTitle}
          visible={visibleAss}
          disabled={false}
          cancle={this.handleCancel}
          numbers={this.numbers}
          ids={this.ids}
          ok={this.saveAssOk}
          {...this.props}
        />
      )
    }
    if (modalType === 2) {
      if(this.state.bShowDelayResult){
         return (
        <FormViewAuditList
          title={showBtnTitle}
          visible={visibleAss}
          disabled={false}
          cancle={this.handleCancel}
          numbers={this.numbers}
          ids={this.ids}
          ok={this.saveAssOk}
          {...this.props}
          delaySystem={this.props.delaySystem}
        />
      )
      }
    }
    if (modalType === 3){

    }
    if (modalType === 8) { //分配至公海
      return (
        <FormAssignMentList
          title={showBtnTitle}
          visible={visibleAss}
          disabled={false}
          cancle={this.handleCancel}
          ok={this.saveAssOk}
          {...this.props}
        />
      )
    }
    if (modalType === 4) {
      return (
        <FormRequestHelpList
          title={showBtnTitle}
          visible={visibleAss}
          disabled={false}
          cancle={this.handleCancel}
          numbers={this.numbers}
          ids={this.ids}
          ok={this.saveAssOk}
          {...this.props}
          value={this.state.value}
        />
      )
    }
    if (modalType === 5) {
      return (
        <FormDeleteHelpList
          title={showBtnTitle}
          visible={visibleAss}
          disabled={false}
          cancle={this.handleCancel}
          numbers={this.numbers}
          ids={this.ids}
          ok={this.saveAssOk}
          {...this.props}
        />
      )
    }
  }

  assignMent = (modalType,from) => {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {delayId} = parsed
    if (modalType === 1) {
      this.state.showBtnTitle = '申请延期'
    }
    if (modalType === 2) {
      this.state.showBtnTitle = '查看审核结果'
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {id, poolId, topicId, customerCategory, action} = parsed
      this.props.dispatch(selectDelayResult({
        poolId: parsed.poolId,
        customerId: parsed.id,
        topicId: parsed.topicId,
      })).then((data)=>{
          if(data && data.code === 0){
            this.setState({
              bShowDelayResult:true,
            })
          }
      })
    }
    if (modalType === 3) {
      // this.state.showBtnTitle = '将客户分配至公海'
      this.setState({
          visible0:true,
      })
    }
    if (modalType === 4) {
      this.state.showBtnTitle = '请求协助'
    }
    if (modalType === 5) {
      this.state.showBtnTitle = '放弃协助'
    }
    if (modalType === 6) {
      let value = {
        delayList: delayId,
        status: 3,
        remark: '',
      }
      this.props.dispatch(insertDelayCheck({
        ...value,
      })).then(data =>{
          if (data) {
            message.success(data.msg)
            this.setState({
                distrBtn:true,
            })
            setTimeout(()=>{
              window.history.go(-1)
            }, 500)
          }
      })
    }
    if (modalType === 7) {
      let value = {
        delayList: delayId,
        status: 2,
        remark: '',
      }
      this.props.dispatch(insertDelayCheck({
        ...value,
      })).then(data =>{
          if (data) {
              this.setState({
                  distrBtn:true,
              })
            message.success(data.msg)
            setTimeout(()=>{
              window.history.go(-1)
            }, 500)
          }
      })
    }
    if(modalType === 8){
        this.state.showBtnTitle = '分配客户'
    }
    if(modalType === 9){
        this.editClue(this.props.clueDetail.id,this.getUrlParam('id'))
    }
    this.setState({
      visibleAss: true,
      showBtnTitle: this.state.showBtnTitle,
      modalType: modalType,
    })
  }

  // requestHelp = (modalType) => {
  //   this.setState({
  //     visibleAss: true,
  //     showBtnTitle: '请求协助',
  //     modalType: modalType,
  //   })
  // }
  viewBusiness = (bId) => {
    this.props.dispatch(getOpportById({
      id:bId,
    })).then(data => {
      if(data && data.code === 0){
        this.setState({
          busiData: data.data,
          visibleBusi: true,
          showTitle: '查看商机',
          action: 2,
        })
      }else{
        if(data){
          message.error(data.msg)
        }
      }

    })
  }

    //查看录音
    conversionRecord = (id,file) =>{
        console.log(file);
        this.setState({
            recordMusic:file,
        })
        this.props.dispatch(getRecordConvert({
            followId:id,
        })).then((data)=>{
            if(data && data.code ===0){
                 if(data.data && data.data.list1 && data.data.list1.length>0){
                     this.setState({
                         recordConvertList:data.data,
                         recorText:'',
                     })
                 }else{
                     this.setState({
                         recordConvertList:null,
                         recorText:'录音文件是空白的，无法转换为文字',
                     })
                 }
            }else{
                if(data){
                    return message.error(data.msg)
                }
            }
        })
        this.setState({
            recordModvisible:true,
        })
    }

    //下载录音
    downloadRecord = (file) => {
        // console.log(file);
        // window.location.href = file
        window.open(file)
        // chrome.downloads.download({
//   url: "http://f3-xz.veimg.cn/special/2017/12/lms_years/src/music/background.mp3",
//   filename: "录音文件" // Optional
// });

// var finalURL = "http://f3-xz.veimg.cn/special/2017/12/lms_years/src/music/background.mav";
// var xhr = new XMLHttpRequest();
// xhr.overrideMimeType("application/octet-stream");
// //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
// xhr.open("GET", finalURL, true);
// xhr.responseType = "arraybuffer";
// xhr.onload = function() {
//   var bb = new (window.BlobBuilder || window.WebKitBlobBuilder)();
//   var res = xhr.response;
//   if (res){
//       var byteArray = new Uint8Array(res);
//   }
//   bb.append(byteArray.buffer);
//   var blob = bb.getBlob("application/octet-stream");
//   var iframe = document.createElement("iframe");
//   iframe.style.display = "none";
//   iframe.src = window.webkitURL.createObjectURL(blob);
//   document.body.appendChild(iframe);
// };
// xhr.send(null);
    }
  saveAssOk = (value) => {
      if(!value.reason){
          value.reason = ''
      }
    if (this.state.modalType === 1 ) {
      if (value.days === undefined || value.days === '' || value.days === null) {
        return message.error('请填写延期天数')
      }
      this.props.dispatch(insertDelay({...value})).then(data => {
        if (data) {
          message.success(data.msg)
          this.handleCancel()
        }
      })
    }
    if (this.state.modalType === 8 ) {
      let userId = ''
      value.map((d,i) => {
        userId = d.userId
      })
      if (userId === undefined || userId === '0') {
        return message.error('请选择人员')
      }
      const clientinfo = JSON.stringify(value)
      this.props.dispatch(insertMyClientToPool({myclientList: clientinfo})).then(data => { //分配
        if (data) {
          message.success(data.msg)
          this.setState({
              distrBtn:true,
          })
          this.handleCancel()
          setTimeout(()=>{
              if(getUrlParam('topName') === "我的客户"){
                  window.location.href = '/CRM/myClient?topName=我的客户'
              }else if(getUrlParam('topName') === "我的公海"){
                  window.location.href = '/CRM/myInternation?topName=我的公海'
              }else if(getUrlParam('topName') === "离职员工客户"){
                  window.location.href = '/personnel/ClientToQuit?topName=离职员工客户'
              }
          },500)
        }
      })
    }
    if (this.state.modalType === 4) {
      if (value.assistPeople === undefined || value.assistPeople === '0') {
        return message.error('请选择人员')
      }
      this.props.dispatch(insertAssist({...value})).then(data => {
        if (data) {
          message.success(data.msg)
          this.handleCancel()
          this.setState({
            value:"",
          })
        }
      })
    }
    if (this.state.modalType === 5) {
      this.props.dispatch(delAssist({...value})).then(data => {
        if (data) {
          message.success(data.msg)
          this.handleCancel()
          setTimeout(()=>{
            window.opener=null
            window.close()
          },1000)
        }
      })
    }
  }

  //查看其它业务线
  getOtherServiceline = (selectList) => {
      const { page } = this.props.clientSystem
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {id, poolId, topicId, customerCategory, action} = parsed

      this.props.dispatch(getFollowByContactsId({ // 跟进信息添加获取联系人
          customerId: parsed.id,
          topicId: parsed.topicId,
          pageNum: page.pageNum,
          pageSize: page.pageSize,
          topicIds: selectList,
      }))

  }
  handleOk = e => {
    // 提交分配到公海
    if(!this.state.poolId){
        return message.info('请选择公海', 1)
    }
      this.props.dispatch(
          addPoolResource({
            cusIds: this.getUrlParam('id'),
            poolId: this.state.poolId,
          })
        ).then(data => {
          if (data && data.code === 0) {
              message.success(data.msg);
            //分配成功
            this.handleCancel()
          } else {
              if(data){
                  return message.info(data.msg, 1)
              }
          }
        })
  }
  call = (customerId) =>{
    this.props.dispatch(getContactorNames({customerId}))
    this.setState({
      call_visible: true,
    })
  }
  handlePhoneChange = (phone) => {
    this.setState({
      phone: phone,
      isCall: false,
    });
  }
  handleCancel = (e) =>{
    this.setState({
      visibleBusi: false,
      visibleAss: false,
      visible0: false,
      recordModvisible:false,
      recordConvertList:null,
      call_visible: false,
      phone: '',
      phones: [],
      isCall: false,
    })
    setTimeout(()=>{
        this.setState({
            recorText:'录音文件获取中，预计时间1分钟，请耐心等待...',
        })
    },1500)
  }
  handleNameChange = (key) => {
    let phones = []
    this.props.myClient.contactors.forEach(item => {
      if(item.key === key.split('|')[0]) {
        phones = item.list
      }
    })
    this.props.form.setFieldsValue({
      phone: 0,
    })
    this.setState({
      phones: phones,
      isCall: false,
    });
  }

  handleCall = (e) =>{
    this.setState({
      isCall: true,
    })
    if ('parentIFrame' in window) {
      window.parentIFrame.sendMessage({
        message: 'CRM Call Initialized',
        callNumber: this.state.phone,
      })
    } else {
      const wsServerURL = 'http://10.10.1.6:8080/WSAgentServer/softphone/processCommand.do';
      const delegatorId = Cookies.get('WS.delegatorId') || ''; // 后期代理 ID
      const ins = Cookies.get('WS.ins') || '';// 获取座席实例
      const phoneNum = this.state.phone; // 获取外拨的号码
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
  handleChangeDis = value => {
    this.setState({ poolId: `${value}` })
  }
  handleBlurDis() {}
  handleFocusDis() {}
  showFormData = () => {
    if (this.state.tabKey === 2) {//联系人信息
      return (
        <ContactDataList
          {...this.props}
          pageChange={this.pageChange}
          onSelectChange={this.onSelectChange}
        />
      )
    }
    if (this.state.tabKey === 3) { //跟进记录
      return (
        <FollowDataList
          {...this.props}
          serviceLine={[1,2,3]}
          pageChange={this.pageChange}
          getOtherServiceline={this.getOtherServiceline}
          conversionRecord={this.conversionRecord}
          downloadRecord={this.downloadRecord}
        />
      )
    }
    if (this.state.tabKey === 4) {//商机记录
      return (
        <BusinessDataList
          {...this.props}
          pageChange={this.pageChange}
          addBusiness={this.addBusiness}
          viewBusiness={this.viewBusiness}
        />
      )
    }
    if (this.state.tabKey === 5) {//合同记录
      return (
        <AgreementDataList
          {...this.props}
          pageChange={this.pageChange}
        />
      )
    }
    if (this.state.tabKey === 6) { //礼品记录
      return (
        <GiftDataList
          {...this.props}
          pageChange={this.pageChange}
        />
      )
    }
    if (this.state.tabKey === 7) {//操作记录
      return (
        <OperateDataList
          {...this.props}
          pageChange={this.pageChange}
        />
      )
    }
  }
  render() {
    const {contactList, contactColumns} = this.props.clientSystem // count, feadBack
    const {businesstList, columns, columnsMyBusi} = this.props.businessSystem
    const {giftList, columnsGift} = this.props.giftSystem
    const {followInfo, columnsFollowInfo} = this.props.followSystem
    const { selectPoolList } = this.props
    const { contactors,contactorLoaded } = this.props.myClient
    const {getFieldDecorator} = this.props.form
    const { selectedRowKeys } = this.props.search
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName,id,topicId} = parsed

    let contactorNames = []

    let contactorPhones = []

    contactorNames = contactors.map(item=>(<Option key={item.id} value={item.key+"|"+item.id}>{item.key}</Option>))
    contactorPhones = this.state.phones.map(item=><Option key={item} value={item}>{item}</Option>)

    if (contactors.length > 0) {
      contactorNames.unshift(<Option key={0} value={0}>请选择联系人</Option>)
      contactorPhones.unshift(<Option key={0} value={0}>请选择联系号码</Option>)
    } else {
      if (contactorLoaded) {
        contactorNames = [<Option key={0} value={0}>未找到联系人</Option>]
        contactorPhones = [<Option key={0} value={0}>请选择联系号码</Option>]
      }
      else {
        contactorNames = [<Option key={0} value={0}>请选择联系人</Option>,this.state.canloading ? <Option key={-1} value={-1}><Spin /></Option> : null]
        contactorPhones = [<Option key={0} value={0}>请选择联系号码</Option>]
      }
    }


    if (topName === '我的客户') {
      columns.forEach((item, index) => {
        if(item.dataIndex === 'busNumber'){
          columns[index].render = (text, record) => {
            return (
              <a onClick={ () => {this.updateBusiness(record.id)}}>{text}</a>
            )
          }
        }
      })

      columnsMyBusi.forEach((item, index) => { //商机记录
        if(item.dataIndex === 'action'){
          // columns[index].sorter = (a, b) => a.busNumber.length - b.busNumber.length
          columnsMyBusi[index].render = (text, record) => {
            return (
              <span>无</span>
            )
          }
        }
      })

      columnsMyBusi.forEach((item, index) => { //商机记录
        if(item.dataIndex === 'status'){
          // columnsMyBusi[index].sorter = (a, b) => a.busNumber.length - b.busNumber.length
          columnsMyBusi[index].render = (text, record) => {
            if (text === 10) {
              return (
                <span>已作废</span>
              )
            }else{
              return (
                <span>正常</span>
              )
            }
          }
        }
      })

      contactColumns.forEach((item, index) => { //联系人信息
        if(item.dataIndex === 'action'){
          contactColumns[index].render = (text, record) => {
            const search = this.props.location.search
            const parsed = queryString.parse(search)
            const topName = parsed.topName
            if (topName === '客户管理') {
              return (
                <span>无</span>
              )
            }
            if (topName === '我的客户') {
              return <a onClick={() => { this.deleteClient(record.id) }}>删除</a>
            }
          }
        }
        if(item.dataIndex === 'contactName'){
          contactColumns[index].render = (text, record) => {
            const search = this.props.location.search
            const parsed = queryString.parse(search)
            const topName = parsed.topName
            const url = `/contact/${record.id}?id=${record.id}&customerId=${record.customerId}&action=2&topName=联系人信息`
            if (topName === '客户管理') {
              return (
                <span>{text}</span>
              )
            }
            if (topName === '我的客户') {
              return (
                <a onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
        }}>{text}</a>
              )
            }
          }
        }
      })

      columnsFollowInfo.forEach((item, index) => { //跟进信息
        if(item.dataIndex === 'action'){
          columnsFollowInfo[index].render = (text, record) => {
            const url = `/follow/${record.id}?id=${record.id}&topicId=${record.topicId}&customerId=${record.customerId}&action=2&topName=跟进信息`
            return (
              <a onClick={(e)=>{
            e.preventDefault()
            newWindow(url, '修改')
          }}>修改</a>
            )
          }
        }
      })
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <Layout>
        <Wrap>
          <div className={style.MyClueWrap}>
            <ContentWrap style={{ borderTop: 'none' }}>
            <div className={style.listTitle}>
              <div>
                <Icon type="bars" className={style.bars} />
                  &ensp;数据列表
                </div>
                <ClientOpreateBtn
                  {...this.props}
                  removeClient={this.removeClient}
                  assignMent={this.assignMent}
                  requestHelp={this.requestHelp}
                  getInto={this.getInto}
                  editClient={this.editClue}
                  distrBtn={this.state.distrBtn}
                />
              </div>
              <div className={style.listHeader}>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="客户信息" key="1">{this.showFormItem()}</TabPane>
                  <TabPane tab="联系人信息" key="2">{this.showFormData()}</TabPane>
                  <TabPane tab="跟进记录" key="3">{this.showFormData()}</TabPane>
                  <TabPane tab="商机记录" key="4">{this.showFormData()}{this.showFormBusi()}</TabPane>
                  <TabPane tab="合同记录" key="5">{this.showFormData()}</TabPane>
                  <TabPane tab="礼品记录" key="6">{this.showFormData()}</TabPane>
                  <TabPane tab="操作记录" key="7">{this.showFormData()}</TabPane>
                </Tabs>
                {this.showModalForm()}
              </div>
            </ContentWrap>
          </div>

          <Modal
            title="将客户分配至公海"
            visible={this.state.visible0}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <div>
              <span>分配至公海：</span>
              {selectPoolList && (
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择公海"
                  optionFilterProp="children"
                  onChange={this.handleChangeDis}
                  onFocus={this.handleFocusDis}
                  onBlur={this.handleBlurDis()}
                  filterOption={(input, option) =>
                    option.props.children
                      .indexOf(input.trim()) >= 0
                  }
                >
                  {selectPoolList.map((d, i) => {
                    return (
                      <Option key={i} value={`${d.id}`}>
                        {d.name}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </div>
          </Modal>

          <Modal title={"查看详情"}
            visible={this.state.recordModvisible}
            onOk={this.onOk}
            onCancel={this.handleCancel}
            width={700}
            footer={null}
          >
          <div className={style.subcontract}>
          <div style={{textAlign:'center'}}>
            <audio src={this.state.recordMusic} controls id="music_record"></audio>
         </div>
            { this.state.recordConvertList ?
                <Tabs defaultActiveKey="0" onChange={this.callbackRecord}>
                        {this.state.recordConvertList && this.state.recordConvertList.list1 && this.state.recordConvertList.list1.length>0?
                            <TabPane tab={"录音1"} key={"0"}>
                                {this.state.recordConvertList.list1.map((v,i)=>{
                                    return <div>{v.text}</div>
                                })}
                            </TabPane>:null
                        }
                        {this.state.recordConvertList && this.state.recordConvertList.list2 && this.state.recordConvertList.list2.length>0?
                            <TabPane tab={"录音2"} key={"1"}>
                                {this.state.recordConvertList.list2.map((v,i)=>{
                                    return <div>{v.text}</div>
                                })}
                            </TabPane>:null
                        }
                        {this.state.recordConvertList && this.state.recordConvertList.list3 && this.state.recordConvertList.list3.length>0?
                            <TabPane tab={"录音3"} key={"2"}>
                                {this.state.recordConvertList.list3.map((v,i)=>{
                                    return <div>{v.text}</div>
                                })}
                            </TabPane>:null
                        }
                </Tabs>:
                <div>
                     <span style={{marginLeft:'15px'}}>{this.state.recorText}</span>
                </div>
            }
          </div>
          </Modal>
          <Modal
          title="拨号"
          destroyOnClose
          footer={null}
          visible={this.state.call_visible}
          onCancel={this.handleCancel}>
          <Form>
            <Row type="flex" justify="center">
              <Col>
                <FormItem label="拨号联系人">
                {getFieldDecorator('contactorNames', {
                  initialValue: 0,
                  rules: [{ required: true, message: '请选择联系人' }],
                })(
                  <Select style={{ width: 200 }} onChange={this.handleNameChange}>
                    {contactorNames}
                  </Select>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <FormItem label="拨号号码">
                {getFieldDecorator('phone', {
                  initialValue: 0,
                  rules: [{ required: true, message: '请选择拨号号码' }],
                })(
                  <Select style={{ width: 200 }} onChange={this.handlePhoneChange}>
                    {contactorPhones}
                  </Select>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <FormItem>
                  <Button type="primary" disabled={this.state.isCall} onClick={this.handleCall}>
                    拨打
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        </Wrap>
      </Layout>
    )
  }
}
const Client = Form.create()($Client)
export default Client
