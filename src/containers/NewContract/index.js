/**
 * Created by zhaolong on 2018/03/12
 * File description:新增合同
 */
'use strict';
import React, { Component } from 'react'
import style from './style.less'
import { Link } from 'react-router-dom'
import Layout from '../Wrap'
import store from 'store'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import ContentWrap from '../Content'
import Product from '../../components/Product'
import moment from 'moment'
import DfwsSelect from 'dfws-antd-select'
import { Table, Button, Input, Select, Icon, Modal, message, Tabs, Label, DatePicker, Radio} from 'antd'
import {newContract, getContractNumber, updateProductById, insertProduct} from '../../actions/contractSystem'
import {selectAllCheneseName} from '../../actions/clientSystem'
import { dictUrl } from '../../config'
import { getUrlParam } from '../../util'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const {Wrap} = Layout
const Option = Select.Option
const auth = store.get('crm') || {}
const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect((state) => {
  return {
    contractNumber:state.contractSystem.contractNumber,
    businessOpportList:state.contractSystem.businessOpportList,
    data: state.data,
    nameList:state.clientSystem.nameList,
    productList:state.contractSystem.productList,
    contractSystem:state.contractSystem,
  }
})
class NewContract extends Component {
    state={
        businessId:"",//对应商机
        startTime:"",//合同开始时间
        endTime:"",//合同结束时间
        status:"",//合同状态
        contractDate:"",//合同签订日期
        isContract:"",//合同类型
        relationNumber:"",//关联合同编号
        srSource:"",//合同收入来源
        contracDes:"",//合同描述详情
        totalAmount:"",//合同总金额
        selectProductMod_visible:false,//选择产品Modal
        bShowRelationNumber:true,//显示关联合同编号输入框
        contractId: '',// 合同id
        tableHeader:[
            {"name":"序号"},
            {"name":"产品名称"},
            {"name":"产品金额"},
            {"name":"销售人员"},
            {"name":"服务人员"},
            {"name":"服务开始时间"},
            {"name":"服务结束时间"},
            {"name":"操作"},
        ],
    }
  constructor(props){
    super(props)
    this.businessId = "";
  }

  componentDidMount(){
    　var customerId = getUrlParam('customerId');
      //获取合同编号和对应商机
      this.props.dispatch(getContractNumber({customerId: customerId}))

      //查询所有人
      let code = ''
      const crm = store.get('crm')
      if (crm && crm.user && crm.user.department) {
        code = crm.user.department.deptCode
      }
      if (crm && crm.user && crm.user.id){
          this.setState({
              userId: crm.user.id,
          })
      }
      this.props.dispatch(selectAllCheneseName({
        code,
      }))

    if(this.props.businessOpportList){
        this.props.businessOpportList.forEach((v,i)=>{
            if(getUrlParam('busNumber') == v.busNumber){
                this.businessId = v.id;
            }
        })
    }
  }
  componentWillUnmount(){
  }
  operateAgree = (action) => {
      if("cancel" === action){
          this.props.history.go(-1);
      }else {
          if(this.state.totalAmount == ""){
              return message.error('请输入合同总金额');
          }else if(this.state.startTime == ""){
              return message.error('请选择合同开始日期');
          }else if(this.state.endTime == ""){
              return message.error('请选择合同结束日期');
          }else if(this.state.contractDate == ""){
              return message.error('请选择合同签订日期');
          }else if(this.state.isContract == "" && getUrlParam('customerCategory') != '1'){
              return message.error('请选择合同类型');
          }else if(this.state.srSource == ""){
              return message.error('请选择合同收入来源');
          } else if(!this.state.businessId && this.businessId=="" && !getUrlParam('busid')){
            return message.error('请选择对应商机');
          } else {
                if(this.state.isContract == 3){
                    if(this.state.relationNumber == "") {
                      return message.error('请填写关联合同编号');
                    }
                }
                if(getUrlParam('customerCategory') == 1){
                    this.state.isContract = 1
                }
              this.props.dispatch(newContract({
                  id:this.state.contractId ? this.state.contractId : '',
                  customerId:getUrlParam('customerId'),
                  topicId:getUrlParam('topicId') != null ? getUrlParam('topicId') : "",
                  contractNumber:this.state.contractNumber||this.props.contractNumber,
                  totalAmount:this.state.totalAmount,
                  businessId:this.state.businessId||this.businessId||getUrlParam('busid')||"",
                  startTime:this.state.startTime,
                  endTime:this.state.endTime,
                  status:3,
                  contractDate:this.state.contractDate,
                  isContract:this.state.isContract,
                  relationNumber:this.state.relationNumber||"",
                  srSource:this.state.srSource,
                  contracDes:this.state.contracDes,
                  userId:this.state.userId,
              })).then( (data)=> {
                 if(data){
                     if(data.code === 0){
                         message.success(data.msg)
                         this.setState({
                            contractId: data.data,
                         })
                         var productList = []
                         var pro_list = []
                         if(this.props.contractSystem && this.props.contractSystem.newproductList && this.props.contractSystem.newproductList.length>0){
                             if(this.props.productList && this.props.productList.length>0){
                                 pro_list = this.props.productList.concat(this.props.contractSystem.newproductList)
                             }else{
                                 pro_list = this.props.contractSystem.newproductList
                             }
                         }
                         // var pro_list = this.props.productList
                         pro_list && pro_list.forEach((v,i)=>{
                             var info={"id":"","cname":"","type":"","money":"","salesUserid":"","serviceUserid":"","startTime":"","endTime":""}
                             productList.push(info)
                             productList[i].id = v.id;
                             productList[i].cname =v.cname;
                             productList[i].money = v.money;
                             productList[i].type = v.type;
                             productList[i].salesUserid = v.salesUserid;
                             productList[i].serviceUserid = v.serviceUserid;
                             productList[i].startTime = v.startTime;
                             productList[i].endTime = v.endTime;
                         })
                         if(productList.length > 0){
                             this.props.dispatch(updateProductById({
                                 productList:pro_list,
                             }))
                         }
                     }
                   }else{
                 }
              })
          }
      }
  }

  handleInputChange(e,v) {
      if(v === "contractNumber"){
          this.setState({
            contractNumber: e.target.value,
          })
      }else if(v === "status"){
          this.setState({
            status: e.target.value,
          })
      }else if(v === "isContract"){
          this.setState({
            isContract: e.target.value,
          })
      }else if(v === "relationNumber"){
          this.setState({
            relationNumber: e.target.value,
          })
      }else if(v === "contracDes"){
          this.setState({
            contracDes: e.target.value,
          })
      }else if(v === "totalAmount"){
          this.setState({
            totalAmount: e.target.value,
          })
      }
  }

  onEndChange = (value,dateString,v) => {
      if(v === "startTime"){
          this.setState({
            startTime: dateString,
          })
      }else if(v === "endTime"){
          this.setState({
            endTime: dateString,
          })
      }else if(v === "contractDate"){
          this.setState({
            contractDate: dateString,
          })
      }
  }
  handleChange(value,type) {
      if(type === "srSource"){
          this.setState({
              srSource:`${value}`,
          })
      }else if(type === "businessId"){
          this.setState({
              businessId:`${value}`,
          })
      }else if(type === "isContract"){
          this.setState({
              isContract:`${value}`,
          })
          if(3 == `${value}`){
              this.setState({
                  bShowRelationNumber:true,
              })
              this.props.contractSystem.contractType = 0
          }else if(2 === `${value}`){
              this.setState({
                  bShowRelationNumber:false,
                  relationNumber:"",
              })
              this.props.contractSystem.contractType = 1
          }else {
              this.setState({
                  bShowRelationNumber:false,
                  relationNumber:"",
              })
              this.props.contractSystem.contractType = 0
          }
      }else if(type === "status"){
          this.setState({
              status:`${value}`,
          })
      }
  }

  //选择产品
  selectProduct = () => {
      this.setState({
          selectProductMod_visible:true,
      })
  }
  onCancel = () => {
      this.setState({
          selectProductMod_visible:false,
      })
  }
  insertProduct = (id,type,salesUserid,serviceUserid) => {
      this.props.dispatch(insertProduct({
          topicId:getUrlParam('topicId') || this.props.selectContract.topicId,
          contractId:this.state.contractId,
          userId:this.state.userId,
          salesUserid:salesUserid,
          serviceUserid:serviceUserid,
          productType:type,
          productId:id,
      }))
  }

  render() {
      const {contractNumber,businessOpportList,productList,nameList} = this.props
    //   if(contractNumber){
    //       this.state.contractNumber = contractNumber
    //   }
      const dateFormat = 'YYYY-MM-DD';
    return (
      <Layout>
        <Wrap>
        <div className={style.MyClueWrap}>
          <div className={style.head}>
             <div className={style.operateAgree}>
                        {/* <Button type="ghost" className={style.button} onClick={()=>this.operateAgree("paste")}>粘贴</Button> */}
                        {/* <Button type="ghost" className={style.button} onClick={()=>this.operateAgree("copy")}>复制</Button> */}
                        <Button type="ghost" className={style.button} onClick={()=>this.operateAgree("cancel")}>返回</Button>
                        <Button type="ghost" className={style.button} onClick={()=>this.operateAgree("submit")}>提交</Button>
                </div>
          </div>
          <ContentWrap style={{ borderTop: 'none' }}>
            <div className={style.contractInfo}>
                <ul className={style.items}>
                    <li>
                        <span className={style.label}>合同编号：</span>
                        <Input className={style.input} value={contractNumber} disabled={true} placeholder="请输入"></Input>
                    </li>
                    <li>
                        <div>
                            <span className={style.label}>对应商机：</span>
                            <Select className={style.select} onChange={(e)=>this.handleChange(e,'businessId')} placeholder="请选择" defaultValue={getUrlParam('busNumber')} >
                            {businessOpportList && businessOpportList.map((v,i)=>{
                                return  <Option value={v.id} key={i}>{v.busNumber}</Option>
                            })}
                            </Select>
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>合同总金额：</span>
                        <Input className={style.input} value={this.state.totalAmount} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'totalAmount')}></Input>
                    </li>
                    <li>
                        <div>
                            <span className={style.label}>合同开始日期：</span>
                            <DatePicker className={style.dataPicker} onChange={(value,dateString)=>this.onEndChange(value,dateString,'startTime')}/>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span className={style.label}>合同结束日期：</span>
                            <DatePicker className={style.dataPicker} onChange={(value,dateString)=>this.onEndChange(value,dateString,'endTime')}/>
                        </div>
                    </li>
                    <li>
                        <div>
                        <span className={style.label}>合同状态：</span>
                            <DfwsSelect
                                showSearch
                                url={dictUrl()}
                                allowClear={false}
                                code="ContractStatus"
                                placeholder="请选择合同状态"
                                className={style.select}
                                onChange={(e)=>this.handleChange(e,'status')}
                                disabled={true}
                                value={"3"}
                            />
                        </div>
                    </li>
                    <li>
                        <div>
                            <span className={style.label}>合同签订日期：</span>
                            <DatePicker className={style.dataPicker} onChange={(value,dateString)=>this.onEndChange(value,dateString,'contractDate')}/>
                        </div>
                    </li>
                    {(()=>{
                        if(getUrlParam('customerCategory') == "2"){
                            return <li>
                                <div>
                                <span className={style.label}>合同类型：</span>
                                <Select className={style.select} onChange={(e)=>this.handleChange(e,'isContract')} placeholder="请选择" >
                                    <Option value="1">单体合同</Option>
                                    <Option value="2">集团版合同</Option>
                                    <Option value="3">子公司合同</Option>
                                </Select>
                                </div>
                            </li>
                        }
                    })()}

                    {(()=>{
                        if(this.state.bShowRelationNumber && getUrlParam('customerCategory') == "2"){
                            return <li>
                                <span className={style.label}>关联合同编号：</span>
                                <Input className={style.input} value={this.state.relationNumber} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'relationNumber')}></Input>
                            </li>
                        }
                    })()}
                    <li>
                        <div>
                            <span className={style.label}>合同收入来源：</span>
                            <DfwsSelect
                            showSearch
                            url={dictUrl()}
                            className={style.select}
                            code="SourceOfContractIncome"
                            placeholder="请选择合同收入来源："
                            onChange={(e)=>this.handleChange(e,'srSource')}
                            />
                        </div>
                    </li>
                </ul>
            </div>

            <div className={style.productInfo}>
                <div className={style.clientDescribe}>
                    <span className={style.label}>合同描述：</span>
                    <TextArea className={style.textarea} value={this.state.contracDes} placeholder="请输入" autosize={{ minRows: 6, maxRows: 8 }} onChange={(e)=>this.handleInputChange(e,'contracDes')}/>
                </div>
                <div className={style.clientDescribe} style={{marginTop: 90}}>
                    <span className={style.label}>产品信息：</span>
                    <div style={{width:'75%'}}>
                        <Product isContract={this.state.isContract} insertProduct={this.insertProduct} id={this.state.contractId} contractNumber={this.state.contractNumber||this.props.contractNumber} />
                    </div>
                </div>
            </div>
          </ContentWrap>
        </div>
        </Wrap>
      </Layout>
    )
  }
}

export default NewContract
