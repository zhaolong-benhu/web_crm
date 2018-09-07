import React, { Component } from 'react'
import style from '../ClientSystem/style.less'
import Layout from '../Wrap'
import store from 'store'
import {connect} from 'react-redux'
import {TableHeaderClient} from '../../components/TableHeaderClient'
import {FormHelpSearch} from '../../components/FormBusinessSearch'
import {FormBusiList} from '../../components/FormBusiList'
import ContentWrap from '../Content'
import { createForm } from 'rc-form'
import { Table, Button, Icon, message } from 'antd'
import {selectAllDelay} from '../../actions/helpSystem'
import {selectAllCheneseName} from '../../actions/clientSystem'
import F from '../../helper/tool'
import { baseURL } from '../../config'
import {
  selectKey,
  deleteSelect,
} from '../../actions/search'
import {newWindow} from '../../util/'
const {Wrap} = Layout
const auth = store.get('crm') || {}

@connect((state) => {
  return {
    search: state.search,
    helpSystem: state.helpSystem,
    clientSystem: state.clientSystem,
  }
})
@createForm()
class HelpSystem extends Component {
  constructor(props) {
    super(props)
    this.outValues = {} // 搜索条件
    this.assignNumber = [] // 启用禁用的id
    this.clientIds = []
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
      this.props.helpSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.helpSystem
    const upData = F.filterUndefind(clientInfo)
    let [nextFlowTime,nextFlowTimeStart] = [upData.flowTime[0],upData.flowTime[1]]

    const outValues = {
      userId: clientInfo.userId || '',
      FollowUpStatus: clientInfo.FollowUpStatus || '',
      createTime: nextFlowTime ? nextFlowTime.format('YYYY-MM-DD') : '',
      modifyTime: nextFlowTimeStart ? nextFlowTimeStart.format('YYYY-MM-DD') : '',
      customerName: clientInfo.customerName || '',
      phone: clientInfo.phone || '',
    }
    this.props.dispatch(selectAllDelay({
      pageNum: 1,
      pageSize: page.pageSize,
      ...F.filterUndefind(outValues),
    }))
    this.outValues = outValues
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    this.props.dispatch(selectAllDelay({
      pageNum,
      pageSize,
      ...this.outValues,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    this.props.dispatch(selectAllDelay({
      pageNum,
      pageSize,
      ...this.outValues,
    }))
  }

  componentDidMount() {
    const { page } = this.props.helpSystem
    this.props.dispatch(selectAllDelay({ // 初始化lis
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    let code = ''
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.department) {
      code = crm.user.department.deptCode
    }
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

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  handleCancel = () => {
   this.setState({
     visibleBusi: false,
   })
  }

  showFormBusi =() => {
    const { visibleBusi, showTitle, action, busiData} = this.state
    if (action === 3) { //修改商机
      return (
        <FormBusiList
          ref={(form) => this.formBusi = form}
          title={showTitle}
          visible={visibleBusi}
          {...this.props}
          cancle={this.handleCancel}
          ok={this.saveOk}
          busiData={busiData}
          action={action}
        />
      )
    }
  }

  render() {
    // const { getFieldProps,getFieldDecorator } = this.props.form // getFieldError
    const { list, page, loading, columns} = this.props.helpSystem // count, feadBack
    const {nameList} = this.props.clientSystem
    const { selectedRowKeys } = this.props.search

    columns.forEach((item, index) => {
      if(item.dataIndex === 'customerName'){
        // columns[index].sorter = (a, b) => a.busNumber.length - b.busNumber.length
        columns[index].render = (text, record) => {
          const url = `/CRM/client/helpId=${record.id}?helpId=${record.id}&id=${record.customerId}&topicId=${record.topicId}&requestName=${record.userName}&customerCategory=${record.type}&action=2&auditStatus=2&topName=协同客户`
          return (
            <a onClick={(e)=>{
              e.preventDefault()
              newWindow(url, text)
            }}>{text}</a>
          )
        }
      }
      if(item.dataIndex === 'userName') {

      }
      // if(item.dataIndex === 'action'){
      //   columns[index].render = (text, record) => {
      //     return <ColumnRender.AuditBtn singAudit={this.singAudit} record={record} />
      //   }
      // }
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
                  <FormHelpSearch
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
                columns={columns}
                dataSource={list}
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

export default HelpSystem
