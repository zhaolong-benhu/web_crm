import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Table,
  Modal,
  message,
  Icon,
  Switch,
  Form,
  Input,
  Radio,
  Button,
  Tree,
  Select,
} from 'antd'
import {
  getAllPowerListRequest,
  getAllPowerList,
  getAllDeptList,
  getAllPersonList,
  postPower,
  postPowerWithAssign,
  postSwitchStatus,
  postPowerRemove,
} from '../../actions/powerSystem'
import ContentWrap from '../Content'
import Layout from '../Wrap'
import { filterOption } from '../../util'
import styles from './style.less'
const { Wrap } = Layout
const FormItem = Form.Item
const RadioGroup = Radio.Group
const { TextArea } = Input
const TreeNode = Tree.TreeNode
const Option = Select.Option

@connect(state => {
  return {
    loading: state.powerSystem.loading,
    powerList: state.powerSystem.powerList,
    deptList: state.powerSystem.deptList,
    personList: state.powerSystem.personList,
    page: state.powerSystem.page,
  }
})
export default class PowerSystem extends Component {
  state = {
    selectedRowKeys: [],
    editVisible: false,
    editConfirmLoading: false,
    editModalTitle: '',
    assignVisible: false,
    assignConfirmLoading: false,
    autoExpandParent: true,
    checkedKeys: [],
    model: null,
    assign: null,
  }
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'groupName',
      align: 'center',
    },
    {
      title: '拥有部门',
      dataIndex: 'deparName',
      width: 400,
      className: 'ellipsis',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={record.status === 1}
            onChange={() => this.onChangeEnable(record.id, record.status)}
          />
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '编辑',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <span>
            <a onClick={this.onEditClick(record.id)}>编辑</a> |{' '}
            <a onClick={this.onAssignClick(record.id)}>权限分配</a>
          </span>
        )
      },
    },
  ]
  start = () => {
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
      })
    }, 1000)
  }
  renderHeaser = () => {
    // 表格头部
    return (
      <div className={styles.listTitle}>
        <div>
          <Icon type="bars" />
          &ensp;数据列表
        </div>
        <div>
          <Button style={{ marginRight: 10 }} onClick={this.onAdd}>
            <Icon type="plus" />
            新增
          </Button>
          {/*
          <Button onClick={this.onRemove}>
            <Icon type="minus" />
            删除
          </Button>
          */}
        </div>
      </div>
    )
  }
  onChangeEnable = (id, status) => {
    const { page } = this.props.page
    const params = {
      id: id,
      status: Math.abs(status - 1),
    }
    this.props.dispatch(postSwitchStatus(params)).then(() => {
      setTimeout(() => {
        this.props.dispatch(
          getAllPowerList({
            ...page,
          })
        )
      }, 0)
    })
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }
  onPageChange = (current, pageSize) => {
    this.props.dispatch(
      getAllPowerList({
        pageNum: current,
        pageSize: pageSize,
      })
    )
  }
  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch(
      getAllPowerList({
        pageNum: current,
        pageSize: pageSize,
      })
    )
  }
  onEditClick = id => e => {
    e.preventDefault()
    const model = this.props.powerList.filter(item => {
      return item.id === id
    })[0]
    this.setState({
      editVisible: true,
      editModalTitle: '编辑角色',
      model,
      checkedKeys: model.deparCode.split(','),
    })
  }
  onAssignClick = id => e => {
    e.preventDefault()
    const assign = this.props.powerList.filter(item => {
      return item.id === id
    })[0]
    this.setState({
      assignVisible: true,
      assign,
    })
  }
  onEditOk = e => {
    e.preventDefault()
    this.setState({
      editConfirmLoading: true,
    })
    setTimeout(() => {
      const form = this.editRef.props.form
      if (this.state.checkedKeys.length > 0) {
        form.validateFields((err, values) => {
          if (!err.groupName && !err.status) {
            const val = {
              ...values,
              dept: '',
              deparCode: this.state.checkedKeys,
            }
            this.props
              .dispatch(postPower(val))
              .then(data => {
                message.info(data.msg)
                this.props.dispatch(
                  getAllPowerList({
                    ...this.props.page,
                  })
                )
              })
              .catch(err => {
                // message.error('请求错误')
              })
            form.resetFields()
            this.setState({
              editVisible: false,
              editConfirmLoading: false,
              checkedKeys: [],
              model: null,
            })
          } else {
            this.setState({
              editConfirmLoading: false,
            })
          }
        })
      } else {
        message.error('请选择部门！')
        this.setState({
          editConfirmLoading: false,
        })
      }
    }, 500)
  }
  onEditCancel = () => {
    const form = this.editRef.props.form
    form.resetFields()
    this.setState({
      editVisible: false,
      checkedKeys: [],
      model: null,
    })
  }
  onAssignOk = e => {
    e.preventDefault()
    this.setState({
      assignConfirmLoading: true,
    })
    setTimeout(() => {
      const form = this.assignRef.props.form
      form.validateFields((err, values) => {
        if (!err) {
          this.props
            .dispatch(postPowerWithAssign(values))
            .then(data => {
              message.info(data.msg)
              this.props.dispatch(
                getAllPowerList({
                  ...this.props.page,
                })
              )
            })
            .catch(err => {
              // message.error('请求错误')
            })
          form.resetFields()
          this.setState({
            assignVisible: false,
            assignConfirmLoading: false,
          })
        } else {
          this.setState({
            assignConfirmLoading: false,
          })
        }
      })
    }, 500)
  }
  onAssignCancel = () => {
    this.setState({
      assignVisible: false,
    })
  }
  onAdd = () => {
    this.setState({
      editVisible: true,
      editModalTitle: '新增角色',
    })
  }
  onRemove = () => {
    const params = {
      ids: this.state.selectedRowKeys,
    }
    this.props
      .dispatch(postPowerRemove(params))
      .then(data => {
        message.info(data.msg)
        this.props.dispatch(
          getAllPowerList({
            ...this.props.page,
          })
        )
      })
      .catch(err => {
        // message.error('请求错误')
      })
  }
  onCheck = checkedKeys => {
    this.setState({ checkedKeys })
  }
  componentDidMount() {
    this.props.dispatch(getAllPowerListRequest())
    this.props.dispatch(
      getAllPowerList({
        ...this.props.page,
      })
    )
    this.props.dispatch(getAllDeptList())
    this.props.dispatch(getAllPersonList())
  }
  render() {
    const { page, powerList, loading, deptList, personList } = this.props
    const { model, assign } = this.state
    const {
      selectedRowKeys,
      editVisible,
      editConfirmLoading,
      editModalTitle,
      assignVisible,
      assignConfirmLoading,
      autoExpandParent,
      checkedKeys,
    } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const pagination = {
      onChange: this.onPageChange,
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
          <ContentWrap style={{ borderTop: 'none' }}>
            <Table
              loading={loading}
              title={this.renderHeaser}
              className={styles.table}
              columns={this.columns}
              dataSource={powerList}
              pagination={pagination}
            />
            <EditModalForm
              editVisible={editVisible}
              editModalTitle={editModalTitle}
              editConfirmLoading={editConfirmLoading}
              onEditOk={this.onEditOk}
              onEditCancel={this.onEditCancel}
              deptList={deptList}
              autoExpandParent={autoExpandParent}
              checkedKeys={checkedKeys}
              onCheck={this.onCheck}
              model={model}
              wrappedComponentRef={editRef => {
                this.editRef = editRef
              }}
            />
            <AssignModalForm
              assignVisible={assignVisible}
              assignConfirmLoading={assignConfirmLoading}
              onAssignOk={this.onAssignOk}
              onAssignCancel={this.onAssignCancel}
              assign={assign}
              personList={personList}
              wrappedComponentRef={assignRef => {
                this.assignRef = assignRef
              }}
            />
          </ContentWrap>
        </Wrap>
      </Layout>
    )
  }
}

const EditModalForm = Form.create()(
  class extends React.Component {
    renderTreeNodes = data => {
      return data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode {...item} />
      })
    }
    render() {
      const {
        editVisible,
        editModalTitle,
        onEditOk,
        editConfirmLoading,
        onEditCancel,
        deptList,
        autoExpandParent,
        checkedKeys,
        onCheck,
        model,
        form,
      } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          title={editModalTitle}
          visible={editVisible}
          onOk={onEditOk}
          confirmLoading={editConfirmLoading}
          onCancel={onEditCancel}
          destroyOnClose
        >
          <Form layout="vertical">
            {getFieldDecorator('id', {
              initialValue: (model && model.id) || '',
            })(<Input hidden />)}
            <FormItem label="角色">
              {getFieldDecorator('groupName', {
                initialValue: (model && model.groupName) || '',
                rules: [
                  {
                    required: true,
                    message: '请输入角色',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem style={{ height: 200, overflowY: 'auto' }} label="部门">
              {getFieldDecorator('dept', {
                rules: [
                  {
                    required: true,
                    message: '请选择部门',
                  },
                ],
              })(
                <Tree
                  checkable
                  autoExpandParent={autoExpandParent}
                  checkedKeys={checkedKeys}
                  onCheck={onCheck}
                >
                  {this.renderTreeNodes(deptList)}
                </Tree>
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                initialValue: model && model.status ? 1 : 0,
                rules: [
                  {
                    required: true,
                    message: '请选择状态',
                  },
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="备注">
              {getFieldDecorator('remark', {
                initialValue: (model && model.remark) || '',
              })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)

const AssignModalForm = Form.create()(
  class extends React.Component {
    render() {
      const {
        assignVisible,
        onAssignOk,
        assignConfirmLoading,
        onAssignCancel,
        assign,
        personList,
        form,
      } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          title="分配权限"
          visible={assignVisible}
          onOk={onAssignOk}
          confirmLoading={assignConfirmLoading}
          onCancel={onAssignCancel}
          destroyOnClose
        >
          <Form layout="vertical" className={styles.form}>
            {getFieldDecorator('powerId', {
              initialValue: (assign && assign.id) || '',
            })(<Input hidden />)}
            <FormItem label="角色">
              {getFieldDecorator('groupName', {
                initialValue: (assign && assign.groupName) || '',
              })(<Input disabled />)}
            </FormItem>
            <FormItem label="人员">
              {getFieldDecorator('userIds', {
                initialValue:
                  (assign && assign.userIds && assign.userIds.split(',')) || [],
                rules: [
                  {
                    required: true,
                    message: '请选择状态',
                  },
                ],
              })(
                <Select
                  filterOption={(input, option) => filterOption(input, option)}
                  showSearch
                  mode="multiple"
                  placeholder="请选择人员"
                >
                  {personList.map(item => (
                    <Option key={item.userId} value={item.userId.toString()}>
                      {item.chineseName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)
