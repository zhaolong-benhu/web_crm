/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, Table,message,Checkbox } from 'antd'
import style from '../../containers/Contact/style.less'
import moment from 'moment'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import store from 'store'
import {getOpportById} from '../../actions/businessSystem'
import {default as ColumnRender} from '../TableColumn'
import {getUrlParam} from '../../util'
import 'moment/locale/zh-cn'
import AuthRequire from '../AuthRequire'
import {newWindow} from '../../util/'
moment.locale('zh-cn')
const CheckboxGroup = Checkbox.Group;

@connect((state) => {
  return {
  }
})
class FollowDataList extends Component { // 跟进信息列表
  state = {
    columnsFollowInfo : [{
      title: '跟进方式',
      dataIndex: 'typeStr',
    }, {
      title: '跟进人',
      dataIndex: 'userName',
      render:(text,record) =>{
          return <span style={{color:'#1890ff',cursor:'pointer'}} onClick={()=>this.goContactsDetail(record)}>{record.userName}</span>
      },
    }, {
      title: '跟进人部门',
      dataIndex: 'department',
    }, {
      title: '跟进的联系人',
      dataIndex: 'contactsName',
      render:(text,record) =>{
          return <span style={{color:'#1890ff',cursor:'pointer'}} onClick={()=>this.goFollowContactsDetail(record)}>{record.contactsName}</span>
      },
    }, {
      title: '跟进时间',
      dataIndex: 'createTime',
    }, {
      title: '下次跟进时间',
      dataIndex: 'nextFlowTime',
    }, {
      title: '跟进内容',
      dataIndex: 'dataList',
      render:(text,record) => {
       var data = record.dataList
       if(data && data.length>0){
           return <div style={{textAlign:'left',paddingLeft:'15px'}}>
            {data.map((v,i)=>{
              return <div>
              <span>{v.itemName}：</span>
              <span>{v.content}</span>
            </div>
           })}
          </div>

       }else{
         return <div style={{textAlign:'left',paddingLeft:'15px'}}>无</div>
       }
    },
    }, {
      title: '跟进时长',
      dataIndex: 'lengthTime',
    },
    // {
    //   title: '跟进次数',
    //   dataIndex: 'flowCount',
    // },
    {
      title: '跟进状态',
      dataIndex: 'statusStr',
    }, {
      title: '操作',
       render:(text,record) => {
           return <span>
                <a onClick={()=>this.props.conversionRecord(record.id,record.file)} disabled={!record.file} title="查看录音"><Icon type="eye-o" style={{cursor:'pointer',marginRight:'8px',fontSize:20}} className={style.bars} /></a>
                {/* <a onClick={()=>this.props.downloadRecord(record.file)} disabled={!record.file} title="下载录音" style={{marginRight:'8px',cursor:'pointer',fontSize:20}}><Icon type="download" className={style.bars} /></a> */}
                {/* <a onClick={()=>this.playRecord(record.url)} title="听录音"><Icon type="play-circle-o" style={{cursor:'pointer',fontSize:20}} className={style.bars} /></a> */}
           </span>
       },
    }],
    bShowfloatWindow:false,
    plainOptions:[
        {"name":"最佳东方","checked":false,"id":2},
        {"name":"先之教育","checked":false,"id":3},
        {"name":"乔邦猎头","checked":false,"id":4},
        {"name":"迈点","checked":false,"id":5},
    ],
    conversionRecord:false,
    topicList: [],
  }
  static propTypes = {
  }
  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  constructor(props){
    super(props)

  }
  goContactsDetail = (record) => {
      var url = `/follow?topName=修改跟进&customerId=`+getUrlParam('id')+'&id='+record.id+'&action=2&topicId='+record.topicId
      newWindow(url,"修改");
  }
  goFollowContactsDetail = (record) => {
      var url = `/contact/${record.contactsId}?topName=联系人信息&customerId=`+getUrlParam('id')+'&id='+record.contactsId+'&action=2&topicId='+record.topicId
      newWindow(url,"修改");
  }
  callbacks = (pageNum,pageSize) => {
    this.props.pageChange(pageNum,pageSize)
  }
  callback = (key, data) => { // 勾选表格
    this.props.onSelectChange(key, data)
  }
  onChange = (index,checkedValues) => {
     this.state.plainOptions.forEach((v,i)=>{
         if(index === v.id){
             v.checked = !v.checked;
             this.setState({
                 plainOptions:v,
             })
             var selectList = [];
             this.state.plainOptions.forEach((d,j)=>{
                 if(d.checked == true){
                     selectList.push(d.id);
                 }
             })
             this.props.myClient.topicIds = selectList;
             this.props.getOtherServiceline(selectList);
         }
     })

  }
  onMouseOver = () => {
      this.setState({
          bShowfloatWindow:true,
      })
  }
  onMouseLeave = () => {
      this.setState({
          bShowfloatWindow:false,
      })
  }
  componentDidMount = () => {
    let topicList = []
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.permissions) {
      crm.user.permissions.forEach((item)=>{
        if (item.type === 'O' && item.permCode.indexOf('sys:myclient:tp') > -1) {
          topicList.push({id:item.id, name: item.name, checked: false})
        }
      })
    }
    this.setState({topicList})
  }

  render() {
    const { loading, page, followInfo, columnsFollowInfo} = this.props.followSystem
    const { selectedRowKeys } = this.props.search

    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName,id,topicId} = parsed

    const rowSelection = {
      selectedRowKeys,
      onChange: this.callback,
    }
    let pagination = {
      onChange: this.callbacks,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }

    const columns = this.state.columnsFollowInfo

    // columns.forEach((item, index) => {
    //   if(item.dataIndex === 'userName'){
    //     columns[index].render = (text, record) => {
    //       const url = `/follow?topName=修改跟进&customerId=`+getUrlParam('id')+'&id='+record.id+'&action=2&topicId='+record.topicId
    //       return <ColumnRender.NewTable text={text} url={url} />
    //     }
    //   }
    //   if(item.dataIndex === 'contactsName'){
    //     columns[index].render = (text, record) => {
    //       const url = `/contact/${record.contactsId}?topName=联系人信息&customerId=`+getUrlParam('id')+'&id='+record.contactsId+'&action=2&topicId='+record.topicId
    //       return <ColumnRender.NewTable text={text} url={url} />
    //     }
    //   }
    // })

    if(this.state.topicList){
        this.state.plainOptions = this.state.topicList;
    }

    return (
      <div>
        <div className={style.listTitle}>
          <div>
            <Icon type="bars" className={style.bars} />
            &ensp;数据列表
          </div>
          <div>
            {topName === '我的客户' ? <AuthRequire authName="sys:myclient:addfollow"><Link to={{
              pathname: '/follow',
              state: {action: 1, topicId:parsed.topicId, customerId:parsed.id, topName: '新增跟进'}, // action:1 新增 customerCategory:2 新增企业
          }}><Button>新增跟进</Button>&emsp;</Link></AuthRequire> :null}
            <Button onClick={this.advancedSearch} className={style.selectService} onMouseOver={()=>this.onMouseOver()}>
              <Icon className={style.icon} type="down" />筛选业务线
            </Button>
          </div>
        </div>
        {this.state.bShowfloatWindow &&
            <div className={style.floatingWindow} onMouseLeave={()=>this.onMouseLeave()}>
                {this.state.topicList && this.state.topicList.map((v,i)=>{
                        return <div className={style.checkBox} key={v.id}>
                            <Checkbox onChange={()=>this.onChange(v.id)} checked={v.checked} >{v.name}</Checkbox>
                        </div>
                })}
            </div>
        }
        <Table
          loading={loading}
          className={style.table}
          columns={this.state.columnsFollowInfo}
          dataSource={followInfo}
          pagination={pagination}
        />
      </div>
    )
  }
}

class ContactDataList extends Component { // 联系人信息列表
    state = {
        isHighcontact:false,
    }
  static propTypes = {
  }
  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  callback = (pageNum,pageSize) => {
    this.props.pageChange(pageNum,pageSize)
  }

  componentDidMount(){


  }
  render() {
    const { page, contactList, contactColumns, loading} = this.props.clientSystem
    const { selectedRowKeys } = this.props.search

    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName,id,topicId} = parsed

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination = {
      onChange: this.callback,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }
    //如果有查看高级联系人的权限 就显示高级联系人 否则就过滤掉高级联系人
    var isHighcontact = false;
    const crm = store.get('crm')
    if(crm && crm.user && crm.user.permissions){
        crm.user.permissions.forEach(item => {
          if(item.permCode == "sys:myclient:high") {
              isHighcontact = true;
          }
        })
    }
    if(!isHighcontact){
        contactList.forEach((v,i)=>{
            if(v.seniorContact == 1){
                contactList.splice(i,1);
            }
        })
    }
     contactColumns.forEach((item, index) => { //联系人信息
             if(item.dataIndex === 'contactName'){
                  contactColumns[index].render = (text, record) => {
                      const search = this.props.location.search
                      const parsed = queryString.parse(search)
                      const topName = parsed.topName
                      const url = `/contact/${record.id}?id=${record.id}&customerId=${record.customerId}&action=2&topName=联系人信息`
                      return <a style={{position: 'relative'}} onClick={(e)=>{
                      e.preventDefault()
                      newWindow(url, text)
                  }}>{text?text:'匿名'}{record.seniorContact ==1 ? <span style={{color: 'red', position: 'absolute', top: '-10px', right: '-14px'}}>高</span> : null}</a>
                }
             }
     })
    return (
      <div>
        <div className={style.listTitle}>
          <div>
            <Icon type="bars" className={style.bars} />
            &ensp;数据列表
          </div>
          <div>
            {topName === '我的客户' ? <Link to={'/contact?action=1&customerId='+getUrlParam('id')+'&topicId='+getUrlParam('topicId')+'&topName=新增联系人'}><AuthRequire authName="sys:myclient:addcontacts"><Button>新增联系人</Button></AuthRequire>&emsp;</Link> : ''}
          </div>
        </div>
        <Table
          loading={loading}
          className={style.table}
          columns={contactColumns}
          dataSource={contactList}
          pagination={pagination}
        />
      </div>
    )
  }
}

class BusinessDataList extends Component { // 商机记录列表
  static propTypes = {
  }
  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  callback = (pageNum,pageSize) => {
    this.props.pageChange(pageNum,pageSize)
  }
  addBusiness = () => {
    this.props.addBusiness()
  }

  render() {
    const { page, businesstList, columns, columnsMyBusi} = this.props.businessSystem
    const { selectedRowKeys } = this.props.search

    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName,id,topicId} = parsed

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination = {
      onChange: this.callback,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }

    columnsMyBusi.forEach((item, index) => { //我的商机
      if(item.dataIndex === 'busNumber'){
        columnsMyBusi[index].render = (text, record) => {
          return (
            <a onClick={ () => {this.props.viewBusiness(record.id)}}>{text}</a>
          )
        }
      }
    }
    )
    return (
      <div>
        <div className={style.listTitle}>
          <div>
            <Icon type="bars" className={style.bars} />
            &ensp;数据列表
          </div>
          <div>
            {topName === '我的客户' ? <AuthRequire authName="sys:myclient:addbusin"><Button onClick={() => { this.addBusiness() }}>新增商机</Button></AuthRequire> : ''}
          </div>
        </div>
        <Table
          className={style.table}
          columns={columnsMyBusi}
          dataSource={businesstList}
          pagination={pagination}
        />
      </div>
    )
  }
}

class AgreementDataList extends Component { // 合同记录列表
    state = {
        columnsContract: [{
            title: '合同编号',
            dataIndex: 'contractNumber',
            key:1,
        }, {
            title: '合同开始日期',
            dataIndex: 'startTime',
            key:2,
            render: (text, record) => {
              return text ? moment(text).format("YYYY-MM-DD") : ''
            },
        }, {
            title: '合同结束日期',
            dataIndex: 'endTime',
            key:3,
            render: (text, record) => {
              return text ? moment(text).format("YYYY-MM-DD") : ''
            },
        }, {
            title: '合同总金额',
            dataIndex: 'totalAmount',
            key:3,
        }, {
            title: '合同状态',
            dataIndex: 'statusStr',
            checked: true,
            key: 4,
        }, {
            title: '是否开票',
            dataIndex: 'isBill',
            key:5,
        }, {
            title: '支付情况',
            dataIndex: 'paymentSit',
            key:5,
        }, {
            title: '创建人',
            dataIndex: 'createUser',
            key:5,
        }],
    }
  static propTypes = {
  }
  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  callback = (pageNum,pageSize) => {
    this.props.pageChange(pageNum,pageSize)
  }
  addBusiness = () => {
    this.props.addBusiness()
  }
  render() {
    const {page, list} = this.props.contractSystem
    const { selectedRowKeys } = this.props.search
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName,id,topicId} = parsed

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination = {
      onChange: this.callback,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }
    const columns = this.state.columnsContract

    columns.forEach((item, index) => {
      if(item.dataIndex === 'contractNumber'){
        columns[index].render = (text, record) => {
          const url = `/CRM/contract/detail/?type=0&contractNumber=${record.contractNumber}&id=${record.key}&customerId=${record.customerId}&topName=我的合同`
          // return <ColumnRender.NewTable text={text} url={url} />
          return <a onClick={e => {
            e.preventDefault()
            newWindow(
            url,
            '合同详情'
            )
        }}>{record.contractNumber}</a>
        }
      }
    })
    return (
      <div>
      <div className={style.listTitle}>
        <div>
          <Icon type="bars" className={style.bars} />
          &ensp;数据列表
        </div>
        <div>
            {topName === '我的客户' ? <AuthRequire authName="sys:myclient:addgift"> <Link to={"/CRM/newContract?customerId="+getUrlParam('id')+"&customerCategory="+getUrlParam('customerCategory')+"&topicId="+getUrlParam('topicId')+"&topName=新增合同"}> <Button>新增合同</Button>&emsp;</Link></AuthRequire>:''}
        </div>
      </div>
        <Table
          className={style.table}
          columns={columns}
          dataSource={list}
          pagination={pagination}
        />
      </div>
    )
  }
}

class GiftDataList extends Component { // 礼品列表
  static propTypes = {
  }
  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  callback = (pageNum,pageSize) => {
    this.props.pageChange(pageNum,pageSize)
  }
  addBusiness = () => {
    this.props.addBusiness()
  }
  render() {
    const {page, giftList, columnsGift} = this.props.giftSystem
    const { selectedRowKeys } = this.props.search

    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName,id,topicId} = parsed

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination = {
      onChange: this.callback,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }
    // let topicId = getUrlParam('topicId')
    columnsGift.forEach((item, index) => {
      if(item.dataIndex === 'goodsName'){
        columnsGift[index].render = (text, record) => {
          const url = `/gift?action=2&topName=编辑礼品&customerId=${id}&id=${record.id}&topicId=${parsed.topicId}`
          return (
            <a onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
          }}>{text}</a>
          )
        }
      }
    })
    return (
      <div>
        <div className={style.listTitle}>
          <div>
            <Icon type="bars" className={style.bars} />
            &ensp;数据列表
          </div>
          <div>
            {topName === '我的客户' ?
            <AuthRequire authName="sys:myclient:addgift">
            <Link to={"/gift?action=1&topName=新增礼品&customerId="+id+"&topicId="+getUrlParam('topicId')}>
            <Button>新增礼品</Button>&emsp;</Link>
            </AuthRequire> : ''}
          </div>
        </div>
        <Table
          className={style.table}
          columns={columnsGift}
          dataSource={giftList}
          pagination={pagination}
        />
      </div>
    )
  }
}

class OperateDataList extends Component { // 操作列表
  static propTypes = {
  }
  start = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  callback = (pageNum,pageSize) => {
    this.props.pageChange(pageNum,pageSize)
  }
  addBusiness = () => {
    this.props.addBusiness()
  }
  render() {
    const {page, operateList, columnsOperate} = this.props.operateSystem
    const { selectedRowKeys } = this.props.search

    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName,id,topicId} = parsed

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination = {
      onChange: this.callback,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      defaultCurrent: page.pageNum,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }
    return (
      <div>
      <div className={style.listTitle}>
        <div>
          <Icon type="bars" className={style.bars} />
          &ensp;数据列表
        </div>
      </div>
        <Table
          className={style.table}
          columns={columnsOperate}
          dataSource={operateList}
          pagination={pagination}
        />
      </div>
    )
  }
}

export {
  FollowDataList,
  ContactDataList,
  BusinessDataList,
  AgreementDataList,
  GiftDataList,
  OperateDataList,
}
