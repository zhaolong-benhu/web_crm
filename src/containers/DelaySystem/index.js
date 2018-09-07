import React, { Component } from 'react'
import style from '../ClientSystem/style.less'
import Layout from '../Wrap'
import store from 'store'
import {connect} from 'react-redux'
import {TableHeaderClient} from '../../components/TableHeaderClient'
import {FormDelaySearch} from '../../components/FormBusinessSearch'
import {FormBusiList} from '../../components/FormBusiList'
import {Audit} from '../../components/TableBtns'
import ContentWrap from '../Content'
import { createForm } from 'rc-form'
import { Table, Button, Icon, message, Modal, Mention } from 'antd'
import {selectDelayList,insertDelayCheck} from '../../actions/delaySystem'
import {selectAllCheneseName} from '../../actions/clientSystem'
import F from '../../helper/tool'
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
    delaySystem: state.delaySystem,
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
    this.auditID = [] // 审核的id
    this.customerNames = [] //勾选的客户编号
    this.alrExaminecustomerName = [] //已经审核的客户编号
    this.alrCheckId = [] //已经审核的客户id
  }
  static propTypes = {
  }
  state = {
    visible: false,
    visibleBusi: false,
    value: 2,
    columns: [],
    busiData: '',
    selectedRowKeys:[],
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
    let customerName = ''
    data.map((item, index) => {
      item.length === index ? customerName += item.customerName : customerName += item.customerName + ','
      return {}
    })
    this.props.dispatch(selectKey(key))
    this.auditID = key
    this.setState({customerName})
    this.setState({
        auditID:this.auditID,
        selectedRowKeys:this.auditID,
    })
    if(customerName){
        this.customerNames = customerName.split(',')
        this.customerNames.pop()
        for(var i=0;i<this.alrExaminecustomerName.length;i++)
        {
          for(var j=0;j<this.customerNames.length;j++)
          {
            if(this.customerNames[j] === this.alrExaminecustomerName[i]){
              this.customerNames.splice(j,1);
              j=j-1;
            }
          }
        }
        this.customerNames = this.customerNames;
    }
  }

  handleCancel = () => {
    this.assignNumber = []
    // console.log(this.onSelectChange(key, data))

    this.setState({
      visible: false,
      selectedRowKeys: [],
    })
  }
  onCancel = () => {
    this.setState({
      visible: false,
    })
  }
  getCheckboxProps = (data) => { // 不能勾选的表格
    const {list} = this.props.delaySystem
    const arr = []
    list.forEach(item => {
      if (item.status === 1) {
        arr.push(item.id)
      }
    })
    return {
      disabled: arr.indexOf(data.id) < 0,
    }
  }

  renderHeaser = () => { // 表格头部
    return (
      <TableHeaderClient {...this.props} auditDelay={this.auditDelay} />
    )
  }

  auditDelay = () => {
    const { selectedRowKeys } = this.props.search
    if (selectedRowKeys.length === 0) {
      return message.info('请选择数据进行审核', 1)
    }
    this.setState({
      audit: true,
    })
  }
  auditCancle = () => {
    this.auditID = []
    this.setState({audit: false})
  }

  auditOk = (value) => { // 审核
    this.alrCheckId.push(...value.delayList)
    // this.alrCheckId = [...new Set(this.alrCheckId)];

    this.props.dispatch(insertDelayCheck({
      ...value,
    })).then(data =>{
        if (data) {
            message.success(data.msg)
            this.setState({
              rowSelection:[],
            })
            this.auditCancle()
            this.alrExaminecustomerName.push(...this.customerNames)
            this.alrExaminecustomerName = [...new Set(this.alrExaminecustomerName)]
            this.auditID = []
            this.setState({
                auditID: this.auditID,
            })
            if (this.state.searchCondition) {
                this.props.dispatch(selectDelayList({
                    pageNum: this.state.searchPageNum,
                    pageSize: this.state.searchPageSize,
                    ...this.state.searchCondition,
                }))
            } else {
                this.props.dispatch(selectDelayList({
                    pageNum: this.state.searchPageNum,
                    pageSize: this.state.searchPageSize,
                }))
            }
            setTimeout(()=>{
              window.location.reload()
            },500)
        }
    })
  }

  clientQuery = (clientInfo) => { // 基本搜索
      this.props.delaySystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.delaySystem
    const upData = F.filterUndefind(clientInfo)
    let [nextFlowTime,nextFlowTimeStart] = [upData.flowTime[0],upData.flowTime[1]]
    const outValues = {
      assistPeople: clientInfo.assistPeople || '',
      createTime: nextFlowTime ? nextFlowTime.format('YYYY-MM-DD') : '',
      modifyTime: nextFlowTimeStart ? nextFlowTimeStart.format('YYYY-MM-DD') : '',
      customerName: clientInfo.customerName || '',
    }
    this.props.dispatch(selectDelayList({
      pageNum: 1,
      pageSize: page.pageSize,
      ...F.filterUndefind(outValues),
    }))
    this.outValues = outValues
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    this.props.dispatch(selectDelayList({
      pageNum,
      pageSize,
      ...this.outValues,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    this.props.dispatch(selectDelayList({
      pageNum,
      pageSize,
      ...this.outValues,
    }))
  }

  componentDidMount() {
    const { page } = this.props.delaySystem
    this.props.dispatch(selectDelayList({ // 初始化lis
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

    const { selectedRowKeys } = this.props.search
    this.setState({selectedRowKeys})
  }

  componentWillMount() {
    this.props.dispatch(deleteSelect)
    const columns = this.props.delaySystem.columns.filter(item => item.checked)
    this.setState({columns})
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

  viewReson = (record) => {
    this.setState({
      visible: true,
      reason: record.reason,
    })
  }


  render() {
    // const { getFieldProps,getFieldDecorator } = this.props.form // getFieldError
    const { list, page, loading, columns, feadBack} = this.props.delaySystem // count, feadBack
    const {remark = ''} = feadBack
    const {nameList} = this.props.clientSystem
    // const { selectedRowKeys } = this.props.search

    columns.forEach((item, index) => {
      if(item.dataIndex === 'customerName'){
        // columns[index].sorter = (a, b) => a.busNumber.length - b.busNumber.length
        columns[index].render = (text, record) => {
          const url = `/CRM/client/delayId=${record.id}?delayId=${record.id}&status=${record.status}&id=${record.customerId}&topicId=${record.topicId}&customerCategory=${record.type}&action=2&auditStatus=2&topName=延期处理`
          return (
            <a onClick={(e)=>{
              e.preventDefault()
              newWindow(url, text)
            }}>{text}</a>
          )
        }
      }
      if(item.dataIndex === 'action'){
        columns[index].render = (text, record) => {
          return (
            <a onClick={() => { this.viewReson(record) }}>查看理由</a>
          )
        }
      }
      if(item.dataIndex === 'delayDate'){
        columns[index].render = (text, record) => {
          const date = record.delayDate.split('.0')
          return (
            <span>{date}</span>
          )
        }
      }
    })
    const rowSelection = {
      selectedRowKeys:this.state.selectedRowKeys,
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

    //过滤掉已经审核的客户id
    for(var i=0;i<this.alrCheckId.length;i++)
    {
      for(var j=0;j<this.auditID.length;j++)
      {
        if(this.auditID[j] === this.alrCheckId[i]){
          this.auditID.splice(j,1);
          j=j-1;
        }
      }
    }
    this.auditID = this.auditID
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
                  <FormDelaySearch
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
          <Audit
            title="延期审核"
            isAudit="2"
            aType="2"
            disabled={false}
            visible={this.state.audit}
            cancle={this.auditCancle}
            ids={this.auditID}
            customerNames={this.customerNames}
            customerName={this.state.customerName}
            ok={this.auditOk}
          />
          <Modal
            title="查看延期理由"
            visible={this.state.visible}
            onOk={this.onCancel}
            onCancel={this.onCancel}
            className={style.Modal}
            bodyStyle={{overflowX: 'hidden', fontSize: '14px', lineHeight: '2.5'}}
          >
            <div className={style.reason}>
              <span>延期理由：</span>
              <Mention
                style={{ width: '100%', height: 100 }}
                placeholder={this.state.reason}
                disabled
                multiLines
              />
            </div>
          </Modal>
        </Wrap>
      </Layout>
    )
  }
}

export default HelpSystem
