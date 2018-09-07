/**
 * Created by zhaolong on 2018/04/10
 * File description:报表中心/合同汇总表
 */

import React, { Component } from 'react'
import style from './formCommon.less'
import { Table, Select, Button, Icon, message, Tooltip, TreeSelect } from 'antd'
import moment from 'moment'
import store from 'store'
import DfwsSelect from 'dfws-antd-select'
import { connect } from 'react-redux'
import Layout from '../Wrap'
import ContentWrap from '../Content'
import TableHeader from '../../components/TableHeader'
import { selectAllCheneseName } from '../../actions/clientSystem'
import { selectContractReport } from '../../actions/reportForms'
import { getDepartment } from '../../actions/department'
import { filterOption } from '../../util'

import 'moment/locale/zh-cn'
// 引入 ECharts 主模块
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/bar'
moment.locale('zh-cn')
const { Wrap } = Layout
const Option = Select.Option

@connect(state => {
  return {
    selectContractReport: state.reportForms.selectContractReport,
    contractCount: state.reportForms.contractCount,
    totalMoney: state.reportForms.totalMoney,
    nameList: state.clientSystem.nameList,
    department: state.department.list,
  }
})
export default class ContractGather extends Component {
  state = {
    signDateList: [
      { name: '单体合同' },
      { name: '集团版合同' },
      { name: '子公司合同' },
      { name: '其他' },
    ],
    tableHeader: [
      { name: '时间' },
      { name: '合同数' },
      { name: '合同数环比增长' },
      { name: '合同总金额' },
      { name: '合同总金额环比增长' },
    ],
    tableBody: [],
    nSelected: 0,
    depCode:'',
  }
  handleChange = (value, type) => {}
  constructor(props) {
    super(props)
    this.year = ''
    this.ContractType = ''
    this.depCode = ''
    this.userId = ''
    this.operationLogList = [
      {
        title: '时间',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '合同数',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '合同数环比增长',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '合同总金额',
        dataIndex: 'departmentName',
        key: 'billingMoney',
      },
      {
        title: '合同总金额环比增长',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '平均客单价',
        dataIndex: 'createTime',
        key: 'createTime',
      },
    ]
    this.allYear = []
    var myDate = new Date() //获取系统当前时间
    var year = myDate.getFullYear()
    this.year = year
    for (var i = year; i >= 2003; i--) {
      this.allYear.push(i)
    }
  }

  componentWillMount() {

    let code = ''
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.department) {
      code = crm.user.department.deptCode
      this.depCode = crm.user.department.deptCode
    }

    //获取所有部门
    //this.props.dispatch(getDepartment({depCode:code}))

    //获取所有人
    this.props.dispatch(selectAllCheneseName({code}));

    this.getData()
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.selectContractReport != nextProps.selectContractReport) {
      this.data = nextProps.selectContractReport
      this.setState({
        tableBody: nextProps.selectContractReport,
      })
      this.initEcharts(this.data)
    }
  }
  //更改查询条件后 获取新数据
  getData = () => {
    this.props.dispatch(
      selectContractReport({
        year: this.year,
        ContractType: this.ContractType,
        depCode: this.depCode,
        userId: this.userId,
      })
    )
  }
  //初始化图表
  initEcharts = data => {
    var month = []
    var contractCount = []
    var money = []
    data.forEach((v, i) => {
      month.push(v.month + '月')
      contractCount.push(v.contractCount)
      money.push(v.money)
    })
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('contractGather'))
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ['合同数量', '合同金额'],
      },
      xAxis: [
        {
          type: 'category',
          data: month,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '合同数量',
          min: 0,
          max: 1000,
          interval: 50,
          axisLabel: {
            formatter: '{value} ',
          },
        },
        {
          type: 'value',
          name: '合同金额',
          min: 0,
          max: 1000000,
          interval: 5,
          axisLabel: {
            formatter: '¥ {value}',
          },
        },
      ],
      series: [
        {
          name: '合同数量',
          type: 'bar',
          data: contractCount,
        },
        {
          name: '合同总金额',
          type: 'line',
          yAxisIndex: 1,
          data: money,
        },
      ],
    }
    // 绘制图表
    myChart.setOption(option)
  }

  //合同类型选择
  selectDate = i => {
    this.setState({
      nSelected: i,
    })
    this.ContractType = i + 1
    this.getData()
  }
  //下拉选择
  handleChange = (value, type) => {
    if (type === 'time') {
      this.year = `${value}`
    } else if (type === 'depCode') {
        this.setState({
            depCode: `${value}`,
        })
      this.depCode = `${value}`
    } else {
      this.userId = `${value}`
    }
    this.getData()
  }
  render() {
    const { billList, nameList, selectContractReport } = this.props
    let departments = []
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.department) {
      departments.push(crm.user.department)
      const departmentStr = JSON.stringify(departments)
      const departmentRep = departmentStr
        .replace(/deptName/g, 'label')
        .replace(/deptCode/g, 'value')
        .replace(/id/g, 'key')
      departments = JSON.parse(departmentRep)
    }
    return (
      <Layout type="reportform">
        <div className={style.container}>
          <span className={style.title}>合同汇总报表&nbsp;</span>
          <Tooltip title="解释：合同总表..." className={style.tooltip}>
            <Icon type="question-circle-o" />
          </Tooltip>

          <div className={style.items2}>
            <div className={style.item}>
              <div className={style.name}>时间：</div>
              <Select
                style={{ width: 180 }}
                defaultValue="请选择"
                onChange={e => this.handleChange(e, 'time')}
              >
                <Option value="">请选择</Option>
                {this.allYear.map((v, i) => {
                  return (
                    <Option value={v.toString()} key={i}>
                      {v}
                    </Option>
                  )
                })}
              </Select>
            </div>
            <div className={style.item}>
              <span className={style.name}>合同类型：</span>
              <div className={style.selectDate}>
                {this.state.signDateList.map((v, i) => {
                  return (
                    <div
                      className={
                        this.state.nSelected == i ? style.selectnav : style.nav
                      }
                      key={i}
                      onClick={() => this.selectDate(i)}
                      title={v.title}
                    >
                      {v.name}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className={style.item}>
              <span className={style.name}>所属部门：</span>
              <TreeSelect
                placeholder="请选择部门"
                treeDefaultExpandAll
                style={{ width: 180 }}
                className={style.select}
                treeData={departments}
                onChange={(e)=>this.handleChange(e,'depCode')}
              />
            </div>
            <div className={style.item}>
              <span className={style.name}>负责人：</span>
              <Select
                className={style.select}
                onChange={e => this.handleChange(e, 'userId')}
                defaultValue="请选择"
                filterOption={(input, option)=>filterOption(input, option)}
                showSearch
              >
              {this.state.depCode != ""?
               <Option value="">全部</Option>:null
              }
                {nameList &&
                  nameList.map((v, i) => {
                      if(v.depCode == this.state.depCode){
                        return  <Option value={v.userId.toString()} key={i} userPinyin={v.userPinyin}>{v.chineseName}</Option>
                      }
                  })}
              </Select>
            </div>
          </div>

          <div className={style.contractGather} id="contractGather" />

          <div className={style.statisticalItems}>
            <span>合同数：{this.props.contractCount}、</span>
            <span>合同总金额：¥ {this.props.totalMoney}</span>
          </div>

          <div className={style.table}>
            <div className={style.header}>
              {this.state.tableHeader.map((v, i) => {
                return (
                  <div className={style.columns2} k={i}>
                    {v.name}
                  </div>
                )
              })}
            </div>

            {this.state.tableBody.map((v, i) => {
              return (
                <div className={style.body} key={i}>
                  <div className={style.columns2}>{v.month}月</div>
                  <div className={style.columns2}>{v.contractCount}</div>
                  <div className={style.columns2}>
                    {v.growthGate ? v.growthGate : '-'}
                  </div>
                  <div className={style.columns2}>{v.total}</div>
                  <div className={style.columns2}>{v.growthMoney}%</div>
                </div>
              )
            })}
          </div>
        </div>
      </Layout>
    )
  }
}
