import React, { Component } from 'react'
import style from '../ClientSystem/style.less'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import Layout from '../Wrap'
import store from 'store'
import PropTypes from 'prop-types'
import moment from 'moment'
import {connect} from 'react-redux'
import {TableHeaderClient} from '../../components/TableHeaderClient'
import {FormMyBusinessSearch} from '../../components/FormBusinessSearch'
import {FormBusiList} from '../../components/FormBusiList'
import ContentWrap from '../Content'
import AuthRequire from '../../components/AuthRequire'
import { createForm } from 'rc-form'
import { Table, Button, Input, Select, Icon, Modal, message } from 'antd'
import {getBusinesstList,getOpportById,deleteBusiness,addOpport,getProductList} from '../../actions/businessSystem'
import {selectAllCheneseName} from '../../actions/clientSystem'
import F from '../../helper/tool'
import { baseURL } from '../../config'
import { getUrlParam } from '../../util'
import {
  selectKey,
  deleteSelect,
} from '../../actions/search'
const {Wrap} = Layout
const Option = Select.Option
const auth = store.get('crm') || {}

@connect((state) => {
  return {
    search: state.search,
    businessSystem: state.businessSystem,
    clientSystem: state.clientSystem,
  }
})
@createForm()
class MyBusiness extends Component {
  constructor(props) {
    super(props)
    this.outValues = {} // 搜索条件
    this.assignNumber = [] // 启用禁用的id
    this.clientIds = []
    this.columnsMyBusi = [{
      title: '商机编号',
      dataIndex: 'busNumber',
    }, {
      title: '商机类型',
      dataIndex: 'busType',
    }, {
      title: '商机状态',
      dataIndex: 'busStatus',
    }, {
      title: '客户名称',
      dataIndex: 'customerName',
    }, {
      title: '预计销售金额',
      dataIndex: 'esMoney',
    }, {
      title: '预计签单日期',
      dataIndex: 'esBillDate',
      render:(text,record) => {
        return text ? moment(text).format("YYYY-MM-DD") : ''
      },
    }, {
      title: '添加时间',
      dataIndex: 'createTime',
    }, {
      title: '操作',
      dataIndex: 'action',
    }]
  }
  static propTypes = {
  }
  state = {
    visible: false,
    visibleBusi: false,
    value: 2,
    columns: [],
    busiData: '',
    loading:false,
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
    let [number,id] = ['','']
    data.map((item, index) => {
      item.length === index ? number += item.number : number += item.number + ','
      item.length === index ? id += item.id : id += item.id + ','
      return {}
    })
    this.props.dispatch(selectKey(key))
    // this.clientIds = key
    this.setState({number,id})
    if(number){
        this.numbers = number.split(',')
        this.numbers.pop()
    }
    if(id){
        this.ids = id.split(',')
        this.ids.pop()
    }
  }

  handleCancel = () => {
    this.assignNumber = []

    this.setState({
      visible: false,
      selectedRowKeys: [],
    })
  }

  renderHeaser = () => { // 表格头部
    return (
      <TableHeaderClient {...this.props} exportTable={this.exportTable} />
    )
  }

  exportTable = () => {
    const { selectedRowKeys } = this.props.search
    if (selectedRowKeys.length === 0) {
      return message.info('请选择商机编号', 1)
    }
    const id = selectedRowKeys.join(',')
    const URL = baseURL() + '/excel/business_download'
    const down = `${URL}?token=${auth.token}&loginName=${auth.user.username}&id=${id}`
    window.location.href = down
  }

  clientQuery = (clientInfo) => { // 基本搜索
    // if(clientInfo.type === undefined || clientInfo.depCode == undefined || clientInfo.userId === undefined){
    //   return message.info('请选择筛选调教进行搜索',1)
    // }
    this.props.businessSystem.loading = true;
    this.setState({
        loading:true,
    })
    const { page } = this.props.businessSystem
    const upData = F.filterUndefind(clientInfo)
    // let [nextFlowTime,nextFlowTimeStart] = [upData.flowTime[0],upData.flowTime[1]]
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
    const outValues = {
      type: upData.type || '',
      // esMoney: upData.esMoney || '',
      // createTime: nextFlowTime ? nextFlowTime.format('YYYY-MM-DD') : '',
      // modifyTime: nextFlowTimeStart ? nextFlowTimeStart.format('YYYY-MM-DD') : '',
      address: upData.address?upData.address.join(""):'',
      customerName: upData.customerName || '',
    }
    this.props.dispatch(getBusinesstList({
      userId:crm.user && crm.user.id || "",
      deps: departments,
      pageNum: 1,
      pageSize: page.pageSize,
      ...outValues,
    }))
    this.outValues = outValues
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
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

    this.props.dispatch(getBusinesstList({
      userId:crm.user && crm.user.id || "",
      deps: departments,
      pageNum,
      pageSize,
      ...this.outValues,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
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
    this.props.dispatch(getBusinesstList({
      userId:crm.user && crm.user.id || "",
      deps: departments,
      pageNum,
      pageSize,
      ...this.outValues,
    }))
  }

  componentDidMount() {
    const { page } = this.props.businessSystem
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
    this.props.dispatch(getBusinesstList({ // 初始化lis
      userId:crm && crm.user && crm.user.id || "",
      deps: departments,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))

    this.props.dispatch(selectAllCheneseName({ // 跟进人列表
      code,
    })).then(data => {
      // const nameData = data.data
      // this.nameData = nameData
      // this.setState({
      //   nameList: this.nameData,
      // })
    }).catch(err => {
      console.log(err)
    })
  }
  componentWillMount(){
    //this.props.dispatch(getProductList({}));
  }
  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  viewBusiness = (bId,busStatus) => {
    this.props.dispatch(getOpportById({
      id:bId,
    })).then(data => {
      if(data && data.code === 0){
        this.setState({
          // busiData: data.data,
          visibleBusi: true,
          busStatus: busStatus,
          showTitle: '查看商机',
          action: 3,
        })
      }else{
        if(data){
          message.error(data.msg)
        }
      }

    })
  }

  handleCancel = () => {
   this.setState({
     visibleBusi: false,
   })
  }

  //作废商机
  cancelBusiness = (bId) => {
    Modal.confirm({
       title: '商机即将作废，请谨慎操作！是否确认作废?',
       content: '',
       okText: '确认',
       cancelText: '取消',
       onOk: this.hideDeleteModal,
       okType: 'danger',
   })
   this.bId = bId
  }

  hideDeleteModal = () => {
    const { page } = this.props.businessSystem
    const bId = this.bId
    this.props.dispatch(deleteBusiness({
      id: bId,
    })).then(data => {
      if(data && data.code !== 0) return message.error(data.msg)
      if(data && data.code === 0) {
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
        this.props.dispatch(getBusinesstList({
          userId:crm.user && crm.user.id || "",
          deps: departments,
          pageNum: page.pageNum,
          pageSize: page.pageSize,
        }))
        this.setState({
          visible: false,
        })
        return message.success(data.msg)
      }
    })
  }

  showFormBusi = () => {
    const { visibleBusi, showTitle, action, busiData} = this.state
    if (action === 3) { //修改商机
      return (
        <FormBusiList
          ref={(form) => this.formBusi = form}
          title={showTitle}
          visible={visibleBusi}
          busStatus={this.state.busStatus}
          {...this.props}
          cancle={this.handleCancel}
          ok={this.saveOk}
          // busiData={busiData}
          action={action}
          productList={this.props.businessSystem.productList}
        />
      )
    }
  }

  saveOk = (value,action,bId) => {
    const { page } = this.props.clientSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id} = parsed

    const upData = F.filterUndefind(value)
    const outValues = {
      customerId: id,
      busNumber: value.busNumber || '',
      userName: value.userName || '',
      esMoney: value.esMoney || '',
      esBillDate: value.esBillDate ? value.esBillDate.format('YYYY-MM-DD') : '',
      products: value.products || '',
      type: value.busType || '',
      status: value.busStatus || '',
      busSource: value.busSource || '',
      remarks: value.remarks || '',
    }
    if (action === 2 || action === 3) {
      this.props.dispatch(addOpport({
        id: bId,
        ...F.filterUndefind(outValues),
      })).then(data => {
        if (data) {
          message.success(data.msg)
          this.handleCancel()
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
          this.props.dispatch(getBusinesstList({ // 初始化list
            userId:crm.user && crm.user.id || "",
            deps: departments,
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          }))
        }
      })
    }
  }

  render() {
    const { visible, confirmLoading } = this.state
    const { businesstList, page, loading} = this.props.businessSystem // count, feadBack
    const {nameList} = this.props.clientSystem
    const { selectedRowKeys } = this.props.search
    let columnsMyBusi  = this.columnsMyBusi
    columnsMyBusi.forEach((item, index) => { //我的商机
      if(item.dataIndex === 'busNumber'){
        columnsMyBusi[index].render = (text, record) => {
          return (
            <a onClick={ () => {this.viewBusiness(record.id,record.busStatus)}}>{text}</a>
          )
        }
      }
      if(item.dataIndex === 'action'){
        columnsMyBusi[index].render = (text, record) => {
          return (
            <div>
                {(()=>{
                    if(record.contractStatus === "" || record.contractStatus === 0){
                        return <div>
                         <AuthRequire authName="sys:mybusiness:tovoid"><a onClick={ () => {this.cancelBusiness(record.id)}}>作废商机 </a></AuthRequire>
                         <AuthRequire authName="sys:mybusiness:turnto">
                           <Link to={"/CRM/newContract?busid="+record.id+"&customerId="+record.customerId+"&topicId="+record.topicId+"&busNumber="+record.busNumber+"&topName=转为合同"}> 转为合同</Link>
                         </AuthRequire>
                       </div>
                    }else{
                        return <div>
                             <span style={{color:'#e9e9e9'}}> 作废商机</span>
                             <span style={{color:'#e9e9e9'}}> 转为合同</span>
                        </div>
                    }
                })()}
            </div>
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
    this.state.loading = loading
    return (
      <Layout>
        <Wrap>
          <div className={style.MyClueWrap}>
            <ContentWrap style={{ borderTop: 'none' }}>
              <div className={style.listHeader}>
                <div className={style.listTitle}>
                  <div>
                    <Icon type="search" className={style.search} />
                    &ensp;筛选查询
                  </div>
                  <div>
                    <Button style={{display: 'none'}} onClick={this.clientQuery}>查询结果</Button>
                  </div>
                </div>
                <div className={style.listTop}>
                  <FormMyBusinessSearch
                    {...this.props}
                    nameList={nameList}
                    clientQuery={this.clientQuery}
                  />
                </div>
              </div>
              <Table
                loading={this.state.loading}
                title={this.renderHeaser}
                className={style.table}
                rowSelection={rowSelection}
                columns={columnsMyBusi}
                dataSource={businesstList}
                pagination={pagination}
              />
              {this.showFormBusi()}
            </ContentWrap>
          </div>
        </Wrap>
      </Layout>
    )
  }
}

export default MyBusiness
