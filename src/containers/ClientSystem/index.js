import React, { Component } from 'react'
import style from './style.less'
import { Link } from 'react-router-dom'
import Layout from '../Wrap'
import store from 'store'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import queryString from 'query-string'
import SearchModule from '../../components/SearchModule'
import {TableHeaderClient} from '../../components/TableHeaderClient'
import {FormClientSearch} from '../../components/formClientSearch'
import {FormAssignMent} from '../../components/FormAssignMent'
import ContentWrap from '../Content'
import {
  getQueyBest,
  getQeryData,
  sortTable,
  selectKey,
  getHasSelectitem,
  deleteSelect,
  saveUserChecked,
} from '../../actions/search'
import { createForm } from 'rc-form'
import { Table, Button, Input, Select, Icon, Modal, message } from 'antd'
import {getClientList,removeClient,selectAllCheneseName,updateClient,geiHeiList} from '../../actions/clientSystem'
import{insertMyClientToPool} from '../../actions/myInternation'
import F from '../../helper/tool'
import {newWindow} from '../../util/'
const {Wrap} = Layout
const Option = Select.Option

@connect((state) => {
  return {
    search: state.search,
    clientSystem: state.clientSystem,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
  }
})
@createForm()
class ClientSystem extends Component {
  constructor(props) {
    super(props)
    this.isBest = true
    this.outValues = {} // 搜索条件
    this.assignNumber = [] // 启用禁用的id
    // this.clientIds = []
    this.topicId = []
    this.poolId = []
    this.customerId = []
    this.queryCondition = {}
    this.queryAdvCondition = {}
  }
  static propTypes = {
    nameList: PropTypes.object,
  }
  state = {
    visible: false,
    value: 2,
    heiQueryData: [],
    queryHeiBest: [],
    loading:true,
  }

  columns = [{
    title: '客户编号',
    dataIndex: 'number',
  }, {
    title: '客户名称',
    dataIndex: 'name',
    render: (text, record) => {
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {topName} = this.props.history.location.state || parsed
      const url = `/CRM/client/clientId=${record.id}?clientId=${record.id}&id=${record.customerId}&poolId=${record.poolId}&topicId=${record.topicId}&customerCategory=${record.type}&action=2&auditStatus=2&topName=${topName}`
      return (
        <a onClick={(e)=>{
          e.preventDefault()
          newWindow(url, text)
        }}>{text}</a>
      )
    },
  }, {
    title: '客户类型',
    dataIndex: 'type',
    render: (text, record) => {
      if (record.type === 1) {
        return <span>个人客户</span>
      }
      if (record.type === 2) {
        return <span>企业客户</span>
      }
    },
  }, {
    title: '所属行业',
    dataIndex: 'dictName',
  },  {
    title: '所属公海',
    dataIndex: 'poolName',
  }, {
    title: '跟进人',
    dataIndex: 'fName',
  }, {
    title: '跟进状态',
    dataIndex: 'fStatus',
  }, {
    title: '最近跟进方式',
    dataIndex: 'fTypeName',
  }, {
    title: '最近跟进时间',
    dataIndex: 'fTime',
  }, {
    title: '状态',
    dataIndex: 'isEnable',
    render: (text, record) => {
      if (record.isEnable === 0) {
        return <span>正常</span>
      }
      if (record.isEnable === 1) {
        return <span>冷冻</span>
      }
    },
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      return <span><a onClick={() => { this.removeClient(record.topicId,record.poolId,record.customerId) }}>移出</a></span>
    },
  }]

  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }

  removeClient = (topicId,poolId,customerId) => {
    Modal.confirm({
       title: '确定移出此客户吗?',
       content: '',
       okText: '确认',
       cancelText: '取消',
       onOk: this.hideDeleteModal,
       okType: 'danger',
   })
   this.topicId = topicId;
   this.poolId = poolId;
   this.customerId = customerId;
  }

  hideDeleteModal = () => {
    const { page } = this.props.clientSystem
    this.props.dispatch(removeClient({
      poolId: this.poolId,
      topicId: this.topicId,
      customerId: this.customerId,
    })).then(data => {
      if(data && data.code !== 0) return message.error(data.msg)
      if(data && data.code === 0) {
        this.props.dispatch(getClientList({
          deps: this.state.deps,
          pageNum: page.pageNum,
          pageSize: page.pageSize,
        }))
        this.setState({
          visible: false,
        })
        setTimeout(() => {
          window.opener=null
          window.close()
        }, 1000);
        message.success(data.msg)
      }
    })
  }

  onSelectChange = (key, data) => { // 勾选表格
    let [number,name,id,poolId,topicId] = ['','','','','']
    data.map((item, index) => {
      item.length === index ? number += item.number : number += item.number + ','
      item.length === index ? name += item.name : name += item.name + ','
      item.length === index ? id += item.customerId : id += item.customerId + ','
      item.length === index ? poolId += item.poolId : poolId += item.poolId + ','
      item.length === index ? topicId += item.topicId : topicId += item.topicId + ','
      return {}
    })
    this.props.dispatch(selectKey(key))
    // this.clientIds = key
    this.setState({number,name,id,poolId,topicId})
    if(number){
        this.numbers = number.split(',')
        this.numbers.pop()
    }
    if(name){
        this.names = name.split(',')
        this.names.pop()
    }
    if(id){
        this.ids = id.split(',')
        this.ids.pop()
    }
    if(poolId){
        this.poolIds = poolId.split(',')
        this.poolIds.pop()
    }
    if(topicId){
        this.topicIds = topicId.split(',')
        this.topicIds.pop()
    }
  }

  saveOk = (value) => {
    // if (value.userId === undefined || value.userId === '0') {
    //   return message.error('请选择人员')
    // }
    const clientinfo = JSON.stringify(value)
    this.props.dispatch(insertMyClientToPool({myclientList: clientinfo})).then(data => {
      if (data) {
        message.success(data.msg)
        this.handleCancel()
        setTimeout(()=>{
          window.location.reload()
        },1000)
      }
    })
  }

  // saveOk = (value) => {
  //   console.log(typeof value.userId)
  //   if (value.userId === undefined || value.userId === '0') {
  //     return message.error('请选择人员')
  //   }
  //   this.props.dispatch(updateClient({...value})).then(data => {
  //     if (data) {
  //       message.success(data.msg)
  //       this.handleCancel()
  //     }
  //   })
  // }

  handleCancel = () => {
    this.assignNumber = []

    this.setState({
      visible: false,
      selectedRowKeys: [],
    })
  }

  renderHeaser = () => { // 表格头部
    return (
      <TableHeaderClient {...this.props} assignMent={this.assignMent}/>
    )
  }

  assignMent = () => {
    const { selectedRowKeys } = this.props.search
    if (selectedRowKeys.length === 0) {
      return message.info('请选择客户进行分配', 1)
    }
    this.props.dispatch(selectAllCheneseName({ // 个人列表
      code: this.state.deps,
    })).then(data => {
      const nameData = data.data
      this.nameData = nameData
      this.setState({
        nameList: this.nameData,
      })
    }).catch(err => {
      console.log(err)
    })
    this.setState({
      visible: true,
    })
  }

  clientQuery = (clientInfo) => { // 基本搜索
    const { page } = this.props.clientSystem
    const upData = F.filterUndefind(clientInfo)
    const outValues = {
      ...upData,
    }
    this.props.dispatch(getClientList({
      deps: this.state.deps,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...outValues,
    }))
    this.outValues = outValues
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    if (this.isBest) {
      this.props.dispatch(getClientList({
        deps: this.state.deps,
        pageNum,
        pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        deps: this.state.deps,
        listType: 3,
        pageNum: pageNum,
        pageSize: pageSize,
        search: this.queryAdvCondition,
      }))
    }
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    if (this.isBest) {
      this.props.dispatch(getClientList({
        deps: this.state.deps,
        pageNum,
        pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        deps: this.state.deps,
        listType: 3,
        pageNum: pageNum,
        pageSize: pageSize,
        search: this.queryAdvCondition,
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
    const { page } = this.props.clientSystem
    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 3,
    }))
    this.props.dispatch(getHasSelectitem({ // 高级搜索 默认item
      listType: 3,
    }))
    this.props.dispatch(getQeryData({ // 高级搜索 所有数据
        from: 3,
    }))
    this.props.dispatch(getClientList({ // 初始化lis
      deps: deps,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
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

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
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
      listType: 3,
    })).then(() => {
      this.props.dispatch(getHasSelectitem({
        listType: 3,
      }))
    })
  }

  handleQueryBest = (value) => { // 初级查询
      this.props.clientSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.clientSystem
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
    this.props.dispatch(getClientList({
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
        //     this.props.dispatch(getClientList({
        //       deps: this.state.deps,
        //       pageNum: maxPage,
        //       pageSize: page.pageSize,
        //       ...this.queryCondition,
        //   }))
        // }
    })
  }

  handleHeiQuery = (value) => { // 高级查询
      this.props.clientSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.clientSystem
    const ss = F.filterUndefind(value)
    this.isBest = false
    this.queryAdvCondition = JSON.stringify(ss)
    this.props.dispatch(geiHeiList({
      deps: this.state.deps,
      listType: 3,
      pageNum: 1,
      pageSize: page.pageSize,
      search: JSON.stringify(ss),
      // ...ss,
    }))
  }

  render() {
    const { queryBest } = this.props
    const { queryHeiBest, heiQueryData } = this.state
    const { visible, confirmLoading } = this.state
    // const { getFieldProps,getFieldDecorator } = this.props.form // getFieldError
    const { list, page, loading} = this.props.clientSystem // count, feadBack
    this.state.loading = loading
    const { selectedRowKeys } = this.props.search
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
              showHeiBtn
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
              <Table
                loading={this.state.loading}
                title={this.renderHeaser}
                className={style.table}
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={list}
                pagination={pagination}
              />
              <FormAssignMent
                title="分配至个人"
                visible={visible}
                disabled={false}
                cancle={this.handleCancel}
                numbers={this.numbers}
                names={this.names}
                ids={this.ids}
                poolIds={this.poolIds}
                topicIds={this.topicIds}
                ok={this.saveOk}
                {...this.props}
                assignNumber = {this.assignNumber}
              />
            </ContentWrap>
          </div>
        </Wrap>
      </Layout>
    )
  }
}

export default ClientSystem
