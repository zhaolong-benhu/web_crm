/**
 * Created by zhaolong on 2018/03/21
 * File description:我的客户
 */
import React, { Component } from 'react'
import style from './style.less'
import SearchModule from '../../components/SearchModule'
import store from 'store'
import Layout from '../Wrap'
import {connect} from 'react-redux'
import { getDepartment } from '../../actions/department'
import { Table, Modal, message, Select, Input, Button, Icon, Cascader } from 'antd'
import {Audit} from '../../components/TableBtns'
import ContentWrap from '../Content'
import TableHeader from '../../components/TableHeader'
import { baseURL } from '../../config'
import {default as ColumnRender} from '../../components/TableColumn'
import moment from 'moment'
// import {push} from 'react-router-redux';
import F from '../../helper/tool'
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
import {selectAllCheneseName} from '../../actions/clientSystem'
import { getProductList } from '../../actions/businessSystem'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const {Wrap} = Layout
const Option = Select.Option;
@connect((state) => {
  return {
    contractSystem: state.contractSystem,
    search: state.search,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
    nameList:state.clientSystem.nameList,
    department: state.department.list,
    selproductList: state.businessSystem.productList,
  }
})
class ContractSystem extends Component {
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
      title: '客户名称',
      dataIndex: 'customerName',
      checked: true,
      key: 2,
    }, {
      title: '合同状态',
      dataIndex: 'statusStr',
      checked: true,
      key: 3,
   },{
      title: '合同总金额',
      dataIndex: 'totalAmount',
      checked: true,
      key: 4,
    },{
       title: '已回执金额',
       dataIndex: 'amountReceipt',
       checked: true,
       key: 5,
   }, {
      title: '合同开始日期',
      dataIndex: 'startTime',
      checked: true,
      key: 6,
      render:(text,record) => {
        return text ? moment(text).format("YYYY-MM-DD") : ''
      },
    }, {
      title: '合同结束日期',
      dataIndex: 'endTime',
      checked: true,
      key: 7,
      render:(text,record) => {
        return text ? moment(text).format("YYYY-MM-DD") : ''
      },
    }, {
      title: '合同添加人',
      dataIndex: 'createUser',
      checked: true,
      key: 8,
    }]

    this.productList = [{
      value: '最佳东方',
      label: '最佳东方',
      children: [],
    }, {
      value: '先之',
      label: '先之',
      children: [],
    }];

  }


  state = {
    heiQueryData: [],
    queryHeiBest: [],
    audit: false,
    modalTwo: false,
    errMsg: '',
    value: 2,
    number: '', // 审核的编号
    columns: [],
    paymentSitStr:"",
    department: "",
    userId: "",
    customerName: "",
    loading:false,
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
          this.props.dispatch(getInitList({ // 初始化list
            deps: this.state.deps,
            listType: 4,
            contractClass: 1,
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
      listType: 4,
    })).then(() => {
      this.props.dispatch(getHasSelectitem({
        listType: 4,
      }))
    })
  }

  handleQueryBest = (value) => { // 初级查询
      this.props.contractSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.contractSystem
    const ss = F.filterUndefind(value)
    var productId = ""
    if(value.productId){
        productId = value.productId[1] || ""
    }
    ss.productId = productId
    this.isBest = true
    this.queryCondition = ss
    this.props.dispatch(getInitList({
      deps: this.state.deps,
      listType: 4,
      contractClass: 1,
      pageNum: 1,
      pageSize: page.pageSize,
      ...ss,
    })).then((data)=>{
        // if(data && data.data && data.data.data.length == 0){
        //     var maxPage = parseInt(data.data.page.total/data.data.page.pageSize);
        //     if(data.data.page.total/data.data.page.pageSize > parseInt(data.data.page.total/data.data.page.pageSize)){
        //         maxPage = parseInt(data.data.page.total/data.data.page.pageSize)+1
        //     }
        //     const crm = store.get('crm')
        //     this.props.dispatch(getInitList({
        //       deps: this.state.deps,
        //       listType:4,
        //       contractClass: 1,
        //       pageNum: maxPage,
        //       pageSize: page.pageSize,
        //       ...ss,
        //   }))
        // }
    })
  }

  handleHeiQuery = (value) => { // 高级查询
      this.props.contractSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.contractSystem
    const ss = F.filterUndefind(value)
    this.isBest = false
    this.queryCondition = JSON.stringify(ss)
    if(ss.productId){
        ss.productId = ss.productId[1]
    }
    this.props.dispatch(geiHeiList({
      deps: this.state.deps,
      listType: 4,
      pageNum: 1,
      pageSize: page.pageSize,
      search: JSON.stringify(ss),
      // ...ss,
    }))
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    if (this.isBest) { // 走基本搜索接口
      this.props.dispatch(getInitList({
        deps: this.state.deps,
        listType: 4,
        contractClass: 1,
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        deps: this.state.deps,
        listType: 4,
        pageNum: pageNum,
        pageSize: pageSize,
        search: this.queryCondition,
      }))
    }
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    if (this.isBest) { // 走基本搜索接口
      this.props.dispatch(getInitList({
        deps: this.state.deps,
        listType: 4,
        contractClass: 1,
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        deps: this.state.deps,
        listType: 4,
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
    let deps = ''
    if(crm && crm.user && crm.user.department) {
      deps = crm.user.department.deptCode
      this.setState({
        deps: crm.user.department.deptCode,
      })
    }
    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 5,
    }))
    this.props.dispatch(getHasSelectitem({ // 高级搜索 默认item
      listType: 4,
    }))
    this.props.dispatch(getQeryData({ // 高级搜索 所有数据
        from: 4,
    }))
    this.props.dispatch(getInitList({ // 初始化list
      deps: deps,
      listType: 4,
      contractClass: 1,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    this.props.dispatch(getDepartment({depCode:deps}))
    this.props.dispatch(selectAllCheneseName({code: deps}))

    this.props.dispatch(getProductList({}))//获取产品列表

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

  //下拉框选择
  onChange= (data,type)=>{
      if(type === "paymentSitStr"){
          this.setState({
              paymentSitStr:data,
          })
      }else if(type === "department"){
          this.setState({
              department:data,
          })
      }else if(type === "userId"){
          this.setState({
              userId:data,
          })
      }else if(type == "customerName"){
          this.setState({
              customerName:data.target.value,
          });
      }
  }

  //搜索
  handleQuery= ()=>{
    this.props.dispatch(getInitList({
        deps: this.state.deps,
        listType: 4,
        contractClass:1,
        pageNum: 1,
        pageSize: this.props.contractSystem.page.pageSize,
        paymentSitStr:this.state.paymentSitStr,
        department:this.state.department,
        userId:this.state.userId,
        customerName:this.state.customerName,
    }))
  }
  render() {
    const { queryBest,nameList,selproductList } = this.props
    const { queryHeiBest, heiQueryData, columns } = this.state
    const { page, list,loading } = this.props.contractSystem
    // const { selproductList } = this.props.businessSystem
    const { selectedRowKeys } = this.props.search

    columns.forEach((item, index) => {
      if(item.dataIndex === 'contractNumber'){
        // columns[index].sorter = (a, b) => a.name.length - b.name.length
        columns[index].render = (text, record) => {
          // const url = `/clue/${record.key}?id=${record.key}&customerCategory=${record.type}&action=2&status=${record.status}&topName=线索管理`
          const url = `/CRM/contract/detail/?type=1&contractNumber=${record.contractNumber}&id=${record.key}&customerId=${record.customerId}&topName=合同管理`
          return <a onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
          }}>{text}</a>
        }
      }
      if(item.dataIndex === 'customerName'){
        // columns[index].sorter = (a, b) => a.name.length - b.name.length
        columns[index].render = (text, record) => {
          const url = `/CRM/client/clientId=${record.id}?clientId=${record.id}&id=${record.customerId}&poolId=${record.poolId}&topicId=${record.topicId}&customerCategory=${record.customerType}&action=2&auditStatus=2&topName=客户管理`
          // const url = `/CRM/client/clientId=${record.id}?clientId=${record.id}&id=${record.customerId}&poolId=${record.poolId}&topicId=${record.topicId}&customerCategory=${record.customerType}&action=2&auditStatus=2&topName=我的客户`
          // const url = `/CRM/contract/detail/?type=1&contractNumber=${record.contractNumber}&id=${record.key}&customerId=${record.customerId}&topName=合同管理`
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
    this.state.loading = loading

    var veryeast_pro = [];
    var xz_pro = [];
    if(selproductList && selproductList.length >0 ){
        selproductList.forEach((v,i)=>{
            var info={"value":v.id,"label":v.cname}
            if(v.type ===1){
                veryeast_pro.push(info);
            }
            if(v.type === 2){
                xz_pro.push(info);
            }
        })
    }
    this.productList[0].children = veryeast_pro;
    this.productList[1].children = xz_pro;

    return (
      <Layout>
        <Wrap>
          <div className={style.ClueSystemWrap}>
            <SearchModule
              showHeiBtn
              handleQueryBest={this.handleQueryBest}
              handleHeiQuery={this.handleHeiQuery}
              saveUserCheck={this.saveUserCheck}
              sortTable={this.sortTable}
              queryBest={queryBest}
              queryHeiBest={queryHeiBest}
              heiQueryData={heiQueryData}
              hidename="0"
              options={this.productList}
              heiQueryType="1"
            />
            {/* <Cascader options={this.productList}  placeholder="选择产品名称" /> */}
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

export default ContractSystem
