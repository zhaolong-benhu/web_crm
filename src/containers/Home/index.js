import React, { Component } from 'react'
import { Row, Col, Card, Collapse } from 'antd'
import styles from './style.less'
import Layout from '../Wrap'
import GridContent from '../../components/GridContent'
const { Wrap } = Layout
const Panel = Collapse.Panel

class Home extends Component {
  state = {}

  render() {
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    }
    return (
      <Layout>
        <Wrap>
          <div className={styles.HomeWrap}>
            <GridContent>
              <Row type="flex" justify="space-around" gutter={24}>
                <Col {...topColResponsiveProps}>
                  <Card
                    bordered={false}
                    bodyStyle={{ padding: '20px 24px 20px' }}
                  >
                    <Row type="flex" gutter={12} align="middle">
                      <Col>
                        <img
                          style={{ width: 60, height: 60 }}
                          src={require('../../static/images/order.png')}
                        />
                      </Col>
                      <Col>
                        <Row type="flex" align="middle">
                          <Col
                            span={24}
                            style={{ color: '#B39999', fontSize: '16px' }}
                          >
                            今日拜访次数
                          </Col>
                          <Col
                            span={24}
                            style={{ color: '#666666', fontSize: '20px' }}
                          >
                            200
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                  <Card
                    bordered={false}
                    bodyStyle={{ padding: '20px 24px 20px' }}
                  >
                    <Row type="flex" gutter={12} align="middle">
                      <Col>
                        <img
                          style={{ width: 60, height: 60 }}
                          src={require('../../static/images/rmb.png')}
                        />
                      </Col>
                      <Col>
                        <Row type="flex" align="middle">
                          <Col
                            span={24}
                            style={{ color: '#B39999', fontSize: '16px' }}
                          >
                            本周预计销售总额
                          </Col>
                          <Col
                            span={24}
                            style={{ color: '#666666', fontSize: '20px' }}
                          >
                            50000.00
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                  <Card
                    bordered={false}
                    bodyStyle={{ padding: '20px 24px 20px' }}
                  >
                    <Row type="flex" gutter={12} align="middle">
                      <Col>
                        <img
                          style={{ width: 60, height: 60 }}
                          src={require('../../static/images/point.png')}
                        />
                      </Col>
                      <Col>
                        <Row type="flex" align="middle">
                          <Col
                            span={24}
                            style={{ color: '#B39999', fontSize: '16px' }}
                          >
                            上周销售总额
                          </Col>
                          <Col
                            span={24}
                            style={{ color: '#666666', fontSize: '20px' }}
                          >
                            50000.00
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                  <Card
                    bordered={false}
                    bodyStyle={{ padding: '20px 24px 20px' }}
                  >
                    <Row type="flex" gutter={12} align="middle">
                      <Col>
                        <img
                          style={{ width: 60, height: 60 }}
                          src={require('../../static/images/data.png')}
                        />
                      </Col>
                      <Col>
                        <Row type="flex" align="middle">
                          <Col
                            span={24}
                            style={{ color: '#B39999', fontSize: '16px' }}
                          >
                            近7填销售总额
                          </Col>
                          <Col
                            span={24}
                            style={{ color: '#666666', fontSize: '20px' }}
                          >
                            50000.00
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </GridContent>
            <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
              <Panel showArrow={false} disabled header="待处理事务" key="1">
                <p>待付款订单 (10) </p>
                <p>待发货订单 (10) </p>
                <p>已发货订单 (10) </p>
                <p>已完成订单 (10) </p>
                <p>待确认退货订单 (10) </p>
                <p>待确认退货订单 (10) </p>
              </Panel>
            </Collapse>
            <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
              <Panel showArrow={false} disabled header="销售快捷入口" key="1">
                <p>销售快捷入口</p>
              </Panel>
            </Collapse>
            <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
              <Panel showArrow={false} disabled header="跟进次数统计" key="1">
                <p>跟进次数统计</p>
              </Panel>
            </Collapse>
          </div>
        </Wrap>
      </Layout>
    )
  }
}

export default Home
