/**
 * Created by zhaolong on 2018/03/21
 * File description:我的合同
 */
'use strict';
import React, { Component } from 'react'
import store from 'store'
import style from './style.less'
import SearchModule from '../../components/SearchModule'
import Layout from '../Wrap'
import DfwsCascader from 'dfws-antd-cascader'
import {connect} from 'react-redux'
import { Table, Modal, message, Select, Input, Button, Icon } from 'antd'
import {Audit} from '../../components/TableBtns'
import ContentWrap from '../Content'
import TableHeader from '../../components/TableHeader'
import {default as ColumnRender} from '../../components/TableColumn'
import F from '../../helper/tool'
import DfwsSelect from 'dfws-antd-select'
import { baseURL, dictUrl } from '../../config'
import { filterOption } from '../../util'
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
} from '../../actions/clientToQuit'
import {selectAllCheneseName,removeClientList} from '../../actions/clientSystem'
import{insertMyClientToPool} from '../../actions/myInternation'
import {newWindow} from '../../util/'
const {Wrap} = Layout
const Option = Select.Option;
@connect((state) => {
  return {
    clientToQuit: state.clientToQuit,
    search: state.search,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
    nameList:state.clientSystem.nameList,
  }
})
class ClientToQuit extends Component {
    state = {
      heiQueryData: [],
      queryHeiBest: [],
      userId:"",
      fStatus:"",
      name:"",
      disCliModVisible:false,
      removeCliModVisible:false,
      loading:false,
    }

  constructor(props) {
    super(props)
    this.isBest = true // 判断是否走高级搜索接口
    this.queryCondition = {} // 搜索条件
    this.auditID = [] // 审核的id
    this.numbers = [] //勾选的合同编号
    this.dataLength = 0
    this.myclientList = []
    this.columns = [{
      title: '客户名称',
      dataIndex: 'fName',
      checked: true,
      key: 1,
    }, {
      title: '行业类别',
      dataIndex: 'dictName',
      checked: true,
      key: 2,
    }, {
      title: '离职人员',
      dataIndex: 'userName',
      checked: true,
      key: 3,
    }, {
      title: '跟进状态',
      dataIndex: 'fStatus',
      checked: true,
      key: 4,
    }, {
      title: '最近跟进时间',
      dataIndex: 'fTime',
      checked: true,
      key: 5,
    }, {
      title: '下次跟进时间',
      dataIndex: 'modifyTime',
      checked: true,
      key: 6,
    }, {
      title: '标签',
      dataIndex: 'labelName',
      checked: true,
      key: 7,
  }]

}

  onSelectChange = (key, data) => { // 勾选表格
      if(data && data.length>0){
          this.myclientList = []
          data.map((item, index) => {
               this.dataLength = data.length

                let obj = {
                  customerId: item.customerId,
                  poolId: item.poolId,
                  topicId: item.topicId,
                  name: item.fName,
                  userId: "",
                }
                this.myclientList.push(obj)
                return {}
          })
          this.setState({
              myclientList:this.myclientList,
          })
      }else{
          this.dataLength = 0
      }

    this.props.dispatch(selectKey(key))
  }

  getCheckboxProps = (data) => { // 不能勾选的表格
    const {list} = this.props.clientToQuit
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
        submitMoreAudit={this.submitMoreAudit}
        type="clienttoquit"
        distributionClient={this.distributionClient}
        removeClient={this.removeClient}
        />
    )
  }

  distributionClient = () =>{
      if (this.dataLength > -0) {
          this.setState({
              disCliModVisible:true,
          })

      }else{
        return message.info('请选择一条客户进行分配', 1)
      }
  }

 removeClient = () =>{
     if (this.dataLength > -0) {
         this.setState({
             removeCliModVisible:true,
         })

     }else{
       return message.info('请选择一条客户进行移除', 1)
     }

 }

  singAudit = (record) => { // 单个审核数据
    this.auditID.push(record.id)
    this.setState({
      audit: true,
      number: record.number,
    })
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
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
    }
  }


  handleChange = (pagination, filters, sorter) => {
      this.myclientList.forEach((d,i)=>{
          this.myclientList[i].userId = pagination
      })
  }

  componentWillMount() {
    const columns = this.columns.filter(item => item.checked)
    this.setState({columns})
  }

  componentDidMount() {
    const { page } = this.props.clientToQuit
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
    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 1,
    }))
    this.props.dispatch(getHasSelectitem({ // 高级搜索 默认item
      listType: 1,
    }))
    this.props.dispatch(getQeryData({ // 高级搜索 所有数据
     from: 1,
    }))
    this.props.dispatch(getInitList({ // 初始化list
      deps: code,
      listType: 1,
      contractClass: 2,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))

    this.props.dispatch(selectAllCheneseName({code}));
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

  onOptionChange = (value,type) => {
      if(type === "userId"){
          this.setState({
              userId:`${value}`,
          })
      }
      if(type === "fStatus"){
          this.setState({
              fStatus:`${value}`,
          })
      }
  }
  onCancel = () => {
      this.setState({
           disCliModVisible:false,
           removeCliModVisible:false,
      })
  }

  onOk = (type) => {
      if(type === "disClient"){
          if(this.state.myclientList[0].userId){
              this.props.dispatch(insertMyClientToPool({
                  myclientList:JSON.stringify(this.myclientList),
              })).then((data)=>{
                  if(data && data.code === 0){
                      this.setState({
                          disCliModVisible:false,
                      })
                      message.success(data.msg)
                      const { page } = this.props.clientToQuit
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
                      this.props.dispatch(getInitList({ // 初始化list
                        deps: code,
                        listType: 1,
                        contractClass: 2,
                        pageNum: page.pageNum,
                        pageSize: page.pageSize,
                      }))
                  }else{
                      if(data && data.code === -1){
                          message.error(data.msg)
                      }
                  }
              })
          }else{
              message.info('请选择员工', 1)
          }

      }
      if(type === "removeClient"){
          this.myclientList.forEach((v,i)=>{
            delete  this.myclientList[i].name
            delete  this.myclientList[i].userId
          })
          this.props.dispatch(removeClientList({
            myclientList:JSON.stringify(this.myclientList),
          })).then((data)=>{
              if(data && data.code === 0){
                  this.setState({
                      removeCliModVisible:false,
                  })
                  this.props.search.selectedRowKeys = [] ;
                  //移除成功之后获取数据列表
                  const { page } = this.props.clientToQuit
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
                  this.props.dispatch(getInitList({ // 初始化list
                    deps: departments,
                    listType: 1,
                    contractClass: 2,
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                  }))
                  setTimeout(() => {
                    window.opener=null
                    window.close()
                  }, 1000);
                  message.success(data.msg)
              }else{
                  if(data && data.code === -1){
                      message.error(data.msg)
                  }
              }
          })
      }
  }

  //搜索项
  onInputChange= (e,type)=>{
      if(type === "name"){
          this.setState({
              name:e.target.value,
          })
      }
      if(type === "address"){
          this.setState({
              address:e.target.value,
          })
      }
      if(type === "userId"){
        this.setState({
            userId:e.target.value,
        })
    }
  }
onAreaChange = (e) => {
    this.setState({
        address:e,
    })
}
  //搜索
  handleQuery= ()=>{
    this.props.clientToQuit.loading = true;
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
      pageNum: this.props.clientToQuit.page.pageNum,
      pageSize: this.props.clientToQuit.page.pageSize,
      userId:this.state.userId,
      fStatus:this.state.fStatus,
      name:this.state.name,
      address:this.state.address?this.state.address.join(""):"",
    }))
  }
  render() {
    const { queryBest, nameList } = this.props
    const { queryHeiBest, heiQueryData, columns } = this.state
    const { page, list,loading } = this.props.clientToQuit
    const { selectedRowKeys } = this.props.search

    columns.forEach((item, index) => {
      if(item.dataIndex === 'fName'){
        columns[index].render = (text, record) => {
          const url = `/CRM/client/clientId=${record.id}?id=${record.customerId}&poolId=${record.poolId}&topicId=${record.topicId}&customerCategory=${record.type}&action=2&auditStatus=2&topName=离职员工客户`
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
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }
    this.state.loading = loading
    return (
      <Layout>
        <Wrap>
          <div className={style.ClueSystemWrap}>
            <ContentWrap>
              <div className={style.listHeader}>
                <div className={style.listTitle}>
                  <div>
                    <Icon type="search" className={style.search} />
                    &ensp;筛选查询
                  </div>
                </div>
                <div className={style.listTop}>
                    <div className={style.formGroup}>
                      <label htmlFor="">关键字：</label>
                      <div>
                        <Input placeholder="请输入关键字" value={this.state.name} onChange={(e)=>this.onInputChange(e,"name")}/>
                      </div>
                    </div>
                  <div className={style.formGroup}>
                    <label htmlFor="">离职人员：</label>
                    <div>
                    <Input value={this.state.userId}onChange={(e)=>this.onInputChange(e,"userId")} />
                    </div>
                  </div>
                  <div className={style.formGroup}>
                    <label htmlFor="">所在地区：</label>
                    <div>
                    <DfwsCascader  url={dictUrl()} placeholder="请选择户口所在地" code={['province','city','area']} onChange={(e)=>this.onAreaChange(e)} allowClear={false} changeOnSelect />
                    </div>
                  </div>
                  <div className={style.formGroup}>
                    <label htmlFor="">成熟度：</label>
                    <div>
                        <DfwsSelect
                          showSearch
                          url={dictUrl()}
                          code="FollowUpStatus"
                          style={{ width: 180 }}
                          placeholder="请选择成熟度"
                          onChange={(e)=>this.onOptionChange(e,"fStatus")}
                          allowClear={false}
                        />
                    </div>
                  </div>

                  <div>
                    <Button onClick={this.handleQuery} className={style.btnSearch}><Icon className={style.icon} type="search" />搜索</Button>
                  </div>
                </div>
              </div>
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

          <Modal title={"分配客户"}
            visible={this.state.disCliModVisible}
            onOk={()=>this.onOk('disClient')}
            onCancel={this.onCancel}
            width={600}
          >
          <div className={style.disClientMod}>
            <ul  className={style.items}>
                <li>
                    <div className={style.label}>客户编号：</div>
                    <div className={style.number}>
                        {this.state.myclientList && this.state.myclientList.map((v,i)=>{
                            if(i<10){
                                if(i==0){
                                    return <div className={style.text}>{v.customerId}</div>
                                }else{
                                    return <div className={style.text}>, {v.customerId}</div>
                                }
                            }
                        })}
                        {this.state.myclientList  && this.state.myclientList.length>10 &&
                            <div>......</div>
                        }
                    </div>
                </li>
                <li>
                    <div className={style.label}>客户名称：</div>
                    <div className={style.number}>
                        {this.state.myclientList && this.state.myclientList.map((v,i)=>{
                            if(i<10){
                                if(i==0){
                                    return <div className={style.text}>{v.name}</div>
                                }else{
                                    return <div className={style.text}>, {v.name}</div>
                                }
                            }
                        })}
                        {this.state.myclientList && this.state.myclientList.length>10 &&
                            <div>......</div>
                        }
                    </div>
                </li>
                <li>
                    <div className={style.label}>分配至员工：</div>
                    <div  className={style.number}>
                    <Select
                      showSearch
                      placeholder="请选择员工"
                      optionFilterProp="children"
                      onChange={this.handleChange}
                      filterOption={(input, option)=>filterOption(input, option)}
                      className={style.select}
                    >
                      {
                        nameList && nameList.map((d, i) => {
                          return (
                            <Option key={d.userId} value={String(d.userId)} userPinyin={d.userPinyin}>{d.chineseName}</Option>
                          )
                        })
                      }
                    </Select>
                    </div>
                </li>
            </ul>
          </div>
          </Modal>

          <Modal title={"移出客户"}
            visible={this.state.removeCliModVisible}
            onOk={()=>this.onOk('removeClient')}
            onCancel={this.onCancel}
            width={430}
          >
          <div className={style.removeClientMod}>
            是否将客户移除公海？
          </div>
          </Modal>
        </Wrap>
      </Layout>
    )
  }
}

export default ClientToQuit
