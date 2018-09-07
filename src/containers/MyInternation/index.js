import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from '../Detail/style.less'
import Layout from '../Wrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import ContentWrap from '../Content'
import { createForm } from 'rc-form'
import queryString from 'query-string'
import store from 'store'
import {TableHeaderClient} from '../../components/TableHeaderClient'
import {FormMyClientSearch} from '../../components/formClientSearch'
import {FormAssignMent} from '../../components/FormAssignMent'
import { Table, Select, Button, Icon, message } from 'antd'
import F from '../../helper/tool'
import {
  selectKey,
  deleteSelect,
} from '../../actions/search'
import {selectAllCheneseName} from '../../actions/clientSystem'
import {
  getMyPoolCus,
  insertMyClientToPool,
  selectPoolByUserId,
} from '../../actions/myInternation'
import {newWindow} from '../../util/'
const {Wrap} = Layout

@connect((state) => {
  return {
    myInternation: state.myInternation,
    clientSystem: state.clientSystem,
  }
})
@createForm()
class MyInternation extends Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: true,
    visible: false,
  };
  static propTypes = {
    dispatch: PropTypes.func,
    myInternation: PropTypes.object,
    nameList: PropTypes.object,
  }
  columns = [{
    title: '客户名称',
    dataIndex: 'name',
    render: (text, record) => {
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {topName} = this.props.history.location.state || parsed

      const url = `/CRM/client/clientId=${record.id}?clientId=${record.id}&id=${record.id}&poolId=${record.poolId}&topicId=${record.topicId}&customerCategory=${record.type}&action=2&auditStatus=2&from=myinternation&topName=我的公海`
      return (
        <a onClick={(e)=>{
          e.preventDefault()
          newWindow(url, text)
        }}>{text}</a>
      )
    },
  }, {
    title: '所属公海',
    dataIndex: 'poolName',
  }, {
    title: '客户类型',
    dataIndex: 'type',
    render: (text, record) => {
      if(record.type === 1){
        return (
          <span>个人客户</span>
        )
      }
      if(record.type === 2){
        return (
          <span>企业客户</span>
        )
      }
    },
  }, {
    title: '客户来源',
    dataIndex: 'dictName',
  }, {
    title: '行业类型',
    dataIndex: 'industryName',
  }, {
    title: '注册时间',
    dataIndex: 'createTime',
  },  {
    title: '可揽入时间',
    dataIndex: 'removeTime',
    render: (text, record) => {
      const date = record.removeTime.split('.0')
      return (
        <span>{date}</span>
      )
    },
  }]
  constructor(props){
      super(props);
      this.queryCondition = {
          "name":"",
          "type":"",
          "dictName":"",
          "poolId":"",
      };
  }
  start = () => {
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  onSelectChange = (selectedRowKeys,data) => {
    let [name,id,poolId,topicId] = ['','','','']
    data.map((item, index) => {
      item.length === index ? name += item.name : name += item.name + ','
      item.length === index ? id += item.id : id += item.id + ','
      item.length === index ? poolId += item.poolId : poolId += item.poolId + ','
      item.length === index ? topicId += item.topicId : topicId += item.topicId + ','
      return {}
    })
    this.props.dispatch(selectKey(selectedRowKeys))
    // this.clientIds = selectedRowKeys
    this.setState({ selectedRowKeys })
    this.setState({name,id,poolId,topicId})
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

  handleMenuClick = (e) => {
    message.info('Click on departMenu item.')
  }

  handleChange = (value) => {
  }

  onChange = (pageNumber) => {
  }

  handleQueryBest = (value) => { // 初级查询
    const { page } = this.props.myInternation
    const ss = F.filterUndefind(value)
    this.isBest = true
    this.queryCondition = ss
    if(this.queryCondition.address){
      this.queryCondition.address = this.queryCondition.address.join("")
    }
    this.props.dispatch(getMyPoolCus({
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...ss,
    }))
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    this.props.dispatch(getMyPoolCus({
      pageNum: pageNum,
      pageSize: pageSize,
      ...this.queryCondition,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    this.props.dispatch(getMyPoolCus({
      pageNum: pageNum,
      pageSize: pageSize,
      ...this.queryCondition,
    }))
  }

  componentDidMount() {
    const crm = store.get('crm')
    const { page } = this.props.myInternation

    this.props.dispatch(selectPoolByUserId({ // 获取所属公海列表
      userId: crm.user && crm.user.id || "",
      // userId: 422,
    })).then((data)=>{
      if(data && data.code == 0){
          if(data.data && data.data.length>0){
              this.queryCondition.poolId = data.data[0].id;
          }
          this.props.dispatch(getMyPoolCus({ // 初始化list
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            poolId: (data.data && data.data.length>0)?data.data[0].id:"",
          }))
      }
    })
  }

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  renderHeaser = () => { // 表格头部
    return (
      <TableHeaderClient {...this.props} assignMent={this.assignMent}/>
    )
  }

  assignMent = () => {
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length === 0) {
      return message.info('请选择客户进行分配', 1)
    }
    //查询所有人
    let code = ''
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.department) {
      code = crm.user.department.deptCode
    }
    this.props.dispatch(selectAllCheneseName({ // 个人列表
      code,
    })).then(data => {
      const nameData = data.data
      this.nameData = nameData
      this.setState({
        nameList: this.nameData,
      })
    }).catch(err => {
    })
    this.setState({
      visible: true,
    })
  }

  saveOk = (value) => {
    if(!value[0].userId || value.userId === '0'){
      return message.info("请选择人员",1);
    }
    const clientinfo = JSON.stringify(value)
    this.props.dispatch(insertMyClientToPool({myclientList: clientinfo})).then(data => {
      if (data && data.code === 0) {
        message.success(data.msg)
        this.handleCancel()

        const { page } = this.props.myInternation
        this.props.dispatch(getMyPoolCus({
          pageNum: page.pageNum,
          pageSize: page.pageSize,
          ...this.queryCondition,
        }))
    }else{
        if(data){
            message.error(data.msg)
        }
    }
    })
  }

  handleCancel = () => {
    this.assignNumber = []
    this.setState({
      visible: false,
      selectedRowKeys: [],
    })
  }

  clientQuery = (clientInfo) => { // 基本搜索
      this.props.myInternation.loading = true;
      this.setState({
          loading:true,
      })
    this.queryCondition.customerName = clientInfo.customerName||"";
    this.queryCondition.type = clientInfo.type||"";
    this.queryCondition.dictName = clientInfo.dictName||"";
    this.queryCondition.poolId = clientInfo.poolId||"";
    this.queryCondition.address = clientInfo.address?clientInfo.address.join(""):"";
    const { page } = this.props.myInternation
    const upData = F.filterUndefind(clientInfo)
    // let [nextFlowTime,nextFlowTimeStart] = [upData.flowTime[0],upData.flowTime[1]]
    const outValues = {
      industryType: clientInfo.dictName || '',
      customerName: clientInfo.customerName || '',
      type: clientInfo.type || '',
      poolId:clientInfo.poolId || '',
      address:clientInfo.address?clientInfo.address.join(""):"",
      // createTime: nextFlowTime ? nextFlowTime.format('YYYY-MM-DD') : '',
      // modifyTime: nextFlowTimeStart ? nextFlowTimeStart.format('YYYY-MM-DD') : '',
    }
    this.queryCondition = outValues;
    this.props.dispatch(getMyPoolCus({
      pageNum: 1,
      pageSize: page.pageSize,
      ...F.filterUndefind(outValues),
    }))
    this.outValues = outValues
  }

  render() {
    const { selectedRowKeys, visible } = this.state
    const { page, list, loading } = this.props.myInternation

    if (!page) {
      return null
    }
    // const { selectedRowKeys } = this.props.search
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
      <Layout className={style.LogsWrap}>
        <Wrap>
          <ContentWrap style={{ borderTop: 'none' }}>
            <div className={style.listTitle}>
              <div>
                <Icon type="search" className={style.search} />
                &ensp;筛选查询
              </div>
              <div>
                <Button style={{display: 'none'}} onClick={this.handleQuery}>查询结果</Button>
              </div>
            </div>
            <div>
              <div className={style.listTop}>
                <FormMyClientSearch
                  {...this.props}
                  clientQuery={this.clientQuery}
                />
              </div>
            </div>
            <Table
              rowKey={record => record.id + '-' + record.poolId}
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
              names={this.names}
              ids={this.ids}
              poolIds={this.poolIds}
              topicIds={this.topicIds}
              ok={this.saveOk}
              {...this.props}
              assignNumber = {this.assignNumber}
            />
          </ContentWrap>
        </Wrap>
      </Layout>
    )
  }
}

export default MyInternation
