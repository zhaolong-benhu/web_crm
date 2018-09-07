/**
 * Created by zhaolong on 2018/03/21
 * File description:我的合同
 */
'use strict';
import React, { Component } from 'react'
import { Pagination } from 'antd';
import store from 'store'
import style from './style.less'
import SearchModule from '../../components/SearchModule'
import Layout from '../Wrap'
import {connect} from 'react-redux'
import { Table, Modal, message, Select, Input, Button, Icon, InputNumber  } from 'antd'
import {Audit} from '../../components/TableBtns'
import { QueryTime } from '../../components/QueryItem'
import ContentWrap from '../Content'
import TableHeader from '../../components/TableHeader'
import {default as ColumnRender} from '../../components/TableColumn'
import F from '../../helper/tool'
import DfwsSelect from 'dfws-antd-select'
import { baseURL, dictUrl } from '../../config'
import {
  getQueyBest,
  getQeryData,
  selectKey,
  saveUserChecked,
  sortTable,
  getHasSelectitem,
  deleteSelect,
} from '../../actions/search'
import {
  getInitList,
  geiHeiList,
  getNumber,
  userAudit,
} from '../../actions/contractSystem'
import {newWindow} from '../../util/'
const {Wrap} = Layout
const Option = Select.Option;
@connect((state) => {
  return {
    contractSystem: state.contractSystem,
    search: state.search,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
  }
})
class MyContract extends Component {
    state = {
      heiQueryData: [],
      queryHeiBest: [],
      audit: false,
      modalTwo: false,
      errMsg: '',
      value: 2,
      number: '', // 审核的编号
      columns: [],
      status:"",
      coPaymentSit:"",
      customerName:"",
      loading:false,
    }

  constructor(props) {
    super(props)
    this.isBest = true // 判断是否走高级搜索接口
    this.queryCondition = {} // 搜索条件
    this.auditID = [] // 审核的id
    this.numbers = [] //勾选的合同编号
    this.alrExaminenumber = [] //已经审核的客户编号

    this.columns = [{
      title: '合同编号',
      dataIndex: 'contractNumber',
      checked: true,
      key: 1,
    }, {
      title: '对应客户',
      dataIndex: 'customerName',
      checked: true,
      key: 2,
    }, {
      title: '合同总金额',
      dataIndex: 'totalAmount',
      checked: true,
      key: 3,
    }, {
      title: '支付情况',
      dataIndex: 'paymentSit',
      checked: true,
      key: 4,
    }, {
      title: '合同状态',
      dataIndex: 'statusStr',
      checked: true,
      key: 5,
    }, {
      title: '添加时间',
      dataIndex: 'createTime',
      checked: true,
      key: 6,
    }]
}

  onSelectChange = (key, data) => { // 勾选表格
    let number = ''
    data.map((item, index) => {
      item.length === index ? number += item.number : number += item.number + ','
      return {}
    })
    this.props.dispatch(selectKey(key))
    this.auditID = key
    this.setState({number})
    if(number){
        this.numbers = number.split(',')
        this.numbers.pop()
        for(var i=0;i<this.alrExaminenumber.length;i++)
        {
          for(var j=0;j<this.numbers.length;j++)
          {
            if(this.numbers[j] === this.alrExaminenumber[i]){
              this.numbers.splice(j,1);
              j=j-1;
            }
          }
        }
        this.numbers = this.numbers;
    }
  }

  getCheckboxProps = (data) => { // 不能勾选的表格
    const {list} = this.props.contractSystem
    const arr = []
    list.forEach(item => {
      // if (item.status === 1) {
        arr.push(item.id)
      // }
    })
    return {
      disabled: arr.indexOf(data.id) < 0,
    }
  }

  renderHeaser = () => {
    return (
      <TableHeader
        dataSource={this.columns}
        menuSure={this.menuSure}
        upLoadFail={this.upLoadFail}
        submitMoreAudit={this.submitMoreAudit}
        exportDoc={this.exportTable}
        type="contract"
        />
    )
  }

  upLoadFail = (info) => {
    const { page } = this.props.contractSystem
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 0 && info.file.response.msg === '') {
        this.setState({
          errMsg: '上传成功',
          modalTwo: true,
        }, () => {
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
          this.props.dispatch(getInitList({ // 初始化list
            deps: departments,
            listType: 1,
            contractClass: 2,
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          }))
        })
      } else {
        const errMsg = info.file.response.msg
        this.setState({
          errMsg,
          modalTwo: true,
        })
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}文件上传失败`)
    }
  }

  singAudit = (record) => { // 单个审核数据
    this.auditID.push(record.id)
    this.setState({
      audit: true,
      number: record.number,
    })
  }
  //导出
  exportTable = () => {
    // const { selectedRowKeys } = this.props.search
    // if (selectedRowKeys.length === 0) {
    //   return message.info('请选择商机编号', 1)
    // }
    // const id = selectedRowKeys.join(',')
    // const URL = baseURL() + '/excel/business_download'
    // const down = `${URL}?token=${auth.token}&loginName=${auth.user.username}&id=${id}`
    // console.log(down)
    // window.location.href = down
  }
  submitMoreAudit = () => { // 多个审核
    const { selectedRowKeys } = this.props.search
    if (selectedRowKeys.length === 0) {
      return message.info('请选择合同编号', 1)
    }
    this.setState({
      audit: true,
    })
  }

  menuSure = (data) => {
    const columns = data.filter(item => item.checked)
    this.setState({columns})
  }

  sortTable = (obj) => { // 排序
    if (obj.items) {
      const list = []
      obj.items.map(item => {
        list.push({
          itemId: item.id,
          sort: item.sort,
        })
        return {}
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
      listType: 1,
    })).then(() => {
      this.props.dispatch(getHasSelectitem({
        listType: 1,
      }))
    })
  }

  handleQueryBest = (value) => { // 初级查询
    const { page } = this.props.contractSystem
    const ss = F.filterUndefind(value)
    this.isBest = true
    this.queryCondition = ss
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
    if(ss.searchReceiptDate && ss.searchReceiptDate == "," ){
        ss.searchReceiptDate = ""
    }
    this.props.dispatch(getInitList({
      deps: departments,
      listType: 1,
      contractClass: 2,
      pageNum: 1,
      pageSize: page.pageSize,
      ...ss,
    })).then((data)=>{
        // if(data && data.data && data.data.data.length == 0){
        //     var maxPage = parseInt(data.data.page.total/data.data.page.pageSize);
        //     if(data.data.page.total/data.data.page.pageSize > parseInt(data.data.page.total/data.data.page.pageSize)){
        //         maxPage = parseInt(data.data.page.total/data.data.page.pageSize)+1
        //     }
        //     this.props.dispatch(getInitList({
        //       deps: departments,
        //       listType:1,
        //       contractClass: 2,
        //       pageNum: maxPage,
        //       pageSize: page.pageSize,
        //       ...ss,
        //   }))
        // }
    })
  }

  handleHeiQuery = (value) => { // 高级查询
    const { page } = this.props.contractSystem
    const ss = F.filterUndefind(value)
    this.isBest = false
    this.queryCondition = JSON.stringify(ss)
    this.props.dispatch(geiHeiList({
      listType: 1,
      pageNum: 1,
      pageSize: page.pageSize,
      search: JSON.stringify(ss),
      // ...ss,
    }))
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    if (this.isBest) { // 走基本搜索接口
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
      this.props.dispatch(getInitList({
        deps: departments,
        listType: 1,
        contractClass: 2,
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        listType: 1,
        pageNum: pageNum,
        pageSize: pageSize,
        search: this.queryCondition,
      }))
    }
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    if (this.isBest) { // 走基本搜索接口
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
      this.props.dispatch(getInitList({
        deps: departments,
        listType: 1,
        contractClass: 2,
        pageNum: pageNum,
        pageSize: pageSize,
        status:this.state.status,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        listType: 1,
        pageNum: pageNum,
        pageSize: pageSize,
        search: this.queryCondition,
      }))
    }
  }

  selectRadio = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      modalTwo: false,
    })
  }

  handleChange = (pagination, filters, sorter) => {
  }

  componentWillMount() {
    const columns = this.columns.filter(item => item.checked)
    this.setState({columns})
  }

  componentDidMount() {
    const { page } = this.props.contractSystem
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
    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 8,
    }))
    this.props.dispatch(getHasSelectitem({ // 高级搜索 默认item
      listType: 1,
    }))
    this.props.dispatch(getQeryData({ // 高级搜索 所有数据
        from: 1,
    }))
    this.props.dispatch(getInitList({ // 初始化list
      deps: departments,
      listType: 1,
      contractClass: 2,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    //this.props.dispatch(getNumber()) // 获取个数
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

  //输入框变化
  onInputChange = (e,type) => {
    if(type === "customerName"){
      this.setState({
        customerName:e.target.value,
      });
    }
  }
  onInputNumberChange = (value,type) => {
    if(type === "amountBackStart"){
      this.setState({
        amountBackStart:value,
      });
    }else if(type === "amountBackEnd"){
      this.setState({
        amountBackEnd:value,
      });
    }
  }
  //下拉框选择
  onSelectChange= (value,type)=>{
      if(type === "contractType"){
          this.setState({
              status:`${value}`,
          })
      }else if(type === "paymentSit"){
          this.setState({
              coPaymentSit:`${value}`,
          })
      }
  }

  //时间选择框
  onQueryTimeChange = (value,type) => {
    if (type === 'time') {
      this.setState({
        receiptDateStart:value[0],
        receiptDateEnd:value[1],
      })
    }
  }

  //搜索
  handleQuery= ()=>{
      this.props.contractSystem.loading = true;
      this.setState({
          loading:true,
      })
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
    this.props.dispatch(getInitList({
      deps: departments,
      listType: 2,
      contractClass:2,
      pageNum: 1,
      pageSize: this.props.contractSystem.page.pageSize,
      customerName:this.state.customerName,
      status:this.state.status,
      coPaymentSit:this.state.coPaymentSit,
      receiptDateStart:this.state.receiptDateStart||"",
      receiptDateEnd:this.state.receiptDateEnd||"",
      amountBackStart:this.state.amountBackStart||"",
      amountBackEnd:this.state.amountBackEnd||"",
    }))
  }
  render() {
    const { queryBest } = this.props
    const { queryHeiBest, heiQueryData, columns } = this.state
    const { page, list, loading } = this.props.contractSystem
    const { selectedRowKeys } = this.props.search

    columns.forEach((item, index) => {
      if(item.dataIndex === 'contractNumber'){
        columns[index].render = (text, record) => {
          const url = `/CRM/contract/detail/?type=0&contractNumber=${record.contractNumber}&id=${record.key}&customerId=${record.customerId}&topName=我的合同`
          return <a onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
          }}>{text}</a>
        }
      }
      if(item.dataIndex === 'customerName'){
        columns[index].render = (text, record) => {
          const url = `/CRM/client/clientId=${record.id}?clientId=${record.id}&id=${record.customerId}&poolId=${record.poolId}&topicId=${record.topicId}&customerCategory=${record.customerType}&action=2&auditStatus=2&topName=我的客户`
          // const url = `/CRM/contract/detail/?type=0&contractNumber=${record.contractNumber}&id=${record.key}&customerId=${record.customerId}&topName=我的合同`
          return <a onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
          }}>{text}</a>
        }
      }
    })

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: this.getCheckboxProps,
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
    const options = [{
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [{
        value: 'hangzhou',
        label: 'Hanzhou',
        children: [{
          value: 'xihu',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
          value: 'zhonghuamen',
          label: 'Zhong Hua Men',
        }],
      }],
    }];

    return (
      <Layout>
        <Wrap>
          <div className={style.ClueSystemWrap}>
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
            <ContentWrap>
              <Table
                loading={loading}
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
        </Wrap>
      </Layout>
    )
  }
}

export default MyContract
