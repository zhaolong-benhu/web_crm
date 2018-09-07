/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import queryString from 'query-string'
import style from '../Detail/style.less'
import PropTypes from 'prop-types'
import { Form, Icon, Button, message } from 'antd'
import moment from 'moment'
import Cookies from 'js-cookie'
import { ListTextPersonAdd, ListTextEnterpriseAdd } from '../../components/formAdd'
import StepBar from '../../components/StepBar'
import F from '../../helper/tool'
import Layout from '../Wrap'
import {connect} from 'react-redux'
import ContentWrap from '../Content'
import {getUrlParam,getBigDate} from '../../util'
import {
  getClueDetail,
  addClueEnterprise,
  addCluePerson,
  updateClueEnterprise,
  updateCluePerson,
  checkExterpriseName,
  checkLicenseName,
  checkPersonalName,
  checkContactToPersonal,
  checkContactToWork,
  checkContactToweChat,
  checkContactToIdCard } from '../../actions/clueDetail'
import {userAudit} from '../../actions/clueSystem'
import SPCommand from '../../util/SPCommand'
import ob from '../../util/ajax'
const {Wrap} = Layout

@connect((state) => {
  return {
    clueDetail: state.clueDetail,
  }
})
class $Detail extends Component {
  static propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    clueDetail: PropTypes.object,
    repMoneyList: PropTypes.object,
    history: PropTypes.object,
  }
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    checkNick: false,
    isChk: false,
    bDisable:false,
  };
  check = () => {
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          console.info('success')
        }
      },
    )
  }
  handleChange = (e) => {
    this.setState({
      checkNick: e.target.checked,
    }, () => {
      this.props.form.validateFields(['nickname'], { force: true })
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
          checkCustomerName={this.checkPersonalName}
          checkPersonalPhone={this.checkContactToPersonal}
          checkWorkPhone={this.checkContactToWork}
          checkWeChat={this.checkContactToweChat}
          checkIdCard={this.checkContactToIdCard}
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
        />
      )
    }
  }

  componentDidMount() {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id, customerCategory, action} = parsed

    if (action === '2') {
      this.props.dispatch(getClueDetail({ // 初级查询详情 数据
          id: id,
          customerCategory: customerCategory,
      }))
    }
    // this.props.dispatch(changeInfo)
  }

  checkExterpriseName = (rule, value, callback) => { // 企业名称查重
    const form = this.props.form
    const enterpriseName = form.getFieldValue('enterpriseName')||''
    const address = form.getFieldValue('address')?form.getFieldValue('address').join(''):''
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    let [customerId,action] = ['','']
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
    }else{
      action = parsed.action
    }
    if (action === '1') {
      customerId = ''
    }
    if (action === '2') {
      customerId = id
    }
    if (enterpriseName === undefined || enterpriseName === '') {
      message.error('请填写企业名称!')
    } else {
      this.props.dispatch(checkExterpriseName({ // 企业线索名称
        exterpriseName: enterpriseName,
        address: address,
        customerId: customerId,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
          this.setState({
            isChk: true,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkLicenseName = (rule, value, callback) => { // 执照名称查重
    const form = this.props.form
    const licenseName = form.getFieldValue('licenseName')
    const address = form.getFieldValue('address')?form.getFieldValue('address').join(''):''
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    let [customerId,action] = ['','']
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
    }else{
      action = parsed.action
    }
    if (action === '1') {
      customerId = ''
    }
    if (action === '2') {
      customerId = id
    }
    if (licenseName === undefined || licenseName === '') {
      message.error('请填写执照名称!')
  }else if (address === undefined || address === '') {
      message.error('请选择企业所在地!')
    } else {
      this.props.dispatch(checkLicenseName({ // 企业执照
        licenseName: licenseName,
        address: address,
        customerId: customerId,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
          this.setState({
            isChk: true,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
  //获取url参数
  // getUrlParam = (name )=> {
  //    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  //    var r = window.location.search.substr(1).match(reg);
  //    if (r != null) return unescape(r[2]); return null;
  // }

  checkPersonalName = (rule, value, callback) => { // 客户姓名查重
    const form = this.props.form
    const customerName = form.getFieldValue('customerName')
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    let [customerId,action] = ['','']
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
    }else{
      action = parsed.action
    }
    if (action === '1') {
      customerId = ''
    }
    if (action === '2') {
      customerId = id
    }
    if (customerName === undefined || customerName === '') {
      message.error('请填写客户姓名!')
    } else {
      this.props.dispatch(checkPersonalName({
        customerName: customerName,
        customerId:customerId,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
          this.setState({
            isChk: true,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkContactToPersonal = (rule, value, callback) => { // 个人手机查重
    const form = this.props.form
    const personalPhone = form.getFieldValue('personalPhone')
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    let [customerId,action] = ['','']
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
    }else{
      action = parsed.action
    }
    if (action === '1') {
      customerId = ''
    }
    if (action === '2') {
      customerId = id
    }
    if (personalPhone === undefined || personalPhone === '') {
      message.error('请填写个人手机!')
    } else {
      this.props.dispatch(checkContactToPersonal({
        personalPhone: personalPhone,
        customerId:customerId,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
          this.setState({
            isChk: true,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkContactToWork = (rule, value, callback) => { // 工作手机查重
    const form = this.props.form
    const workPhone = form.getFieldValue('workPhone')
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    let [customerId,action] = ['','']
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
    }else{
      action = parsed.action
    }
    if (action === '1') {
      customerId = ''
    }
    if (action === '2') {
      customerId = id
    }
    if (workPhone === undefined || workPhone === '') {
      message.error('请填写工作手机!')
    } else {
      this.props.dispatch(checkContactToWork({
        workPhone: workPhone,
        customerId:customerId,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
          this.setState({
            isChk: true,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkContactToweChat = (rule, value, callback) => { // 个人微信号查重
    const form = this.props.form
    const weChat = form.getFieldValue('weChat')
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    let [customerId,action] = ['','']
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
    }else{
      action = parsed.action
    }
    if (action === '1') {
      customerId = ''
    }
    if (action === '2') {
      customerId = id
    }
    if (weChat === undefined || weChat === '') {
      message.error('请填写微信!')
    } else {
      this.props.dispatch(checkContactToweChat({
        weChat: weChat,
        customerId:customerId,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
          this.setState({
            isChk: true,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  checkContactToIdCard = (rule, value, callback) => { // 个人身份证查重
    const form = this.props.form
    const idCard = form.getFieldValue('idCard')
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed
    let [customerId,action] = ['','']
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
    }else{
      action = parsed.action
    }
    if (action === '1') {
      customerId = ''
    }
    if (action === '2') {
      customerId = id
    }
    if (idCard === undefined || idCard === '') {
      message.error('请填写身份证!')
    } else {
      this.props.dispatch(checkContactToIdCard({
        idCard: idCard,
        customerId:customerId,
      })).then(data => {
        if (data.code === 10) {
          message.success(data.msg)
        } else {
          message.success(data.msg)
          this.setState({
            isChk: true,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  addClue = () => { // 添加线索
    const {customerCategory} = this.props.history.location.state
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err)
        return
      }

      const upData = F.filterUndefind(values)
      if (customerCategory === 2) {
        const outValues = {
          ...upData,
          industryType: parseInt(upData.industryTypeAndcategory[0], 10) || '',
          category: parseInt(upData.industryTypeAndcategory[1], 10) || '',
          star: parseInt(upData.star, 10) || '',
          scale: parseInt(upData.scale, 10) || '',
          capital: parseInt(upData.capital, 10) || '',
          isBuild: upData.isBuild || '',
          isGroup: parseInt(upData.isGroup, 10) || '',
          customerSource: parseInt(upData.customerSource, 10) || '',
          superiorUnit: upData.superiorUnit && upData.superiorUnit.key ? parseInt(upData.superiorUnit.key, 10) : 0,
          establDate: upData.establDate ? upData.establDate.format('YYYY-MM-DD') : '',
          openingTime: upData.openingTime ? upData.openingTime.format('YYYY-MM-DD') : '',
          attackTime: upData.attackTime ? upData.attackTime.format('YYYY-MM-DD') : '',
          address: upData.address ? upData.address.join('') : '',
        }
        //提交前检验查重
        // if (upData.enterpriseName) {
        //   this.checkExterpriseName(upData.enterpriseName)
        // }
        //提交前检验查重
        this.props.dispatch(addClueEnterprise({ // 添加企业线索
          ...customerCategory,
          ...F.filterUndefind(outValues),
        })).then(data => {
          if (data.code === 0) {
            message.success(data.msg)
            this.props.history.go(-1)
          } else {
            message.success('新增出错！')
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (customerCategory === 1) {
        const outValues = {
          ...upData,
          industryType: parseInt(upData.industryType, 10) || '',
          sex: upData.sex == 0?0:parseInt(upData.sex)|| "" ,
          customerSource: parseInt(upData.customerSource, 10) || '',
          education: parseInt(upData.education, 10) || '',
          workingLife: parseInt(upData.workingLife, 10) || '',
          birthday: upData.birthday ? upData.birthday.format('YYYY-MM-DD') : '',
          graduationTime: upData.graduationTime ? upData.graduationTime.format('YYYY-MM-DD') : '',
          attackTime: upData.attackTime ? upData.attackTime.format('YYYY-MM-DD') : '',
          residence: upData.residence?upData.residence.join('') : '',
          address:upData.address?upData.address.join('') : '',
        }
        //提交前检验查重
        // if (upData.customerName || upData.personalPhone || upData.workPhone || upData.weChat || upData.idCard) {
        //   this.checkPersonalName(upData.customerName)
        //   this.checkContactToPersonal(upData.personalPhone)
        //   this.checkContactToWork(upData.workPhone)
        //   this.checkContactToweChat(upData.weChat)
        //   this.checkContactToIdCard(upData.idCard)
        // }
        //提交前检验查重
        if(!outValues.personalPhone &&
            !outValues.workPhone &&
            !outValues.weChat &&
            !outValues.fixedPhone &&
            !outValues.qQ &&
            !outValues.email &&
            !outValues.fax
        ){
            return message.error("联系方式必须填写一项!")
        }
        this.props.dispatch(addCluePerson({ // 添加个人线索
          ...customerCategory,
          ...F.filterUndefind(outValues),
        })).then(data => {
          if (data.code === 0) {
            message.success(data.msg)
            this.props.history.go(-1)
          } else {
            message.success('新增出错！')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
  }

  // componentDidUpdate() {
  //   console.log(this.props.clueDetail.isOK)
  //   setTimeout(() => {
  //     this.props.clueDetail.isOK && this.props.history.go(-1)
  //   }, 2000)
  // }
  //
  // componentDidMount() {
  //   this.props.dispatch(changeInfo)
  // }

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
          id: id,
          customerId: customerId,
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
          attackTime: upData.attackTime ? upData.attackTime.format('YYYY-MM-DD') : '',
          address: upData.address?upData.address.join('') : '',
        }
        // console.log(JSON.stringify(outValues))
        //提交前检验查重
        // if (upData.enterpriseName) {
        //   this.checkExterpriseName(upData.enterpriseName)
        // }
        //提交前检验查重
        this.props.dispatch(updateClueEnterprise({ // 编辑企业线索
          ...customerCategory,
          ...F.filterUndefind(outValues),
        })).then(data => {
          if (data) {
            message.success(data.msg)
            this.props.history.go(-1)
          }
        })
      }
      if (customerCategory === '1') {
        const outValues = {
          ...upData,
          id: id,
          customerId: customerId,
          industryType: parseInt(upData.industryType, 10) || '',
          sex: upData.sex == 0 ? 0:parseInt(upData.sex,10) || '',
          customerSource: parseInt(upData.customerSource, 10) || '',
          education: parseInt(upData.education, 10) || '',
          workingLife: parseInt(upData.workingLife, 10) || '',
          birthday: upData.birthday ? upData.birthday.format('YYYY-MM-DD') : '',
          graduationTime: upData.graduationTime ? upData.graduationTime.format('YYYY-MM-DD') : '',
          attackTime: upData.attackTime ? upData.attackTime.format('YYYY-MM-DD') : '',
          residence: upData.residence?upData.residence.join('') : '',
          address: upData.address?upData.address.join('') : '',
        }
        // //提交前检验查重
        // if (upData.customerName || upData.personalPhone || upData.workPhone || upData.weChat || upData.idCard) {
        //   this.checkPersonalName(upData.customerName)
        //   this.checkContactToPersonal(upData.personalPhone)
        //   this.checkContactToWork(upData.workPhone)
        //   this.checkContactToweChat(upData.weChat)
        //   this.checkContactToIdCard(upData.idCard)
        // }
        // //提交前检验查重
        // if (this.state.isChk) {
            if(outValues.birthday && outValues.attackTime){
                if(getBigDate(outValues.birthday,outValues.attackTime) === 1){
                    return message.info("出生年月应小于开始工作时间",1)
                }
            }
            if(outValues.birthday && outValues.graduationTime){
                if(getBigDate(outValues.birthday,outValues.graduationTime) === 1){
                    return message.info("出生年月应小于毕业时间",1)
                }
            }
          this.props.dispatch(updateCluePerson({ // 编辑个人线索
            ...customerCategory,
            ...F.filterUndefind(outValues),
          })).then(data => {
            if (data && data.code === 0) {
              message.success(data.msg)
              this.props.history.go(-1)
            } else {
              if(data){
                  message.error(data.msg)
              }
            }
          })
        // }
      }
    })
  }

  operateClue = (action, id, customerId) => {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
      if (String(action) === '1') {
       this.addClue()
     }
      if (String(action) === '2') {
      this.editClue(id,customerId)
     }
  }

  singAudit = (id, status) => {
    this.props.dispatch(userAudit({
      customerList: [id],
      status,
    })).then(data => {
      if (data && data.code === 0) {
        message.success(data.msg)
        this.setState({
            bDisable:true,
        })
        // window.location.href = '/CRM/clueSystem'
        // this.props.history.go(-1)
      }
    })
  }
  //获取url参数
  getUrlParam = (name )=> {
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
       var r = window.location.search.substr(1).match(reg);
       if (r != null) return unescape(r[2]); return null;
  }
  goBack = () =>{
      if(getUrlParam('topName') === "我的线索"){
          window.location.href = '/CRM/myClue?topName=我的线索'
      }else if(getUrlParam('topName') === "线索管理"){
          window.location.href = '/CRM/clueSystem?topName=线索管理'
      }else{
          window.location.href = '/CRM/myClue?topName=我的线索'
      }
      // this.props.history.go(-1)
  }
  render() {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let {topName} = this.props.history.location.state || parsed
    let id, action, customerCategory, status
    if(JSON.stringify(parsed) === "{}"){
      [id, action, customerCategory, status] = [this.props.history.location.state.id, parseInt(this.props.history.location.state.action), this.props.history.location.state.customerCategory, this.props.history.location.state.status]
    }else{
      [id, action, customerCategory, status] = [parseInt(parsed.id), parseInt(parsed.action), parseInt(parsed.customerCategory), parseInt(parsed.status)]
    }
    const {clueDetail} = this.props
    return (
      <Layout className={style.LogsWrap}>
        <Wrap>
          <ContentWrap>
            {/* {topName === '我的线索' && <StepBar {...this.props} />} */}
            <div className={style.listTitle}>
              <div>
                {action === 1 ? <Icon type="plus-circle-o" /> : <Icon type={action === 1 ? 'edit':'eye'} />}
                &ensp;{action === 1 ? '新增线索' : '查看线索'} - {customerCategory === 1 ? '个人' : '企业'}
              </div>
              <div>
                <Button onClick={() => { this.goBack() }}>返回</Button>&emsp;
                {getUrlParam('status') === '1' && <Button onClick={() => { this.singAudit(id, 2) }} disabled={this.state.bDisable || clueDetail.status != 1}>审核通过</Button>}&emsp;
                {getUrlParam('status') === '1' && <Button onClick={() => { this.singAudit(id, 3) }} disabled={this.state.bDisable || clueDetail.status != 1}>审核不通过</Button>}&emsp;
                <Button onClick={() => { this.operateClue(action,this.props.clueDetail.id,this.props.clueDetail.customerId) }}
                disabled={(getUrlParam('from') === "0" && getUrlParam('auditStatus') == "2") || (getUrlParam('from') === "0" && getUrlParam('status') == "2") || (this.state.bDisable) ?true:false}>
                 提交
                 </Button>&emsp;
                {/*{parsed.auditStatus ? '' : <Button onClick={() => { this.props.history.go(-1) }}>返回</Button>}*/}
              </div>
            </div>
            <div className={style.listTop}>
              <div>
                {this.showFormItem()}
              </div>
            </div>
          </ContentWrap>
        </Wrap>
      </Layout>
    )
  }
}
const Detail = Form.create()($Detail)
export default Detail
