/**
 * Created by zhaolong on 2018/04/09
 * File description:报表中心/跟进记录表
 */
'use strict';
import React, { Component } from 'react'
import style from './formCommon.less'
import { Table, Select, Button, Icon, message, TreeSelect } from 'antd'
import moment from 'moment'
import store from 'store'
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
import { getDepartment } from '../../actions/department'
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/bar';
import {selectAllCheneseName} from '../../actions/clientSystem'
import {getFollowTotal} from '../../actions/reportForms'
moment.locale('zh-cn')
const queryList = store.get('crm:queryList')
const {Wrap} = Layout
const Option = Select.Option

@connect((state) => {
  return {
    funneTotal:state.reportForms.funneTotal,
    nameList:state.clientSystem.nameList,
    department: state.department.list,
  }
})
export default class FollowupRecord extends Component {

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
        {"name":"销售人员"},
        {"name":"所在部门"},
        {"name":"跟进次数"},
        {"name":"跟进线索数"},
        {"name":"跟进商机数量"},
        {"name":"跟进合同数量"},
    ],
    tableBody:[

    ],
    nSelected:2,
    depCode:"",
    username:"",
    startTime:"",
    endTime:"",
    showQueryTime:false,
}

constructor(props){
    super(props);
    this.data = [];
    this.searchType = 2;
    this.depCode = "";
    this.username = "";
    this.startTime = "";
    this.endTime = "";
    this.nSelected = 2;
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
    // this.props.dispatch(getDepartment({depCode:code}))

    //获取所有人
    this.props.dispatch(selectAllCheneseName({code}))

    //获取默认初始化数据
    this.getData();
}
componentDidMount(){
}
componentWillReceiveProps(nextProps){
    if(this.props.funneTotal !== nextProps.funneTotal){
        this.data = nextProps.funneTotal;
        this.setState({
            tableBody: nextProps.funneTotal,
          })
        this.initEcharts(this.data);
    }else {
        this.data = [];
        // this.initEcharts(this.data);
    }
}
//初始化Echars图表
initEcharts = (data)=> {
    var userName = []
    var followCount = []
    var clueCount = []
    var businCount = []
    var contractCount = []
    data.forEach((v, i) => {
        userName.push(v.userName)
        followCount.push(v.followCount)
        clueCount.push(v.clueCount)
        businCount.push(v.businCount)
        contractCount.push(v.contractCount)
    })
    // 基于准备好的dom，初始化echarts实例
       var myChart = echarts.init(document.getElementById('followupRecord'));
       var option = {
           title : {
           text: '跟进记录报表',
           subtext: '虚拟数据',
       },
       tooltip : {
           trigger: 'axis',
       },
       legend: {
           data:['跟进次数','跟进线索次数','跟进商机次数','跟进合同次数'],
       },
       toolbox: {
           show : true,
           feature : {
               dataView : {show: true, readOnly: false},
               magicType : {show: true, type: ['line', 'bar']},
               restore : {show: true},
               saveAsImage : {show: true},
           },
       },
       calculable : true,
       xAxis : [
           {
               type : 'category',
               data : userName,
           },
       ],
       yAxis : [
           {
               type : 'value',
           },
       ],
       series : [
           {
               name:'跟进次数',
               type:'bar',
               data:followCount,
            //    markPoint : {
            //        data : [
            //            {type : 'max', name: '最大值'},
            //            {type : 'min', name: '最小值'},
            //        ],
            //    },
            //    markLine : {
            //        data : [
            //            {type : 'average', name: '平均值'},
            //        ],
            //    },
           },
           {
               name:'跟进线索次数',
               type:'bar',
               data:clueCount,
               // markPoint : {
               //     data : [
               //         {name : '年最高', value : 90, xAxis: 7, yAxis: 183},
               //         {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3},
               //     ],
               // },
               // markLine : {
               //     data : [
               //         {type : 'average', name : '平均值'},
               //     ],
               // },
           },
            {
               name:'跟进商机次数',
               type:'bar',
               data:businCount,
            //    markPoint : {
            //        data : [
            //            {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
            //            {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3},
            //        ],
            //    },
            //    markLine : {
            //        data : [
            //            {type : 'average', name : '平均值'},
            //        ],
            //    },
           },
           {
               name:'跟进合同次数',
               type:'bar',
               data:contractCount,
            //    markPoint : {
            //        data : [
            //            {type : 'max', name: '最大值'},
            //            {type : 'min', name: '最小值'},
            //        ],
            //    },
            //    markLine : {
            //        data : [
            //            {type : 'average', name: '平均值'},
            //        ],
            //    },
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

    if(type === "userId"){
        this.setState({
            username:`${value}`,
        })
        this.username = `${value}`;
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
selectDate = (number,i) =>{
        this.setState({
            nSelected:i,
        })
        this.nSelected = i;

        if(i !== 5){
            this.setState({
                showQueryTime:false,
            })
        }else {
            this.setState({
                showQueryTime:true,
            })
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
//更改查询条件后 获取新数据
getData = ()=> {
    var searchType = 0;

    if(this.nSelected === 5){
        searchType = 0;
    }else {
        searchType = this.nSelected + 1;
    }

    if(searchType === 0 ){
        if(this.startTime != "" && this.endTime != ""){
            this.getFollowTotal(searchType);
        }
    }else {
        this.getFollowTotal(searchType);
    }
}
//获取接口数据
getFollowTotal = (searchType)=> {
    this.props.dispatch(getFollowTotal({
        searchType:searchType,
        depCode:this.depCode,
        userId:this.username,
        startTime:this.startTime,
        endTime:this.endTime,
    }))
}

  render() {
      const {funnelotal,nameList} = this.props
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
            <div className={style.title}>跟进记录报表</div>
            <div className={style.items4}>
            <div className={style.date}>
            <div className={style.selectText}>写跟进时间：</div>
            <div className={style.selectItem}>
                {this.state.signDateList.map((v,i)=>{
                    return <div className={this.state.nSelected == i ? style.selectitem : style.item} key={i} onClick={()=>this.selectDate(1,i)}>{v.name}</div>
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
            <div className={style.selectText}>跟进人：</div>
            <div className={style.selectItem}>
            <TreeSelect
                placeholder="请选择部门"
                treeDefaultExpandAll
                style={{ width: 180 }}
                className={style.select}
                treeData={departments}
                onChange={(e)=>this.handleChange(e,'depCode')}
            />
            <Select className={style.select} onChange={(e)=>this.handleChange(e,'userId')}
               placeholder="请选择"
               defaultValue="请选择"
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
            </div>

            <div className={style.followupRecord} id="followupRecord"></div>

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
                        <div className={style.columns3}>{v.userName}</div>
                        <div className={style.columns3}>{v.department}</div>
                        <div className={style.columns3}>{v.followCount}</div>
                        <div className={style.columns3}>{v.clueCount}</div>
                        <div className={style.columns3}>{v.businCount}</div>
                        <div className={style.columns3}>{v.contractCount}</div>
                    </div>
                )
            })}
          </div>

        </div>
      </Layout>
    )
  }
}
