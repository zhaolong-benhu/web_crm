/**
 * Created by zhaolong on 2018/04/10
 * File description:报表中心/业务新增汇总表
 */
'use strict';
import React, { Component } from 'react'
import style from './formCommon.less'
import { Table, Select, Button, Icon, message,Tooltip,TreeSelect } from 'antd'
import moment from 'moment'
import { getDepartment } from '../../actions/department'
import store from 'store'
import {connect} from 'react-redux'
import Layout from '../Wrap'
import ContentWrap from '../Content'
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
import {getBusinAdd} from '../../actions/reportForms'
moment.locale('zh-cn')
const {Wrap} = Layout
const Option = Select.Option

@connect((state) => {
  return {
    businadd:state.reportForms.businadd,
    clueCount:state.reportForms.clueCount,
    clientCount:state.reportForms.clientCount,
    businCount:state.reportForms.businCount,
    contractCount:state.reportForms.contractCount,
    department: state.department.list,
    nameList:state.clientSystem.nameList,
  }
})
export default class VocationalGather extends Component {

state={
    signDateList:[
        {"name":"日"},
        {"name":"周"},
        {"name":"月"},
        {"name":"年"},
    ],
    nSelected:2,
    tableHeader: [
        { name: '时间' },
        { name: '线索数' },
        { name: '客户数' },
        { name: '商机数' },
        { name: '合同数' },
      ],
    tableBody: [],
    deoCode:'',
}
handleChange = (value,type)=> {

}
constructor(props){
    super(props);
    this.searchType = 2;
    this.depCode = "";
    this.username = "";
    this.data = [];
    this.businaddColumns = [{
          title: '时间',
          dataIndex: 'everyDay',
          key: 'everyDay',
         }, {
          title: '线索数',
          dataIndex: 'clueCount',
          key: 'clueCount',
         }, {
          title: '客户数',
          dataIndex: 'clientCount',
          key: 'clientCount',
        }, {
          title: '商机数',
          dataIndex: 'businCount',
          key: 'businCount',
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
    // this.props.dispatch(getDepartment({depCode:code}))

    //获取所有人
    this.props.dispatch(selectAllCheneseName({code}));

    //获取默认初始化数据
    this.getData();
}
componentDidMount(){
}

componentWillReceiveProps(nextProps){
    if(this.props.businadd != nextProps.businadd){
        this.data = nextProps.businadd;
        this.setState({
            tableBody: nextProps.businadd,
          })
        this.initEcharts(this.data);
    }
}
selectDate = (i) =>{
    this.setState({
        nSelected:i,
    })
    if(i === 3){
        this.searchType = 5;
    }else{
        this.searchType = i+1;
    }
    this.getData();
}

//更改查询条件后 获取新数据
getData = ()=> {
    this.props.dispatch(getBusinAdd({
        searchType:this.searchType,
        depCode:this.depCode,
        userId:this.username,
    }))
}

initEcharts = (data)=> {
    var everyDay = []
    var clueCount = []
    var clientCount = []
    var businCount = []
    var contractCount = []
    data.forEach((v, i) => {
        everyDay.push(v.everyDay)
        clueCount.push(v.clueCount)
        clientCount.push(v.clientCount)
        businCount.push(v.businCount)
        contractCount.push(v.contractCount)
    })
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('vocationalGather'));
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
         data: ['线索数', '客户数', '商机数', '合同数'],
     },
     xAxis: {
         type: 'category',
         name: '金额',
         splitLine: {show: false},
         data: everyDay,
     },
     grid: {
         left: '3%',
         right: '4%',
         bottom: '3%',
         containLabel: true,
     },
     yAxis: {
         type: 'log',
         name: '数量',
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
         {
             name: '商机数',
             type: 'line',
             data: businCount,
         },
         {
             name: '合同数',
             type: 'line',
             data: contractCount,
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
            depCode:`${value}`,
        })
        this.depCode = `${value}`;
    }

    if(type === "username"){
        this.username = `${value}`;
    }

    this.getData();
}
  render() {
      const {nameList,businadd,clueCount,clientCount,businCount,contractCount} = this.props
      if(businadd){
      }
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
            <div className={style.title}>业务新增汇总表</div>
            <div className={style.items}>
                <div className={style.item}>
                    <div className={style.name}>时间维度：</div>
                    <div className={style.selectDate}>
                        {this.state.signDateList.map((v,i)=>{
                            return <div className={this.state.nSelected == i ? style.selectnav : style.nav} key={i} onClick={()=>this.selectDate(i)} title={v.title}>{v.name}</div>
                        })
                    }
                    </div>
                </div>
                <div className={style.item}>
                    <span className={style.name}>创建人：</span>
                    <TreeSelect
                        placeholder="请选择部门"
                        treeDefaultExpandAll
                        className={style.select}
                        treeData={departments}
                        style={{ width: 180 }}
                        onChange={(e)=>this.handleChange(e,'depCode')}
                    />
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

            <div className={style.vocationalGather} id="vocationalGather"></div>

            <div className={style.statisticalItems}>
                <span>线索数：{clueCount}、</span>
                <span>客户数：{clientCount}、</span>
                <span>商机数：{businCount}、</span>
                <span>合同数：{contractCount}</span>
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
                        <div className={style.columns2}>{v.everyDay}</div>
                        <div className={style.columns2}>{v.clueCount}</div>
                        <div className={style.columns2}>{v.clientCount}</div>
                        <div className={style.columns2}>{v.businCount}</div>
                        <div className={style.columns2}>{v.contractCount}</div>
                    </div>
                )
                })}
            </div>

        </div>
      </Layout>
    )
  }
}
