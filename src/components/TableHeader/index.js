/**
 * Created by huangchao on 24/11/2017.
 * @param {array} dataSource - 数据原.
 * @param {function} menuSure - 确定的回调函数.
 *
 */

import React from 'react'
import style from './style.less'
import {Icon, Upload, Button, Dropdown, Menu, Checkbox} from 'antd'
import { uploadProps } from '../../actions/clueSystem'
import AuthRequire from '../../components/AuthRequire'
import store from 'store'
import { baseURL } from '../../config'

const auth = store.get('crm') || {}
const URL = baseURL() + '/excel/templateDownload'

function downLoadExel() {
  window.location.href = `${URL}?token=${auth.token}&loginName=${auth.userName}`
}

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
            {(()=>{
                if(this.props.type === "contract"){
                    return <Button className={style.audit} disabled={true} onClick={() => this.props.exportDoc()}>导出</Button>
                }else if(this.props.type === "clienttoquit"){
                    return <div>
                            <Button className={style.audit}  onClick={() => this.props.distributionClient()}>分配客户</Button>
                            <Button className={style.audit}  onClick={() => this.props.removeClient()}>移出客户</Button>
                    </div>
                }else{
                    return <div>
                        <AuthRequire authName="sys:clue:examine">
                          <Button className={style.audit} onClick={() => this.props.submitMoreAudit()}>
                            <Icon type="eye-o" />
                            审核
                          </Button>
                        </AuthRequire>
                        <AuthRequire authName="sys:clue:import">
                          <Upload {...uploadProps} onChange={info => this.props.upLoadFail(info)}>
                            <Button>
                              <Icon type="upload" />导入线索
                            </Button>
                          </Upload>&emsp;
                        </AuthRequire>
                        <AuthRequire authName="sys:clue:template">
                          <Button onClick={() => downLoadExel()}>
                            <Icon type="download" /> <span>模版下载</span>
                          </Button>&emsp;
                        </AuthRequire>
                    </div>
                }
            })()}

        </div>
      </div>
    )
  }
}

export default TableHeader
