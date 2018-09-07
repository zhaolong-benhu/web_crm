/**
 * Created by huangchao on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React from 'react'
import {
  HeiQueryText,
  HeiQueryCascader,
  HeiQuerySelect,
  HeiQueryTime,
  HeiQueryMoney,
} from '../advancedSearch'
import style from './style.less'
import PropTypes from 'prop-types'
import { Form } from 'antd'
const FormItem = Form.Item

const showHeiQueryItem = props => {
  const {
    data,
    getFieldDecorator,
    select,
    topicList,
    nameList,
  } = props
  if (data.type === 1) {
    // 普通文本框
    return (
        <React.Fragment key={data.keyword}>
          <HeiQueryText
            getFieldDecorator={getFieldDecorator}
            select={select}
            data={data}
          />
        </React.Fragment>
    )
  }
  if (data.type === 3) {
    // 下拉框
    return (
      <React.Fragment key={data.keyword}>
        <HeiQuerySelect
          getFieldDecorator={getFieldDecorator}
          select={select}
          data={data}
          topicList={topicList}
          nameList={nameList}
        />
      </React.Fragment>
    )
  }
  if (data.type === 2) {
    // 时间文本框
    return (
      <React.Fragment key={data.keyword}>
        <HeiQueryTime
          getFieldDecorator={getFieldDecorator}
          select={select}
          data={data}
        />
      </React.Fragment>
    )
  }
  if (data.type === 4 || data.type === 5) {
    // 级联选项
    return (
      <React.Fragment key={data.keyword}>
        <HeiQueryCascader
          getFieldDecorator={getFieldDecorator}
          select={select}
          data={data}
        />
      </React.Fragment>
    )
  }
  if (data.type  === 6) {
    // 级联选项
    return (
      <React.Fragment key={data.keyword}>
        <HeiQueryMoney
          getFieldDecorator={getFieldDecorator}
          select={select}
          data={data}
        />
      </React.Fragment>
    )
  }
}

const HeiQueryItem = props => {
  return <div>{showHeiQueryItem(props)}</div>
}

showHeiQueryItem.propTypes = {
  data: PropTypes.object,
  select: PropTypes.func,
  getFieldDecorator: PropTypes.func,
}

export default HeiQueryItem
