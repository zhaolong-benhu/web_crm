/**
 * Created by huangchao on 14/11/2017.
 */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import style from './style.less'
import Layout from '../Wrap'
const {Wrap} = Layout

class PermissionSystem extends Component {
  // static propTypes = {
  //   history: PropTypes.object,
  // }

  state = {
  }

  render() {
    return (
      <Layout className={style.PermissionSystemWrap}>
        <Wrap>
          权限管理
        </Wrap>
      </Layout>
    )
  }
}

export default PermissionSystem
