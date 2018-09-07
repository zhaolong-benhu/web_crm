import React, { Component } from 'react'
import queryString from 'query-string'
import style from './style.less'
import StepBar from '../../components/StepBar'
import PropTypes from 'prop-types'
import { createForm } from 'rc-form'
import { SelectPeople } from '../../components/TableBtns'
import Layout from '../Wrap'
import { connect } from 'react-redux'
import DfwsSelect from 'dfws-antd-select'
import TableHeaderInternation from '../../components/TableHeaderInternation'
import ContentWrap from '../Content'
import {getUrlParam} from '../../util'
import {
  Table,
  Button,
  message,
  Switch,
  Input,
  Select,
  Icon,
  Modal,
} from 'antd'
import F from '../../helper/tool'
import {
  getAdminList,
  clearAdminList,
  getMemberList,
  clearMemberList,
  getPoolById,
  getTopicList,
  deleteMemberList,
  creatNewSea,
  creatNewAdmin,
  creatNewMenber,
  updateMember,
  selectLabel,
  addLabel,
  delLabel,
} from '../../actions/internation'
import { getAllPeople } from '../../actions/selectPeople'

const { Wrap } = Layout
const Option = Select.Option

@connect(state => {
  return {
    search: state.search,
    internation: state.internation,
    queryBest: state.search.queryBest,
  }
})
@createForm()
class Internation extends Component {
  constructor(props) {
    super(props)
    this.creatNewPool = {} // 创建公海时候的条件
    this.labelId = ""//修改的标签ID
  }

  state = {
    isCompile: false,
    value: 2,
    SelPeople: false,
    tips: '新增管理员',
    mod_title:'新增标签',
    creatTyp: '',
    isChange: false,
    labels:[
        {"name":"大客户","id":"1"},
        {"name":"续约客户","id":"2"},
        {"name":"贵宾","id":"3"},
        {"name":"常联系的客户","id":"4"},
        {"name":"浙江富豪客户张总","id":"5"},
        {"name":"霸气","id":"6"},
    ],
  }

  static propTypes = {
    dispatch: PropTypes.func,
    internation: PropTypes.object,
    search: PropTypes.object,
    history: PropTypes.object,
    queryBest: PropTypes.array,
  }

  columns = [
    {
      title: '姓名',
      dataIndex: 'chineseName',
    },
    {
      title: '岗位',
      dataIndex: 'jobName',
    },
    {
      title: '是否在职',
      dataIndex: 'status',
      render: (text, record) => {
        if (record.status === '1') {
          return <span>试用</span>
        }
        if (record.status === '2') {
          return <span>正式</span>
        }
        if (record.status === '3') {
          return <span>离职</span>
        }
      },
    },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      render: (text, record) => {
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={record.isEnable === 1 ? true : false}
            defaultChecked={record.isEnable === 1 ? true : false}
            onChange={() => this.onChangeEnable(record.id, record.isEnable)}
          />
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        if (record.status !== 1) {
          return (
            <a
              onClick={() => {
                this.removeAdmin(record.id)
              }}
            >
              移出
            </a>
          )
        }
      },
    },
  ]

  renderHeaser = () => {
    // 表格头部
    return <TableHeaderInternation />
  }

  onChangeEnable = (id, isEnable) => {
    Modal.confirm({
      title: '确定是否更改状态?',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: this.hideChangeModal,
      onCancel: this.cancelModal,
    })
    this.id = id
    this.isEnable = isEnable
  }

  hideChangeModal = () => {
    if (this.isEnable === 0) {
      this.isEnable = '1'
    }
    if (this.isEnable === 1) {
      this.isEnable = '0'
    }
    this.setState({
      defaultCheckedSwitch: true,
      isEnable: this.isEnable,
    })
    const { page } = this.props.internation
    const search = this.props.location.search
    const parsed = queryString.parse(search)

    let [poolId, topicId] = ['', '']
    if (JSON.stringify(parsed) === '{}') {
      poolId = this.PoolId
      topicId = parseInt(this.topicId)
    } else {
      poolId = parsed.id
      topicId = parsed.topicId
    }

    const params = {
      id: this.id,
      isEnable: this.isEnable,
    }
    this.props.dispatch(updateMember({ ...params })).then(data => {
      if (data) {
        message.success(data.msg)
        this.props.dispatch(
          getAdminList({
            poolId: poolId||"",
            topicId: topicId,
          })
        ) // 获取管理员&成员列表
        this.props.dispatch(
          getMemberList({
            poolId: poolId||"",
            topicId: topicId,
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            ...this.outValues,
          })
        ) // 获取管理员&成员列表
      }
    })
  }

  cancelModal = () => {
    this.setState({
      loding: true,
      visible: false,
    })
  }

  removeAdmin = id => {
    Modal.confirm({
      title: '确定删除这条规则吗?',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: this.hideModal,
      okType: 'danger',
    })
    this.id = id
  }

  hideModal = () => {
    const { page } = this.props.internation
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const { topicId } = parsed
    this.props.dispatch(deleteMemberList({ id: this.id })).then(data => {
      if (data) {
        message.success(data.msg)
        this.props.dispatch(
          getAdminList({
            poolId: this.PoolId || parsed.id,
            topicId: this.topicId || topicId,
          })
        ) // 获取管理员&成员列表
        this.props.dispatch(
          getMemberList({
            poolId: this.PoolId || parsed.id || "",
            topicId: this.topicId || topicId,
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          })
        ) // 获取管理员&成员列表
      }
    })
  }

  handleQueryBest = value => {
    // 初级查询
    const { page } = this.props.internation
    const ss = F.filterUndefind(value)
    this.props.dispatch(
      getPoolById({
        pageNum: page.pageNum,
        pageSize: page.pageSize,
        ...ss,
      })
    )
  }

  handleQuery = () => {
    // 基本搜索
    const { page } = this.props.internation
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const { id } = parsed
    this.props.form.validateFields((err, value) => {
      if (err) return
      const upData = F.filterUndefind(value)
      const outValues = {
        ...upData,
      }
      this.props.dispatch(
        getMemberList({
          pageNum: page.pageNum,
          pageSize: page.pageSize,
          ...outValues,
          poolId: id||"",
        })
      )
      this.outValues = outValues
    })
  }

  onShowSizeChange = (pageNum, pageSize) => {
    // 点击每页显示个数
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const { id } = parsed
    this.props.dispatch(
      getMemberList({
        pageNum,
        pageSize,
        ...this.outValues,
        poolId: id||"",
      })
    )
  }

  pageChange = (pageNum, pageSize) => {
    // 点击页数
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const { id } = parsed
    this.props.dispatch(
      getMemberList({
        pageNum,
        pageSize,
        ...this.outValues,
        poolId: id||"",
      })
    )
  }

  addAdmin = () => {
    // 新增管理员
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    if (this.PoolId === undefined && parseInt(parsed.action) !== 2) {
      message.error('请新增公海名称等基本信息！')
    } else {
      this.setState({
        tips: '新增管理员',
        SelPeople: true,
        creatTyp: 1,
      })
    }
  }

  addMember = () => {
    // 新增成员
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    if (this.PoolId === undefined && parseInt(parsed.action) !== 2) {
      message.error('请新增公海名称等基本信息！')
    } else {
      this.setState({
        tips: '新增成员',
        SelPeople: true,
        creatTyp: 0,
      })
    }
  }

  // ===========添加人员弹窗模块
  selectPeopleOk = checkedKeys => {
    // 添加人员
    let ids = checkedKeys
    let creatNewPool = this.creatNewPool
    let role = this.state.creatTyp
    if (ids === 0) return message.warning('请选择人员')

    if (role === 1) {
      // 添加管理员
      this.props
        .dispatch(
          creatNewAdmin({
            ids,
            role,
            ...creatNewPool,
          })
        )
        .then(data => {
          // if(data.code !== 0) return message.error(data.msg)
          if (data) {
             message.success(data.msg)
          }
        }).then(data => {
          const search = this.props.location.search
          const parsed = queryString.parse(search)
          const { id, topicId } = parsed
          this.props.dispatch(
            getAdminList({
              poolId: id || this.PoolId,
              topicId: topicId || creatNewPool.topicId,
            })
          ) // 获取管理员列表
          this.props.dispatch(
            getMemberList({
              poolId: id || this.PoolId || "",
              topicId: topicId || creatNewPool.topicId,
            })
          ) // 获取成员列表
        })
    }

    if (role === 0) {
      // 添加成员
      this.props
        .dispatch(
          creatNewMenber({
            ids,
            role,
            ...creatNewPool,
          })
        )
        .then(data => {
          // if(data.code !== 0) return message.error(data.msg)
          if (data) {
            message.success(data.msg)
          }
        }).then(data=>{
          const search = this.props.location.search
            const parsed = queryString.parse(search)
            const { id, topicId } = parsed
            this.props.dispatch(
              getMemberList({
                poolId: id || this.PoolId || "",
                topicId: topicId || creatNewPool.topicId,
              })
            ) // 获取成员列表
            this.props.dispatch(
              getAdminList({
                poolId: id || this.PoolId || "",
                topicId: topicId || creatNewPool.topicId,
              })
            ) // 获取管理员列表
        })
    }

    this.setState({ SelPeople: false, isChange: true  })
  }

  selectPeopleCancle = () => {
    //关闭
    this.setState({ SelPeople: false, isChange: true })
  }

  componentDidMount() {
    const { page } = this.props.internation
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const { id, topicId } = parsed

    this.props.dispatch(getAllPeople()) // 获取公司成员
    this.props.dispatch(getTopicList())

    if (parsed.id) {
      // 编辑公海的情况
      if (parsed.action === '2') {
        this.props.dispatch(
          getPoolById({
            // 初始化list
            id: id,
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          })
        )
      }
      this.props.dispatch(
        getAdminList({
          poolId: id,
          topicId,
        })
      ) // 获取管理员&成员列表
      this.props.dispatch(
        getMemberList({
          poolId: id||"",
          topicId,
          pageNum: page.pageNum,
          pageSize: page.pageSize,
        })
      ) // 获取管理员&成员列表
      this.setState({ isCompile: true })
      this.creatNewPool = {
        poolId: id||"",
        topicId,
      }
      // 获取默认标签
      this.props.dispatch(selectLabel({
          poolId:id,
      }))
    }
  }

  componentWillUnmount() {
    // this.props.form.resetFields()
    // this.props.dispatch(clearAdminList)
    // this.props.dispatch(clearMemberList)
  }

  saveInternation = () => {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const { action,id } = parsed
    console.log(typeof action)


    this.props.form.validateFields((err, value) => {
      if (err) return
      if (!value.name) {
        return message.warning('请输入公海名称')
      }
      if (!value.topicId) {
        return message.warning('请选择业务线')
      }
      let topicId = value.topicId
      this.topicId = topicId

      if (action === '2') {
        this.props
          .dispatch(
            creatNewSea({
              // ====== 修改公海名称
              name: value.name,
              topicId: value.topicId,
              id: parsed.id,
            })
          )
          .then(data => {
            // if(data.code !== 0) return message.error(data.msg)
            if (data) {
              const PoolId = data.data
              this.PoolId = PoolId
              this.creatNewPool = {
                poolId: data.data,
                topicId,
                id: parsed.id,
              }
              // this.setState({
              //   isCompile: true,
              // })
              return message.success('修改成功')
            }
          })
      } else {
      this.props
        .dispatch(
          creatNewSea({
            // ====== 创建公海
            name: value.name,
            topicId: value.topicId,
          })
        )
        .then(data => {
          // if(data.code !== 0) return message.error(data.msg)
          if (data) {
            const PoolId = data.data
            this.PoolId = PoolId
            this.creatNewPool = {
              poolId: data.data,
              topicId,
            }
            // this.setState({
            //   isCompile: true,
            // })
            return message.success('添加成功')
          }
        })
      }
    })
  }

  back = () => {
    this.props.form.resetFields()
    this.props.dispatch(clearAdminList)
    this.props.dispatch(clearMemberList)
    this.props.history.go(-1)
  }
  editLabel = (id,name) => {
      this.setState({
          labelName:name,
          addModvisible:true,
          mod_title:"修改标签",
      })
      this.labelId = id;
  }

    hideDeleteModal = () => {
        this.props.dispatch(delLabel({
            poolId:getUrlParam('id'),
            id:this.cus_labelId,
        })).then((data)=>{
            if(data && data.code ===0){
                // 获取默认标签
                this.props.dispatch(selectLabel({
                    poolId:getUrlParam('id'),
                }))
                return message.success(data.msg);
            }else{
                if(data){
                   return message.error(data.msg);
                }
            }
        })
    }
  deleteLabel = (id) => {
      Modal.confirm({
        title: '确定删除此标签吗?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: this.hideDeleteModal,
        okType: 'danger',
      })
      this.cus_labelId = id;
  }
  addLabel = () => {
      this.setState({
        addModvisible:true,
        mod_title:"新增标签",
        labelName:"",
      })
  }
  onCancel = () => {
      this.setState({
        addModvisible:false,
        labelName:"",
      })
      this.labelId = "";
  }
  handleInputChange = (e) => {
      this.setState({
          labelName:e.target.value,
      })
  }
  onOk = () => {
      if(!this.state.labelName || this.state.labelName === ""){
          return message.error("请输入标签名称");
      }else if(this.state.labelName && this.state.labelName.length>8){
          return message.error("标签名称内容过长(不超过8个文字)");
      }else {
          this.props.dispatch(addLabel({
              poolId:getUrlParam('id'),
              id:this.labelId,
              labelName:this.state.labelName,
          })).then((data)=>{
              if(data && data.code ===0){
                  this.labelId = "";
                  this.setState({
                      addModvisible:false,
                      labelName:"",
                  })
                  // 获取默认标签
                  this.props.dispatch(selectLabel({
                      poolId:getUrlParam('id'),
                  }))
                  return message.success(data.msg);
              }else{
                  if(data){
                     return message.error(data.msg);
                  }
              }
          })
      }
  }

  goBack = () => {
      window.location.href = '/CRM/internationSystem'
  }
  render() {
    const search = this.props.location.search
    const { getFieldProps } = this.props.form
    const parsed = queryString.parse(search)
    const { topName, action } = parsed
    const {
      listAdmin,
      listMem,
      topicList,
      page,
      loading,
      PoolData = {},
    } = this.props.internation
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
    const {labelList} = this.props.internation
    return (
      <Layout className={style.LogsWrap}>
        <Wrap>
          <ContentWrap>
            {/* {topName === '我的线索' && <StepBar />} */}
            <div className={style.listTitle}>
              <div>
                {/* <Icon type="plus-circle-o" />  */}
                查看公海
              </div>
              <Button style={{float:'right',position:'absolute',right:'50px'}} onClick={()=>this.goBack()}>返回</Button>
              <div>
                {parsed.action === undefined ? (
                  <Button onClick={this.back}>返回公海列表</Button>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={style.listPane}>
              <div className={style.listTop}>
                <div className={style.formGroup}>
                  <label htmlFor="">公海名称：</label>
                  <div>
                    <Input
                      {...getFieldProps('name', {
                        initialValue: PoolData.name,
                      })}
                      style={{ width: 220 }}
                      placeholder="请输入公海名称"
                    />
                  </div>
                </div>
                <div className={style.formGroup}>
                  <label htmlFor="">业务线：</label>
                  <div>
                    <Select
                      showSearch
                      {...getFieldProps('topicId', {
                        initialValue: String(PoolData.topicId?PoolData.topicId:""),
                      })}
                      style={{ width: 220 }}
                      disabled={action === '2'}
                      placeholder="请选择关联业务线"
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.indexOf(input.trim()) >= 0}
                    >
                    {
                      topicList.map((d, i) => {
                        return (
                          <Option key={d.id} value={String(d.id)}>{d.name}</Option>
                        )
                      })
                    }
                  </Select>
                  </div>
                </div>
                <Button
                  onClick={this.saveInternation}
                >
                  保存
                </Button>
              </div>
              <p>
                * 管理员列表<Button
                  style={{ float: 'right' }}
                  onClick={this.addAdmin}
                >
                  新增管理员
                </Button>
              </p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.columns}
                  dataSource={listAdmin}
                  pagination={false}
                  style={{ borderBottom: 0 }}
                />
              </div>
            </div>
            <div className={style.listPane}>
              <div className={style.listTop}>
                <div className={style.formGroup}>
                  <label htmlFor="">成员姓名：</label>
                  <div>
                    <Input
                      style={{ width: 220 }}
                      {...getFieldProps('chineseName')}
                      placeholder="请输入成员姓名"
                    />
                  </div>
                </div>
                <div className={style.formGroup}>
                  <label htmlFor="">是否在职：</label>
                  <div>
                    <Select
                      defaultValue="请选择"
                      placeholder="请选择状态"
                      style={{ width: 120 }}
                      {...getFieldProps('status')}
                    >
                      <Option value="">请选择状态</Option>
                      <Option value="1">试用</Option>
                      <Option value="2">正式</Option>
                      <Option value="3">离职</Option>
                    </Select>
                    &emsp;<Icon
                      type="search"
                      className={style.search}
                      onClick={this.handleQuery}
                    />
                  </div>
                </div>
              </div>
              <p>
                * 成员列表<Button
                  style={{ float: 'right' }}
                  onClick={this.addMember}
                >
                  新增成员
                </Button>
              </p>
              <div className={style.listTop}>
                <Table
                  loading={loading}
                  className={style.table}
                  columns={this.columns}
                  dataSource={listMem}
                  pagination={pagination}
                />
              </div>

              <div className={style.labelBox}>
                  <div className={style.text}>* 公海客户标签池</div>
                  <div className={style.labels}>
                  {labelList && labelList.map((v,i)=>{
                      return <div className={style.item} key={"label"+i}>
                          <div className={style.labelName} title={v.labelName}>{v.labelName}</div>
                          <Icon
                            type="edit"
                            className={style.edit}
                            onClick={()=>this.editLabel(v.id,v.labelName)}
                            title="编辑"
                          />
                          <Icon
                            type="delete"
                            className={style.delete}
                            onClick={()=>this.deleteLabel(v.id,i)}
                            title="删除"
                          />
                      </div>
                  })}
                  <div className={style.add} onClick={()=>this.addLabel()} title="添加标签">+</div>
                  </div>
              </div>


            </div>
            {/*添加标签弹窗*/}
            <Modal title={this.state.mod_title}
              visible={this.state.addModvisible}
              onOk={this.onOk}
              onCancel={this.onCancel}
              width={600}
            >
            <div className={style.labelMod}>
                <div className={style.contrain}>
                    <div className={style.key}>标签名称：</div>
                    <input className={style.value} placeholder="请输入标签名称" value={this.state.labelName} onChange={(e)=>this.handleInputChange(e)} />
                </div>
            </div>
            </Modal>

            {/* 添加人员弹窗 */}
            <SelectPeople
              title={this.state.tips}
              ok={this.selectPeopleOk}
              cancle={this.selectPeopleCancle}
              visible={this.state.SelPeople}
              isChange={this.state.isChange}
            />
          </ContentWrap>
        </Wrap>
      </Layout>
    )
  }
}

export default Internation
