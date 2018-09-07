import React, { Component } from 'react'
import style from '../ClientSystem/style.less'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import Layout from '../Wrap'
import store from 'store'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {TableHeaderClient} from '../../components/TableHeaderClient'
import {FormBusinessSearch} from '../../components/FormBusinessSearch'
import {FormBusiList} from '../../components/FormBusiList'
import SearchModule from '../../components/SearchModule'
import ContentWrap from '../Content'
import { createForm } from 'rc-form'
import { Table, Button, Input, Select, Icon, Modal, message } from 'antd'
import {getBusinesstList,getOpportById,addOpport,getProductList, geiHeiList} from '../../actions/businessSystem'
import {selectAllCheneseName} from '../../actions/clientSystem'
import F from '../../helper/tool'
import { baseURL } from '../../config'
import {
  getQueyBest,
  getQeryData,
  selectKey,
  saveUserChecked,
  sortTable,
  getHasSelectitem,
  deleteSelect,
} from '../../actions/search'
import ColumnGroup from 'antd/lib/table/ColumnGroup';
const {Wrap} = Layout
const Option = Select.Option
const auth = store.get('crm') || {}
@connect((state) => {
  return {
    search: state.search,
    businessSystem: state.businessSystem,
    clientSystem: state.clientSystem,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
  }
})
@createForm()
class BusinessSystem extends Component {
  constructor(props) {
    super(props)
    this.outValues = {} // 搜索条件
    this.assignNumber = [] // 启用禁用的id
    this.clientIds = []
    this.queryCondition = {}
    this.queryAdvCondition = {}
  }
  static propTypes = {
  }
  state = {
    visible: false,
    visibleBusi: false,
    value: 2,
    columns: [],
    busiData: '',
    heiQueryData: [],
    queryHeiBest: [],
    loading:true,
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
    const { page } = this.props.businessSystem
    const upData = F.filterUndefind(clientInfo)
    let userName
    if (upData.userId === "0") {
      userName = ''
    } else {
      userName = upData.userId
    }
    const outValues = {
      type: upData.type || '',
      departmentName: upData.depCode || '',
      userName: userName || '',
    }
    this.props.dispatch(getBusinesstList({
      deps: this.state.deps,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...outValues,
    }))
    this.outValues = outValues
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    if (this.isBest) {
      this.props.dispatch(getBusinesstList({
        deps: this.state.deps,
        pageNum,
        pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        deps: this.state.deps,
        listType: 4,
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.queryAdvCondition,
      }))
    }
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    if (this.isBest) {
      this.props.dispatch(getBusinesstList({
        deps: this.state.deps,
        pageNum,
        pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        deps: this.state.deps,
        listType: 4,
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.queryAdvCondition,
      }))
    }
  }

  componentDidMount() {
    const crm = store.get('crm')
    let deps = ''
    if(crm && crm.user && crm.user.department) {
      deps = crm.user.department.deptCode
      this.setState({
        deps: crm.user.department.deptCode,
      })
    }
    const { page } = this.props.businessSystem
    this.props.dispatch(getBusinesstList({ // 初始化lis
      deps: deps,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 4,
    }))
    this.props.dispatch(getHasSelectitem({ // 高级搜索 默认item
      listType: 4,
    }))
    this.props.dispatch(getQeryData({ // 高级搜索 所有数据
        from: 4,
    }))
    this.props.dispatch(selectAllCheneseName({
      code: deps,
    }))
    // this.props.dispatch(getProductList({}))
    // this.props.dispatch(selectAllCheneseName({ // 跟进人列表
    //   code,
    // })).then(data => {
    //   // const nameData = data.data
    //   // this.nameData = nameData
    //   // this.setState({
    //   //   nameList: this.nameData,
    //   // })
    // }).catch(err => {
    // })
  }
  componentWillMount() {
  }
  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }
  componentWillReceiveProps(props) {
    this.setState({
      heiQueryData: props.heiQueryData,
      queryHeiBest: props.queryHeiBest,
    })
    // if(this.props.clueSystem != props.clueSystem){
    //     const columns = this.props.clueSystem.columns.filter(item => item.checked)
    //     this.setState({columns})
    // }
  }

  viewBusiness = (bId,busStatus) => {
    this.props.dispatch(getOpportById({
      id:bId,
    })).then(data => {
      this.setState({
        busiData: data.data,
        visibleBusi: true,
        busStatus: busStatus,
        showTitle: '查看商机',
        action: 3,
      })
    })
  }

  handleCancel = () => {
   this.setState({
     visibleBusi: false,
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
          busiData={busiData}
          action={action}
          productList={this.props.businessSystem.productList}
        />
      )
    }
  }

  sortTable = (obj) => { // 排序
    if (obj.items) {
      const list = []
      obj.items.forEach(item => {
        list.push({
          itemId: item.id,
          sort: item.sort,
        })
      })
      this.props.dispatch(sortTable({
        list: JSON.stringify(list),
      }))
    }
  }

  saveUserCheck = (heiQueryData) => { // 保存用户选择的item
    const searchList = []
    heiQueryData.map(item => {
      if (item.checked) {
        searchList.push(item.id)
      }
      // return {}
    })
    this.props.dispatch(saveUserChecked({ // 保存已选择的item后重新获取默认的高级搜索项
      searchList,
      listType: 4,
    })).then(() => {
      this.props.dispatch(getHasSelectitem({
        listType: 4,
      }))
    })
  }

  handleQueryBest = (value) => { // 初级查询
      this.props.businessSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.businessSystem
    const ss = F.filterUndefind(value)
    this.setState({
        searchCondition:ss,
        searchPageNum:page.pageNum,
        searchPageSize:page.pageSize,
    })
    this.isBest = true
    this.queryCondition = Object.assign(this.queryCondition, ss)
    if(this.queryCondition.address){
      this.queryCondition.address = this.queryCondition.address.join("")
    }
    this.props.dispatch(getBusinesstList({
      deps: this.state.deps,
      pageNum: 1,
      pageSize: page.pageSize,
      ...this.queryCondition,
    })).then((data)=>{
        // if(data && data.data && data.data.data.length == 0){
        //     var maxPage = parseInt(data.data.page.total/data.data.page.pageSize);
        //     if(data.data.page.total/data.data.page.pageSize > parseInt(data.data.page.total/data.data.page.pageSize)){
        //         maxPage = parseInt(data.data.page.total/data.data.page.pageSize)+1
        //     }
        //     this.props.dispatch(getBusinesstList({
        //       deps: this.state.deps,
        //       pageNum: maxPage,
        //       pageSize: page.pageSize,
        //       ...this.queryCondition,
        //   }))
        // }
    })
  }

  handleHeiQuery = (value) => { // 高级查询
    const { page } = this.props.businessSystem
    const ss = F.filterUndefind(value)
    this.isBest = false
    this.queryAdvCondition = JSON.stringify(ss)
    this.props.dispatch(geiHeiList({
      deps: this.state.deps,
      listType: 4,
      pageNum: 1,
      pageSize: page.pageSize,
      ...ss,
    }))
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
          this.props.dispatch(getBusinesstList({ // 初始化list
            deps: this.state.deps,
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          }))
        }
      })
    }
  }

  render() {
    const { queryBest } = this.props
    const { queryHeiBest, heiQueryData } = this.state
    const { visible, confirmLoading } = this.state
    // const { getFieldProps,getFieldDecorator } = this.props.form // getFieldError
    const { businesstList, page, loading, columns} = this.props.businessSystem // count, feadBack
    this.state.loading = loading
    const {nameList} = this.props.clientSystem
    const { selectedRowKeys } = this.props.search

    columns.forEach((item, index) => {
      if(item.dataIndex === 'busNumber'){
        // columns[index].sorter = (a, b) => a.busNumber.length - b.busNumber.length
        columns[index].render = (text, record) => {
          return (
            <a onClick={ () => {this.viewBusiness(record.id,record.busStatus)}}>{text}</a>
          )
        }
      }
      // if(item.dataIndex === 'action'){
      //   columns[index].render = (text, record) => {
      //     return <ColumnRender.AuditBtn singAudit={this.singAudit} record={record} />
      //   }
      // }
    })

    columns.forEach((item, index) => {
      if(item.dataIndex === 'action'){
        // columns[index].sorter = (a, b) => a.busNumber.length - b.busNumber.length
        columns[index].render = (text, record) => {
          return (
            <span>无</span>
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
          <div className={style.MyClueWrap}>
            <SearchModule
              showHeiBtn={false}
              handleQueryBest={this.handleQueryBest}
              handleHeiQuery={this.handleHeiQuery}
              saveUserCheck={this.saveUserCheck}
              sortTable={this.sortTable}
              queryBest={queryBest}
              queryHeiBest={queryHeiBest}
              heiQueryData={heiQueryData}
              hidename="0"
            />
            <ContentWrap style={{ borderTop: 'none' }}>
            {
              /*
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
                  <FormBusinessSearch
                    {...this.props}
                    nameList={nameList}
                    clientQuery={this.clientQuery}
                  />
                </div>
              </div>
              */
            }
              <Table
                loading={this.state.loading}
                title={this.renderHeaser}
                className={style.table}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={businesstList}
                pagination={pagination}
              />
              {this.showFormBusi() }
            </ContentWrap>
          </div>
        </Wrap>
      </Layout>
    )
  }
}

export default BusinessSystem
