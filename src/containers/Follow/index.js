import React, { Component } from 'react'
import queryString from 'query-string'
import style from '../Detail/style.less'
import PropTypes from 'prop-types'
import Layout from '../Wrap'
import moment from 'moment'
import {connect} from 'react-redux'
import F from '../../helper/tool'
import {deleteSelect} from '../../actions/search'
import ContentWrap from '../Content'
import { Button, message, Icon } from 'antd'
import { getFollowItemBytopicId,getConListByCusId,addFollow,updateFollow,getFollowById,selectRecord} from '../../actions/followSystem'
// import { getMyContactList } from '../../actions/clientSystem'
import { FollowClientForm } from '../../components/FollowClient'
import TableHeader from '../../components/TableHeader'
import {getUrlParam} from '../../util'
const {Wrap} = Layout
@connect((state) => {
  return {
    search: state.search,
    followDetail: state.followDetail,
    followSystem: state.followSystem,
    recordList: state.followSystem.recordList,
    followDetail:state.followSystem.followDetail,
    page:state.followSystem.page,
    contactList:state.clientSystem.contactList,
  }
})
class $Follow extends Component {
  static propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    followDetail: PropTypes.object,
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
    followData:[],
    conData:[],
  }

  callback = (key) => {
  }

  showFormItem = () => { // 表单列表
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    let action = ''
    if(JSON.stringify(parsed) === "{}"){
      action = this.props.history.location.state.action||getUrlParam('action')
    }else{
      action = parseInt(parsed.action)
    }
    if (action === 1) {
      return (
        <FollowClientForm
          {...this.props}
          parsed={parsed}
          addFollowOne={this.addFollowOne}
          followData={this.state.followData}
          recordData={this.props.recordList}
          page={this.props.page}
          followDetail={this.props.followDetail}
        />
      )
    }
    if (action === 2) {
      return (
        <FollowClientForm
          {...this.props}
          parsed={parsed}
          editFollowOne={this.editFollowOne}
          followData={this.state.followData}
          recordData={this.props.recordList}
          page={this.props.page}
          followDetail={this.props.followDetail}
        />
      )
    }
  }

  addFollowOne = (followInfo,itemIds,topicId,customerId,callback) => {
    const upData = F.filterUndefind(followInfo)
    let dataArr = []
    let outValues = []

    const arr = ['dChkText','dRadioText','dSelText','dMention','dText','dTimeText']

    const contentArr = []

    Object.keys(upData).forEach((item)=>{
      arr.forEach((i)=>{
        if(item.split('-')[0] === i) {
          contentArr.push({
            itemId: item.split('-')[1],
            content: upData[item],
          })
        }
      })
    })
    const oValues = {
      topicId:topicId,
      followDataList:JSON.stringify(contentArr),
      recordList:followInfo.recordidList && JSON.stringify(followInfo.recordidList) || [],
      type: followInfo.type,
      // customerId: this.props.history.location.state.customerId||getUrlParam('cusId'),
      customerId:followInfo.customerId,
      status: followInfo.status,
      nextFlowTime: followInfo.nextFlowTime ? moment(followInfo.nextFlowTime).format('YYYY-MM-DD'): '',
      ecDate: followInfo.nextFlowTime ? moment(followInfo.ecDate).format('YYYY-MM-DD') : '',
      remarks: followInfo.remarks,
    }
    if(followInfo.id){
        oValues.id = followInfo.id
    }
    this.props.dispatch(addFollow({ // 添加跟进信息
      ...F.filterUndefind(oValues),
    })).then(data => {
      if (data.code === 0) {
        message.success(data.msg)
        callback()
      } else {
        message.success('添加出错！')
      }
    }).catch(err => {
      console.log(err)
    })
  }

  editFollowOne = (followInfo,itemIds,topicId,customerId,dataList) => {
    const upData = F.filterUndefind(followInfo)
    let dataArr = []
    let outValues = []

    const arr = ['dChkText','dRadioText','dSelText','dMention','dText','dTimeText']

    const contentArr = []

    Object.keys(upData).forEach((item)=>{
      arr.forEach((i)=>{
        if(item.split('-')[0] === i) {
          dataList.forEach((a)=>{
            if(a.itemId == item.split('-')[1]){
                contentArr.push({
                  id: a.id,
                  itemId: item.split('-')[1],
                  content: upData[item],
                })
              }
          })
        }
      })
    })
    const oValues = {
      topicId:topicId,
      followDataList:JSON.stringify(contentArr),
      recordList:followInfo.recordidList && JSON.stringify(followInfo.recordidList) || [],
      type: followInfo.type,
      // customerId: this.props.history.location.state.customerId||getUrlParam('cusId'),
      customerId:followInfo.customerId,
      status: followInfo.status,
      nextFlowTime: followInfo.nextFlowTime ? moment(followInfo.nextFlowTime).format('YYYY-MM-DD'): '',
      ecDate: followInfo.ecDate ? moment(followInfo.ecDate).format('YYYY-MM-DD') : '',
      remarks: followInfo.remarks,
    }
    if(followInfo.id){
        oValues.id = followInfo.id
    }
    this.props.dispatch(updateFollow({ // 添加跟进信息
      ...F.filterUndefind(oValues),
    })).then(data => {
      if (data.code === 0) {
        message.success(data.msg)
      } else {
        message.success('添加出错！')
      }
    }).catch(err => {
      console.log(err)
    })
  }

  componentWillMount(){
    this.props.dispatch(selectRecord({}))
  }
  componentDidMount() {
    const { page } = this.props.followSystem
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    // const {topicId,customerId,type} = this.props.history.location.state

    let [topicId,customerId,type]=['','','']
    if (JSON.stringify(parsed) === '{}') {
      [topicId,customerId,type]=[this.props.history.location.state.topicId,this.props.history.location.state.customerId,this.props.history.location.state.type]
    } else {
      [topicId,customerId,type]=[parsed.topicId,parsed.customerId,parsed.type]
    }
    this.props.dispatch(getFollowItemBytopicId({ // 获取跟进内容设置
      topicId: topicId,
    })).then(data => {
      this.setState({
        followData: data.data,
      })
    }).catch(err => {
      console.log(err)
    })

    // var cusId = getUrlParam("cusId");
    // this.props.dispatch(getConListByCusId({ // 获取联系人下拉设置
    //   id: cusId?cusId:customerId,
    // })).then(data => {
    //   this.setState({
    //     conData: data.data,
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })

    // this.props.dispatch(getMyContactList({ // 获取联系人下拉设置
    //   id: cusId?cusId:customerId,
    // })).then(data => {
    //   this.setState({
    //     conData: data.data,
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })

    if (parsed.action === '2') {
      this.props.dispatch(getFollowById({ // 初级查询详情 数据
          id: getUrlParam('id'),
      }))
    }
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
                   跟进信息
                </div>
                <div>
                {getUrlParam('topName') === "修改跟进" ? null : <Button onClick={() => { this.props.history.go(-1) }}>返回</Button>}
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

export default $Follow
