/**
 * Created by huangchao on 14/11/2017.
 */
import React, { Component } from 'react'
import style from './style.less'
import SearchModule from '../../components/SearchModule'
import Layout from '../Wrap'
import {connect} from 'react-redux'
import moment from 'moment'
import { Table, Modal, message } from 'antd'
import {Audit} from '../../components/TableBtns'
import ContentWrap from '../Content'
import TableHeader from '../../components/TableHeader'
import {default as ColumnRender} from '../../components/TableColumn'
// import {push} from 'react-router-redux';
import F from '../../helper/tool'
import {newWindow} from '../../util/'
import $ from 'jquery'
import {
  getQueyBest,
  getQeryData,
  selectKey,
  saveUserChecked,
  sortTable,
  getHasSelectitem,
  deleteSelect,
} from '../../actions/search'
import {
  getInitList,
  geiHeiList,
  getNumber,
  userAudit,
} from '../../actions/clueSystem'
const {Wrap} = Layout

@connect((state) => {
  return {
    clueSystem: state.clueSystem,
    search: state.search,
    heiQueryData: state.search.queryData,
    queryBest: state.search.queryBest,
    queryHeiBest: state.search.queryHeiBest,
  }
})
class ClueSystem extends Component {
  constructor(props) {
    super(props)
    this.isBest = true // 判断是否走高级搜索接口
    this.queryCondition = {exStatus:"1",exStartTime:[moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD'),moment(new Date()).add(1, 'day').format('YYYY-MM-DD')]} // 搜索条件
    this.queryAdvCondition = {}
    this.auditID = [] // 审核的id
    this.numbers = [] //勾选的客户编号
    this.names = [] //勾选的客户名称
    this.alrExaminenumber = [] //已经审核的客户编号
    this.alrCheckId = [] //已经审核的客户id
  }

  state = {
    heiQueryData: [],
    queryHeiBest: [],
    audit: false,
    modalTwo: false,
    errMsg: '',
    value: 2,
    number: '', // 审核的编号
    columns: [],
    loading:true,
  }

  onSelectChange = (key, data) => { // 勾选表格
    let number = ''
    let name = ''

    data.map((item, index) => {
      item.length === index ? number += item.number : number += item.number + ','
      item.length === index ? name += item.name : name += item.name + ','
      return {}
    })
    this.props.dispatch(selectKey(key))
    this.auditID = key
    this.setState({number})
    this.setState({name})

    this.setState({
        auditID:this.auditID,
    })
    if(number){
        this.numbers = number.split(',')
        this.names = name.split(',')

        this.numbers.pop()
        this.names.pop()

        for(var i=0;i<this.alrExaminenumber.length;i++)
        {
          for(var j=0;j<this.numbers.length;j++)
          {
            if(this.numbers[j] === this.alrExaminenumber[i]){
              this.numbers.splice(j,1);
              this.names.splice(j,1);
              j=j-1;
            }
          }
        }
        this.numbers = this.numbers;
        this.names = this.names;
    }
  }

  getCheckboxProps = (data) => { // 不能勾选的表格
    const {list} = this.props.clueSystem
    const arr = []
    list.forEach(item => {
      if (item.status === 1) {
        arr.push(item.id)
      }
    })
    return {
      disabled: arr.indexOf(data.id) < 0,
    }
  }

  renderHeaser = () => {
    return (
      <TableHeader
        dataSource={this.props.clueSystem.columns}
        menuSure={this.menuSure}
        upLoadFail={this.upLoadFail}
        submitMoreAudit={this.submitMoreAudit} />
    )
  }

  upLoadFail = (info) => {
    const { page } = this.props.clueSystem
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 0 && info.file.response.msg === '') {
        message.success('上传成功')
        this.setState({
          errMsg: '上传成功',
        }, () => {
          this.props.dispatch(getInitList({ // 初始化list
            pageNum: page.pageNum,
            pageSize: page.pageSize,
          }))
        })
      } else {
        const errMsg = info.file.response.msg
        message.error(errMsg)
        this.setState({
          errMsg,
        })
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}文件上传失败`)
    }
  }

  singAudit = (record) => { // 单个审核数据
    this.auditID.push(record.id)
    this.setState({
      audit: true,
      number: record.number,
      auditID:this.auditID,
      name:record.name,
    })
    this.numbers=[]
    this.names=[]
  }

  submitMoreAudit = () => { // 多个审核
    const { selectedRowKeys } = this.props.search
    if (selectedRowKeys.length === 0) {
      return message.info('请选择客户编号', 1)
    }
    this.setState({
      audit: true,
    })
  }

  menuSure = (data) => {
    const columns = data.filter(item => item.checked)
    this.setState({columns})
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
      listType: 1,
    })).then(() => {
      this.props.dispatch(getHasSelectitem({
        listType: 1,
      }))
    })
  }

  handleQueryBest = (value) => { // 初级查询
      this.props.clueSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.clueSystem
    const ss = F.filterUndefind(value)
    this.setState({
        searchCondition:ss,
        searchPageNum:page.pageNum,
        searchPageSize:page.pageSize,
    })
    this.isBest = true
    this.queryCondition = Object.assign(this.queryCondition, ss)
    if(this.queryCondition.exStartTime && this.queryCondition.exStartTime == "," ){
        this.queryCondition.exStartTime = ""
    }
    this.props.dispatch(getInitList({
      pageNum: 1,
      pageSize: page.pageSize,
      ...this.queryCondition,
    })).then((data)=>{
        // if(data && data.data && data.data.data.length == 0){
        //     var maxPage = parseInt(data.data.page.total/data.data.page.pageSize);
        //     if(data.data.page.total/data.data.page.pageSize > parseInt(data.data.page.total/data.data.page.pageSize)){
        //         maxPage = parseInt(data.data.page.total/data.data.page.pageSize)+1
        //     }
        //     this.props.dispatch(getInitList({
        //       pageNum: maxPage,
        //       pageSize: page.pageSize,
        //       ...this.queryCondition,
        //   }))
        // }
    })
  }

  handleHeiQuery = (value) => { // 高级查询
      this.props.clueSystem.loading = true;
      this.setState({
          loading:true,
      })
    const { page } = this.props.clueSystem
    const ss = F.filterUndefind(value)
    this.isBest = false
    this.queryAdvCondition = JSON.stringify(ss)
    if(!ss.exStartTime){
        var exStartTime = moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD') + "," + moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
        ss.exStartTime = exStartTime
    }
    if(!ss.exStatus){
        ss.exStatus = 1
    }
    this.props.dispatch(geiHeiList({
      listType: 1,
      pageNum: 1,
      pageSize: page.pageSize,
      search: JSON.stringify(ss),
      // ...ss,
    }))
  }

  showHeiQuery = () => {
      let heiSearch=document.getElementById('heiSearch');
      $('#heiSearch').stop(true,true).animate({height:"700px"});
      heiSearch.style.display="block";
      heiSearch.style.background="#ececec";
  }
  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
    if (this.isBest) { // 走基本搜索接口
      this.props.dispatch(getInitList({
        listType: 1,
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        listType: 1,
        pageNum: pageNum,
        pageSize: pageSize,
        search: this.queryAdvCondition,
      }))
    }
  }

  pageChange = (pageNum, pageSize) => { // 点击页数
    if (this.isBest) { // 走基本搜索接口
      this.props.dispatch(getInitList({
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.queryCondition,
      }))
    } else { //  走高级搜索接口
      this.props.dispatch(geiHeiList({
        listType: 1,
        pageNum: pageNum,
        pageSize: pageSize,
        search: this.queryAdvCondition,
      }))
    }
  }

  selectRadio = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      modalTwo: false,
      selectedRowKeys: [],
    })
  }

  handleChange = (pagination, filters, sorter) => {
  }

  auditCancle = () => {
    this.auditID = []
    this.setState({audit: false})
  }

  auditOk = (value) => { // 审核
    if(!value.remark){
      value.remark = ''
    }
    this.alrCheckId.push(...value.customerList)
    // this.alrCheckId = [...new Set(this.alrCheckId)];

    this.props.dispatch(userAudit({
      ...value,
    })).then(data =>{
        if (data) {
            message.success(data.msg)
            this.auditCancle()
            this.alrExaminenumber.push(...this.numbers)
            this.alrExaminenumber = [...new Set(this.alrExaminenumber)]
            this.auditID = []
            this.setState({
                auditID: this.auditID,
            })
            if (this.state.searchCondition) {
                this.props.dispatch(getInitList({
                    pageNum: this.props.clueSystem.page.pageNum,
                    pageSize: 10,
                    ...this.state.searchCondition,
                    ...this.queryCondition,
                }))
            } else {
                this.props.dispatch(getInitList({
                    pageNum: this.props.clueSystem.page.pageNum,
                    pageSize: 10,
                    ...this.queryCondition,
                }))
            }
        }
    })
  }

  componentWillMount() {
    const columns = this.props.clueSystem.columns.filter(item => item.checked)
    this.setState({columns})
  }

  componentDidMount() {
    const { page } = this.props.clueSystem
    this.props.dispatch(getQueyBest({ // 初级查询 数据
      defaut: 1,
    }))
    this.props.dispatch(getHasSelectitem({ // 高级搜索 默认item
      listType: 1,
    }))
    this.props.dispatch(getQeryData({ // 高级搜索 所有数据
        from: 1,
    }))
    this.props.dispatch(getInitList({ // 初始化list
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...this.queryCondition,
    }))
    //this.props.dispatch(getNumber()) // 获取个数

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

  componentWillUnmount() {
    this.props.dispatch(deleteSelect)
  }

  render() {
    const { queryBest } = this.props
    const { queryHeiBest, heiQueryData, columns } = this.state
    const { page, list, loading } = this.props.clueSystem
    this.state.loading = loading
    const { selectedRowKeys } = this.props.search
    columns.forEach((item, index) => {
      if(item.dataIndex === 'name'){
        columns[index].render = (text, record) => {
          const url = `/clue/${record.key}?id=${record.key}&customerCategory=${record.type}&action=2&status=${record.status}&topName=线索管理`
          return <a onClick={(e)=>{
            e.preventDefault()
            newWindow(url, text)
          }}>{text}</a>
        }
      }
      if(item.dataIndex === 'action'){
        columns[index].render = (text, record) => {
          return <ColumnRender.AuditBtn singAudit={this.singAudit} record={record} />
        }
      }
    })

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: this.getCheckboxProps,
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

    //过滤掉已经审核的客户id
    for(var i=0;i<this.alrCheckId.length;i++)
    {
      for(var j=0;j<this.auditID.length;j++)
      {
        if(this.auditID[j] === this.alrCheckId[i]){
          this.auditID.splice(j,1);
          j=j-1;
        }
      }
    }
    this.auditID = this.auditID;
    return (
      <Layout>
        <Wrap>
          <div className={style.ClueSystemWrap}>
            <SearchModule
              showHeiBtn
              defaultExamineStatus={"1"}
              startTime={moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD')}
              endTime={moment(new Date()).add(1, 'day').format('YYYY-MM-DD')}
              handleQueryBest={this.handleQueryBest}
              handleHeiQuery={this.handleHeiQuery}
              saveUserCheck={this.saveUserCheck}
              sortTable={this.sortTable}
              queryBest={queryBest}
              queryHeiBest={queryHeiBest}
              heiQueryData={heiQueryData}
              hidename="0"
              showHeiQuery={this.showHeiQuery}
              heiQueryType="2"
            />
            <div className={style.heiSearch} id="heiSearch" >高级搜索</div>
            <ContentWrap>
              <Table
                loading={this.state.loading}
                onChange={this.handleChange}
                title={this.renderHeaser}
                className={style.table}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={list}
                pagination={pagination}
              />
            </ContentWrap>
          </div>
          <Audit
            title="线索审核"
            isAudit="1"
            aType="1"
            disabled={false}
            visible={this.state.audit}
            cancle={this.auditCancle}
            ids={this.auditID}
            numbers={this.numbers}
            number={this.state.number}
            names={this.names}
            name={this.state.name}
            ok={this.auditOk}
          />
          <Modal
            title="导入线索"
            visible={this.state.modalTwo}
            onOk={this.handleCancel}
            onCancel={this.handleCancel}
            className={style.Modal}
          >
            <p dangerouslySetInnerHTML={{__html: this.state.errMsg}} />
          </Modal>
        </Wrap>
      </Layout>
    )
  }
}

export default ClueSystem
