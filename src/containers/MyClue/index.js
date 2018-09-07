import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.less'
import { Link } from 'react-router-dom'
import SearchModule from '../../components/SearchModule'
import Layout from '../Wrap'
import {connect} from 'react-redux'
import queryString from 'query-string'
import TableHeaderMyClue from '../../components/TableHeaderMyClue'
import ContentWrap from '../Content'
import { Table, Mention, Modal, Radio, message } from 'antd'
import store from 'store'
import F from '../../helper/tool'
import { baseURL } from '../../config'
import {
  getQueyBest,
  selectKey,
  deleteSelect,
} from '../../actions/search'
import {
  getMyClueList,
  checkReason,
  getNumber,
} from '../../actions/myClue'
import {newWindow} from '../../util/'
const RadioGroup = Radio.Group
const auth = store.get('crm') || {}
// const { toContentState } = Mention
const {Wrap} = Layout

@connect((state) => {
  return {
    search: state.search,
    myClue: state.myClue,
    queryBest: state.search.queryBest,
  }
})

class MyClue extends Component {
  constructor(props) {
    super(props)
    this.queryCondition = {} // 搜索条件
  }

  state = {
    visible: false,
    value: 2,
    loading:true,
  }

  static propTypes = {
    dispatch: PropTypes.func,
    myClue: PropTypes.object,
    search: PropTypes.object,
    history: PropTypes.object,
    queryBest: PropTypes.array,
  }

  columns = [{
    title: '客户编号',
    dataIndex: 'number',
  }, {
    title: '客户姓名',
    dataIndex: 'name',
    render: (text, record) => {
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {topName} = this.props.history.location.state || parsed
      const url = `/clue/${record.key}?id=${record.key}&customerCategory=${record.type}&action=2&topName=${topName}&auditStatus=${record.status}&from=0`
      return (
        <a onClick={(e)=>{
          e.preventDefault()
          newWindow(url, text)
        }}>{text}</a>
      )
    },
  }, {
    title: '客户类型',
    dataIndex: 'cType',
  }, {
    title: '审核状态',
    dataIndex: 'sta',
  }, {
    title: '提交时间',
    dataIndex: 'createTime',
  }, {
    title: '修改时间',
    dataIndex: 'updateTime',
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      if (record.status !== 1) {
        return <a onClick={() => { this.viewFeedback(record) }}>查看反馈</a>
      }
    },
  }]

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

  onSelectChange = (key) => { // 勾选表格
    this.props.dispatch(selectKey(key))
  }

  renderHeaser = () => { // 表格头部
    return (
      <TableHeaderMyClue exportTable={this.exportTable} />
    )
  }

  exportTable = () => {
    const { selectedRowKeys } = this.props.search
    if (selectedRowKeys.length === 0) {
      return message.info('请选择客户编号', 1)
    }
    const id = selectedRowKeys.join(',')
    const URL = baseURL() + '/excel/resource_download'
    const down = `${URL}?token=${auth.token}&loginName=${auth.user.username}&id=${id}`
    window.location.href = down
  }

  viewFeedback(record) { // 查看反馈
    this.props.dispatch(checkReason({
      customerID: record.id,
    }))
    this.setState({
      visible: true,
    })
  }

  handleQueryBest = (value) => { // 初级查询
      this.props.myClue.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.myClue
    const ss = F.filterUndefind(value)
    this.queryCondition = ss
    this.props.dispatch(getMyClueList({
      listType: 1,
      pageNum: 1,
      pageSize: page.pageSize,
      ...ss,
    }))
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    this.props.dispatch(getMyClueList({
      listType: 1,
      pageNum,
      pageSize,
      ...this.queryCondition,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    this.props.dispatch(getMyClueList({
      listType: 1,
      pageNum,
      pageSize,
      ...this.queryCondition,
    }))
  }

  handleTabsChange = (...args) => {
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  componentDidMount() {
    const { page } = this.props.myClue
    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 7,
    }))
    this.props.dispatch(getMyClueList({ // 初始化list
      listType: 1,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
    //this.props.dispatch(getNumber()) // 获取个数
  }

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  render() {
    const { queryBest } = this.props
    const { page, list, loading, feadBack } = this.props.myClue // count
    const { selectedRowKeys } = this.props.search
    const {remark = ''} = feadBack
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
            <SearchModule
              handleQueryBest={this.handleQueryBest}
              showHeiBtn={false}
              queryBest={queryBest}
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
            </ContentWrap>
          </div>
          <Modal
            title="查看反馈"
            visible={this.state.visible}
            onOk={this.handleCancel}
            onCancel={this.handleCancel}
            className={style.Modal}
            bodyStyle={{overflowX: 'hidden', fontSize: '14px', lineHeight: '2.5'}}
            footer={null}
          >
            <div className={style.number}>
              <span>反馈人：</span>
              <span>{feadBack.checkerName}</span>
            </div>

            <div>
              <span className={style.auditSpan}>反馈结果：</span>
              <RadioGroup disabled={true} onChange={this.selectRadio} value={feadBack.status}>
                <Radio value={2}>审核通过</Radio>
                <Radio value={3}>审核不通过</Radio>
              </RadioGroup>
            </div>

            <div className={style.reason}>
              <span>反馈内容：</span>
              <Mention
                style={{ width: '100%', height: 100 }}
                placeholder={remark}
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

export default MyClue
