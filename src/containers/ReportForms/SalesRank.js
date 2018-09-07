/**
 * Created by zhaolong on 2018/04/10
 * File description:报表中心/销售额排名榜
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
import TableHeader from '../../components/TableHeader'
import { QueryTime } from '../../components/QueryItem'

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
import {selectSaleReportContract} from '../../actions/reportForms';

moment.locale('zh-cn')
const {Wrap} = Layout
const Option = Select.Option


@connect((state) => {
  return {
    selectSaleReportContract:state.reportForms.selectSaleReportContract,
    totalMoney:state.reportForms.totalMoney,
    department: state.department.list,
  }
})
export default class SalesRank extends Component {

state={
    tabs:[
        {"name":"合同金额"},
        {"name":"赢单商机金额"},
    ],
    tableHeader:[
        {"name":"姓名"},
        {"name":"排名"},
        {"name":"所在部门"},
        {"name":"合同金额"},
    ],
    tableBody:[
    ],
    nSelected:1,
}
handleChange = (value,type)=> {

}
constructor(props){
    super(props);
    var myDate = new Date();//获取系统当前时间
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    var day = myDate.getDate();

    this.startTime = year+"-"+month+"-"+"01";
    this.endTime = year+"-"+month+"-"+day;
    this.depCode = "";
}

componentWillMount(){
    const crm = store.get('crm')
    const depCode = crm && crm.user ? crm.user.depCode : '';
    //this.props.dispatch(getDepartment({depCode}))
    this.depCode = depCode
    this.getData();
}
componentDidMount(){

}

componentWillReceiveProps(nextProps){
    if(this.props.selectSaleReportContract != nextProps.selectSaleReportContract){
        this.data = nextProps.selectSaleReportContract;
        this.setState({
            tableBody:nextProps.selectSaleReportContract,
        })
        this.initEcharts(this.data);
    }
}

//更改查询条件后 获取新数据
getData = ()=> {
    this.props.dispatch(selectSaleReportContract({
        startTime:this.startTime,
        endTime:this.endTime,
        depCode:this.depCode,
    }))
}
//初始化图表
initEcharts = (data)=> {
    var user = [];
    var total = [];

    data.forEach((v,i)=>{
        user.push(v.userName);
        total.push(v.total);
   })
     // 基于准备好的dom，初始化echarts实例
       var myChart = echarts.init(document.getElementById('salesRank'));
       var option = {
        xAxis: {
            type: 'category',
            data: user,
        },
        yAxis: {
            type: 'value',
        },
        series: [{
            data: total,
            type: 'bar',
        }],
   };
       // 绘制图表
       myChart.setOption(option);
}

//下拉框选择事件
handleChange = (value,type)=> {
    if(type === "depCode"){
        this.depCode = `${value}`
    }
    this.getData();
}
//自定义时间段选择
onChange = (data, type) => {
  if (type === 'time') {
    this.startTime = data[0];
    this.endTime = data[1];
    this.getData();
  }
}

//table改变时间
tableChange = i => {
  this.setState({
    nSelected: i,
  })
}

  render() {
      const {totalMoney} = this.props;
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
            <div className={style.title2}>销售额排名报表</div>
            <div className={style.tabs}>
                <div className={this.state.nSelected == 1? style.selected:style.selected2} onClick={()=>this.tableChange(1)}>合同金额</div>
                <div className={this.state.nSelected == 1? style.UnSelected:style.UnSelected2} onClick={()=>this.tableChange(2)}>赢单商机金额</div>
            </div>
            <div className={style.items}>
                <div className={style.item}>
                    {/*<div className={style.name}>合同开始日期：</div>*/}
                    <QueryTime
                      data={{ name: '合同开始日期-自定义时间段' }}
                      onChange={e => this.onChange(e, 'time')}
                      type="form"
                      startTime={this.startTime}
                      endTime={this.endTime}
                    />
                </div>
                <div className={style.item}>
                    <div className={style.department}>部门：</div>
                    <TreeSelect
                        placeholder="请选择部门"
                        treeDefaultExpandAll
                        className={style.select}
                        treeData={departments}
                        style={{ width: 180 }}
                        onChange={(e)=>this.handleChange(e,'depCode')}
                    />
                </div>
            </div>

            <div className={style.salesRank} id="salesRank"></div>
            <div className={style.statisticalItems}>
                <span>合同金额：¥{totalMoney}</span>
            </div>
            <div className={style.table}>
            <div className={style.header}>
                {this.state.tableHeader.map((v,i)=>{
                    return <div className={style.columns3} key={i}>{v.name}</div>
                })}
            </div>

            {this.state.tableBody.map((v,i)=>{
                return <div className={style.body} key={i}>
                            <div className={style.columns3}>{v.userName}</div>
                            <div className={style.columns3}>{v.category}</div>
                            <div className={style.columns3}>{v.departmentName}</div>
                            <div className={style.columns3}>{v.total}</div>
                    </div>
            })}
          </div>

        </div>
      </Layout>
    )
  }
}
