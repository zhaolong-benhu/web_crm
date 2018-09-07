/**
 * Created by zhaolong on 2018/04/10
 * File description:报表中心/线索转化率
 */

import React, { Component } from 'react'
import style from './formCommon.less'
import { Table, Select, Icon, message, Tooltip, TreeSelect } from 'antd'
import moment from 'moment'
import store from 'store'
import { connect } from 'react-redux'
import Layout from '../Wrap'
import ContentWrap from '../Content'
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
import { selectClueReportContract } from '../../actions/reportForms'
import { selectAllCheneseName } from '../../actions/clientSystem'
import { getDepartment } from '../../actions/department'
import { filterOption } from '../../util'

moment.locale('zh-cn')
const { Wrap } = Layout
const Option = Select.Option

@connect(state => {
  return {
    selectBlueReportContract: state.reportForms.selectBlueReportContract,
    contractCount: state.reportForms.contractCount,
    growthGate: state.reportForms.growthGate,
    number: state.reportForms.number,
    nameList: state.clientSystem.nameList,
    department: state.department.list,
  }
})
export default class BlueChangeRate extends Component {
  state = {
    nSelected: 0,
    tableHeader: [
      { name: '时间' },
      { name: '新增线索数' },
      { name: '已转化线索数' },
      { name: '转化率' },
    ],
    tableBody: [],
    depCode:'',
  }
  handleChange = (value, type) => {}
  constructor(props) {
    super(props)
    this.year = ''
    this.depCode = ''
    this.userId = ''
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
    if (
      this.props.selectBlueReportContract != nextProps.selectBlueReportContract
    ) {
      this.data = nextProps.selectBlueReportContract
      this.setState({
        tableBody: nextProps.selectBlueReportContract,
      })
      this.initEcharts(this.data)
    }
  }

  //获取报表数据
  getData = () => {
    this.props.dispatch(
      selectClueReportContract({
        year: this.year,
        depCode: this.depCode,
        userId: this.userId,
      })
    )
  }

  //table改变时间
  tableChange = i => {
    this.setState({
      nSelected: i,
    })
  }

  //下拉框选择事件
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

  //初始化图表
  initEcharts = data => {
    var month = []
    var number = []
    var contractCount = []
    var growthGate = []
    data.forEach((v, i) => {
      month.push(v.month + '月')
      number.push(v.number)
      contractCount.push(v.contractCount)
      var Gate =  parseFloat(v.growthGate).toFixed(2)
      growthGate.push(Gate)
    })

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('blueChangeRate'))
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
        data: ['新增线索数', '已转化线索数', '转化率(%)'],
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
          name: '线索数',
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          name: '转化率(%)',
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      series: [
        {
          name: '新增线索数',
          type: 'bar',
          data: number,
        },
        {
          name: '已转化线索数',
          type: 'bar',
          data: contractCount,
        },
        {
          name: '转化率(%)',
          type: 'line',
          yAxisIndex: 1,
          data: growthGate,
        },
      ],
    }
    // 绘制图表
    myChart.setOption(option)
  }

  render() {
    const {
      nameList,
      contractCount,
      growthGate,
      number,
    } = this.props
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
          <div className={style.title3}>线索转化率&nbsp;</div>
          <div className={style.tips}>
            <Tooltip title="解释：线索转化率..." className={style.tooltip}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </div>

          <div className={style.tabs}>
            <div
              className={
                this.state.nSelected == 1 ? style.selected : style.selected2
              }
              onClick={() => this.tableChange(1)}
            >
              转化率
            </div>
            <div
              className={
                this.state.nSelected == 1 ? style.UnSelected : style.UnSelected2
              }
              onClick={() => this.tableChange(2)}
            >
              转化时长
            </div>
          </div>

          <div className={style.items3}>
            <div className={style.item}>
              <div className={style.name}>时间：</div>
              <Select
                style={{ width: 180 }}
                defaultValue={this.year.toString()}
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
                placeholder="请选择"
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
                       return  <Option value={v.userId.toString()} key={i} userPinyin={v.userPinyin}>{v.chineseName} </Option>
                   }
                  })}
              </Select>
            </div>
          </div>
          <div className={style.blueChangeRate} id="blueChangeRate" />
          <div className={style.statisticalItems}>
            <span>新增线索数：{number}、</span>
            <span>已转化线索数：{contractCount}、</span>
            <span>转化率：{growthGate}</span>
          </div>
          <div className={style.table}>
            <div className={style.header}>
              {this.state.tableHeader.map((v, i) => {
                return (
                  <div className={style.columns3} key={i}>
                    {v.name}
                  </div>
                )
              })}
            </div>
            {this.state.tableBody.map((v, i) => {
              return (
                <div className={style.body} key={i}>
                  <div className={style.columns3}>{v.month}月</div>
                  <div className={style.columns3}>{v.number}</div>
                  <div className={style.columns3}>{v.contractCount}</div>
                  <div className={style.columns3}>{v.growthGate}</div>
                </div>
              )
            })}
          </div>
        </div>
      </Layout>
    )
  }
}
