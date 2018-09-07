import React, { Component } from 'react'
import { Spin, Row, Col } from 'antd'
import queryString from 'query-string'
import store from 'store'
import * as auth from '../../actions/auth'
import { transfer } from '../../config'

export default class Transfer extends Component {
  componentDidMount() {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    if (JSON.stringify(parsed) !== '{}') {
      try {
        auth.queryUserInfo({ ticket: parsed.ticket }).then(data => {
          store.set('crm', data)
          window.location.href = transfer() + '?ticket=' + parsed.ticket
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  render() {
    return (
      <Row
        style={{ height: '100vh' }}
        type="flex"
        justify="center"
        align="middle"
      >
        <Col>
          <Spin size="large" tip="正在跳转..." />
        </Col>
      </Row>
    )
  }
}
