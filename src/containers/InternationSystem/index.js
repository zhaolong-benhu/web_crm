import React, { Component } from 'react'
import style from './style.less'
import { Link } from 'react-router-dom'
import Layout from '../Wrap'
import {connect} from 'react-redux'
import TableHeaderInternation from '../../components/TableHeaderInternation'
import ContentWrap from '../Content'
import { createForm } from 'rc-form'
import queryString from 'query-string'
import store from 'store'
import { Table, Button, message, Switch, Input, Select, Icon, TreeSelect } from 'antd'
import {getInternationList, updatePoolEnable} from '../../actions/internationSystem'
import { getDepartment } from '../../actions/department'
import F from '../../helper/tool'
import {
  selectKey,
  deleteSelect,
  getQueyBest,
} from '../../actions/search'
import {newWindow} from '../../util/'
// import {queryAutoPoolRule} from '../../actions/internationRule'
// const { toContentState } = Mention
const {Wrap} = Layout
const Option = Select.Option

@connect((state) => {
  return {
    search: state.search,
    internationSystem: state.internationSystem,
    queryBest: state.search.queryBest,
    department: state.department.list,
  }
})
@createForm()
class InternationSystem extends Component {
  constructor(props) {
    super(props)
    this.outValues = {} // 搜索条件
    this.auditID = [] // 启用禁用的id
  }

  state = {
    visible: false,
    value: 2,
    deps:'',
    loading:true,
  }

  columns = [{
    title: '公海名称',
    dataIndex: 'name',
    render: (text, record) => {
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {topName} = this.props.history.location.state || parsed
      const url = `/CRM/internation/${record.key}?id=${record.key}&action=2&topName=${topName}&topicId=${record.topicId}`
      return <a onClick={(e)=>{
        e.preventDefault()
        newWindow(url, text)
      }}>{text}</a>
    },
  }, {
    title: '公海管理员',
    dataIndex: 'sysList',
    render: (text, record) => {
      const sysList = record.sysList
      let sysNames = ''
      sysList.map((data, index) => {
        if(index <= 2){
          sysNames += data.chineseName
          if(index === 0 || index === 1){
           sysNames += '，'
           return null;
         }
        } else if(index === 3) {
          sysNames += '...'
          return null;
        }
        return null
      })
      return(
        <div>
          {sysNames}
        </div>
      )
    },
  },
  {
    title: '所属业务线',
    dataIndex: 'topicName',
    render: (text, record) => {
      return(
        <div>
          {record.topicName}
        </div>
      )
    },
  },
   {
    title: '公海成员',
    dataIndex: 'menList',
    render: (text, record) => {
      const menList = record.memList
      let memNames = ''
      menList.map((data, index) => {
        if(index <= 2){
          memNames += data.chineseName
          if(index === 0 || index === 1){
           memNames += '，'
           return null
         }
        } else if(index === 3) {
          memNames += '...'
          return null
        }
        return null
      })
      return(
        <div>
          {memNames}
        </div>
      )
    },
  }, {
    title: '是否启用',
    dataIndex: 'enable',
    render: (text, record) => {
      if(record.status === 0){
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={ ()=> this.onChangeEnable(record.id,1)} />
      }else {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked onChange={ ()=> this.onChangeEnable(record.id,0)} />
      }
    },
  }, {
     title: '操作',
     key: 'operation',
     render: (text, record) => (
         <Link to={'/CRM/internationRule?poolId='+record.id+'&topName='+record.topicName+'-'+record.name} style={{color:'#1ABC9C',cursor:'pointer'}} title="规则维护">规则维护</Link>
     ),
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

  onSelectChange = (key, data) => { // 勾选表格
      if(data && data.length>0){
          data.map((item, index) => {
            // item.length === index ? number += item.number : number += item.number + ','
            const poolId = item.id
            this.poolId = poolId
            this.topicName = item.topicName
            this.name = item.name
            this.dataLength = data.length
            return {}
          })
      }else{
          this.dataLength = 0
      }

    this.props.dispatch(selectKey(key))
    // this.props.dispatch(selectPoolId(key))
  }

  ruleUpdate = () => {
    if (this.poolId === undefined || this.dataLength > 1) {
      return message.info('请选择一条数据进行规则维护', 1)
    } else {
      const poolId = this.poolId
      const topName = this.topicName+"-"+this.name
      const url = `/CRM/internationRule?poolId=${poolId}&topName=`+topName
      window.location.href = url
    }
  }

  renderHeaser = () => { // 表格头部
    return (
      <TableHeaderInternation ruleUpdate={this.ruleUpdate} />
    )
  }

  onChangeEnable = (id,status) => {
    const { page } = this.props.internationSystem
    const params={
      "id":id,
      "status":status,
    }
    this.props.dispatch(updatePoolEnable({...params})).then(data => {
      if (data) {
        message.success(data.msg)
        this.props.dispatch(getInternationList({
          deps: this.state.deps,
          pageNum: page.pageNum,
          pageSize: page.pageSize,
        }))
      }
    })
  }

  handleQuery = () => { // 基本搜索
      this.props.internationSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.internationSystem
    this.props.form.validateFields((err, value) => {
      if(err) return
      const upData = F.filterUndefind(value)
      const outValues = {
        ...upData,
      }
      this.props.dispatch(getInternationList({
        deps: this.state.deps,
        pageNum: 1,
        pageSize: page.pageSize,
        ...outValues,
    })).then((data)=>{
        // if(data && data.data && data.data.data.length === 0){
        //     var maxPage = parseInt(data.data.page.total/data.data.page.pageSize);
        //     if(data.data.page.total/data.data.page.pageSize > parseInt(data.data.page.total/data.data.page.pageSize)){
        //         maxPage = parseInt(data.data.page.total/data.data.page.pageSize)+1
        //     }
        //     this.props.dispatch(getInternationList({
        //       deps: this.state.deps,
        //       pageNum: maxPage,
        //       pageSize: page.pageSize,
        //       ...outValues,
        //   }))
        // }
    })
      this.outValues = outValues
    })
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    this.props.dispatch(getInternationList({
      deps: this.state.deps,
      pageNum,
      pageSize,
      ...this.outValues,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    this.props.dispatch(getInternationList({
      deps: this.state.deps,
      pageNum,
      pageSize,
      ...this.outValues,
    }))
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
    const { page } = this.props.internationSystem
    this.props.dispatch(getDepartment({depCode:deps}))
    this.props.dispatch(getInternationList({ // 初始化list
      deps: deps,
      listType: 1,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))

    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 1,
    }))
  }

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  render() {
    // const { queryBest } = this.props
    const { getFieldProps } = this.props.form // getFieldError
    const { list, page, loading} = this.props.internationSystem // count, feadBack
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
    let departments = []
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.department) {
      departments.push(crm.user.department)
      const departmentStr = JSON.stringify(departments)
      const departmentRep = departmentStr
        .replace(/deptName/g, 'label')
        .replace(/deptCode/g, 'value')
        .replace(/id/g, 'key')
      departments = JSON.parse(departmentRep)
    }
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
                </div>
                <div className={style.listTop}>
                  <div className={style.formGroup}>
                    <label htmlFor="">输入搜索：</label>
                    <div>
                      <Input style={{ width: 220 }} {...getFieldProps('name')} placeholder="请输入公海名称/管理员/成员" />
                    </div>
                  </div>
                  {/* <div className={style.formGroup}>
                    <label htmlFor="">部门：</label>
                    <div>
                      <TreeSelect
                        style={{ width: 220 }}
                        {...getFieldProps('depCode')}
                        placeholder="请选择部门"
                        treeDefaultExpandAll
                        treeData={departments}
                      />
                    </div>
                  </div> */}
                  <div className={style.formGroup}>
                    <label htmlFor="">启用状态：</label>
                    <div>
                      <Select defaultValue="2" placeholder="请选择状态" style={{ width: 120 }} {...getFieldProps('status')}>
                        <Option value="">请选择状态</Option>
                        <Option value="1">启用</Option>
                        <Option value="0">禁用</Option>
                      </Select>
                    </div>
                  </div>
                  <div>
                  <Button onClick={this.handleQuery} className={style.btnSearch}><Icon className={style.icon} type="search" />搜索</Button>
                  </div>
                </div>
              </div>
              <Table
                loading={this.state.loading}
                title={this.renderHeaser}
                className={style.table}
                rowSelection={rowSelection}
                columns={this.columns}
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

export default InternationSystem
