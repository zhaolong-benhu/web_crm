/**
 * Created by ll on 14/11/2017.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.less'
import { Steps } from 'antd'

const Step = Steps.Step

class StepBar extends Component {
  static propTypes = {
    name: PropTypes.string,
  }

  state = {
    loding: false,
  }

  render() {
    let current,title
    if (JSON.stringify(this.props.clueDetail) === "{}") {
      current = 0
      title = '审核结果'
    } else {
      if (this.props.clueDetail.status === 1) {
        current = 1
        title = '审核结果'
      } else {
        current = 2
        if (this.props.clueDetail.status === 2) {
          title = '审核通过'
        }
        if (this.props.clueDetail.status === 3) {
          title = '审核未通过'
        }
      }
    }
    return (
      <div className={style.stepStyle}>
        <Steps current={current}>
          <Step title="填写线索信息" />
          <Step title="提交审核" />
          <Step title={title} />
        </Steps>
      </div>
    )
  }
}

export default StepBar
