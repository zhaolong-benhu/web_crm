/**
 * Created by zhaolong on 2018/04/10
 * File description:报表中心/销售预测表
 */
'use strict';
import React, { Component } from 'react'
import style from './formCommon.less'
import { Table, Select, Button, Icon, message,Tooltip,TreeSelect } from 'antd'
import moment from 'moment'
import store from 'store'
import { getDepartment } from '../../actions/department'
import {connect} from 'react-redux'
import Layout from '../Wrap'
import ContentWrap from '../Content'
import { QueryTime } from '../../components/QueryItem'
import TableHeader from '../../components/TableHeader'
import { filterOption } from '../../util'

import 'moment/locale/zh-cn'
// 引入 ECharts 主模块
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/bar';
import {selectAllCheneseName} from '../../actions/clientSystem'
import {getBusinessForecast} from '../../actions/reportForms'
moment.locale('zh-cn')
const {Wrap} = Layout
const Option = Select.Option

@connect((state) => {
  return {
    businessForecast:state.reportForms.businessForecast,
    nameList:state.clientSystem.nameList,
    department: state.department.list,
  }
})
export default class SalesCalculate extends Component {

state={
    signDateList:[
        {"name":"今日"},
        {"name":"本周"},
        {"name":"本月"},
        {"name":"本季度"},
        {"name":"本年"},
        {"name":"自定义时间段"},
    ],
    tableHeader:[
        {"name":"时间"},
        {"name":"商机数量"},
        {"name":"预计销售金额"},
        {"name":"人员"},
        {"name":"部门"},
    ],
    tableBody:[

    ],
    nSelected:2,
    depCode:'',
    showQueryTime:false,
}
handleChange = (value,type)=> {

}
constructor(props){
    super(props);
    this.searchType = 2;
    this.depCode = '';
    this.username = 0;
    this.data = [];
    this.businaddColumns = [{
          title: '时间',
          dataIndex: 'everyDay',
          key: 'everyDay',
         }, {
          title: '线索数',
          dataIndex: 'businCount',
          key: 'businCount',
         }, {
          title: '客户数',
          dataIndex: 'clientCount',
          key: 'clientCount',
        }, {
          title: '商机数',
          dataIndex: 'clueCount',
          key: 'clueCount',
        },{
          title: '合同数',
          dataIndex: 'contractCount',
          key: 'contractCount',
      },
    ];
}

componentWillMount(){
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

    //获取默认初始化数据
    this.getData();
}
componentDidMount(){
}

componentWillReceiveProps(nextProps){
    if(this.props.businessForecast != nextProps.businessForecast){
        this.data = nextProps.businessForecast;
        this.initEcharts(this.data);
    }
}
selectDate = (i) =>{
    this.setState({
        nSelected:i,
    })
    if(i == 3){
        this.searchType = 5;
    }else{
        this.searchType = i+1;
    }
    if(i != 5){
        this.setState({
            showQueryTime:false,
        })
        this.getData();
    }else{
        this.setState({
            showQueryTime:true,
        })
    }

}
onChange = (data, type) => {
    if (type === 'time') {
      this.startTime = data[0];
      this.endTime = data[1];
      this.getData();
    }
  }
//更改查询条件后 获取新数据
getData = ()=> {
    this.props.dispatch(getBusinessForecast({
        searchType:this.searchType,
        depCode:this.depCode,
        userId:this.username,
    }))
}

initEcharts = (data)=> {
    var month = []
    var clueCount = []
    var clientCount = []
    data.forEach((v, i) => {
        month.push(v.month)
        clueCount.push(v.clueCount)
        clientCount.push(v.clientCount)
    })
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('salesCalculate'));
    var option = {
      title: {
         text: '数据展示',
         left: 'center',
     },
     tooltip: {
         trigger: 'item',
         formatter: '{a} <br/>{b} : {c}',
     },
     legend: {
         left: 'left',
         data: ['线索数', '客户数'],
     },
     xAxis: {
         type: 'category',
         name: 'x',
         splitLine: {show: false},
         data: month,
     },
     grid: {
         left: '3%',
         right: '4%',
         bottom: '3%',
         containLabel: true,
     },
     yAxis: {
         type: 'log',
         name: 'y',
     },
     series: [
         {
             name: '线索数',
             type: 'line',
             data: clueCount,
         },
         {
             name: '客户数',
             type: 'line',
             data: clientCount,
         },
     ],
     };
         // 绘制图表
         myChart.setOption(option);
}

//下拉框选择事件
handleChange = (value,type)=> {
    if(type === "depCode"){
        this.setState({
            depCode: `${value}`,
        })
        this.depCode = `${value}`;
    }

    if(type === "username"){
        this.username = `${value}`;
    }

    this.getData();
}
  render() {
      const {nameList} = this.props
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
            <div className={style.title}>销售预测表</div>
            <div className={style.items}>
                <div className={style.item}>
                    <div className={style.name}>预测时间：</div>
                    <div className={style.date}>
                    <div className={style.selectDate}>
                        {this.state.signDateList.map((v,i)=>{
                            return <div className={this.state.nSelected == i ? style.selectnav : style.nav} key={i} onClick={()=>this.selectDate(i)} title={v.title}>{v.name}</div>
                        })
                    }
                    <div className={this.state.showQueryTime?style.time:style.hidetime}>
                    <QueryTime
                    data={{ name: '自定义时间段' }}
                    onChange={e => this.onChange(e, 'time')}
                    type="form"
                    />
                </div>
                </div>
                    </div>
                </div>
                <div className={style.item}>
                    <span className={style.name}>所属部门：</span>
                    <TreeSelect
                        placeholder="请选择部门"
                        treeDefaultExpandAll
                        className={style.select}
                        treeData={departments}
                        style={{ width: 180 }}
                        onChange={(e)=>this.handleChange(e,'depCode')}
                    />
                   <span className={style.name2}>人员：</span>
                   <Select className={style.select} onChange={(e)=>this.handleChange(e,'username')} defaultValue="请选择用户"
                      filterOption={(input, option)=>filterOption(input, option)} showSearch >
                      {this.state.depCode != ""?
                        <Option value="">全部</Option>:null
                      }
                      {nameList && nameList.map((v,i)=>{
                         if(v.depCode == this.state.depCode){
                             return <Option value={v.userId.toString()} key={i} userPinyin={v.userPinyin}>{v.chineseName}</Option>
                         }
                      })}
                  </Select>
                </div>
            </div>

            <div className={style.salesCalculate} id="salesCalculate">
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
                    <div className={style.columns3}>{v.time}</div>
                    <div className={style.columns3}>{v.clueCount}</div>
                    <div className={style.columns3}>{v.money}</div>
                    <div className={style.columns3}>{v.userName}</div>
                    <div className={style.columns3}>{v.depCode}</div>
                </div>
            )
        })}
      </div>

        </div>
      </Layout>
    )
  }
}
