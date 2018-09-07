import React, { Component } from 'react'
import style from '../ClientSystem/style.less'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import Layout from '../Wrap'
import store from 'store'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TableHeaderClient } from '../../components/TableHeaderClient'
import { FormFollowSearch } from '../../components/formClientSearch'
import { FormFollowList } from '../../components/FormFollowList'
import ContentWrap from '../Content'
import { createForm } from 'rc-form'
import { Table, Button, Input, Select, Icon, Modal, message,Switch  } from 'antd'
import {
  getClientList,
  removeClient,
  selectAllCheneseName,
  updateClient,
} from '../../actions/clientSystem'
import F from '../../helper/tool'
import { selectKey, deleteSelect } from '../../actions/search'
import {
  selectFollowItemPage,
  deleteFollowItem,
  addOrUpdateFollowItem,
  getFollowItemById,
  followItemDisable,
} from '../../actions/followSystem'
import {
  getTopicList,
} from '../../actions/internation'
const { Wrap } = Layout
const Option = Select.Option

@connect(state => {
  return {
    search: state.search,
    internation: state.internation,
    followSystem: state.followSystem,
  }
})
@createForm()
class FollowSystem extends Component {
  constructor(props) {
    super(props)
    this.outValues = {} // 搜索条件
    this.assignNumber = [] // 启用禁用的id
    this.clientIds = []
  }
  static propTypes = {
    nameList: PropTypes.object,
  }
  state = {
    visible: false,
    value: 2,
    showTitle: '',
    followData: '',
    showBtnTitle: '',
    loading:false,
  }

  columns = [
    {
      title: '字段名称',
      dataIndex: 'name',
      // render: (text, record) => {
      //   const topName = this.props.history.location.state.topName
      //   const url = `/CRM/client/clientId=${record.id}?clientId=${record.id}&id=${record.customerId}&poolId=${record.poolId}&customerCategory=${record.type}&action=2&topName=${topName}`
      //   return (
      //     <Link to={url} target="_blank">
      //       {text}
      //     </Link>
      //   )
      // },
    },
    {
      title: '关联业务线',
      dataIndex: 'topName',
    },
    {
      title: '字段类型',
      dataIndex: 'type',
      render: (text, record) => {
        const dic = ['文本框', '时间文本框', '下拉框', '文本域', '单选', '复选']
        return <span>{dic[parseInt(text, 10) - 1]}</span>
      },
    },
    {
      title: '是否必填',
      dataIndex: 'isRequired',
      render: (text, record) => {
        if (record.isRequired === 0) {
          return <span>否</span>
        }
        if (record.isRequired === 1) {
          return <span>是</span>
        }
      },
    },
    {
      title: '参数',
      dataIndex: 'keyword',
      render: (text, record) => {
        let keywordText = ''
        const keywords = text.split('\n')
        keywords.map((item, key) => {
          keywordText += item
          keywordText += '，'
        })
        // if (keywords[keywords.length-1]) {
        //   keywordText += ' '
        // }
        return <span>{keywordText}</span>
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        return (
            <Switch checkedChildren="已启用" unCheckedChildren="已禁用"  onChange={()=>this.onChangeSwitch(record.id,record.status)}  defaultChecked={record.status === 1 ? true : false} />
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <span>
            <a
              onClick={() => {
                this.updateFollow(record.id)
              }}
            >
              编辑
            </a>
            {/* {' '}
            |{' '}
            <a
              onClick={() => {
                this.removeFollow(record.id)
              }}
            >
              删除
            </a> */}
          </span>
        )
      },
    },
  ]

  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }

  removeFollow = fId => {
    Modal.confirm({
      title: '确定删除此跟进内容吗?',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: this.hideDeleteModal,
      okType: 'danger',
    })
    this.fId = fId
  }

  hideDeleteModal = () => {
    const { page } = this.props.followSystem
    const fId = this.fId
    this.props
      .dispatch(
        deleteFollowItem({
          id: fId,
        })
      )
      .then(data => {
        if (data.code !== 0) return message.error(data.msg)
        if (data.code === 0) {
          this.props.dispatch(
            selectFollowItemPage({
              pageNum: page.pageNum,
              pageSize: page.pageSize,
            })
          )
          this.setState({
            visible: false,
          })
          return message.success(data.msg)
        }
      })
  }

  onSelectChange = (key, data) => {
    // 勾选表格
    let [number, id] = ['', '']
    data.map((item, index) => {
      item.length === index
        ? (number += item.number)
        : (number += item.number + ',')
      item.length === index ? (id += item.id) : (id += item.id + ',')
      return {}
    })
    this.props.dispatch(selectKey(key))
    // this.clientIds = key
    this.setState({ number, id })
    if (number) {
      this.numbers = number.split(',')
      this.numbers.pop()
    }
    if (id) {
      this.ids = id.split(',')
      this.ids.pop()
    }
  }

  addOrUpdateFollowItem = () => {
    this.setState({
      visible: true,
      action: 1,
      showTitle: '添加跟进内容',
    })
  }

  updateFollow = fID => {
    this.props
      .dispatch(
        getFollowItemById({
          id: fID,
        })
      )
      .then(data => {
        this.setState({
          followData: data.data,
          visible: true,
          showTitle: '编辑跟进内容',
          action: 2,
        })
      })
    this.fID = fID
  }

  saveOk = (value, action) => {
    const { page } = this.props.followSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const { id } = parsed

    const upData = F.filterUndefind(value)
    const outValues = {
      ...upData,
    }
    if (action === 1) {
        if(!outValues.name || (outValues.name && outValues.name === " ")){
            return message.error("请输入字段名称");
        }else{
            this.props.dispatch(
                addOrUpdateFollowItem({
                  ...F.filterUndefind(outValues),
                })
              )
              .then(data => {
                if (data) {
                  message.success(data.msg)
                  this.handleCancel()
                  this.props.dispatch(
                    selectFollowItemPage({
                      // 初始化list
                      pageNum: page.pageNum,
                      pageSize: page.pageSize,
                    })
                  )
                }
              })
        }
    }
    if (action === 2) {
      this.props
        .dispatch(
          addOrUpdateFollowItem({
            id: this.fID,
            ...F.filterUndefind(outValues),
          })
        )
        .then(data => {
          if (data) {
            message.success(data.msg)
            this.handleCancel()
            this.props.dispatch(
              selectFollowItemPage({
                // 初始化list
                pageNum: page.pageNum,
                pageSize: page.pageSize,
              })
            )
          }
        })
    }
  }

  handleCancel = () => {
    this.assignNumber = []

    this.setState({
      visible: false,
      selectedRowKeys: [],
    })
  }

  renderHeaser = () => {
    // 表格头部
    return <TableHeaderClient {...this.props} addOrUpdateFollowItem={this.addOrUpdateFollowItem} />
  }

  clientQuery = clientInfo => {
      this.props.followSystem.loading = true;
      this.setState({
          loading:true,
      })
    // 基本搜索
    const { page } = this.props.followSystem
    const upData = F.filterUndefind(clientInfo)
    const outValues = {
      name: upData.name || '',
      topicId: upData.topicId || '',
    }
    this.props.dispatch(
      selectFollowItemPage({
        pageNum: 1,
        pageSize: page.pageSize,
        ...outValues,
      })
    )
    this.outValues = outValues
  }

  showFormFollow = (topicList) => {
    const { visible, showTitle, action, followData } = this.state
    return (
      <FormFollowList
        ref={form => (this.formBusi = form)}
        title={showTitle}
        visible={visible}
        {...this.props}
        cancle={this.handleCancel}
        ok={this.saveOk}
        action={action}
        followData={followData}
        topicList={topicList}
      />
    )
  }

  onShowSizeChange = (pageNum, pageSize) => {
    // 点击每页显示个数
    this.props.dispatch(
      selectFollowItemPage({
        pageNum,
        pageSize,
        ...this.outValues,
      })
    )
  }

  pageChange = (pageNum, pageSize) => {
    // 点击页数
    this.props.dispatch(
      selectFollowItemPage({
        pageNum,
        pageSize,
        ...this.outValues,
      })
    )
  }

  componentDidMount() {
    const { page } = this.props.followSystem
    this.props.dispatch(
      selectFollowItemPage({
        // 初始化lis
        pageNum: page.pageNum,
        pageSize: page.pageSize,
      })
    )
    this.props.dispatch(getTopicList())
  }

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }
  onChangeSwitch = (id,status) => {
      const { page } = this.props.followSystem
      this.props.dispatch(
          followItemDisable({
              id:id,
              status:status == 0?1:0,
          })
      ).then((data)=>{
          if(data && data.code ===0){
              message.success(data.msg);
              this.props.dispatch(
                selectFollowItemPage({
                  pageNum: page.pageNum,
                  pageSize: page.pageSize,
                  ...this.outValues,
                })
              )
          }else{
              if(data){
                  message.error(data.msg)
              }
          }
      })
  }

  render() {
    const { visible, confirmLoading } = this.state
    // const { getFieldProps,getFieldDecorator } = this.props.form // getFieldError
    const { list, page, loading } = this.props.followSystem // count, feadBack
    const { selectedRowKeys } = this.props.search
    const {
      topicList,
    } = this.props.internation
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
                    <Button
                      style={{ display: 'none' }}
                      onClick={this.clientQuery}
                    >
                      查询结果
                    </Button>
                  </div>
                </div>
                <div className={style.listTop}>
                  <FormFollowSearch
                    {...this.props}
                    topicList={topicList}
                    clientQuery={this.clientQuery}
                  />
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
              {this.showFormFollow(topicList)}
            </ContentWrap>
          </div>
        </Wrap>
      </Layout>
    )
  }
}

export default FollowSystem
