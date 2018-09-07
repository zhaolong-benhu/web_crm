import React, { Component } from 'react'
import style from './style.less'
import { Table, Menu, Dropdown, Button, Icon, message } from 'antd'
import Layout from '../Wrap'
const {Wrap} = Layout

const columns = [{
  title: 'Name',
  dataIndex: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  })
}

class Test extends Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };
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
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  handleButtonClick = (e) => {
    message.info('Click on menu item.')
  }

  handleMenuClick = (e) => {
    message.info('Click on menu item.')
  }

  onShowSizeChange = (current, pageSize) => {
  }

  onChange = (pageNumber) => {
  }

  render() {
    const { loading, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const hasSelected = selectedRowKeys.length > 0

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3rd item</Menu.Item>
      </Menu>
    )
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
      <Layout>
        <Wrap>
          <div className={style.listWrap}>
            <div className={style.listWrapContent}>
              <div>
                <div>
                  <div className={style.listTop}>
                    <Button
                      type="primary"
                      onClick={this.start}
                      disabled={!hasSelected}
                      loading={loading}
                    >
                      重置
                    </Button>
                    <div>
                      <Dropdown.Button onClick={this.handleButtonClick} overlay={menu}>
                        导入线索
                      </Dropdown.Button>
                      <Dropdown.Button
                        onClick={this.handleButtonClick}
                        overlay={menu}
                        disabled
                        style={{ marginLeft: 8 }}
                      >
                        审核
                      </Dropdown.Button>
                      <Dropdown overlay={menu}>
                        <Button style={{ marginLeft: 8 }}>
                          显示条数 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                  <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `选择 ${selectedRowKeys.length} 项` : ''}
                  </span>
                </div>
                <Table className={style.table} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
              </div>
            </div>
          </div>
        </Wrap>
      </Layout>
    )
  }
}

export default Test
