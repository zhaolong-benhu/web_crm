/**
 * Created by huangchao on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import style from './style.less'
import {Icon, Button} from 'antd'
import AuthRequire from '../AuthRequire'

const TableHeaderMyClue = (props) => {
  return (
    <div className={style.listTitle}>
      <div>
        <Icon type="bars" className={style.bars} />
        &ensp;数据列表
      </div>
      <div>
        <AuthRequire authName="sys:myclue:adden">
          <Link to={{
            pathname: '/clue',
            state: {customerCategory: 2, action: 1, topName: '我的线索'}, // action:1 新增 customerCategory:2 新增企业
          }}><Button>新增企业线索</Button>&emsp;</Link>
        </AuthRequire>
        <AuthRequire authName="sys:myclue:addin">
          <Link to={{
            pathname: '/clue',
            state: {customerCategory: 1, action: 1, topName: '我的线索'}, // action:1 新增 customerCategory:1 新增个人
          }}><Button>新增个人线索</Button>&emsp;</Link>
        </AuthRequire>
        <AuthRequire authName="sys:myclue:export">
          <Button onClick={props.exportTable} disabled={true}><Icon type="download" /> 导出</Button>
        </AuthRequire>
      </div>
    </div>
  )
}

TableHeaderMyClue.propTypes = {
  exportTable: PropTypes.func,
}

export default TableHeaderMyClue
