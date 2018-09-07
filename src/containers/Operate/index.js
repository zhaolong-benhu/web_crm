import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import style from './style.less'
import { Table, Select, Button, Icon, message, DatePicker } from 'antd'
import moment from 'moment'
import Layout from '../Wrap'
import ContentWrap from '../Content'
const Option = Select.Option

const {Wrap} = Layout

const dateFormat = 'YYYY年MM月DD日'

const columns = [{
  title: '用户123',
  dataIndex: 'username',
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
}]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    username: `Lucy ${i}`,
    ip: '192.168.1.1',
    address: `浙江 杭州 ${i}`,
    explore: `London, Park Lane no. ${i}`,
    time: '2017年11月13日09:42:37',
  })
}
class Operate extends Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };
  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  handleMenuClick = (e) => {
    message.info('Click on departMenu item.')
  }

  handleChange = (value) => {
  }

  onShowSizeChange = (current, pageSize) => {
  }

  onChange = (pageNumber) => {
  }

  render() {
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
                &ensp;筛选查询123
              </div>
              <div>
                <Button>查询结果</Button>
              </div>
            </div>
            <div>
              <div className={style.listTop}>
                <div className={style.formGroup}>
                  <label htmlFor="">日期：</label>
                  <div>
                    <DatePicker defaultValue={moment('2015/01/01', dateFormat)} format={dateFormat} />&ensp;-&ensp;<DatePicker defaultValue={moment('2015/01/01', dateFormat)} format={dateFormat} />
                  </div>
                </div>
                <div className={style.formGroup}>
                  <label htmlFor="">部门：</label>
                  <div>
                    <Select defaultValue="技术中心" style={{ width: 120 }} onChange={this.handleChange}>
                      <Option value="财务部">财务部</Option>
                      <Option value="人事部">人事部</Option>
                      <Option value="产品部">产品部</Option>
                    </Select>
                  </div>
                </div>
                <div className={style.formGroup}>
                  <label htmlFor="">员工：</label>
                  <div>
                    <Select defaultValue="Tom" style={{ width: 120 }} onChange={this.handleChange}>
                      <Option value="Lucy">Lucy</Option>
                      <Option value="Miracle">Miracle</Option>
                      <Option value="Marry">Marry</Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <Table className={style.table} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
          </ContentWrap>
        </Wrap>
      </Layout>
    )
  }
}

export default Operate
