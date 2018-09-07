/**
 * Created by ll on 30/11/2017.
 * @param {array} dataSource - 数据原.
 */
import React from 'react'
import style from './style.less'
import {Icon, Button} from 'antd'
import queryString from 'query-string'
import AuthRequire from '../AuthRequire'

class TableHeaderClient extends React.Component {

  state = {
    columns: this.props.dataSource,
    visible: false,
  }

  showBtn = () => {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName} = this.props.history.location.state || parsed
    if (topName === '跟进设置') {
      return (
        <AuthRequire authName="sys:followsystem:add">
          <Button onClick={() => this.props.addOrUpdateFollowItem()}>添加跟进内容</Button>
        </AuthRequire>
      )
    }
    if (topName === '商机管理' || topName === '我的商机') {
      return (
        <AuthRequire authName="sys:busin:export">
          <Button onClick={this.props.exportTable} disabled={true}>导出</Button>
        </AuthRequire>
      )
    }
    if (topName === '客户管理' || topName === '我的公海') {
      return (
        <AuthRequire authName={["sys:client:allocate", "sys:mypool:distribution"]}>
          <Button onClick={() => this.props.assignMent()}>分配</Button>
        </AuthRequire>
      )
    }
    if (topName === '延期处理') {
      return (
        <AuthRequire authName="sys:delaysystem:examine">
          <Button onClick={() => this.props.auditDelay()}>审核</Button>
        </AuthRequire>
      )
    }
  }

  render() {
    return (
      <div className={style.listTitle}>
        <div>
          <Icon type="bars" className={style.bars} />
          &ensp;数据列表
        </div>
        <div>
          {this.showBtn()}
        </div>
      </div>
    )
  }
}

export {
  TableHeaderClient,
}
