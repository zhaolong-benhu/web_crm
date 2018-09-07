/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {connect} from 'react-redux'
import 'moment/locale/zh-cn'
import {ListContactBaseAddForm} from '../formContactBaseAdd'
import {ListWorkPaneAdd} from '../formWorkPaneAdd'
import {ListPhoneAddForm} from '../formPhoneAdd'
moment.locale('zh-cn')

@connect((state) => {
  return {
    contactBaseInfo: state.contactBaseInfo,
  }
})
class ListContactAdd extends Component { // 企业表单提交
  static propTypes = {
    form: PropTypes.any,
    parsed: PropTypes.object,
    contactBaseInfo: PropTypes.object,
    location: PropTypes.object,
  }

  render() {
    return (
      <div>
        <ListContactBaseAddForm
          {...this.props}
          contactBaseInfo={this.props.contactBaseInfo}
         />
         <ListWorkPaneAdd
          {...this.props}
         />
         {/*<ListPhoneAddForm
           {...this.props}
         />*/}
      </div>
    )
  }
}

export {
  ListContactAdd,
}
