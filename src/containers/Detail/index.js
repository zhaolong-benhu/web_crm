import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import style from './style.less'
import PropTypes from 'prop-types'
import { Form, Table, Button, Icon, Tabs, Popconfirm } from 'antd'
import {ListTextPerson, ListTime, ListRadio} from '../../components/formList'
import Layout from '../Wrap'
import ContentWrap from '../Content'
import { heiQueryData } from '../../static/formData'
const TabPane = Tabs.TabPane

const {Wrap} = Layout

const columns = [{
  title: '用户',
  dataIndex: 'username',
  render: text => <a href="#/" onClick={() => { console.log(this.props) }}>{text}</a>,
}, {
  title: 'IP',
  dataIndex: 'ip',
}, {
  title: '地区',
  dataIndex: 'address',
}, {
  title: '浏览器',
  dataIndex: 'explore',
}, {
  title: '时间',
  dataIndex: 'time',
}, {
  title: '操作',
  dataIndex: 'operation',
  render: (text, record) => {
    return (
      <Popconfirm title="确定删除行?" onConfirm={() => this.onDelete(record.key)}>
        <a href="#/">删除</a>
      </Popconfirm>
    )
  },
}]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    username: `Miracle ${i}`,
    ip: '192.168.1.1',
    address: `浙江 杭州 ${i}`,
    explore: `London, Park Lane no. ${i}`,
    time: '2017年11月13日09:42:37',
  })
}

class $Detail extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    dataSource: data,
    checkNick: false,
  };
  check = () => {
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          console.info('success')
        }
      },
    )
  }
  handleChange = (e) => {
    this.setState({
      checkNick: e.target.checked,
    }, () => {
      this.props.form.validateFields(['nickname'], { force: true })
    })
  }
  showFormItem = () => { // 表单列表
    return heiQueryData.map((data, index) => {
      if (data.type === 1) {
        return (
          <ListTextPerson
            key={index}
            data={data}
          />
        )
      }
      if (data.type === 2) {
        return (
          <ListRadio
            key={index}
            data={data}
          />
        )
      }
      if (data.type === 3) {
        return (
          <ListTime
            key={index}
            data={data}
          />
        )
      }
      return null
    })
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  callback = (key) => {
  }

  render() {
    // const { getFieldDecorator } = this.props.form
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    // const hasSelected = selectedRowKeys.length > 0
    let {page, size, total} = this.state
    let pagination = {
      total: total,
      defaultCurrent: page,
      pageSize: size,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }

    return (
      <Layout className={style.LogsWrap}>
        <Wrap>
          <ContentWrap>
            <div className={style.listTitle}>
              <div>
                <Icon type="search" className={style.search} />
                &ensp;个人客户信息
              </div>
              <div>
                <Button>取消</Button> &emsp;
                <Button>保存</Button>
              </div>
            </div>
            <div className={style.listTop}>
              <Tabs onChange={this.callback} type="card">
                <TabPane tab="客户信息" key="1">
                  <div>
                    {this.showFormItem()}
                  </div>
                </TabPane>
                <TabPane tab="联系人信息" key="2">
                  <Table className={style.table} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
                </TabPane>
                <TabPane tab="跟进记录" key="3">
                  <Table className={style.table} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
                </TabPane>
                {/* <TabPane tab="商机记录" key="4">
                  <Table className={style.table} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
                </TabPane>
                <TabPane tab="合同记录" key="5">
                  <Table className={style.table} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
                </TabPane> */}
                <TabPane tab="礼物记录" key="6">
                  <Table className={style.table} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
                </TabPane>
                <TabPane tab="操作记录" key="7">
                  <Table className={style.table} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
                </TabPane>
              </Tabs>
            </div>
          </ContentWrap>
        </Wrap>
      </Layout>
    )
  }
}
const Detail = Form.create()($Detail)
export default Detail
