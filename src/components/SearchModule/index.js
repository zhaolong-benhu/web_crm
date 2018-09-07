/**
 * Created by huangchao on 14/11/2017.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.less'
import { QueryItem, QuerySelect, QueryTime, QueryCascader, QueryMoney, QueryProduct } from '../QueryItem'
import HeiQueryItem from '../advanceSearchItem'
import { createForm } from 'rc-form'
import { Icon, Modal, Button, Card, Table, Form, Cascader } from 'antd'
import { connect } from 'react-redux'
import SortTable from '../SorTable'
import { extname } from 'path'
import store from 'store'
import moment from 'moment'
import $ from 'jquery'
import _ from 'lodash'
import {
  getTopicList,
} from '../../actions/internation'
import { getDepartment } from '../../actions/department'
import {selectAllCheneseName} from '../../actions/clientSystem'
// import {queryData} from '../../static/data.js' // heiQueryData
const ButtonGroup = Button.Group

@connect(state => {
  return {
    internation: state.internation,
    clientSystem: state.clientSystem,
    department: state.department.list,
  }
})
@createForm()
class SearchModule extends Component {
  constructor(props) {
    super(props)
    this.isSort = true // 判断是否排序
    this.value = {}
  }
  static propTypes = {
    form: PropTypes.object,
    validateFields: PropTypes.func,
    heiQueryData: PropTypes.array,
    queryBest: PropTypes.array,
    queryHeiBest: PropTypes.array,
    handleQueryBest: PropTypes.func,
    handleHeiQuery: PropTypes.func,
    saveUserCheck: PropTypes.func,
    showHeiBtn: PropTypes.any,
    getFieldDecorator: PropTypes.any,
    sortTable: PropTypes.func,
  }

  state = {
    draggingIndex: null,
    queryHeiBest: [],
    heiQueryData: [],
    visible: false,
    visibleCst: false,
    bShowheiQuery:false,
    showHeiBtn:true,
    existEnterpriseQuery:false,
    existPersonQuery:false,
  }

  componentDidMount() {
    this.props.dispatch(getTopicList())
    let code = ''
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.department) {
      code = crm.user.department.deptCode
    }
     //获取所有部门
    this.props.dispatch(getDepartment({depCode:code}))

    //获取所有人
    this.props.dispatch(selectAllCheneseName({
      code,
    }))

    $("#heiSearch").slideToggle()
  }

  showQueryItem = () => {
    // 初级筛选
    const { getFieldDecorator } = this.props.form
    const queryBest = this.props.queryBest
    if (!queryBest) {
      return null
    }

    return queryBest.map((data, index) => {
      if (data.type === 1) {
        return (
          <React.Fragment key={data.keyword}>
            {getFieldDecorator(data.keyword)(
              <QueryItem
                hidename={this.props.hidename}
                key={index}
                data={data}
              />
            )}
          </React.Fragment>
        )
      }
      if (data.type === 2) {
        return (
          <React.Fragment key={data.keyword}>
            {getFieldDecorator(data.keyword)(
              <QueryTime
                hidename={this.props.hidename}
                key={index}
                data={data}
                startTime={this.props.startTime}
                endTime={this.props.endTime}
              />
            )}
          </React.Fragment>
        )
      }
      if (data.type === 3) {
        return (
          <React.Fragment key={data.keyword}>
            {getFieldDecorator(data.keyword)(
              <QuerySelect
                hidename={this.props.hidename}
                key={index}
                data={data}
                topicList={this.props.internation.topicList}
                nameList={this.props.clientSystem.nameList}
                depCodeList={this.props.department}
                defaultExamineStatus={this.props.defaultExamineStatus}
              />
            )}
          </React.Fragment>
        )
      }
      if (data.type === 4 || data.type === 5) {
        return (
          <React.Fragment key={data.keyword}>
            {getFieldDecorator(data.keyword)(
              <QueryCascader
                hidename={this.props.hidename}
                key={index}
                data={data}
              />
            )}
          </React.Fragment>
        )
      }
      if (data.type === 6) {
        return (
          <React.Fragment key={data.keyword}>
            {getFieldDecorator(data.keyword)(
              <QueryMoney
                hidename={this.props.hidename}
                key={index}
                data={data}
              />
            )}
          </React.Fragment>
        )
      }
      if (data.type === 7) {
        return (
          <React.Fragment key={data.keyword}>
            {getFieldDecorator(data.keyword)(
              <QueryProduct
                hidename={this.props.hidename}
                key={index}
                data={data}
                options={this.props.options}
              />
            )}
          </React.Fragment>
        )
      }
      return null
    })
  }

  showHeiQueryItem = (type) => {
    // 高级筛选
    const { getFieldDecorator } = this.props.form
    // this.props.form.setFieldsInitialValue(this.value)
    const queryHeiBest = this.state.queryHeiBest
    const { topicList } = this.props.internation
    const { nameList } = this.props.clientSystem
    if (!queryHeiBest) {
      return null
    }
    if (this.isSort) {
      return queryHeiBest.map((data, index) => {
          if(type == '1' && data.customerType == '1'){
              return (
                <div style={{width:'25%'}}>
                     <SortTable
                      key={data.id}
                      items={queryHeiBest}
                      updateState={this.updateState}
                      draggingIndex={this.state.draggingIndex}
                      sortId={index}
                      outline="grid"
                    >
                      <Card className={style.cardBox}>
                        <HeiQueryItem
                          key={data.id}
                          data={data}
                          getFieldDecorator={getFieldDecorator}
                          topicList={topicList}
                          nameList={nameList}
                        />
                      </Card>
                    </SortTable>
                </div>
              )
          }
          if(type == '2' && data.customerType == '2'){
              return (
                <div style={{width:'25%'}}>
                     <SortTable
                      key={data.id}
                      items={queryHeiBest}
                      updateState={this.updateState}
                      draggingIndex={this.state.draggingIndex}
                      sortId={index}
                      outline="grid"
                    >
                      <Card className={style.cardBox}>
                        <HeiQueryItem
                          key={data.id}
                          data={data}
                          getFieldDecorator={getFieldDecorator}
                          topicList={topicList}
                          nameList={nameList}
                        />
                      </Card>
                    </SortTable>
                </div>
              )
          }

          if(this.props.heiQueryType == '1'){
              return (
                <div style={{width:'25%'}}>
                     <SortTable
                      key={data.id}
                      items={queryHeiBest}
                      updateState={this.updateState}
                      draggingIndex={this.state.draggingIndex}
                      sortId={index}
                      outline="grid"
                    >
                      <Card className={style.cardBox}>
                        <HeiQueryItem
                          key={data.id}
                          data={data}
                          getFieldDecorator={getFieldDecorator}
                          topicList={topicList}
                          nameList={nameList}
                        />
                      </Card>
                    </SortTable>
                </div>
              )
          }

      })
    }
  }

  updateState = obj => {
    this.setState(obj, () => {
      this.props.sortTable(obj)
    })
  }

  advancedSearch = () => {
    this.setState({
      bShowheiQuery:true,
      showHeiBtn:false,
    })
    // var serarchs = document.getElementById('heiSearch');
    // serarchs.style.height="auto"
    $("#heiSearch").slideToggle()
  }

  handleCancel = () => {
    // 关闭
    this.isSort = true
    this.setState({
      visible: false,
    })
  }

  resert = () => {
    // 重置
    this.props.form.resetFields()
  }

 hideHeiSearch = () => {
     $("#heiSearch").slideToggle()
     this.setState({
       bShowheiQuery:false,
       showHeiBtn:true,
     })
 }
 //基础搜索
  handleQuery = () => {

      //清空掉高级搜索的搜索项
    // this.props.forom.resetFields();
    var heiQuery = []
    this.state.queryHeiBest && this.state.queryHeiBest.forEach((v,i)=>{
        heiQuery.push(v.keyword)
    })
    // this.props.form.resetFields(heiQuery)

    this.props.form.validateFields((err, value) => {
      if (err) return
      var IndustryCategory = value.IndustryCategory||""
      const result = _.omit(value, heiQuery)
      result.IndustryCategory = IndustryCategory
      this.props.handleQueryBest(result)
    })
  }

//高级搜索
  handleAdvancedSearch = () => {
    this.props.form.validateFields((err, value) => {
      if (err) return
      // this.showHeiQueryItem()
      if(value.industryTypeAndcategory && value.industryTypeAndcategory != ""){
          value.industryTypeAndcategory = value.industryTypeAndcategory.join(",")
      }
      if(value.enAddress && value.enAddress != ""){
          value.enAddress = value.enAddress.join("")
      }
      if(value.peAddress && value.peAddress != ""){
          value.peAddress = value.peAddress.join("")
      }
      if(value.exStartTime && value.exStartTime != ""){
          value.exStartTime = value.exStartTime.join(",")
      }
      if(value.passTime && value.passTime != ""){
          value.passTime = value.passTime.join(",")
      }
      if(value.conUserId && value.conUserId == "0"){
          value.conUserId = ""
      }

      var dateFormat = "YYYY-MM-DD"
      if(value.enEstablDateStart && value.enEstablDateStart != ""){
          value.enEstablDateStart = moment(value.enEstablDateStart[0]).format('YYYY-MM-DD')+','+moment(value.enEstablDateStart[1]).format('YYYY-MM-DD')
      }
      if(value.peBirthdayStart && value.peBirthdayStart != ""){
          value.peBirthdayStart = moment(value.peBirthdayStart[0]).format('YYYY-MM-DD')+','+moment(value.peBirthdayStart[1]).format('YYYY-MM-DD')
      }
      if(value.peGradStartTime && value.peGradStartTime != ""){
          value.peGradStartTime = moment(value.peGradStartTime[0]).format('YYYY-MM-DD')+','+moment(value.peGradStartTime[1]).format('YYYY-MM-DD')
      }
      if(value.peAttackStartTime && value.peAttackStartTime != ""){
          value.peAttackStartTime = moment(value.peAttackStartTime[0]).format('YYYY-MM-DD')+','+moment(value.peAttackStartTime[1]).format('YYYY-MM-DD')
      }
      if(value.enCoStartTimeStart && value.enCoStartTimeStart != ""){
          value.enCoStartTimeStart = moment(value.enCoStartTimeStart[0]).format('YYYY-MM-DD')+','+moment(value.enCoStartTimeStart[1]).format('YYYY-MM-DD')
      }
      if(value.coContractDateStart && value.coContractDateStart != ""){
          value.coContractDateStart = moment(value.coContractDateStart[0]).format('YYYY-MM-DD')+','+moment(value.coContractDateStart[1]).format('YYYY-MM-DD')
      }
      if(value.coStartTimet && value.coStartTimet != ""){
          value.coStartTimet = moment(value.coStartTimet[0]).format('YYYY-MM-DD')+','+moment(value.coStartTimet[1]).format('YYYY-MM-DD')
      }
      if(value.enCoEndTimeStart && value.enCoEndTimeStart != ""){
          value.enCoEndTimeStart = moment(value.enCoEndTimeStart[0]).format('YYYY-MM-DD')+','+moment(value.enCoEndTimeStart[1]).format('YYYY-MM-DD')
      }
      if(value.enNextFlowTimeStart && value.enNextFlowTimeStart != ""){
          value.enNextFlowTimeStart = moment(value.enNextFlowTimeStart[0]).format('YYYY-MM-DD')+','+moment(value.enNextFlowTimeStart[1]).format('YYYY-MM-DD')
      }
      if(value.enAllotStartTime && value.enAllotStartTime != ""){
          value.enAllotStartTime = moment(value.enAllotStartTime[0]).format('YYYY-MM-DD')+','+moment(value.enAllotStartTime[1]).format('YYYY-MM-DD')
      }
      if(value.coReceStartDate && value.coReceStartDate != ""){
          value.coReceStartDate = moment(value.coReceStartDate[0]).format('YYYY-MM-DD')+','+moment(value.coReceStartDate[1]).format('YYYY-MM-DD')
      }
      if(value.enLastFollowStartTime && value.enLastFollowStartTime != ""){
          value.enLastFollowStartTime = moment(value.enLastFollowStartTime[0]).format('YYYY-MM-DD')+','+moment(value.enLastFollowStartTime[1]).format('YYYY-MM-DD')
      }
      if(value.inCoStartTimeStart && value.inCoStartTimeStart != ""){
          value.inCoStartTimeStart = moment(value.inCoStartTimeStart[0]).format('YYYY-MM-DD')+','+moment(value.inCoStartTimeStart[1]).format('YYYY-MM-DD')
      }
      if(value.inCoEndTimeStart && value.inCoEndTimeStart != ""){
          value.inCoEndTimeStart = moment(value.inCoEndTimeStart[0]).format('YYYY-MM-DD')+','+moment(value.inCoEndTimeStart[1]).format('YYYY-MM-DD')
      }
      if(value.inNextFlowTimeStart && value.inNextFlowTimeStart != ""){
          value.inNextFlowTimeStart = moment(value.inNextFlowTimeStart[0]).format('YYYY-MM-DD')+','+moment(value.inNextFlowTimeStart[1]).format('YYYY-MM-DD')
      }
      if(value.inAllotStartTime && value.inAllotStartTime != ""){
          value.inAllotStartTime = moment(value.inAllotStartTime[0]).format('YYYY-MM-DD')+','+moment(value.inAllotStartTime[1]).format('YYYY-MM-DD')
      }
      if(value.inLastFollowStartTime && value.inLastFollowStartTime != ""){
          value.inLastFollowStartTime = moment(value.inLastFollowStartTime[0]).format('YYYY-MM-DD')+','+moment(value.inLastFollowStartTime[1]).format('YYYY-MM-DD')
      }
      if(value.coDatePayStart && value.coDatePayStart != ""){
          value.coDatePayStart = moment(value.coDatePayStart[0]).format('YYYY-MM-DD')+','+moment(value.coDatePayStart[1]).format('YYYY-MM-DD')
      }
      if(value.coTicketApplStartDate && value.coTicketApplStartDate != ""){
          value.coTicketApplStartDate = moment(value.coTicketApplStartDate[0]).format('YYYY-MM-DD')+','+moment(value.coTicketApplStartDate[1]).format('YYYY-MM-DD')
      }
      if(value.coTicketStartTime && value.coTicketStartTime != ""){
          value.coTicketStartTime = moment(value.coTicketStartTime[0]).format('YYYY-MM-DD')+','+moment(value.coTicketStartTime[1]).format('YYYY-MM-DD')
      }
      if(value.coTicketSenStartDate && value.coTicketSenStartDate != ""){
          value.coTicketSenStartDate = moment(value.coTicketSenStartDate[0]).format('YYYY-MM-DD')+','+moment(value.coTicketSenStartDate[1]).format('YYYY-MM-DD')
      }
      if(value.coAddStartTime && value.coAddStartTime != ""){
          value.coAddStartTime = moment(value.coAddStartTime[0]).format('YYYY-MM-DD')+','+moment(value.coAddStartTime[1]).format('YYYY-MM-DD')
      }

      // console.log(value);
      this.props.handleHeiQuery(value)
      this.setState({
        visible: false,
      })
    })
  }

  handleCst = () => {
    this.setState({
      visibleCst: true,
    })
  }

  handleCstOk = () => {
    this.setState({
      visibleCst: false,
    })
    if(this.state.heiQueryData2 && this.state.heiQueryData2.length>0){
        this.props.saveUserCheck(this.state.heiQueryData.concat(this.state.heiQueryData2))
    }else{
        this.props.saveUserCheck(this.state.heiQueryData)
    }
  }

  handleCstCancel = () => {
    this.setState({
      visibleCst: false,
      heiQueryData: this.props.heiQueryData,
    })
  }

  componentWillReceiveProps(props) {
      this.state.existEnterpriseQuery = false;
      this.state.existPersonQuery = false;

    this.setState({
      queryHeiBest: props.queryHeiBest, // 默认高级搜索项
      // heiQueryData: props.heiQueryData, // 所有高级搜索项
      // heiQueryData2: props.heiQueryData, // 所有高级搜索项
    })
    var enterpiseData = []
    var pensorData = []
    var allData = []
    props.heiQueryData && props.heiQueryData.forEach((v,i)=>{
        var info = {"checked":v.checked,"id":v.id,"name":v.name}
        if(v.customerType == 1){
            pensorData.push(info);
        }
        if(v.customerType == 2){
            enterpiseData.push(info);
        }
        if(this.props.heiQueryType === "1"){
            allData.push(info)
        }
    })

    this.setState({
      heiQueryData: this.props.heiQueryType === "1"?allData:enterpiseData, // 所有高级搜索项
      heiQueryData2: pensorData, // 所有高级搜索项
    })

    if(props.queryHeiBest && props.queryHeiBest.length>0){
        props.queryHeiBest.forEach((v,i)=>{
            if(v.customerType == 2){
                this.setState({
                    existEnterpriseQuery:true,
                })
            }
            if(v.customerType == 1){
                this.setState({
                    existPersonQuery:true,
                })
            }
        })
    }
  }
  render() {
    let selectedRowKeys = []
    let selectedRowKeys2 = []
    let alreadyselected = []

    this.state.heiQueryData && this.state.heiQueryData.forEach(item => {
        if (item.checked) {
          selectedRowKeys.push(item.id)
        }
      })
      this.state.heiQueryData2 && this.state.heiQueryData2.forEach(item => {
          if (item.checked) {
            selectedRowKeys2.push(item.id)
          }
        })
    const columns = [
      {
        title: '搜索条件',
        dataIndex: 'name',
      },
    ]
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const selected = selectedRows.map(item => {
          return {
            ...item,
            checked: true,
          }
        })
        this.setState({
          heiQueryData: selected,
        })
      },
      selectedRowKeys,
    }
    const rowSelection2 = {
      onChange: (selectedRowKeys2, selectedRows2) => {
        const selected = selectedRows2.map(item => {
          return {
            ...item,
            checked: true,
          }
        })
        this.setState({
          heiQueryData2: selected,
        })
      },
      selectedRowKeys:selectedRowKeys2,
    }


    alreadyselected = selectedRowKeys.concat(selectedRowKeys2);
    alreadyselected = [...new Set(alreadyselected)]

    const type =  this.props.heiQueryType
    const EnterpriseCustomerQueryData = []
    const PersonCustomerQueryData = []
    this.props.heiQueryData && this.props.heiQueryData.forEach((v,i)=>{
        var info = {"checked":v.checked,"id":v.id,"name":v.name}
        if(v.customerType == 2){
            EnterpriseCustomerQueryData.push(info)
        }else{
            PersonCustomerQueryData.push(info)
        }
    })

    return (
      <div
        ref={sub => {
          this.subRef = sub
        }}
        className={style.SearchModuleWrap}
      >
        <div className={style.top}>
          <div className={style.topLeft}>
            <Icon className={style.icon} type="search" />&ensp;筛选查询
          </div>
          <div className={style.topRight}>
            <div>
            {this.state.showHeiBtn ?
                <Button onClick={this.handleQuery} className={style.btnSearch}>
                  <Icon className={style.icon} type="search" />搜索
                </Button>:null
            }

              {this.props.showHeiBtn && this.state.showHeiBtn ? (
                <Button onClick={this.advancedSearch}>
                  <Icon className={style.icon} type="down" />展开更多条件
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <div className={style.bottom}>{this.showQueryItem()}
        </div>
        <div className={style.serarchs} id="heiSearch">
            <div className={style.searchContainers}>

                {this.props.heiQueryType == '1' ?
                    <div className={style.HeiQueryItem}>{this.showHeiQueryItem(0)}</div>:
                    <div>
                        <div className={this.state.existEnterpriseQuery?style.classifyTitle:style.hideclassifyTitle}>企业客户搜索条件：</div>
                        <div className={style.HeiQueryItem}>{this.showHeiQueryItem(2)}</div>
                        <div className={this.state.existPersonQuery?style.classifyTitle:style.hideclassifyTitle}>个人客户搜索条件：</div>
                        <div className={style.HeiQueryItem}>{this.showHeiQueryItem(1)}</div>
                    </div>
                }
                <div className={style.allBtns}>
                    <Button value="large" onClick={this.handleCst} className={style.diyBtn}>
                    <Icon className={style.icon} type="setting" />
                      自定义搜索条件
                    </Button>

                    <div className={style.btns}>
                        <Button value="large" onClick={this.resert} className={style.btn}>
                        <Icon className={style.icon} type="delete" />
                          清空搜索条件
                        </Button>
                        <Button value="large" onClick={this.hideHeiSearch} className={style.btn}>
                          <Icon className={style.icon} type="up" />收起更多条件
                        </Button>
                        <Button value="large" onClick={this.handleAdvancedSearch} className={style.btnSearch}>
                          <Icon className={style.icon} type="search" />搜索
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <Modal
          title="请选择搜索条件"
          visible={this.state.visibleCst}
          onOk={this.handleCstOk}
          onCancel={this.handleCstCancel}
          width={type==1?520:880}
        >
          <div>共可选 <span className={style.red}>{this.props.heiQueryData && this.props.heiQueryData.length}</span> 个条件，已选择 <span className={style.red}>{alreadyselected.length}</span> 个条件</div>

          {type ==1?
          <Table
            rowKey={record => record.id}
            size="middle"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.heiQueryData}
            pagination={false}
            className={style.table}
            scroll={{ y: 300 }}
          />
          :
          <div className={style.tabs}>
              <div className={style.tab}>
                  <div className={style.classify}>企业客户条件</div>
                  <Table
                    rowKey={record => record.id}
                    size="middle"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={EnterpriseCustomerQueryData}
                    pagination={false}
                    className={style.table}
                    scroll={{ y: 300 }}
                  />
              </div>
              <div className={style.tab}>
                  <div className={style.classify}>个人客户条件</div>
                  <Table
                    rowKey={record => record.id}
                    size="middle"
                    rowSelection={rowSelection2}
                    columns={columns}
                    dataSource={PersonCustomerQueryData}
                    pagination={false}
                    className={style.table}
                    scroll={{ y: 300 }}
                  />
              </div>
          </div>
        }

        </Modal>
      </div>
    )
  }
}

export default SearchModule
