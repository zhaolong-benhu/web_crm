/**
 * Created by huangchao on 14/11/2017.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.less'
import { QueryTime } from '../../components/QueryItem'
import Layout from '../Wrap'
import { connect } from 'react-redux'
import moment from 'moment'
import { Table, Modal, Select, message, Input, Radio, Button, Icon, Row, Col } from 'antd'
import SearchModule from '../../components/SearchModule'
import { Audit } from '../../components/TableBtns'
import ContentWrap from '../Content'
import TableHeader from '../../components/TableHeaderResource'
import { default as ColumnRender } from '../../components/TableColumn'
import F from '../../helper/tool'
import { dictUrl } from '../../config'
import store from 'store'
import {
  getQueyBest,
  getQeryData,
  saveUserChecked,
  selectKey,
  sortTable,
  getHasSelectitem,
  deleteSelect,
} from '../../actions/search'
import {
  getInitList,
  geiHeiList,
  addPoolResource,
  mergeGetCustomer,
  mergeToCustomer,
  getDictionaries,
  selectPoolList,
} from '../../actions/resourceSystem'
import {newWindow} from '../../util/'
const Option = Select.Option
const { Wrap } = Layout
const RadioGroup = Radio.Group

@connect(state => {
  return {
    resourceSystem: state.resourceSystem,
    search: state.search,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
    custorm: state.resourceSystem.custorm,
    poolList: state.resourceSystem.poolList,
    selectPoolList:state.resourceSystem.selectPoolList,
  }
})
class ResourceSystem extends Component {
  state = {
    heiQueryData: [],
    queryHeiBest: [],
    visible0: false,
    visible1: false,
    confirmLoading: false,
    audit: false,
    modalTwo: false,
    errMsg: '',
    value: 2,
    cusIds: '', //客户ID
    custrormType: '', //客户类型
    custrormType2: '', //客户类型2
    number: '', // 审核的编号
    name: '', //客戶名稱
    poolId: '', //公海ID
    checkId: '', //勾选的客户
    notCheckId: '', //未勾选的客户
    customerSourceName: '', //客户来源
    customerSource: '',
    reason: '',
    enAddress: '',
    enAddressDetail: '',
    sex: '',
    personalPhone: '',
    workPhone: '',
    fixedPhone: '',
    weChat: '',
    QQ: '',
    email: '',
    fax: '',
    birthday: '',
    school: '',
    education: '',
    graduationTime: '',
    workingLife: '',
    residence: '',
    residenceDetail: '',
    inAddress: '',
    inAddressDetail: '',
    idCard: '',
    nation: '',
    nature: '',
    bloodType: '',
    accountCode: '',
    remarks: '',
    star: '',
    category: '',
    scale: '',
    capital: '',
    legalRe: '',
    establDate: '',
    companyWebsite: '',
    isBuild: '',
    isGroup: '',
    openingTime: '',
    superiorUnit: '',
    enterpriseProfile: '',
    pooList: '',
    columns: [],
    smultipleSearch: '',
    poolText:'请选择',
    source:'',
    loading:true,
  }
  static propTypes = {
    dispatch: PropTypes.func,
    resourceSystem: PropTypes.object,
    search: PropTypes.object,
    history: PropTypes.object,
    queryBest: PropTypes.array,
    internation: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.isBest = true // 判断是否走高级搜索接口
    this.queryCondition = {checkStatus:'1',passTime:[moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD'),moment(new Date()).add(1, 'day').format('YYYY-MM-DD')]} // 搜索条件
    this.queryAdvCondition = {}
    this.auditID = [] // 审核的id
    this.handleCancel = this.handleCancel.bind(this)
    this.exType = ''
    this.exDisMode = ''
    this.searchTime = ''
    this.smultipleSearch = ''
  }
  onSelectChange = (key, data) => {
    // 勾选表格
    let number = ''
    data.map((item, index) => {
      item.length == index
        ? (number += item.number)
        : (number += item.number + ',')
      return null
    })
    let name = ''
    data.map((item, index) => {
      item.length == index ? (name += item.name) : (name += item.name + ',')
      return null
    })
    let cusIds = ''
    data.map((item, index) => {
      item.length == index ? (cusIds += item.id) : (cusIds += item.id + ',')
      return null
    })
    let custrormType = ''
    data.map((item, index) => {
      if (0 == index) {
        item.length == index
          ? (custrormType += item.type)
          : (custrormType += item.type)
      }
      return null
    })
    let custrormType2 = ''
    data.map((item, index) => {
      item.length == index
        ? (custrormType2 += item.type)
        : (custrormType2 += item.type + ',')
      return null
    })
    this.props.dispatch(selectKey(key))
    this.auditID = key
    this.setState({ number })
    this.setState({ name })
    this.setState({ cusIds })
    // this.componentDidMount()
    this.setState({ custrormType })
    this.setState({ custrormType2 })
  }
  showDialog = () => {
    this.setState({
      visible1: true,
    })
  }
  renderHeaser = () => {
    return (
      <TableHeader
        dataSource={this.props.resourceSystem.columns}
        menuSure={this.menuSure}
        showDisModal={this.showDisModal}
        submitMerge={this.submitMerge}
        submitMoreDis={this.submitMoreDis}
      />
    )
  }
  submitMerge = () => {
    // 选择两个资源合并
    const { selectedRowKeys } = this.props.search
    if (selectedRowKeys.length === 0) {
      return message.info('请选择客户', 1)
    }
    if (this.state.custrormType2.length === 4) {
      if (
        this.state.custrormType2.split(',')[0] ===
        this.state.custrormType2.split(',')[1]
      ) {
        this.setState({
          visible1: true,
        })
      } else {
        return message.info('请选择两个相同类型的线索合并', 1)
      }
    }
    this.props
      .dispatch(
        mergeGetCustomer({
          cusIds: this.state.cusIds,
        })
      )
      .then(function(data) {
        if (data) {
          if (data.code === 0) {
            // this.showDialog();
          }
        } else {
        }
      })
  }
  submitMoreDis = () => {
    // 选择多个资源分配
    const { selectedRowKeys } = this.props.search
    if (selectedRowKeys.length === 0) {
      return message.info('请选择客户！', 1)
    }
    this.setState({
      visible0: true,
    })
  }
  menuSure = data => {
    const columns = data.filter(item => item.checked)
    this.setState({ columns })
  }
  sortTable = obj => {
    // 排序
    if (obj.items) {
      const list = []
      obj.items.map(item => {
        list.push({
          itemId: item.id,
          sort: item.sort,
        })
        return {}
      })
      this.props.dispatch(
        sortTable({
          list: JSON.stringify(list),
        })
      )
    }
  }
  saveUserCheck = heiQueryData => {
    // 保存用户选择的item
    const searchList = []
    heiQueryData.map(item => {
      if (item.checked) {
        searchList.push(item.id)
      }
      return {}
    })
    this.props
      .dispatch(
        saveUserChecked({
          // 保存已选择的item后重新获取默认的高级搜索项
          searchList,
          listType: 2,
        })
      )
      .then(() => {
        this.props.dispatch(
          getHasSelectitem({
            listType: 2,
          })
        )
      })
  }
  handleQueryBest = value => {
      this.props.resourceSystem.loading = true;
      this.setState({
          loading:true,
      })
    // 初级查询
    const { page } = this.props.resourceSystem
    const ss = F.filterUndefind(value)
    this.isBest = true
    this.queryCondition = Object.assign(this.queryCondition, ss)
    if(this.queryCondition.passTime && this.queryCondition.passTime == "," ){
        this.queryCondition.exStartTime = ""
    }
    this.props.dispatch(
      getInitList({
        pageNum: 1,
        pageSize: page.pageSize,
        ...this.queryCondition,
      })
    )
  }
  handleHeiQuery = value => {
    // 高级查询
    this.props.resourceSystem.loading = true;
    this.setState({
        loading:true,
    })
    const { page } = this.props.resourceSystem
    const ss = F.filterUndefind(value)
    this.isBest = false
    this.queryAdvCondition = JSON.stringify(ss)
    if(!ss.passTime){
        var passTime = moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD') + "," + moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
        ss.passTime = passTime
    }
    this.props.dispatch(
      geiHeiList({
        listType: 2,
        pageNum: 1,
        pageSize: page.pageSize,
        search: JSON.stringify(ss),
        // ...ss,
      })
    )
  }
  onShowSizeChange = (pageNum, pageSize) => {
    // 点击每页显示个数
    if (this.isBest) {
      // 走基本搜索接口
      this.props.dispatch(
        getInitList({
          pageNum: pageNum,
          pageSize: pageSize,
          ...this.queryCondition,
        })
      )
    } else {
      //  走高级搜索接口
      this.props.dispatch(
        geiHeiList({
          listType: 2,
          pageNum: pageNum,
          pageSize: pageSize,
          search: this.queryAdvCondition,
        })
      )
    }
  }
  pageChange = (pageNum, pageSize) => {
    // 点击页数
    if (this.isBest) {
      // 走基本搜索接口
      this.props.dispatch(
        getInitList({
          pageNum: pageNum,
          pageSize: pageSize,
          exType: this.exType,
          ...this.queryCondition,
        })
      )
    } else {
      //  走高级搜索接口
      this.props.dispatch(
        geiHeiList({
          listType: 2,
          pageNum: pageNum,
          pageSize: pageSize,
          search: this.queryAdvCondition,
        })
      )
    }
  }
  selectRadio = e => {
    this.setState({
      value: e.target.value,
    })
  }
  handleChange = (pagination, filters, sorter) => {
  }
  auditCancle = () => {
    this.auditID = []
    this.setState({ audit: false })
  }
  componentWillMount() {
    const columns = this.props.resourceSystem.columns.filter(
      item => item.checked
    )
    this.setState({ columns })
  }
  componentDidMount() {
    // this.props.dispatch(getDictionaries({})) //当公海项发生更改后 需重新获取属性
    this.props.dispatch(selectPoolList({})) //当公海项发生更改后 需重新获取属性

    const { page } = this.props.resourceSystem

    this.props.dispatch(
      getInitList({
        // 初始化list
        pageNum: page.pageNum,
        pageSize: page.pageSize,
        ...this.queryCondition,
      })
    )
    this.props.dispatch(
      getQueyBest({
        // 初级查询 数据
        defaut: 2,
      })
    )
    this.props.dispatch(
      getHasSelectitem({
        // 高级搜索 默认item
        listType: 2,
      })
    )
    this.props.dispatch(
      getQeryData({
        // 高级搜索 所有数据
        from: 2,
      })
    )

  }
  componentWillReceiveProps(props) {
    this.setState({
      heiQueryData: props.heiQueryData,
      queryHeiBest: props.queryHeiBest,
    })
  }
  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }
  handleOk = e => {
      if(!this.state.poolId){
          return message.info('请选择公海',1)
      }
    //提交分配到公海
    if (!this.props.disabled) {
      //this.props.ok(value)
      this.props.dispatch(addPoolResource({
            cusIds: this.state.cusIds,
            poolId: this.state.poolId,
        })).then(data => {
          if (data && data.code === 0) {
            //分配成功
            this.handleCancel()
            this.props.dispatch(deleteSelect)
            //分配成功 刷新状态
            if (data.data) {
              this.props.dispatch(
                getInitList({
                  pageNum: this.props.resourceSystem.page.pageNum,
                  pageSize: this.props.resourceSystem.page.pageSize,
                  ...this.queryCondition,
                })
              )
              return message.info(data.data.msg, 2)
            } else {
                if(data){
                    return message.info(data.msg, 2)
                }
            }
          } else {
              if(data){
                  this.handleCancel()
                  return message.info(data.msg, 1)
              }
          }
        })
    } else {
      this.handleCancel()
    }
  }
  handleMergeOk = e => {
    const { page } = this.props.resourceSystem
    const ss = {
      checkId: this.state.checkId,
      notCheckId: this.state.notCheckId,
      personalPhone:this.state.personalPhone,
      workPhone: this.state.workPhone,
      fixedPhone: this.state.fixedPhone,
      weChat: this.state.weChat,
      QQ: this.state.QQ,
      email: this.state.email,
      fax: this.state.fax,
      birthday: this.state.birthday,
      school: this.state.school,
      education: this.state.education,
      graduationTime: this.state.graduationTime,
      workingLife: this.state.workingLife,
      residence: this.state.residence,
      residenceDetail: this.state.residenceDetail,
      address: this.state.inAddress || this.state.enAddress,
      addressDetail: this.state.inAddressDetail||this.state.enAddressDetail,
      idCard: this.state.idCard,
      nation: this.state.nation,
      nature: this.state.nature,
      bloodType: this.state.bloodType,
      accountCode: this.state.accountCode,
      remarks: this.state.remarks,
      star: this.state.star,
      category: this.state.category,
      scale: this.state.scale,
      capital: this.state.capital,
      legalRe: this.state.legalRe,
      establDate: this.state.establDate,
      companyWebsite: this.state.companyWebsite,
      isBuild: this.state.isBuild,
      isGroup: this.state.isGroup,
      openingTime: this.state.openingTime,
      superiorUnit: this.state.superiorUnit,
      enterpriseProfile: this.state.enterpriseProfile,
      source: this.state.source,
    }
    const upData = F.filterUndefind(ss)
    //确定合并勾选的资源
    this.props
      .dispatch(
        mergeToCustomer(upData)
      )
      .then(data => {
        if (data && data.code === 0) {
          //合并成功
          this.setState({
            visible1: false,
          })
          if (this.isBest) {
            // 走基本搜索接口
            this.props.dispatch(
              getInitList({
                pageNum: page.pageNum,
                pageSize: page.pageSize,
                exType: this.exType,
                ...this.queryCondition,
              })
            )
          } else {
            //  走高级搜索接口
            this.props.dispatch(
              geiHeiList({
                listType: 2,
                pageNum: page.pageNum,
                pageSize: page.pageSize,
                search: this.queryAdvCondition,
              })
            )
          }
          this.props.dispatch(selectKey([]))
          message.info('合并成功', 2)
        } else {
          // return message.info(data.msg, 1)
        }
      })
  }
  handleCancel = e => {
    this.setState({
      visible0: false,
      visible1: false,
      poolText: '请选择',
      poolId: null,
    })

  }
  handleChangeDis = value => {
    this.setState({ poolId: `${value}` })
    this.props.selectPoolList && this.props.selectPoolList.forEach((v,i)=>{
        if(v.id == `${value}`){
            this.setState({
                poolText:v.name,
            })
        }
    })
  }
  handleBlurDis() {}
  handleFocusDis() {}
  //获取客户编号
  onChangeName = e => {
    this.setState({ checkId: e.target.value })
    if (e.target.value === this.props.custorm.data.id.split(':')[0]) {
      this.setState({ notCheckId: this.props.custorm.data.id.split(':')[1] })
    } else {
      this.setState({ notCheckId: this.props.custorm.data.id.split(':')[0] })
    }
  }
  //获取其他数据
  onChangeRadio = (type, e) => {
    if (type === 'customerSourceName') {
      this.setState({ customerSourceName: e.target.value })
    } else if (type === 'reason') {
      this.setState({ reason: e.target.value })
    } else if (type === 'enAddress') {
      this.setState({ enAddress: e.target.value })
    } else if (type === 'sex') {
      this.setState({ sex: e.target.value })
    } else if (type === 'personalPhone') {
      this.setState({ personalPhone: e.target.value })
    } else if (type === 'workPhone') {
      this.setState({ workPhone: e.target.value })
    } else if (type === 'fixedPhone') {
      this.setState({ fixedPhone: e.target.value })
    } else if (type === 'weChat') {
      this.setState({ weChat: e.target.value })
    } else if (type === 'QQ') {
      this.setState({ QQ: e.target.value })
    } else if (type === 'email') {
      this.setState({ email: e.target.value })
    } else if (type === 'fax') {
      this.setState({ fax: e.target.value })
    } else if (type === 'birthday') {
      this.setState({ birthday: e.target.value })
    } else if (type === 'school') {
      this.setState({ school: e.target.value })
    } else if (type === 'education') {
      this.setState({ education: e.target.value })
    } else if (type === 'graduationTime') {
      this.setState({ graduationTime: e.target.value })
    } else if (type === 'workingLife') {
      this.setState({ workingLife: e.target.value })
    } else if (type === 'residence') {
      this.setState({ residence: e.target.value })
    } else if (type === 'residenceDetail') {
      this.setState({ residenceDetail: e.target.value })
    } else if (type === 'inAddress') {
      this.setState({ inAddress: e.target.value })
    } else if (type === 'inAddressDetail') {
      this.setState({ inAddressDetail: e.target.value })
    } else if (type === 'idCard') {
      this.setState({ idCard: e.target.value })
    } else if (type === 'nation') {
      this.setState({ nation: e.target.value })
    } else if (type === 'bloodType') {
      this.setState({ bloodType: e.target.value })
    } else if (type === 'accountCode') {
      this.setState({ accountCode: e.target.value })
    } else if (type === 'remarks') {
      this.setState({ remarks: e.target.value })
    } else if (type === 'star') {
      this.setState({ star: e.target.value })
    } else if (type === 'category') {
      this.setState({ category: e.target.value })
    } else if (type === 'scale') {
      this.setState({ scale: e.target.value })
    } else if (type === 'capital') {
      this.setState({ capital: e.target.value })
    } else if (type === 'legalRe') {
      this.setState({ legalRe: e.target.value })
    } else if (type === 'establDate') {
      this.setState({ establDate: e.target.value })
    } else if (type === 'companyWebsite') {
      this.setState({ companyWebsite: e.target.value })
    } else if (type === 'isBuild') {
      this.setState({ isBuild: e.target.value })
    } else if (type === 'isGroup') {
      this.setState({ isGroup: e.target.value })
    } else if (type === 'openingTime') {
      this.setState({ openingTime: e.target.value })
    } else if (type === 'superiorUnit') {
      this.setState({ superiorUnit: e.target.value })
    } else if (type === 'accountCode') {
      this.setState({ accountCode: e.target.value })
    } else if (type === 'enterpriseProfile') {
      this.setState({ enterpriseProfile: e.target.value })
    } else if (type === 'source') {
      this.setState({ source: e.target.value })
    }
  }
  onChange = (data, type) => {
    if (type === 'cutormType') {
      this.exType = data
    } else if (type === 'mergeType') {
      this.exDisMode = data
    } else if (type === 'mergeTime') {
      this.searchTime = data
    } else {
      this.setState({ smultipleSearch: data.target.value })
    }
    // this.props.dispatch(getInitList({
    //     listType: 2,
    //     pageNum: this.props.resourceSystem.page.pageNum,
    //     pageSize: this.props.resourceSystem.page.pageSize,
    //     exType:this.exType,
    //     exDisMode:this.exDisMode,
    //     searchTime:this.searchTime,
    //     smultipleSearch:this.state.smultipleSearch,
    // }))
  }
  handleQuery = () => {
    this.props.dispatch(
      getInitList({
        pageNum: this.props.resourceSystem.page.pageNum,
        pageSize: this.props.resourceSystem.page.pageSize,
        exType: this.exType,
        exDisMode: this.exDisMode,
        searchTime: this.searchTime,
        smultipleSearch: this.state.smultipleSearch,
      })
    )
  }
  render() {
    const { queryBest } = this.props
    const { queryHeiBest, heiQueryData, columns } = this.state
    const { page, list,loading } = this.props.resourceSystem
    this.state.loading = loading;
    const { selectPoolList } = this.props
    const { selectedRowKeys } = this.props.search
    var custormData = this.props.custorm.data
    columns.forEach((item, index) => {
      if (item.dataIndex === 'name') {
        // columns[index].sorter = (a, b) => a.name.length - b.name.length
        columns[index].render = (text, record) => {
          const url = `/CRM/client/${record.key}?id=${record.key}&customerCategory=${record.type}&poolId=${record.poolId}&topicId=${record.topicId}&action=2&auditStatus=2&topName=资源管理`
          return <a onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
          }}>{text}</a>
        }
      }
      if (item.dataIndex === 'action') {
        columns[index].render = (text, record) => {
          return (
            <ColumnRender.AuditBtn singAudit={this.singAudit} record={record} />
          )
        }
      }
    })

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    let pagination = {
      onChange: this.pageChange,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      current: page.pageNum,
      defaultCurrent: 1,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }

    return (
      <Layout>
        <Wrap>
          <div className={style.ClueSystemWrap}>
            <SearchModule
              showHeiBtn
              startTime={moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD')}
              endTime={moment(new Date()).add(1, 'day').format('YYYY-MM-DD')}
              handleQueryBest={this.handleQueryBest}
              handleHeiQuery={this.handleHeiQuery}
              saveUserCheck={this.saveUserCheck}
              sortTable={this.sortTable}
              queryBest={queryBest}
              queryHeiBest={queryHeiBest}
              heiQueryData={heiQueryData}
              hidename="0"
            />
            <ContentWrap>
              <Table
                loading={this.state.loading}
                onChange={this.handleChange}
                title={this.renderHeaser}
                className={style.table}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={list}
                pagination={pagination}
              />
            </ContentWrap>
          </div>
          <Audit
            title="线索审核"
            disabled={false}
            visible={this.state.audit}
            cancle={this.auditCancle}
            ids={this.auditID}
            ok={this.auditOk}
          />

          <Modal
            title="资源合并"
            visible={this.state.visible1}
            onOk={this.handleMergeOk}
            onCancel={this.handleCancel}
            width={800}
            height={600}
            footer={<Button key="submit" type="primary" onClick={this.handleMergeOk}>
            确定
          </Button>}
          >
            <div className={style.modalContainer}>
              {(() => {
                if (this.state.custrormType === "1") {
                  //个人客户
                  return (
                    <div className={style.person}>
                      <div>
                        {(() => {
                          if (custormData)
                            return (
                              <ul className={style.line}>
                                <li
                                  className={
                                    custormData.name
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={this.onChangeName}
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData &&
                                        custormData.id.split(':')[0]
                                      }
                                    >
                                      客户姓名：<Input
                                        readOnly
                                        style={{width: '200px'}}
                                        placeholder="客户姓名"
                                        value={
                                          custormData.name &&
                                          custormData.name.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData &&
                                          custormData.id.split(':')[1]
                                        }
                                      >
                                        客户姓名：<Input
                                          readOnly
                                          style={{width: '200px'}}
                                          placeholder="客户姓名"
                                          value={
                                            custormData.name &&
                                            custormData.name.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.customerSourceName
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('source', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.source &&
                                        custormData.source.split(':')[0]
                                      }
                                    >
                                      客户来源：<Input
                                        readOnly
                                        style={{width: '200px'}}
                                        placeholder="客户来源"
                                        value={
                                          custormData.customerSourceName &&
                                          custormData.customerSourceName.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.source &&
                                          custormData.source.split(':')[1]
                                        }
                                      >
                                        客户来源：<Input
                                          readOnly
                                          style={{width: '200px'}}
                                          placeholder="客户来源"
                                          value={
                                            custormData.customerSourceName &&
                                            custormData.customerSourceName.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.sexStr
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e => this.onChangeRadio('sex', e)}
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.sexStr &&
                                        custormData.sexStr.split(':')[0]
                                      }
                                    >
                                      性别：<Input
                                        placeholder="性别"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.sexStr &&
                                          custormData.sexStr.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.sexStr &&
                                          custormData.sexStr.split(':')[1]
                                        }
                                      >
                                        性别：<Input
                                          placeholder="性别"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.sexStr &&
                                            custormData.sexStr.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.personalPhone
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('personalPhone', e)
                                    }
                                  >
                                   <Col className={style.itemWidth}>
                                    <Radio
                                      className={
                                        custormData.personalPhone
                                          ? style.showKey
                                          : style.hideKey
                                      }
                                      value={
                                        custormData.personalPhone &&
                                        custormData.personalPhone.split(':')[0]
                                      }
                                    >
                                      个人手机：<Input
                                        placeholder="个人手机"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.personalPhone &&
                                          custormData.personalPhone.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.personalPhone &&
                                          custormData.personalPhone.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        个人手机：<Input
                                          placeholder="个人手机"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.personalPhone &&
                                            custormData.personalPhone.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.workPhone
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('workPhone', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.workPhone &&
                                        custormData.workPhone.split(':')[0]
                                      }
                                    >
                                      工作手机：<Input
                                        placeholder="工作手机"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.workPhone &&
                                          custormData.workPhone.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.workPhone &&
                                          custormData.workPhone.split(':')[1]
                                        }
                                      >
                                        工作手机：<Input
                                          placeholder="工作手机"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.workPhone &&
                                            custormData.workPhone.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.fixedPhone
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('fixedPhone', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.fixedPhone &&
                                        custormData.fixedPhone.split(':')[0]
                                      }
                                    >
                                      固定电话：<Input
                                        placeholder="固定电话"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.fixedPhone &&
                                          custormData.fixedPhone.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.fixedPhone &&
                                          custormData.fixedPhone.split(':')[1]
                                        }
                                      >
                                        固定电话：<Input
                                          placeholder="固定电话"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.fixedPhone &&
                                            custormData.fixedPhone.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.weChat
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('weChat', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.weChat &&
                                        custormData.weChat.split(':')[0]
                                      }
                                    >
                                      微信：<Input
                                        placeholder="微信"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.weChat &&
                                          custormData.weChat.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.weChat &&
                                          custormData.weChat.split(':')[1]
                                        }
                                      >
                                        微信：<Input
                                          placeholder="微信"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.weChat &&
                                            custormData.weChat.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.QQ
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e => this.onChangeRadio('QQ', e)}
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.QQ &&
                                        custormData.QQ.split(':')[0]
                                      }
                                    >
                                      QQ：<Input
                                        placeholder="QQ"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.QQ &&
                                          custormData.QQ.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.QQ &&
                                          custormData.QQ.split(':')[1]
                                        }
                                      >
                                        QQ：<Input
                                          placeholder="QQ"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.QQ &&
                                            custormData.QQ.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.email
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('email', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.email &&
                                        custormData.email.split(':')[0]
                                      }
                                    >
                                      邮箱：<Input
                                        placeholder="邮箱"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.email &&
                                          custormData.email.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.email &&
                                          custormData.email.split(':')[1]
                                        }
                                      >
                                        邮箱：<Input
                                          placeholder="邮箱"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.email &&
                                            custormData.email.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.fax
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e => this.onChangeRadio('fax', e)}
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.fax &&
                                        custormData.fax.split(':')[0]
                                      }
                                    >
                                      传真：<Input
                                        placeholder="传真"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.fax &&
                                          custormData.fax.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.fax &&
                                          custormData.fax.split(':')[1]
                                        }
                                      >
                                        传真：<Input
                                          placeholder="传真"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.fax &&
                                            custormData.fax.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.birthday
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('birthday', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.birthday &&
                                        custormData.birthday.split(':')[0]
                                      }
                                    >
                                      出身年月：<Input
                                        placeholder="出身年月"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.birthday &&
                                          custormData.birthday.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.birthday &&
                                          custormData.birthday.split(':')[1]
                                        }
                                      >
                                        出身年月：<Input
                                          placeholder="出身年月"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.birthday &&
                                            custormData.birthday.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.school
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('school', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.school &&
                                        custormData.school.split(':')[0]
                                      }
                                    >
                                      毕业院校：<Input
                                        placeholder="毕业院校"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.school &&
                                          custormData.school.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.school &&
                                          custormData.school.split(':')[1]
                                        }
                                      >
                                        毕业院校：<Input
                                          placeholder="毕业院校"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.school &&
                                            custormData.school.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.education
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('education', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.education &&
                                        custormData.education.split(':')[0]
                                      }
                                    >
                                      学历：<Input
                                        placeholder="学历"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.educationName &&
                                          custormData.educationName.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.education &&
                                          custormData.education.split(':')[1]
                                        }
                                      >
                                        学历：<Input
                                          placeholder="学历"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.educationName &&
                                            custormData.educationName.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.graduationTime
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('graduationTime', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.graduationTime &&
                                        custormData.graduationTime.split(':')[0]
                                      }
                                    >
                                      毕业时间：<Input
                                        placeholder="毕业时间"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.graduationTime &&
                                          custormData.graduationTime.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.graduationTime &&
                                          custormData.graduationTime.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        毕业时间：<Input
                                          placeholder="毕业时间"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.graduationTime &&
                                            custormData.graduationTime.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.workingLife
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('workingLife', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.workingLife &&
                                        custormData.workingLife.split(':')[0]
                                      }
                                    >
                                      工作开始时间：<Input
                                        placeholder="工作开始时间"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.attackTime &&
                                          custormData.attackTime.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.attackTime &&
                                          custormData.attackTime.split(':')[1]
                                        }
                                      >
                                      工作开始时间：<Input
                                          placeholder="工作开始时间"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.attackTime &&
                                            custormData.attackTime.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.residence
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('residence', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.residence &&
                                        custormData.residence.split(':')[0]
                                      }
                                    >
                                      户口所在地：<Input
                                        placeholder="户口所在地"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.residenceName &&
                                          custormData.residenceName.split(':')[0] && custormData.residenceName.split(':')[0].split('#')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.residence &&
                                          custormData.residence.split(':')[1]
                                        }
                                      >
                                        户口所在地：<Input
                                          placeholder="户口所在地"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.residenceName &&
                                            custormData.residenceName.split(':')[1] && custormData.residenceName.split(':')[1].split('#')[0]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.residenceDetail
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('residenceDetail', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.residenceDetail &&
                                        custormData.residenceDetail.split(
                                          ':'
                                        )[0]
                                      }
                                    >
                                      户口详细地址：<Input
                                        placeholder="户口详细地址"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.residenceDetail &&
                                          custormData.residenceDetail.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.residenceDetail &&
                                          custormData.residenceDetail.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        户口详细地址：<Input
                                          placeholder="户口详细地址"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.residenceDetail &&
                                            custormData.residenceDetail.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.inAddress
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('inAddress', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.inAddress &&
                                        custormData.inAddress.split(':')[0]
                                      }
                                    >
                                      现住址：<Input
                                        placeholder="现住址"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.inAddressName &&
                                          custormData.inAddressName.split(':')[0] && custormData.inAddressName.split(':')[0].split('#')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.inAddress &&
                                          custormData.inAddress.split(':')[1]
                                        }
                                      >
                                        现住址：<Input
                                          placeholder="现住址"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.inAddressName &&
                                            custormData.inAddressName.split(':')[1] &&
                                            custormData.inAddressName.split(':')[1].split('#')[0]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.inAddressDetail
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('inAddressDetail', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.inAddressDetail &&
                                        custormData.inAddressDetail.split(
                                          ':'
                                        )[0]
                                      }
                                    >
                                      现住详细地址：<Input
                                        placeholder="现住详细地址"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.inAddressDetail &&
                                          custormData.inAddressDetail.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.inAddressDetail &&
                                          custormData.inAddressDetail.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        现住详细地址：<Input
                                          placeholder="现住详细地址"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.inAddressDetail &&
                                            custormData.inAddressDetail.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.idCard
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('idCard', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.idCard &&
                                        custormData.idCard.split(':')[0]
                                      }
                                    >
                                      身份证：<Input
                                        placeholder="身份证"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.idCard &&
                                          custormData.idCard.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.idCard &&
                                          custormData.idCard.split(':')[1]
                                        }
                                      >
                                        身份证：<Input
                                          placeholder="身份证"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.idCard &&
                                            custormData.idCard.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.nation
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('nation', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.nation &&
                                        custormData.nation.split(':')[0]
                                      }
                                    >
                                      民族：<Input
                                        placeholder="民族"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.nationName &&
                                          custormData.nationName.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.nation &&
                                          custormData.nation.split(':')[1]
                                        }
                                      >
                                        民族：<Input
                                          placeholder="民族"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.nationName &&
                                            custormData.nationName.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.nature
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('nature', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.nature &&
                                        custormData.nature.split(':')[0]
                                      }
                                    >
                                      性格：<Input
                                        placeholder="性格"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.nature &&
                                          custormData.nature.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.nature &&
                                          custormData.nature.split(':')[1]
                                        }
                                      >
                                        性格：<Input
                                          placeholder="性格"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.nature &&
                                            custormData.nature.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.bloodType
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                               <Row type="flex" justify="center" style={{textAlign:'right'}}>
                                  <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('bloodType', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.bloodType &&
                                        custormData.bloodType.split(':')[0]
                                      }
                                    >
                                      血型：<Input
                                        placeholder="血型"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.bloodTypenName &&
                                          custormData.bloodTypenName.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.bloodType &&
                                          custormData.bloodType.split(':')[1]
                                        }
                                      >
                                        血型：<Input
                                          placeholder="血型"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.bloodTypenName &&
                                            custormData.bloodTypenName.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.inAccountCode
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('accountCode', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.inAccountCode &&
                                        custormData.inAccountCode.split(':')[0]
                                      }
                                    >
                                      账号编码：<Input
                                        placeholder="账号编码"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.inAccountCode &&
                                          custormData.inAccountCode.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.inAccountCode &&
                                          custormData.inAccountCode.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        账号编码：<Input
                                          placeholder="账号编码"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.inAccountCode &&
                                            custormData.inAccountCode.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>
                                <li
                                  className={
                                    custormData.reason
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('reason', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.reason &&
                                        custormData.reason.split(':')[0]
                                      }
                                    >
                                      反馈详情：<Input
                                        readOnly
                                        style={{width: '200px'}}
                                        placeholder="反馈详情"
                                        value={
                                          custormData.reason &&
                                          custormData.reason.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.reason &&
                                          custormData.reason.split(':')[1]
                                        }
                                      >
                                        反馈详情：<Input
                                          placeholder="反馈详情"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.reason &&
                                            custormData.reason.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.inRemarks
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('remarks', e)
                                    }
                                  >
                                     <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.inRemarks &&
                                        custormData.inRemarks.split(':')[0]
                                      }
                                    >
                                      备注：<Input
                                        placeholder="备注"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.inRemarks &&
                                          custormData.inRemarks.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                       <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.inRemarks &&
                                          custormData.inRemarks.split(':')[1]
                                        }
                                      >
                                        备注：<Input
                                          placeholder="备注"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.inRemarks &&
                                            custormData.inRemarks.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>
                              </ul>
                            )
                        })()}
                      </div>
                    </div>
                  )
                } else if(this.state.custrormType === "2") {
                  //企业客户
                  return (
                    <div className={style.company}>
                      <div>
                        {(() => {
                          if (custormData) {
                            return (
                              <ul className={style.line}>
                                <li
                                  className={
                                    custormData.name
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                  <Row type="flex" justify="space-between" style={{textAlign:'right'}}>
                                  <RadioGroup
                                  name="radiogroup"
                                  className={style.radiogroup}
                                  onChange={this.onChangeName}
                                >
                                  <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.id &&
                                        custormData.id.split(':')[0]
                                      }
                                    >
                                      企业名称：<Input
                                        placeholder="企业名称"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.name &&
                                          custormData.name.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                  </Col>
                                   <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.id &&
                                          custormData.id.split(':')[1]
                                        }
                                      >
                                        企业名称：<Input
                                          placeholder="企业名称"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.name &&
                                            custormData.name.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                  </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.customerSourceName
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                               <Row type="flex" justify="center" style={{textAlign:'right'}}>
                                  <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('customerSource', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.source &&
                                        custormData.source.split(':')[0]
                                      }
                                    >
                                      客户来源：<Input
                                        placeholder="客户来源"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.customerSourceName &&
                                          custormData.customerSourceName.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.source &&
                                          custormData.source.split(':')[1]
                                        }
                                      >
                                        客户来源：<Input
                                          placeholder="客户来源"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.customerSourceName &&
                                            custormData.customerSourceName.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.reason
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center"  style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('reason', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.reason &&
                                        custormData.reason.split(':')[0]
                                      }
                                    >
                                      反馈详情：<Input
                                        placeholder="反馈详情"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.reason &&
                                          custormData.reason.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                    <Col className={style.itemWidth}>
                                      <Radio
                                        value={
                                          custormData.reason &&
                                          custormData.reason.split(':')[1]
                                        }
                                      >
                                        反馈详情：<Input
                                          placeholder="反馈详情"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.reason &&
                                            custormData.reason.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                    </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.enAddress
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center"  style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('enAddress', e)
                                    }
                                  >
                                  <Col className={style.itemWidth}>
                                    <Radio
                                      value={
                                        custormData.enAddress &&
                                        custormData.enAddress.split(':')[0]
                                      }
                                    >
                                      企业所在地：<Input
                                        placeholder="企业所在地"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.enAddressName &&
                                          custormData.enAddressName.split(':')[0].split('#')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                    <Col className={style.itemWidth}>
                                      <Radio
                                        value={
                                          custormData.enAddress &&
                                          custormData.enAddress.split(':')[1]
                                        }
                                      >
                                        企业所在地：<Input
                                          placeholder="企业所在地"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.enAddressName &&
                                            custormData.enAddressName.split(':')[1].split('#')[0]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.enAddressDetail
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                  <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('enAddressDetail', e)
                                    }
                                  >
                                  <Col className={style.itemWidth}>
                                    <Radio
                                      value={
                                        custormData.enAddressDetail &&
                                        custormData.enAddressDetail.split(
                                          ':'
                                        )[0]
                                      }
                                    >
                                      企业详细地址：<Input
                                        placeholder="企业详细地址"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.enAddressDetail &&
                                          custormData.enAddressDetail.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                    <Col className={style.itemWidth}>
                                      <Radio
                                        value={
                                          custormData.enAddressDetail &&
                                          custormData.enAddressDetail.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        企业详细地址：<Input
                                          placeholder="企业详细地址"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.enAddressDetail &&
                                            custormData.enAddressDetail.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                  </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.star
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                  <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('star', e)
                                    }
                                  >
                                  <Col className={style.itemWidth}>
                                    <Radio
                                      value={
                                        custormData.star &&
                                        custormData.star.split(':')[0]
                                      }
                                    >
                                      所属类别：<Input
                                        placeholder="所属类别"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.starName &&
                                          custormData.starName.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.star &&
                                          custormData.star.split(':')[1]
                                        }
                                      >
                                      所属类别：<Input
                                          placeholder="所属类别"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.starName &&
                                            custormData.starName.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.category
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                  <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('category', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.category &&
                                        custormData.category.split(':')[0]
                                      }
                                    >
                                      企业类别：<Input
                                        placeholder="企业类别"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.categoryName &&
                                          custormData.categoryName.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.category &&
                                          custormData.category.split(':')[1]
                                        }
                                      >
                                        企业类别：<Input
                                          placeholder="企业类别"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.categoryName &&
                                            custormData.categoryName.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.scale
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('scale', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.scale &&
                                        custormData.scale.split(':')[0]
                                      }
                                    >
                                      规模：<Input
                                        placeholder="规模"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.scaleName &&
                                          custormData.scaleName.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.scale &&
                                          custormData.scale.split(':')[1]
                                        }
                                      >
                                        规模：<Input
                                          placeholder="规模"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.scaleName &&
                                            custormData.scaleName.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.capital
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('capital', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.capital &&
                                        custormData.capital.split(':')[0]
                                      }
                                    >
                                      注册资金：<Input
                                        placeholder="注册资金"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.capital &&
                                          custormData.capital.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.capital &&
                                          custormData.capital.split(':')[1]
                                        }
                                      >
                                        注册资金：<Input
                                          placeholder="注册资金"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.capital &&
                                            custormData.capital.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.legalRe
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('legalRe', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.legalRe &&
                                        custormData.legalRe.split(':')[0]
                                      }
                                    >
                                      法人代表：<Input
                                        placeholder="法人代表"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.legalRe &&
                                          custormData.legalRe.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.legalRe &&
                                          custormData.legalRe.split(':')[1]
                                        }
                                      >
                                        法人代表：<Input
                                          placeholder="法人代表"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.legalRe &&
                                            custormData.legalRe.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.establDate
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('establDate', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.establDate &&
                                        custormData.establDate.split(':')[0]
                                      }
                                    >
                                      成立日期：<Input
                                        placeholder="成立日期"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.establDate &&
                                          custormData.establDate.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.establDate &&
                                          custormData.establDate.split(':')[1]
                                        }
                                      >
                                        成立日期：<Input
                                          placeholder="成立日期"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.establDate &&
                                            custormData.establDate.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.companyWebsite
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('companyWebsite', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.companyWebsite &&
                                        custormData.companyWebsite.split(':')[0]
                                      }
                                    >
                                      公司网址：<Input
                                        placeholder="公司网址"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.companyWebsite &&
                                          custormData.companyWebsite.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.companyWebsite &&
                                          custormData.companyWebsite.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        公司网址：<Input
                                          placeholder="公司网址"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.companyWebsite &&
                                            custormData.companyWebsite.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.isBuild
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                <Row>
                                  <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('isBuild', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.isBuild &&
                                        custormData.isBuild.split(':')[0]
                                      }
                                    >
                                      是否筹建：<Input
                                        placeholder="是否筹建"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.isBuild ? custormData.isBuild.split(':')[0] === 1 ? '是' : '否' : ''
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.isBuild &&
                                          custormData.isBuild.split(':')[1]
                                        }
                                      >
                                        是否筹建：<Input
                                          placeholder="是否筹建"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.isBuild ? custormData.isBuild.split(':')[1] === 1 ? '是' : '否' : ''
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.isGroup
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('isGroup', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.isGroup &&
                                        custormData.isGroup.split(':')[0]
                                      }
                                    >
                                      是否集团：<Input
                                        placeholder="是否集团"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.isGroup ?
                                          custormData.isGroup.split(':')[0] === 1 ? '是' : '否' : ''
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.isGroup &&
                                          custormData.isGroup.split(':')[1]
                                        }
                                      >
                                        是否集团：<Input
                                          placeholder="是否集团"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.isGroup ?
                                          custormData.isGroup.split(':')[1] === 1 ? '是' : '否' : ''
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.openingTime
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('openingTime', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.openingTime &&
                                        custormData.openingTime.split(':')[0]
                                      }
                                    >
                                      开业日期：<Input
                                        placeholder="开业日期"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.openingTime &&
                                          custormData.openingTime.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.openingTime &&
                                          custormData.openingTime.split(':')[1]
                                        }
                                      >
                                        开业日期：<Input
                                          placeholder="开业日期"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.openingTime &&
                                            custormData.openingTime.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                      </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.superiorUnit
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('superiorUnit', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.superiorUnit &&
                                        custormData.superiorUnit.split(':')[0]
                                      }
                                    >
                                      上级单位：<Input
                                        placeholder="上级单位"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.superiorUnitName &&
                                          custormData.superiorUnitName.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.superiorUnit &&
                                          custormData.superiorUnit.split(':')[1]
                                        }
                                      >
                                        上级单位：<Input
                                          placeholder="上级单位"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.superiorUnitName &&
                                            custormData.superiorUnitName.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.enAccountCode
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('accountCode', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.enAccountCode &&
                                        custormData.enAccountCode.split(':')[0]
                                      }
                                    >
                                      账号编码：<Input
                                        placeholder="账号编码"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.enAccountCode &&
                                          custormData.enAccountCode.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.enAccountCode &&
                                          custormData.enAccountCode.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        账号编码：<Input
                                          placeholder="账号编码"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.enAccountCode &&
                                            custormData.enAccountCode.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.enterpriseProfile
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('enterpriseProfile', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.enterpriseProfile &&
                                        custormData.enterpriseProfile.split(
                                          ':'
                                        )[0]
                                      }
                                    >
                                      企业简介：<Input
                                        placeholder="企业简介"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.enterpriseProfile &&
                                          custormData.enterpriseProfile.split(
                                            ':'
                                          )[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.enterpriseProfile &&
                                          custormData.enterpriseProfile.split(
                                            ':'
                                          )[1]
                                        }
                                      >
                                        企业简介：<Input
                                          placeholder="企业简介"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.enterpriseProfile &&
                                            custormData.enterpriseProfile.split(
                                              ':'
                                            )[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>

                                <li
                                  className={
                                    custormData.enRemarks
                                      ? style.showKey
                                      : style.hideKey
                                  }
                                >
                                 <Row type="flex" justify="center" style={{textAlign:'right'}}>                                   <RadioGroup
                                    name="radiogroup"
                                    className={style.radiogroup}
                                    onChange={e =>
                                      this.onChangeRadio('remarks', e)
                                    }
                                  >
                                    <Col className={style.itemWidth}>                                     <Radio
                                      value={
                                        custormData.enRemarks &&
                                        custormData.enRemarks.split(':')[0]
                                      }
                                    >
                                      备注：<Input
                                        placeholder="备注"
                                        style={{width: '200px'}}
                                        readOnly
                                        value={
                                          custormData.enRemarks &&
                                          custormData.enRemarks.split(':')[0]
                                        }
                                      />
                                    </Radio>
                                    </Col>
                                      <Col className={style.itemWidth}>                                     <Radio
                                        value={
                                          custormData.enRemarks &&
                                          custormData.enRemarks.split(':')[1]
                                        }
                                      >
                                        备注：<Input
                                          placeholder="备注"
                                          style={{width: '200px'}}
                                          readOnly
                                          value={
                                            custormData.enRemarks &&
                                            custormData.enRemarks.split(':')[1]
                                          }
                                        />
                                      </Radio>
                                    </Col>
                                  </RadioGroup>
                                  </Row>
                                </li>
                              </ul>
                            )
                          } else {
                            return <div />
                          }
                        })()}
                      </div>
                    </div>
                  )
                } else {
                  return null
                }
              })()}
            </div>
          </Modal>

          <Modal
            title="将客户分配至公海"
            visible={this.state.visible0}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <div className={style.number}>
              <div style={{overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap',display:'flex',marginBottom:'5px'}}>
                <div style={{width:'90px',textAlign:'right'}}>客户编号：</div>{this.state.number && this.state.number.substr(0,this.state.number.length-1)}
              </div>
            </div>
            <div className={style.number}>
              <div style={{overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap',display:'flex',marginBottom:'5px'}}>
                <div style={{width:'90px',textAlign:'right'}}>客户名称：</div>{this.state.name && this.state.name.substr(0,this.state.name.length-1)}
              </div>
            </div>
            <div style={{display:'flex'}}>
              <div style={{width:'90px',textAlign:'right'}}>分配至公海：</div>
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
                  value={this.state.poolText}
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
        </Wrap>
      </Layout>
    )
  }
}

export default ResourceSystem
