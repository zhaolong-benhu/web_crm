/**
 * Created by ll on 30/11/2017.
 * @param {array} dataSource - 数据原.
 */
import React from 'react'
import {Link} from 'react-router-dom'
import style from './style.less'
import {Icon, Button} from 'antd'
import AuthRequire from '../AuthRequire'

class TableHeaderInternation extends React.Component {

  state = {
    columns: this.props.dataSource,
    visible: false,
  }

  render() {
    return (
      <div className={style.listTitle}>
        <div>
          <Icon type="bars" className={style.bars} />
          &ensp;数据列表
        </div>
        <div>
        <AuthRequire authName="sys:pool:add">
            <Link to={{
              pathname: '/CRM/internation',
              state: {action: 1, topName: '查看公海'}, // action:1 新增 customerCategory:2 新增企业
          }}><Button>新增公海</Button>&emsp;</Link>
          </AuthRequire>
          <AuthRequire authName="sys:pool:maintenance">
            <Link to={{
              state: {action: 1, topName: '公海管理'}, // action:1 新增 customerCategory:1 新增个人
            }}>
           {/* <Button onClick={() => this.props.ruleUpdate()}>规则维护</Button>&emsp; */}
          </Link>
          </AuthRequire>
        </div>
      </div>
    )
  }
}

export default TableHeaderInternation
