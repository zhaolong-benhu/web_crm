import React, { Component } from 'react'
import queryString from 'query-string'
import style from '../Detail/style.less'
import PropTypes from 'prop-types'
import Layout from '../Wrap'
import moment from 'moment'
import store from 'store'
import {connect} from 'react-redux'
import F from '../../helper/tool'
import {
deleteSelect,
} from '../../actions/search'
import ContentWrap from '../Content'
import { Button, message, Icon } from 'antd'
import { selectAllContacts, updateContactOne, updateCrmJob} from '../../actions/clientSystem'
import { GiftClientForm } from '../../components/FollowClient'
import {selectAllCheneseName} from '../../actions/clientSystem'
import {addOrUpdGiftInv, getDeliveryById} from '../../actions/giftSystem'
import {getUrlParam} from '../../util'

const {Wrap} = Layout

@connect((state) => {
  return {
    search: state.search,
    clueDetail: state.clueDetail,
    clientSystem: state.clientSystem,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
    giftSystem: state.giftSystem,
  }
})
class $Gift extends Component {
  static propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    clueDetail: PropTypes.object,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.outValues = {} // 搜索条件
    this.auditID = [] // 启用禁用的id
  }

  state = {
    visible: false,
    value: 2,
  }

  callback = (key) => {
  }

  showFormItem = () => { // 表单列表
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let action = ''
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action
    }else{
      action = parseInt(parsed.action)
    }
    if (action === 1) {
      return (
        <GiftClientForm
          {...this.props}
          parsed={parsed}
          addGiftInfo={this.addGiftInfo}
        />
      )
    }
    if (action === 2) {
      return (
        <GiftClientForm
          {...this.props}
          parsed={parsed}
          editGiftInfo={this.editGiftInfo}
        />
      )
    }
  }

  addGiftInfo = (giftInfo) => {
    const upData = F.filterUndefind(giftInfo)
    const outValues = {
      ...upData,
      expresDate: upData.expresDate ? upData.expresDate.format('YYYY-MM-DD') : '',
    }
    outValues.customerId = getUrlParam('customerId');
    outValues.topicId = getUrlParam('topicId');
    this.props.dispatch(addOrUpdGiftInv({ // 添加礼品
      ...F.filterUndefind(outValues),
    })).then(data => {
      if (data.code === 0) {
        message.success(data.msg)
        // this.props.history.go(-1)
      } else {
        message.success('添加出错！')
      }
    }).catch(err => {
      console.log(err)
    })
  }

  editGiftInfo = (giftInfo) => {
    const upData = F.filterUndefind(giftInfo)
    const outValues = {
      ...upData,
      expresDate: upData.expresDate.format('YYYY-MM-DD') || '',
      topicId: getUrlParam('topicId'),
    }
    this.props.dispatch(addOrUpdGiftInv({ // 修改联系人基本信息
      ...F.filterUndefind(outValues),
    })).then(data => {
      if (data.code === 0) {
        message.success(data.msg)
        // this.props.history.go(-1)
      } else {
        message.success('修改出错！')
      }
    }).catch(err => {
      console.log(err)
    })
  }

  componentDidMount() {
    const { page } = this.props.clientSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {id,action} = parsed
    if(action === '2'){
      // this.props.dispatch(selectAllContacts({ // 初始化list
      //   contactsID: id,
      //   pageNum: page.pageNum,
      //   pageSize: page.pageSize,
      // }))
      this.props.dispatch(getDeliveryById({id:parsed.id}))
    }
    let code = ''
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.department) {
      code = crm.user.department.deptCode
    }
    this.props.dispatch(selectAllCheneseName({ // 跟进人列表
      code,
    })).then(data => {
    }).catch(err => {
      console.log(err)
    })
  }

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  render() {
    return (
      <Layout>
        <Wrap>
          <div className={style.MyClueWrap}>
            <ContentWrap style={{ borderTop: 'none' }}>
              <div className={style.listTitle}>
                <div>
                  <Icon type="plus-circle-o" /> 礼品信息
                </div>
                <div>
                  {getUrlParam('topName') === "新增礼品" ?<Button onClick={() => { this.props.history.go(-1) }}>返回</Button>:null}
                </div>
              </div>
              {this.showFormItem()}
            </ContentWrap>
          </div>
        </Wrap>
      </Layout>
    )
  }
}

export default $Gift
