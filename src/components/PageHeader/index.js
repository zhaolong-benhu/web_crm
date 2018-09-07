/**
 * Created by huangchao on 14/11/2017.
 */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import style from './style.less'

class PageHeader extends Component {
  // static propTypes = {
  //   history: PropTypes.object,
  // }

  state = {
  }

  render() {
    return (
      <div className={style.PageHeaderWrap}>
        东方网升客户关系管理系统
      </div>
    )
  }
}

export default PageHeader
