import React, { Component } from 'react'
import {withRouter,Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import style from './style.less'
import { Layout, Menu, Icon } from 'antd'
import queryString from 'query-string'
import ConnentTop from '../../components/ConnentTop'
import PageHeader from '../../components/PageHeader'
import {setHistory} from '../../actions/history'
import * as auth from '../../actions/auth'
const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

class Wrap extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

@connect((state) => {
  return {}
})
@withRouter
class Layout$ extends Component {
  static propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    state: PropTypes.object,
    dispatch: PropTypes.func,
  }

  state = {
    params: [],
    topName: '系统首页',
  }

  static Wrap = Wrap

  tipTags = (value) => {
    const keyPath = value.keyPath
    const topName = value.item.props.children
    this.props.history.push(`/${keyPath[1]}/${keyPath[0]}`, {page: keyPath[1], key: keyPath[0], topName})
  }
  componentDidMount() {
    this.props.dispatch(setHistory({...this.props.history}))
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    this.setState({
      topName: parsed.topName,
    })
  }
  render() {
    const state = this.props.location.state || {}
    const {topName} = this.state
    return (
      <div className={`${style.Wrap} ${this.props.className}`}>
        <Layout className={style.layputBox}>
          <Header style={{backgroundColor: 'rgb(57, 185, 149)'}} className={style.header}>
            <PageHeader />
          </Header>
          <Layout className={style.middleContent}>
            <Sider width={200} className={style.sider}>
              <Menu
                mode="inline"
                defaultOpenKeys={[`${state.page}`]}
                defaultSelectedKeys={[`${state.key}`]}
                className={style.menu}
                theme="light"
                onClick={this.tipTags}
              >
                <SubMenu key="home" title={<span><Icon type="home" />首页</span>}>
                  <Menu.Item key="system">系统首页</Menu.Item>
                  <Menu.Item key="seeting">账户设置</Menu.Item>
                  <Menu.Item key="logs">登录日志</Menu.Item>
                  <Menu.Item key="operate">操作日志</Menu.Item>
                </SubMenu>
                <SubMenu key="CRM" title={<span><Icon type="laptop" />CRM</span>}>
                  <Menu.Item key="clueSystem">线索管理</Menu.Item>
                  <Menu.Item key="resourceSystem">资源管理</Menu.Item>
                  <Menu.Item key="internationSystem">公海管理</Menu.Item>
                  <Menu.Item key="clientSystem">客户管理</Menu.Item>
                  <Menu.Item key="businessSystem">商机管理</Menu.Item>
                  <Menu.Item key="myClue">我的线索</Menu.Item>
                  <Menu.Item key="myInternation">我的公海</Menu.Item>
                  <Menu.Item key="myClient">我的客户</Menu.Item>
                  <Menu.Item key="helpSystem">协同客户</Menu.Item>
                  <Menu.Item key="delaySystem">延期处理</Menu.Item>
                  <Menu.Item key="followSystem">跟进设置</Menu.Item>
                  <Menu.Item key="myBusiness">我的商机</Menu.Item>
                  <Menu.Item key="myContract">我的合同</Menu.Item>
                  <Menu.Item key="contractSystem">合同管理</Menu.Item>
                  <Menu.Item key="powerSystem">权限管理</Menu.Item>

                  <SubMenu key="form" title={<span><Icon type="appstore" />报表中心</span>}>
                      <Menu.Item key="followupRecord">跟进记录表</Menu.Item>
                      <Menu.Item key="salesCalculate">销售预测表</Menu.Item>
                      <Menu.Item key="salesfunnel">销售漏斗表</Menu.Item>
                      <Menu.Item key="vocationalGather">业务新增汇总表</Menu.Item>
                      <Menu.Item key="ContractGather">合同汇总表</Menu.Item>
                      <Menu.Item key="salesRank">销售额排名榜</Menu.Item>
                      <Menu.Item key="blueChangeRate">线索转化率</Menu.Item>
                   </SubMenu>

                </SubMenu>
                <SubMenu key="personnel" title={<span><Icon type="paper-clip" />人事管理</span>}>
                  <Menu.Item key="PermissionSystem">权限管理</Menu.Item>
                  <Menu.Item key="ClientToQuit">离职员工客户</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout>
              <Content className={style.content}>
                {/* {this.props.type != "reportform" &&
                 <ConnentTop name={state.topName||topName} />
                } */}
                <div>
                  {this.props.children}
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default Layout$
