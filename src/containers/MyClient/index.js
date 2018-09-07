import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from '../Detail/style.less'
import Layout from '../Wrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import ContentWrap from '../Content'
import moment from 'moment'
import { createForm } from 'rc-form'
import queryString from 'query-string'
import {FormMyClientSearch} from '../../components/formClientSearch'
import SearchModule from '../../components/SearchModule'
import { Table, Select, Button, Icon, message, Modal, DatePicker, Form, Row, Col, Spin} from 'antd'
import F from '../../helper/tool'
import {
  getMyClientList,
  geiHeiList,
  addRemind,
  getContactorNames,
} from '../../actions/myClient'
import {
  getQueyBest,
  getQeryData,
  selectKey,
  saveUserChecked,
  sortTable,
  getHasSelectitem,
  deleteSelect,
} from '../../actions/search'
import {newWindow} from '../../util/'
import { relative } from 'path';
const {Wrap} = Layout
const FormItem = Form.Item;
const Option = Select.Option;

@connect((state) => {
  return {
    myClient: state.myClient,
    search: state.search,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
  }
})
@createForm()
class MyClient extends Component {
  constructor(props) {
    super(props)
    this.isBest = true // 判断是否走高级搜索接口
    this.queryCondition = {} // 搜索条件
    this.dataLength = 0 //选中的客户数量
    this.preReminds = []
  }
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    canloading: false,
    heiQueryData: [],
    queryHeiBest: [],
    phone: '',
    phones: [],
    isCall: false,
  };
  static propTypes = {
    dispatch: PropTypes.func,
    myClient: PropTypes.object,
  }
  columns = [{
    title: '客户名称',
    dataIndex: 'fName',
    render: (text, record) => {
      const search = this.props.location.search
      const parsed = queryString.parse(search)
      const {topName} = this.props.history.location.state || parsed
      const url = `/CRM/client/clientId=${record.id}?clientId=${record.id}&id=${record.customerId}&poolId=${record.poolId}&topicId=${record.topicId}&customerCategory=${record.type}&action=2&auditStatus=2&topName=${topName}`
      if (record.assistPeople > 0) {
        return (
          <a style={{position: 'relative'}} onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
          }}><span>{text}</span>
          <span style={{color: 'red', position: 'absolute', top:'-11px', right: '-13px'}}>协</span></a>
        )
      }
      else {
        return (
          <a style={{position: 'relative'}} onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
          }}><span>{text}</span></a>
        )
      }
    },
  }, {
    title: '行业类别',
    dataIndex: 'industryName',
  }, {
    title: '跟进状态',
    dataIndex: 'fStatus',
  }, {
    title: '到期天数',
    dataIndex: 'expireDay',
    render: (text, record) => {
      return text + '天'
    },
  }, {
    title: '下次跟进时间',
    dataIndex: 'modifyTime',
    render: (text, record) => {
      return text ? moment(text).format("YYYY-MM-DD") : ''
    },
  }, {
    title: '最近跟进时间',
    dataIndex: 'fTime',
    render: (text, record) => {
      return text ? moment(text).format("YYYY-MM-DD") : ''
    },
  }, {
    title: '标签',
    dataIndex: 'labelName',
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => {
      const url = `/follow`
      return <Link to={{
          pathname: '/follow/?cusId='+record.customerId,
          state: {action: 1, topicId:record.topicId, customerId:record.id, type:record.type, topName: '跟进客户'}, // action:1 新增 customerCategory:2 新增企业
        }}>跟进客户</Link>
    },
  }]
  start = () => {
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  onSelectChange = (selectedRowKeys,data) => {
    this.setState({ selectedRowKeys })
    this.preReminds = [];
    if(data && data.length>0){
        data.map((item, index) => {
            this.preReminds.push({"customerId":item.customerId,"topicId":item.topicId})
            this.dataLength = data.length
          return {}
        })
    }else{
        this.dataLength = 0
    }

  }

  diaLing = (customerId, topicId) => {
    this.props.dispatch(getContactorNames({customerId, topicId}))
    this.setState({
      call_visible: true,
      canloading: true,
    })
    setTimeout(() => {
      this.setState({
        canloading: false,
      })
    }, 3000);
  }

  handleOk = (e) =>{
    this.setState({
      call_visible: false,
    })
  }

  handleNameChange = (key) => {
    let phones = []
    this.props.myClient.contactors.forEach(item => {
      if(item.key === key.split('|')[0]) {
        phones = item.list
      }
    })
    this.props.form.setFieldsValue({
      phone: 0,
    })
    this.setState({
      phones: phones,
      isCall: false,
    });
  }

  handlePhoneChange = (phone) => {
    this.setState({
      phone: phone,
      isCall: false,
    });
  }

  handleCall = (e) =>{
    if (this.state.phone) {
      if ('parentIFrame' in window) {
        this.setState({
          isCall: true,
        })
        message.info('正在拨打...')
        window.parentIFrame.sendMessage({
          message: 'CRM Call Initialized',
          callNumber: this.state.phone,
        })
      } else {
        message.error('拨号失败，请检查试是否在系统中拨号')
      }
    } else {
      message.error('联系人号码不能为空！')
    }
  }

  handleCancel = (e) =>{
    this.setState({
      call_visible: false,
      phone: '',
      phones: [],
      isCall: false,
    })
  }

  handleMenuClick = (e) => {
    message.info('Click on departMenu item.')
  }

  handleChange = (value) => {
  }

  onChange = (pageNumber) => {
  }

  handleQueryBest = (value) => { // 初级查询
    const { page } = this.props.myClient
    const ss = F.filterUndefind(value)
    this.isBest = true
    this.queryCondition = ss
    if(this.queryCondition.address){
      this.queryCondition.address = this.queryCondition.address.join("")
    }
    this.props.dispatch(getMyClientList({
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...ss,
    }))
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    this.props.dispatch(getMyClientList({
      pageNum: pageNum,
      pageSize: pageSize,
      ...this.queryCondition,
    }))
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    this.props.dispatch(getMyClientList({
      pageNum: pageNum,
      pageSize: pageSize,
      ...this.queryCondition,
    }))
  }

  componentDidMount() {
    const { page } = this.props.myClient
    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 6,
    }))
    this.props.dispatch(getHasSelectitem({ // 高级搜索 默认item
      listType: 5,
    }))
    this.props.dispatch(getQeryData({ // 高级搜索 所有数据
        from: 5,
    }))
    this.props.dispatch(getMyClientList({ // 初始化list
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    }))
  }

  componentWillReceiveProps(props) {
    this.setState({
      heiQueryData: props.heiQueryData,
      queryHeiBest: props.queryHeiBest,
    })
    // if(this.props.clueSystem != props.clueSystem){
    //     const columns = this.props.clueSystem.columns.filter(item => item.checked)
    //     this.setState({columns})
    // }
  }

  clientQuery = (clientInfo) => { // 基本搜索
    const { page } = this.props.myClient
    const upData = F.filterUndefind(clientInfo)
    const outValues = {
      ...upData,
    }
    this.props.dispatch(getMyClientList({
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...outValues,
    }))
    this.outValues = outValues
  }

  sortTable = (obj) => { // 排序
    if (obj.items) {
      const list = []
      obj.items.forEach(item => {
        list.push({
          itemId: item.id,
          sort: item.sort,
        })
      })
      this.props.dispatch(sortTable({
        list: JSON.stringify(list),
      }))
    }
  }

  saveUserCheck = (heiQueryData) => { // 保存用户选择的item
    const searchList = []
    heiQueryData.map(item => {
      if (item.checked) {
        searchList.push(item.id)
      }
      // return {}
    })
    this.props.dispatch(saveUserChecked({ // 保存已选择的item后重新获取默认的高级搜索项
      searchList,
      listType: 5,
    })).then(() => {
      this.props.dispatch(getHasSelectitem({
        listType: 5,
      }))
    })
  }

  handleQueryBest = (value) => { // 初级查询
      this.props.myClient.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.myClient
    const ss = F.filterUndefind(value)
    this.setState({
        searchCondition:ss,
        searchPageNum:page.pageNum,
        searchPageSize:page.pageSize,
    })
    this.isBest = true
    this.queryCondition = ss
    if(this.queryCondition.address){
      this.queryCondition.address = this.queryCondition.address.join("")
    }
    this.props.dispatch(getMyClientList({
      pageNum: 1,
      pageSize: page.pageSize,
      ...this.queryCondition,
    })).then((data)=>{
        // if(data && data.data && data.data.data.length == 0){
        //     var maxPage = parseInt(data.data.page.total/data.data.page.pageSize);
        //     if(data.data.page.total/data.data.page.pageSize > parseInt(data.data.page.total/data.data.page.pageSize)){
        //         maxPage = parseInt(data.data.page.total/data.data.page.pageSize)+1
        //     }
        //     this.props.dispatch(getMyClientList({
        //       pageNum: maxPage,
        //       pageSize: page.pageSize,
        //       ...ss,
        //   }))
        // }
    })
  }

  handleHeiQuery = (value) => { // 高级查询
      this.props.myClient.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.myClient
    const ss = F.filterUndefind(value)
    this.isBest = false
    this.queryCondition = JSON.stringify(ss)
    this.props.dispatch(geiHeiList({
      listType: 5,
      pageNum: 1,
      pageSize: page.pageSize,
      search: JSON.stringify(ss),
      // ...ss,
    }))
  }
 onOk = () =>{
     this.props.dispatch(addRemind({
         preReminds:JSON.stringify(this.preReminds),
         remindTime:this.remindTime,
     })).then((data)=>{
        if(data && data.code === 0){
            message.success(data.msg)
            var ss =this.queryCondition
            const { page } = this.props.myClient
            this.props.dispatch(getMyClientList({
              pageNum: page.pageNum,
              pageSize: page.pageSize,
              ...ss,
            }))
            this.setState({
              selectedRowKeys: [],
              remindTime: '',
            })
            this.dataLength = 0
        } else{
            if(data){
                message.error(data.msg);
            }
        }
     })
    this.onCancel();
 }
 onCancel = () =>{
     this.setState({
         followRemindMod_visible:false,
     })
 }
  followRemind = () => { // 预设跟进提醒
      if (this.dataLength === 0) {
        return message.info('请选择客户', 1)
      }
      this.setState({
          followRemindMod_visible:true,
      })
  }
  onEndChange = (value,dateString) => {
      this.setState({
        remindTime: dateString,
      })
      this.remindTime = dateString
  }
  disabledDate = current => {
    return current && current < moment().endOf('day')
  }
  render() {
    const { queryBest  } = this.props
    const { queryHeiBest, heiQueryData,selectedRowKeys } = this.state
    const { page, list, loading, contactors, contactorLoaded } = this.props.myClient
    const { getFieldDecorator } = this.props.form;
    this.state.loading = loading
    if (!page) {
      return null
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination = {
      onChange: this.pageChange,
      onShowSizeChange: this.onShowSizeChange,
      total: page.total,
      current: page.pageNum,
      defaultCurrent: 1,
      pageSize: page.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
    }
    const dateFormat = 'YYYY-MM-DD';

    let contactorNames = []

    let contactorPhones = []

    contactorNames = contactors.map(item=>(<Option key={item.id} value={item.key+"|"+item.id}>{item.key}</Option>))
    contactorPhones = this.state.phones.map(item=><Option key={item} value={item}>{item}</Option>)

    if (contactors.length > 0) {
      contactorNames.unshift(<Option key={0} value={0}>请选择联系人</Option>)
      contactorPhones.unshift(<Option key={0} value={0}>请选择联系号码</Option>)
    } else {
      if (contactorLoaded) {
        contactorNames = [<Option key={0} value={0}>未找到联系人</Option>]
        contactorPhones = [<Option key={0} value={0}>请选择联系号码</Option>]
      }
      else {
        contactorNames = [<Option key={0} value={0}>请选择联系人</Option>,this.state.canloading ? <Option key={-1} value={-1}><Spin /></Option> : null]
        contactorPhones = [<Option key={0} value={0}>请选择联系号码</Option>]
      }
    }
    // const veryeast_proList = [];
    // const xz_proList = [];
    //
    // selproductList && selproductList.forEach((v,i)=>{
    //     var info = {"value":v.id,"label":v.cname}
    //     if(v.type ==1){
    //         veryeast_proList.push(info)
    //     }
    //     if(v.type ==2){
    //         xz_proList.push(info)
    //     }
    // })
    // const options = [{
    //       value: '1',
    //       label: '最佳东方',
    //       children: veryeast_proList,
    //     }, {
    //       value: '2',
    //       label: '先之教育',
    //       children: xz_proList,
    //   }];
    return (
      <Layout className={style.LogsWrap}>
        <Wrap>
          <SearchModule
            showHeiBtn
            handleQueryBest={this.handleQueryBest}
            handleHeiQuery={this.handleHeiQuery}
            saveUserCheck={this.saveUserCheck}
            sortTable={this.sortTable}
            queryBest={queryBest}
            queryHeiBest={queryHeiBest}
            heiQueryData={heiQueryData}
            hidename="0"
            defaultExamineStatus={"0"}
          />
          <ContentWrap style={{ borderTop: 'none' }}>
          <div className={style.listTitle}>
            <div>
              <Icon type="bars" className={style.bars} />
              &ensp;数据列表
            </div>
           {/* <div>
             <Button onClick={()=>this.followRemind()}>预设跟进提醒</Button>&emsp;
           </div> */}
          </div>
            <Table
              loading={this.state.loading}
              title={this.renderHeaser}
              className={style.table}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={list}
              pagination={pagination}
            />
          </ContentWrap>
          <Modal
          title="拨号"
          destroyOnClose
          footer={null}
          visible={this.state.call_visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <Form>
            <Row type="flex" justify="center">
              <Col>
                <FormItem label="拨号联系人">
                {getFieldDecorator('contactorNames', {
                  initialValue: 0,
                  rules: [{ required: true, message: '请选择联系人' }],
                })(
                  <Select style={{ width: 200 }} onChange={this.handleNameChange}>
                    {contactorNames}
                  </Select>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <FormItem label="拨号号码">
                {getFieldDecorator('phone', {
                  initialValue: 0,
                  rules: [{ required: true, message: '请选择拨号号码' }],
                })(
                  <Select style={{ width: 200 }} onChange={this.handlePhoneChange}>
                    {contactorPhones}
                  </Select>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <FormItem>
                  <Button type="primary" disabled={this.state.isCall} onClick={this.handleCall}>
                    拨打
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
          <Modal title={"预设跟进提醒"}
            visible={this.state.followRemindMod_visible}
            onOk={()=>this.onOk()}
            onCancel={this.onCancel}
            width={500}
          >
          <div style={{display:'flex',height:"35px",lineHeight:"35px"}}>
             <span>请选择预设跟进时间：</span>
             <DatePicker value={this.state.remindTime ? moment(this.state.remindTime, dateFormat):""} disabledDate={this.disabledDate} onChange={(value,dateString)=>this.onEndChange(value,dateString)}/>
          </div>
          </Modal>
        </Wrap>
      </Layout>
    )
  }
}

export default MyClient
