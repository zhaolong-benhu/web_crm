/**
 * Created by huangchao on 24/11/2017.
 * @param {array} dataSource - 数据原.
 * @param {function} menuSure - 确定的回调函数.
 *
 */

import React from 'react'
import style from './style.less'
import {Icon, Button, Dropdown, Menu, Checkbox} from 'antd'
import AuthRequire from '../../components/AuthRequire'
import { baseURL } from '../../config'
// import { uploadProps } from '../../actions/clueSystem'
// import store from 'store'
// const auth = store.get('crm') || {}
// const URL = baseURL() + '/excel/templateDownload'

class TableHeader extends React.Component {

  state = {
    columns: this.props.dataSource,
    visible: false,
  }

  showMenu = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  menuSure = () => {
    this.props.menuSure(this.state.columns)
    this.setState({visible: false})
  }

  handleMenuClick = (key) => {
    let columns = []
    this.state.columns.map(item => {
      if(item.key === key) {
        item.checked = !item.checked
      }
      columns.push(item)
      return {}
    })
    this.setState({columns})
  }

  menu = () => {
    return (
      <Menu>
        {this.state.columns.map((item, index) => {
          return <Menu.Item key={index}>
            <Checkbox
              onChange={() => this.handleMenuClick(item.key)}
              checked={item.checked}
            >{item.title}</Checkbox>
          </Menu.Item>
        })}
        <Menu.Divider />
        <Menu.Item>
          <Button.Group>
            <Button onClick={this.showMenu}>取消</Button>
            <Button onClick={this.menuSure} type="primary">确定</Button>
          </Button.Group>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    return (
      <div className={style.tableHeader}>
        <div className={style.left}>
          <Dropdown onClick={this.showMenu} visible={this.state.visible} overlay={this.menu()} trigger={['click']}>
            <div>
              <Icon className={style.icon} type="bars" /> 数据列表
            </div>
          </Dropdown>
        </div>
        <div className={style.right}>
          <AuthRequire authName="sys:resource:merge">
            <Button onClick={() => this.props.submitMerge()}>
              合并
            </Button>
          </AuthRequire>
          &emsp;
          <AuthRequire authName="sys:resource:allocate">
            <Button  onClick={this.props.submitMoreDis}>
              分配至公海
            </Button>&emsp;
          </AuthRequire>
        </div>
      </div>
    )
  }
}

export default TableHeader
