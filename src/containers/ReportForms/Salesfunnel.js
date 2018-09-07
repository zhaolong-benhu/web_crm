/**
 * Created by zhaolong on 2018/04/09
 * File description:报表中心/销售漏斗表
 */
'use strict';
import React, { Component } from 'react'
import style from './formCommon.less'
import { Table, Select, Button, Icon, message, TreeSelect } from 'antd'
import moment from 'moment'
import store from 'store'
import { getDepartment } from '../../actions/department'
import {connect} from 'react-redux'
import Layout from '../Wrap'
import ContentWrap from '../Content'
import TableHeader from '../../components/TableHeader'
import { QueryTime } from '../../components/QueryItem'
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
import {getfunnelotal} from '../../actions/reportForms'
moment.locale('zh-cn')
const queryList = store.get('crm:queryList')
const {Wrap} = Layout
const Option = Select.Option


@connect((state) => {
  return {
    salesFunnel:state.reportForms.salesFunnel,
    nameList:state.clientSystem.nameList,
    department: state.department.list,
  }
})
export default class Salesfunnel extends Component {

state={
    signDateList:[
        {"name":"全部"},
        {"name":"本周"},
        {"name":"本月"},
        {"name":"本季度"},
        {"name":"本年"},
        {"name":"自定义时间段"},
    ],
    tableHeader:[
        {"name":"销售人员"},
        {"name":"部门"},
        {"name":"线索数量"},
        {"name":"客户数量"},
        {"name":"产生商机数量"},
        {"name":"产生合同数量"},
        {"name":"合同成交数量"},
    ],
    tableBody:[
        {"value":"全体"},
        {"value":"全部"},
        {"value":"0"},
        {"value":"0"},
        {"value":"0"},
        {"value":"0"},
        {"value":"0"},
    ],
    nSelected:2,
    showQueryTime:false,
    depCode:"",
}

constructor(props){
    super(props)
    this.data = []
    this.depCode = ""
    this.username = ""
    this.startTime = ""
    this.endTime = ""
    this.funnelotalList = [{
          title: '销售人员',
          dataIndex: 'title',
          key: 'title',
         }, {
          title: '部门',
          dataIndex: 'content',
          key: 'content',
         }, {
          title: '线索数量',
          dataIndex: 'userName',
          key: 'userName',
        }, {
          title: '客户数量',
          dataIndex: 'departmentName',
          key: 'billingMoney',
        },{
          title: '产生商机数量',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '产生合同数量',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '合同成交数量',
          dataIndex: 'createTime',
          key: 'createTime',
        },
    ];
}
componentWillMount(){

    //获取所有部门
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
    if(this.props.salesFunnel !== nextProps.salesFunnel){
        this.data[0] = nextProps.salesFunnel.clueCount;
        this.data[1] = nextProps.salesFunnel.clientCount;
        this.data[2] = nextProps.salesFunnel.businCount;
        this.data[3] = nextProps.salesFunnel.contractCount;
        this.data[4] = nextProps.salesFunnel.madeCount;

        this.initEcharts(this.data);

        var items = this.state.tableBody;
        for(var i=0;i<this.state.tableBody.length;i++){
            if(i>1){
                items[i].value = this.data[i-2];
            }else{

            }
        }
        this.setState({
              tableBody: items,
        });
    }
}
//初始化Echars图表
initEcharts = (data)=> {
    // 基于准备好的dom，初始化echarts实例
       var myChart = echarts.init(document.getElementById('salesfunnel'));
       var option = {
       title: {
           text: '漏斗表',
           subtext: '',
       },
       tooltip: {
           trigger: 'item',
           formatter: "{a} <br/>{b} : {c}",
       },
       toolbox: {
           feature: {
               dataView: {readOnly: false},
               restore: {},
               saveAsImage: {},
           },
       },
       legend: {
           data: ['线索','客户','商机','合同','成交'],
       },
       calculable: true,
       series: [
           {
               name:'漏斗图',
               type:'funnel',
               left: '10%',
               top: 60,
               //x2: 80,
               bottom: 60,
               width: '80%',
               // height: {totalHeight} - y - y2,
               min: 0,
               max: 100,
               minSize: '0%',
               maxSize: '100%',
               sort: 'descending',
               gap: 2,
               label: {
                   normal: {
                       show: true,
                       position: 'inside',
                   },
                   emphasis: {
                       textStyle: {
                           fontSize: 20,
                       },
                   },
               },
               labelLine: {
                   normal: {
                       length: 10,
                       lineStyle: {
                           width: 1,
                           type: 'solid',
                       },
                   },
               },
               itemStyle: {
                   normal: {
                       borderColor: '#fff',
                       borderWidth: 1,
                   },
               },
               // data: [
               //     {value: data[0], name: '线索'},
               //     {value: data[1], name: '客户'},
               //     {value: data[2], name: '商机'},
               //     {value: data[3], name: '合同'},
               //     {value: data[4], name: '成交'},
               // ],
               data: [
                   {value: 100, name: '线索'},
                   {value: 80, name: '客户'},
                   {value: 60, name: '商机'},
                   {value: 40, name: '合同'},
                   {value: 20, name: '成交'},
               ],
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
        this.depCode = `${value}`
    }

    if(type === "userId"){
        this.username = `${value}`
        const {nameList} = this.props;
        nameList.forEach((v,i)=>{
            if( `${value}` == v.userId){
                var items = this.state.tableBody;
                items[0].value = v.chineseName
                this.setState({
                    tableBody:items,
                })
            }
        })
    }
    this.getData();
}
//签单日期选择事件
selectDate = (i) =>{
    this.setState({
        nSelected:i,
    })
    if(i != 5){
        this.getData();
        this.setState({
            showQueryTime:false,
        })
    }else{
        this.setState({
            showQueryTime:true,
        })
    }
}
//自定义时间段选择
onChange = (data, type) => {
  if (type === 'time') {
    this.startTime = data[0];
    this.endTime = data[1];
    this.getData();
  }
}
//更改查询条件后 获取新数据
getData = ()=> {
    var searchType = 3;
    switch (this.state.nSelected) {
        case 0:
            searchType = 6;//全部
            break;
        case 1:
            searchType = 2;//本周
            break;
        case 2:
            searchType = 3;//本月
            break;
        case 3:
            searchType = 4;//本季度
            break;
        case 4:
            searchType = 5;//本年
            break;
        case 5:
            searchType = 0;//自定义
            break;
        default:

    }
    this.props.dispatch(getfunnelotal({
        searchType:searchType,
        depCode:this.depCode,
        userId:this.username,
        startTime:this.startTime,
        endTime:this.endTime,
    }))
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
            <div className={style.title}>销售漏斗报表</div>
            <div className={style.date}>
                <div className={style.selectText}>预计签单日期：</div>
                <div className={style.selectItem}>
                    {this.state.signDateList.map((v,i)=>{
                        return <div className={this.state.nSelected == i ? style.selectitem : style.item} key={i} onClick={()=>this.selectDate(i)}>{v.name}</div>
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
            <div className={style.date2}>
                <div className={style.selectText}>所属部门：</div>
                <div className={style.selectItem}>
                <TreeSelect
                        placeholder="请选择部门"
                        treeDefaultExpandAll
                        className={style.select}
                        treeData={departments}
                        style={{ width: 180 }}
                        onChange={(e)=>this.handleChange(e,'depCode')}
                    />
                <Select className={style.select} onChange={(e)=>this.handleChange(e,'userId')} defaultValue="请选择"
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

            <div className={style.salesfunnel} id="salesfunnel"></div>

            <div className={style.table}>
                <div className={style.header}>
                    {this.state.tableHeader.map((v,i)=>{
                        return <div className={style.columns} k={i}>{v.name}</div>
                    })}
                </div>
                <div className={style.body}>
                    {this.state.tableBody.map((v,i)=>{
                        return <div className={style.columns} k={i}>{v.value}</div>
                    })}
                </div>
            </div>
        </div>
      </Layout>
    )
  }
}
