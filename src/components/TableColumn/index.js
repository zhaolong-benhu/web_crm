/**
 * Created by huangchao on 25/12/2017.
 * 表格的头部，以及列的render包装
 */
import React from 'react'
import { Link } from 'react-router-dom'


/*
 * @param {string} to - 新窗口打开.
 * @param {string} text - 链接title.
 * */
const NewTable = (props) => {
  return (
    <Link to={props.url} target="_blank" title={props.title}>
      {props.text}
    </Link>
  )
}

/* 审核组件的渲染
 * @param {function} singAudit - 审核回调.
 * */

const AuditBtn = (props) => {
  return (
    <div>
      {props.record.status === 1 ?
        <a href="javascript:" onClick={() => { props.singAudit(props.record) }}>审核</a> : <span>已审核</span>
      }
    </div>
  )
}

export default {
  NewTable,
  AuditBtn,
}
