/**
 * Created by zhaolong on 2018/03/12
 * File description:我的合同/合同管理详情
 */
'use strict';
import React, { Component } from 'react'
import style from './style.less'
import Layout from '../Wrap'
import store from 'store'
import {connect} from 'react-redux'
import ContentWrap from '../Content'
import AuthRequire from '../../components/AuthRequire'
import moment from 'moment'
import {default as ColumnRender} from '../../components/TableColumn'
import DfwsSelect from 'dfws-antd-select'
import TableHeader from '../../components/TableHeader'
import Product from '../../components/Product'
import { dictUrl,fileBaseurl } from '../../config'
import {newWindow} from '../../util/'
import {Table,Button,Input,InputNumber,Select,Icon,Modal,message,Tabs,DatePicker,Radio,Upload} from 'antd'
import {getContractNumber,
    selectContractAndProduct,
    selectReceipt,
    selectReceiptList,
    insertReceipt,
    selectBillList,
    selectContractOperationLog,
    updateContract,
    updateContractStatus,
    insertSendBill,
    selectPayment,
    updatePayment,
    insertBill,
    deleteReceipt,
    insertPayment,
    selectBill,
    updateBill,
    addBill,
    selectSubsidiaryList,
    insertSubsidiaryContract,
    deleteSubsidiaryContract,
    getSubsidiaryContractNumber,
    updateProductById,
    insertProduct,
    updateContractMeterial,
    deleteContractMeterial,
    selectContractMeterialOne,
    selectContractMeterialPage,
} from '../../actions/contractSystem'
import {selectAllCheneseName} from '../../actions/clientSystem'
import { baseURL } from '../../config'
import { getUrlParam,filterOption, getBigDate } from '../../util'
import { permissionNamesHas } from '../../util/isAuth'
import 'moment/locale/zh-cn'
import $ from 'jquery'
moment.locale('zh-cn')

const queryList = store.get('crm:queryList')
const {Wrap} = Layout
const Option = Select.Option
const auth = store.get('crm') || {}
const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group;
const Dragger = Upload.Dragger;
const { TextArea } = Input;
// const props = {
//   name: 'file',
//   showUploadList: true,
//   accept: '.rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png,.xlsx',
//   action: baseURL() + '/crm/uploadFile',
//   multiple:true,//是否支持多选文件，
//   data:{
//       // id:getCookie('appendixId')||"",
//       id:1,
//   },
//   headers: {
//     'X-Requested-With': null,
//    },
//    withCredentials:true,
// };

@connect((state) => {
  return {
    id:state.contractSystem.id,
    contractNumber:state.contractSystem.contractNumber,
    businessOpportList:state.contractSystem.businessOpportList,
    selectContract:state.contractSystem.selectContract,
    receiptList:state.contractSystem.receiptList,
    totalAmount:state.contractSystem.totalAmount,
    totalAmountBack:state.contractSystem.totalAmountBack,
    residue:state.contractSystem.residue,
    bill_hasBillMoney:state.contractSystem.bill_hasBillMoney,
    bill_residue:state.contractSystem.bill_residue,
    bill_totalAmount:state.contractSystem.bill_totalAmount,
    userId:state.contractSystem.userId,
    billList:state.contractSystem.billList,
    operationLogList:state.contractSystem.operationLogList,
    selectPayment:state.contractSystem.selectPayment,
    nameList:state.clientSystem.nameList,
    deleteReceipt:state.contractSystem.deleteReceipt,
    insertPayment:state.contractSystem.insertPayment,
    selectBill:state.contractSystem.selectBill,
    updateBill:state.contractSystem.updateBill,
    log_page: state.contractSystem.log_page,
    meterial_page: state.contractSystem.meterial_page,
    subsidiaryList:state.contractSystem.subsidiaryList,
    collecContractAmount:state.contractSystem.collecContractAmount,
    subsidiaryAmount:state.contractSystem.subsidiaryAmount,
    amountBacks:state.contractSystem.amountBack,
    contractSystem:state.contractSystem,
    productList:state.contractSystem.productList,
    meterialList:state.contractSystem.meterialList,
  }
})

class ContractDetail extends Component {
  constructor(props) {
    super(props)
    this.status = "" //合同状态
    this.z_msg = [] //添加回执-附件
    this.f_msg = [] //添加发票/附件
    this.d_msg = [] //合同资料明细/附件
    this.files = null
    this.extraCommission = 0
    this.isAddcommission = false
    this.commissionList = []
    this.commissionList2 = []
    this.fileList = [{
          title: '附件类别名称',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '附件列表',
          dataIndex: 'money',
          key: 'money',
       }, {
          title: '操作',
          key: 'operation',
          render: (text, record) => (
            <Upload {...props}
            showUploadList={false}
            >
              <span style={{color:'#1ABC9C',cursor:'pointer'}} title="上传">上传</span>
            </Upload>
          ),
    }];
    this.subsidiaryList = [{
          title: '合同号',
          dataIndex: 'contractNumber',
          key: '1',
          render: (text, record) =>{
            const url = `/CRM/contract/detail/?type=0&contractNumber=${record.contractNumber}&id=${record.id}&customerId=${record.customerId}&topName=子公司合同&from=subsidiary`
             return (
                <a style={{position: 'relative'}} onClick={(e)=>{
            e.preventDefault()
            newWindow(url, record.contractNumber)
          }}>{record.contractNumber}</a>
              )
          },
         }, {
          title: '子公司名称',
          dataIndex: 'customerName',
          key: '2',
         }, {
          title: '合同签订日期',
          dataIndex: 'contractDate',
          key: '3',
          render: (text, record) => {
            return text ? moment(text).format("YYYY-MM-DD") : ''
          },
        }, {
          title: '合同金额',
          dataIndex: 'totalAmount',
          key: '4',
        }, {
          title: '备注',
          dataIndex: 'remark',
          key: '5',
        }, {
          title: '操作',
          key: '6',
            render: (text, record) => (
                <div>
                    <span title="删除" onClick={()=>this.operateSubsidiary("delete",record.id)} style={{color:'#1ABC9C',cursor:'pointer'}}>删除</span>
                </div>
            ),
       }],
    this.paymentList = [{
          title: '回执日期',
          dataIndex: 'receiptDate',
          key: 'receiptDate',
          render: (text, record) => {
            return text ? moment(text).format("YYYY-MM-DD") : ''
          },
         }, {
          title: '回执金额',
          dataIndex: 'amountReceipt',
          key: 'amountReceipt',
         }, {
          title: '回执填写人',
          dataIndex: 'receiptUser',
          key: 'receiptUser',
        }, {
          title: '回款日期',
          dataIndex: 'arrivalDate',
          key: 'arrivalDate',
        }, {
          title: '回款金额',
          dataIndex: 'amountBack',
          key: 'money',
          render: (text, record) => (
             <span>{record.amountBack ===0?"":record.amountBack}</span>
         ),
        },{
         title: '回款方式',
         dataIndex: 'paymentMethodStr',
         key: 'paymentMethodStr',
        }, {
         title: '回款填写人',
         dataIndex: 'paymentUser',
         key: 'paymentUser',
        }, {
          title: '操作',
          key: 'operation',
          render: (text, record) => (
            <span>
              <span title="查看详情" onClick={()=>this.viewDetail("payment",record.id,record.isAdd)} style={{color:'#1ABC9C',cursor:'pointer'}}>查看详情   </span>
              {/* {record.arrivalDate === "" || record.arrivalDate === null &&
                <span>
                    <span title="删除" onClick={()=>this.deleteReceipt("payment",record.id)} style={{color:'#1ABC9C',cursor:'pointer'}}>  删除</span>
                </span>
              } */}
              {(()=>{
                  if(getUrlParam('type') == 1){
                      if(record.isAdd == 1){
                          return <span title="确认到款" onClick={()=>this.insertPayment("payment",record)} style={{color:'#1ABC9C',cursor:'pointer'}}>  确认到款</span>
                      }
                  }
              })()}
            </span>
          ),
    }];
    this.billList = [{
          title: '申请开票日期',
          dataIndex: 'applyDate',
          key: 'applyDate',
          render: (text, record) => {
            return text ? moment(text).format("YYYY-MM-DD") : ''
          },
         },, {
          title: '是否开票',
          dataIndex: 'isBill',
          key: 'isBill',
          render:(text,record) => {
              if(record.isBill === 0){
                  return <span>否</span>
              }else if(record.isBill === 1){
                  return <span>是</span>
              }else{
                  return <span>否</span>
              }
          },
         }, {
          title: '开票种类',
          dataIndex: 'deliveryName',
          key: 'deliveryName',
          render:(text,record) => {
              if(record.isBill === 1){
                  return <span>{record.deliveryName}</span>
              }
          },
         }, {
          title: '开票日期',
          dataIndex: 'billingDate',
          key: 'billingDate',
          render: (text, record) => {
            return text ? moment(text).format("YYYY-MM-DD") : ''
          },
        }, {
          title: '发票金额',
          dataIndex: 'billingMoney',
          key: 'billingMoney',
          render:(text,record) => {
              if(record.isBill === 1){
                  return <span>{record.billingMoney}</span>
              }
          },
        }, {
          title: '是否寄送',
          dataIndex: 'status',
          key: 'status',
          render:(text,record) => {
              if(record.status === 0){
                  return <span>否</span>
              }else if(record.status === 1){
                  return <span>是</span>
              }else{
                  return <span>否</span>
              }
          },
        },{
         title: '寄送日期',
         dataIndex: 'maildate',
         key: 'maildate',
         render: (text, record) => {
            return text ? moment(text).format("YYYY-MM-DD") : ''
          },
        }, {
         title: '邮寄号',
         dataIndex: 'number',
         key: 'number',
        }, {
          title: '操作',
          key: 'operation',
          render: (text, record) => (
            <span>
              <span onClick={()=>this.viewDetail("receipt",record.id,record.isBill,record.status)} style={{color:'#1ABC9C',cursor:'pointer'}}>查看详情 </span>
              {(()=>{
                 if(getUrlParam('type') == '0'){
                     if(record.isBill == 0){
                         return <span onClick={()=>this.insertBill(record)} style={{color:'#1ABC9C',cursor:'pointer'}}>{permissionNamesHas('sys:fp:add')?"添加发票":""}</span>
                     }
                 }else{
                     if(record.isBill === 1 && record.status == 0){
                         return <span onClick={()=>this.sendInvoice(record.id,record.contractId)} style={{color:'#1ABC9C',cursor:'pointer'}}>寄送发票</span>
                     }
                 }
              })()}
            </span>
          ),
    }];
    this.datumDetail = [{
        title: '资料名称',
        dataIndex: 'meterialName',
        key: 'meterialName',
       }, {
        title: '当前页数/总页数',
        dataIndex: 'page',
        key: 'page',
       }, {
        title: '是否齐全',
        dataIndex: 'complete',
        key: 'complete',
      }, {
        title: '添加时间',
        dataIndex: 'createTime',
        key: 'createTime',
     }, {
       title: '操作',
       key: 'action',
       render: (text, record) => (
         <span>
           <a href={record.annexUrl} target="_blank" style={{color:'#1ABC9C',cursor:'pointer'}}>查看 </a>
           <span onClick={()=>this.viewDetail("datumDetail",record)} style={{color:'#1ABC9C',cursor:'pointer'}}>{getUrlParam('type') === "0"?"":permissionNamesHas('sys:annx:add')?"修改 ":""}</span>
           <span onClick={()=>this.deleteDatumdetail(record)} style={{color:'#1ABC9C',cursor:'pointer'}}>{getUrlParam('type') === "0"?"":permissionNamesHas('sys:annx:add')?"删除":""}</span>
         </span>
       ),
   }]
   this.datumDetailList=[
       {"title":"营业执照","page":"当前1/12","isFull":"是","addTime":"2018-11-11"},
       {"title":"营业执照","page":"当前1/12","isFull":"是","addTime":"2018-11-11"},
       {"title":"营业执照","page":"当前1/12","isFull":"是","addTime":"2018-11-11"},
   ]
    this.operationLogList = [{
          title: '动作',
          dataIndex: 'title',
          key: 'title',
         }, {
          title: '操作内容',
          dataIndex: 'content',
          key: 'content',
         }, {
          title: '操作人',
          dataIndex: 'userName',
          key: 'userName',
        }, {
          title: '操作人部门',
          dataIndex: 'departmentName',
          key: 'billingMoney',
        },{
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime',
        },
    ];
  }
  static propTypes = {
  }
  state = {
      credentialsList:[
       {"name":"营业执照","list":""},
       {"name":"身份证","list":""},
       {"name":"照片","list":""},
       {"name":"订单协议","list":""},
       {"name":"发票","list":""},
       {"name":"其他","list":""},
   ],
    commissionList:[],
    addCommissionList:[],
    commissionLength:1,
    hideMessage:false,//隐藏删除文件消息提示信息
    contractMod_visible: false,//执行合同Moddal
    receiptMod_visible: false,//添加回执Modal
    receiptDetailMod_visible:false,//发票详情Modal
    sendInvoiceMod_visible:false,//寄送发票Modal
    paymentDetailMod_visible:false,//回执/到款信息详情Modal
    insertPaymentMod_visible:false,//新增回款Modal
    insertSubcontractMod_visible:false,//添加子合同账号Modal
    updateSubcontractMod_visible:false,//修改子合同信息Modal
    appleReceiptMod_visible:false,//申请开票Modal
    bShowCommission:false,//是否显示佣金
    chineseName:"",//
    mod_title:"执行合同",
    moduleText:"合同执行之后",
    moduleText2:"立即生效",
    moduleText3:"，请谨慎操作！是否执行所选合同？",
    startTime:"",//合同开始时间
    endTime:"",//合同结束时间
    status:"",//合同状态
    contractDate:"",//合同签订日期
    isContract:"",//合同类型
    relationNumber:"",//关联合同编号
    srSource:"",//合同收入来源
    contracDes:"",//合同描述详情
    totalAmount:"",//合同总金额

    amountReceipt:"",//本次回执金额
    paymentMethod:"",//回款方式
    receiptDate:"",//回执日期
    remarks:"",//备注
    ids:"",//附件id

    receiptId:"",//发票id
    mailUserId:"",//寄送人
    addressee:"",//收件人
    address:"",//收件人地址
    phone:"",//收件人电话
    company:"",//快递公司
    number:"",//邮寄单号
    maildate:"",//邮寄日期
    remarks:"",//备注
    z_msg:[],
    isFirst:true,
    d_meterialId:"1",
    isComplete:"1",
    annexImg:"",
    datumDetailModTitle:"新增合同资料明细",
    bCanupload:false,
    isSpecialticket:true,
    changeAppendix:false,
    appendixId:"",

    columns: [],
    appendixList:[
        {
          key: '1',
          name: '营业执照',
          money: '营业执照.jpg',
        }, {
          key: '2',
          name: '身份证',
          money: '身份证.jpg',
        }, {
          key: '3',
          name: '照片',
          money: '-',
      },{
        key: '4',
        name: '订单协议',
        money: '订单协议.pdf',
      }, {
        key: '5',
        name: '发票',
        money: '-',
      }, {
        key: '6',
        name: '其他',
        money: '-',
    }],
    bShowRelationNumber:true,//显示关联合同编号输入框
    subsidiaryContractNumber:"",//子合同账号编号
    bShowsubmitBtn:true,//控制提交按钮的显示额隐藏
    bPaymentdateDisable:true,//控制回执信息 查看详情(到款日期和到款金额)是否可以操作
  }
  componentWillMount(){
      var id = getUrlParam('id');
      var customerId = getUrlParam('customerId');
      //获取合同编号和对应商机
      this.props.dispatch(getContractNumber({
          customerId: customerId,
          type:1,
      }))

      //获取合同信息
      this.props.dispatch(selectContractAndProduct({id:id}))

      //子公司合同信息
      this.props.dispatch(selectSubsidiaryList({contractID:id}))

      //获取回执/到款信息
      this.props.dispatch(selectReceiptList({contractID:id}))

      //发票/寄送记录
      this.props.dispatch(selectBillList({contractID:id}))

      //合同资料明细
      this.props.dispatch(selectContractMeterialPage({contractID:id}))

      //操作记录
      this.props.dispatch(selectContractOperationLog({contractID:id}))

      const crm = store.get('crm')
        let code = ''
        if (crm && crm.user && crm.user.department) {
        code = crm.user.department.deptCode
     }
      //查询所有人
      this.props.dispatch(selectAllCheneseName({code}))
  }
  componentDidMount(){
  }
  componentWillUnmount(){
  }
  //Input变化
  handleInputChange(e,v,i) {
      //添加回执
      if(v === "z_amountReceipt"){
          this.setState({
              z_amountReceipt:e.target.value,
          })
      }else if(v == "z_remarks"){
          this.setState({
              z_remarks:e.target.value,
          })
      }

      //添加回执-查看详情
      if(v === "p_amountBack"){
          this.setState({
              p_amountBack:e.target.value,
              p_amountBackChange:true,
          })
      }else if(v === "p_amountReceipt"){
          this.setState({
              p_amountReceipt:e.target.value,
              p_amountReceiptChange:true,
          })
      }else if(v === "p_money"){
          this.setState({
              p_money:e.target.value,
              p_moneyChanage:true,
          })
      }else if(v === "p_remarks"){
          this.setState({
              p_remarks:e.target.value,
              p_remarksChange:true,
          })
      }
      else if(v === "p_recRemarks"){
          this.setState({
              p_recRemarks:e.target.value,
              p_recRemarksChange:true,
          })
      }



      if(v === "contractNumber"){//合同编号
          this.setState({
            contractNumber: e.target.value,
          })
      }else if(v === "customerName"){//对应客户
          this.setState({
            customerName: e.target.value,
            u_customerNameChange: true,
          })
      }else if(v === "totalAmount"){//合同总金额
          this.setState({
            totalAmount: e.target.value,
            u_totalAmountChange:true,
          })
      }else if(v === "relationNumber"){//关联合同编号
          this.setState({
            relationNumber: e.target.value,
            u_relationNumberChange:true,
          })
      }else if(v === "contracDes"){//合同描述
          this.setState({
            contracDes: e.target.value,
            u_contracDesChange:true,
          })
      }else if(v === "status"){
          this.setState({
            status: e.target.value,
          })
      }else if(v === "isContract"){
          this.setState({
            isContract: e.target.value,
          })
      }

      if(v === "mailUserId"){
          this.setState({
              mailUserId:e.target.value,
          })
      }else if(v === "addressee"){
          this.setState({
              addressee:e.target.value,
          })
      }else if(v === "address"){
          this.setState({
              address:e.target.value,
          })
      }else if(v === "phone"){
          this.setState({
              phone:e.target.value,
          })
      }else if(v === "company"){
          this.setState({
              company:e.target.value,
          })
      }else if(v === "number"){
          this.setState({
              number:e.target.value,
          })
      }



      if(v === "i_headUp"){
          this.setState({
              i_headUp:e.target.value,
          })
      }else if(v === "i_dutyParagraph"){
          this.setState({
              i_dutyParagraph:e.target.value,
          })
      }else if(v === "i_invoiceNumber"){
          this.setState({
              i_invoiceNumber:e.target.value,
          })
      }else if(v === "i_bankAccounts"){
          this.setState({
              i_bankAccounts:e.target.value,
          })
      }else if(v === "i_addressPhone"){
          this.setState({
              i_addressPhone:e.target.value,
          })
      }else if(v === "i_billingMoney"){
          this.setState({
              i_billingMoney:e.target.value,
          })
      }else if(v === "i_deliveryType"){
          this.setState({
              i_deliveryType:e.target.value,
          })
      }else if(v === "i_drawer"){
          this.setState({
              i_drawer:e.target.value,
          })
      }

      if(v === "b_amountReceipt"){
          this.setState({
              b_amountReceipt:e.target.value,
          })
      }else if(v === "i_money"){
          this.setState({
              iMoneyChange:true,
          })
          this.commissionList[i].money = e.target.value
      }else if(v === "i_money2"){
          this.commissionList2[i].money = e.target.value
      }else if(v === "b_remarks"){
          this.setState({
              b_remarks:e.target.value,
          })
      }else if(v === "b_amountBack"){
          this.setState({
              b_amountBack:e.target.value,
          })
      }

      if(v === "u_headUp"){
          this.setState({
              bHeadUpchange:true,
              u_headUp:e.target.value,
          })
      }else if(v === "u_dutyParagraph"){
          this.setState({
              bDutyParagraphchange:true,
              u_dutyParagraph:e.target.value,
          })
      }else if(v === "u_invoiceNumber"){
          this.setState({
              bInvoiceNumberchange:true,
              u_invoiceNumber:e.target.value,
          })
      }else if(v === "u_bankAccounts"){
          this.setState({
              bBankAccountschange:true,
              u_bankAccounts:e.target.value,
          })
      }else if(v === "u_addressPhone"){
          this.setState({
              bAddressPhonechange:true,
              u_addressPhone:e.target.value,
          })
      }else if(v === "u_billingMoney"){
          this.setState({
              bBillingMoneychange:true,
              u_billingMoney:e.target.value,
          })
      }else if(v === "u_addressee"){
          this.setState({
              bAddresseechange:true,
              u_addressee:e.target.value,
          })
      }else if(v === "u_address"){
          this.setState({
              bAddresschange:true,
              u_address:e.target.value,
          })
      }else if(v === "u_phone"){
          this.setState({
              bPhonechange:true,
              u_phone:e.target.value,
          })
      }else if(v === "u_company"){
          this.setState({
              bCompanychange:true,
              u_company:e.target.value,
          })
      }else if(v === "u_number"){
          this.setState({
              bNumberchange:true,
              u_number:e.target.value,
          })
      }else if(v === "u_remarks"){
          this.setState({
              bRemarkschange:true,
              u_remarks:e.target.value,
          })
      }

      if(v === "s_addressee"){
          this.setState({
              s_addressee:e.target.value,
          })
      }else if(v === "s_address"){
          this.setState({
              s_address:e.target.value,
          })
      }else if(v === "s_phone"){
          this.setState({
              s_phone:e.target.value,
          })
      }else if(v === "s_number"){
          this.setState({
              s_number:e.target.value,
          })
      }else if(v === "s_remarks"){
          this.setState({
              s_remarks:e.target.value,
          })
      }

      if(v === "insert_subsidiary"){
          this.setState({
              subsidiaryContractNumber:e.target.value,
          })
      }else if(v === "insert_remark"){
          this.setState({
              subsidiaryRemark:e.target.value,
          })
      }

      if(v === "a_receiptMoney"){
          this.setState({
              a_receiptMoney:e.target.value,
          })
      }else if(v === "a_head"){
          this.setState({
              a_head:e.target.value,
          })
      }else if(v === "a_dutyParagraph"){
          this.setState({
              a_dutyParagraph:e.target.value,
          })
      }else if(v === "a_bankofDeposit"){
          this.setState({
              a_bankofDeposit:e.target.value,
          })
      }else if(v === "a_addrPhone"){
          this.setState({
              a_addrPhone:e.target.value,
          })
      }

      if(v === "d_totalPage"){
        this.setState({
            d_totalPage:e.target.value,
        })
      }else if(v === "d_currentPage"){
        this.setState({
            d_currentPage:e.target.value,
        })
      }

  }
  //DatePicker变化
  onEndChange = (value,dateString,v) => {

      //添加回执
      if(v === "z_receiptDate"){
          this.setState({
            z_receiptDate: dateString,
          })
      }

      if(v === "startTime"){
          this.setState({
            startTime: dateString,
            u_startTimeChange:true,
          })
      }else if(v === "endTime"){
          this.setState({
            endTime: dateString,
            u_endTimeChange:true,
          })
      }else if(v === "contractDate"){
          this.setState({
            contractDate: dateString,
            u_contractDateChange:true,
          })
      }else if(v === "p_receiptDate"){
          this.setState({
            p_receiptDate: dateString,
            p_receiptDateChange:true,
          })
      }else if(v === "maildate"){
          this.setState({
            maildate: dateString,
          })
      }else if(v === "p_arrivalDate"){
          this.setState({
              p_arrivalDateChange: true,
              p_arrivalDate: dateString,
          })
      }

      if(v === "i_billingDate"){
          this.setState({
            i_billingDate: dateString,
            billingDateChange:true,
          })
      }

      if(v === "b_receiptDate"){
          this.setState({
            b_receiptDate: dateString,
          })
      }else if(v === "b_arrivalDate"){
          this.setState({
            b_arrivalDate: dateString,
          })
      }

      if(v === "u_applyDate"){
          this.setState({
            u_applyDate: dateString,
            u_applyDateChange: true,
          })
      }else if(v === "u_billingDate"){
          this.setState({
            u_billingDate: dateString,
            u_billingDateChange: true,
          })
      }else if(v === "u_maildate"){
          this.setState({
             u_maildateChange: true,
             u_maildate: dateString,
          })
      }
      if(v === "s_maildate"){
          this.setState({
            s_maildate: dateString,
          })
      }

      if(v === "a_applyDate"){
          this.setState({
            a_applyDate: dateString,
          })
      }


  }
  //Select变化
  handleChange(value,type,i) {
      //添加回执
      if(type === "z_paymentMethod"){
          this.setState({
              z_paymentMethod:`${value}`,
          })
      }

      //添加回执-详情
      if(type === "p_userId"){
          this.setState({
              p_userId:`${value}`,
          })
      }else if(type === "p_receiptUserId"){
          this.setState({
              p_receiptUserIdChange:true,
              p_receiptUserId:`${value}`,
          })
          this.props.nameList.forEach((v,i)=>{
              if(v.userId == `${value}`){
                  this.setState({
                      p_receiptUserName:v.chineseName,
                  })
              }
          })
          setTimeout({
              p_receiptUserId:false,
          },3000)
      }else if( type == "p_paymentMethod"){
          this.setState({
              p_paymentMethod:`${value}`,
          })
      }else if(type === "p_commission"){
          this.setState({
              p_commission:`${value}`,
              p_commissionChange:true,
          })
          if(`${value}` == 1){
              this.setState({
                  bShowCommission:true,
                  p_commissionText:"是",
              })

              var info={"userId":"","money":""}
              this.commissionList = []
              this.isAddcommission = true
              this.commissionList2.push(info)
              this.state.addCommissionList.push(info);

          }else {
              this.setState({
                  bShowCommission:false,
                  p_commissionText:"否",
                  commissionLength:1,
              })
              this.isAddcommission = false
              this.state.addCommissionList = [];
              this.commissionList = [];
              this.commissionList2 = [];
              this.props.selectBill.commissionList = [];
          }
      }


      //修改合同内容
     if(type === "businessId"){//对应商机
          this.setState({
              businessId:`${value}`,
              u_businessIdChangae:true,
          })
      }else if(type === "status"){//合同状态
          this.setState({
              status:`${value}`,
              u_statusChange:true,
          })
      } else if(type === "isContract"){//合同类型
           this.setState({
               isContract:`${value}`,
               u_isContractChange:true,
           })
           if(3 == `${value}`){
                 this.setState({
                     bShowRelationNumber:true,
                 })
                 this.props.selectContract.isContract = 3
                 this.props.contractSystem.contractType = 0
            }
            if(2 == `${value}`){
                  this.setState({
                      bShowRelationNumber:false,
                      relationNumber:"",
                  })
                  this.props.selectContract.isContract = 2
                  this.props.contractSystem.contractType = 1
             }
            if(1 == `${value}`){
                 this.setState({
                     bShowRelationNumber:false,
                     relationNumber:"",
                 })
                 this.props.selectContract.isContract = 1
                 this.props.contractSystem.contractType = 0
             }
       }else if(type === "srSource"){//合同收入来源
           this.setState({
               srSource:`${value}`,
               u_srSourceChange:true,
           })
       }

      if(type == "P_receiptUserId"){
          this.setState({
              P_receiptUserId:`${value}`,
          })
      }else if(type == "paymentMethod"){
          this.setState({
              paymentMethod:`${value}`,
          })
      }

      if(type === "b_receiptUser"){
          this.setState({
              b_receiptUser:`${value}`,
              b_receiptUserIdChange:true,
          })
          this.props.nameList.forEach((v,i)=>{
              if(`${value}` == v.userId){
                  this.setState({
                      b_receiptUserName:v.chineseName,
                  })
              }
          })
      }else if(type === "i_userId"){
          this.commissionList[i].userId = `${value}`
      }else if(type === "i_userId2"){
          this.commissionList2[i].userId = `${value}`
      }else if(type === "b_paymentMethod"){
          this.setState({
              b_paymentMethod:`${value}`,
          })
      }

      if(type == "i_deliveryType"){
          this.setState({
              i_deliveryType:`${value}`,
          })
      }else if(type === "i_drawer"){
          this.setState({
              i_drawer:`${value}`,
          })
      }else if(type === "i_financer"){
          this.setState({
              i_financer:`${value}`,
          })
      }else if(type === "i_commission"){
          this.setState({
              bShowCommissionChange:true,
          })
          if(`${value}` == 1){
              this.setState({
                  bShowCommission:true,
                  bShowCommissionText:"是",
              })
              var info={"userId":"","money":""}
              var items = this.state.commissionList
              items.push(info);
              this.commissionList.push(info)
              this.setState({
                  commissionList:items,
              })
          }else {
              this.setState({
                  bShowCommission:false,
                  bShowCommissionText:"否",
                  commissionList:[],
              })
             this.commissionList = []
          }
          this.setState({
              i_commission:`${value}`,
          })
      }

      if(type === "u_deliveryType"){
          this.setState({
              BdeliveryTypeChange:true,
              u_deliveryType:`${value}`,
          })
          setTimeout(()=>{
              this.setState({
                  BdeliveryTypeChange:false,
              })
          },3000)
      }else if(type === "u_drawer"){
          this.setState({
              u_drawer:`${value}`,
          })
      }else if(type === "u_mailUserId"){
          this.setState({
              u_mailUserId:`${value}`,
          })
      }else if(type === "u_company"){
          this.setState({
              u_company:`${value}`,
              uCcompanyChange:true,
          })
      }else if(type === "u_financer"){
          this.setState({
              u_financer:`${value}`,
          })
      }

      if(type === "s_mailUserId"){
          this.setState({
              s_mailUserId:`${value}`,
          })
      }else if(type === "s_company"){
          this.setState({
              s_company:`${value}`,
          })
      }

      if(type === "a_receiptUserId"){
          this.setState({
              a_receiptUserId:`${value}`,
          })
          this.props.nameList.forEach((v,i)=>{
              if(`${value}` == v.userId){
                  this.setState({
                      a_receiptUserName:v.chineseName,
                  })
              }
          })

      }else if(type === "a_receiptType"){
          this.setState({
              a_receiptType:`${value}`,
          })
          console.log(`${value}`);
          if(`${value}` == "1"){
              this.setState({
                  isSpecialticket:true,
              })
          }
          if(`${value}` == "2"){
              this.setState({
                  isSpecialticket:false,
              })
          }
      }

      if(type === "d_meterialId"){
        this.setState({
            d_meterialId :`${value}`,
        })
      }
  }

  onRadioChange = (e) => {
    this.setState({
        isComplete:e.target.value,
    })
  }
  //删除产品
  deleteProduct = (id,text)=>{
        const selectedRowKeys = this.state.data;
        let dataSource = this.state.data;
        // for(let i = selectedRowKeys.length - 1; i >= 0; i--) {
            dataSource.splice(Number.parseInt(text.key)-1, 1);
        // }
        this.setState({
            data: dataSource,
            selectedRowKeys: [],
        })
    }

    //操作子公司合同(修改，删除)
    operateSubsidiary = (type,id) => {
        if(type == "insert"){
            this.setState({
                insertSubcontractMod_visible:true,
            })
        }
        if(type == "delete"){
            this.props.dispatch(deleteSubsidiaryContract({
                id:id,
            })).then((data)=>{
                if(data && data.code ===0){
                    message.success(data.msg)
                    this.props.dispatch(selectSubsidiaryList({
                        contractID:getUrlParam('id'),
                    }))
                }else{
                    if(data){
                        message.error(data.msg)
                    }
                }
            })
        }
    }
    //查看服务
    viewService = (e)=>{
    }
    callback = (activeKey)=>{
        if(activeKey === "1" ){
            this.setState({
                bShowsubmitBtn:true,
            })
        }else{
            this.setState({
                bShowsubmitBtn:false,
            })
        }

        if(activeKey === "5"){
            //操作记录
            this.props.dispatch(selectContractOperationLog({contractID:getUrlParam('id')}))
        }
    }
    clientSelect = ()=>{

    }

    //删除合同资料明细
    deleteDatum = () => {
        this.props.dispatch(deleteContractMeterial({
            id:this.contractMeterial_id,
        })).then((data)=>{
            if(data && data.code ===0){
                //重新获取列表数据
                this.props.dispatch(selectContractMeterialPage({contractID:getUrlParam('id')}))
                return message.success(data.msg);
            }else{
                if(data){
                   return message.error(data.msg);
                }
            }
        })
    }
  //Modal取消事件
  onCancel = ()=> {
          this.setState({
            contractMod_visible: false,
            receiptMod_visible: false,
            receiptDetailMod_visible:false,
            sendInvoiceMod_visible:false,
            paymentDetailMod_visible:false,
            insertBillMod_visible:false,
            insertPaymentMod_visible:false,
            insertSubcontractMod_visible:false,
            appleReceiptMod_visible:false,
            datumDetailMod_visible:false,
            p_paymentMethod:null,
            p_receiptDateChange:false,
            p_amountReceiptChange:false,
            p_receiptUserName:null,
            u_applyDateChange:null,
            u_billingDateChange:null,
            b_receiptUserIdChange:null,
            bShowCommission:false,
            bAddresseechange:false,
            bAddresschange:false,
            bPhonechange:false,
            bNumberchange:false,
            bRemarkschange:false,
            uCcompanyChange:false,
            bShowCommissionChange:false,
            billingDateChnage:false,
            iMoneyChange:false,
            commissionList:[],
            annexImg:"",
        })
        this.z_msg = []
        this.f_msg = []
        this.d_msg = []
        this.isAddcommission = false
        this.commissionList = []
        this.commissionList2 = []
     }
     //Modal确定事件
  //Modal确定事件
  onOk = (type)=> {
      if(type === "contract"){
          this.props.dispatch(updateContractStatus({//修改合同状态 执行合同、暂停服务、终止合同、作废合同
              id:getUrlParam('id'),
              contractNumber:getUrlParam('contractNumber'),
              status:this.status,
          })).then((data)=>{
              if(data && data.code=== 0){
                   message.success(data.msg);
                   this.setState({
                       status:null,
                       contractMod_visible:false,
                   })
                   //重新获取合同资料明细
                   this.props.dispatch(selectContractAndProduct({id:getUrlParam('id')}))
              }else {
                  if(data){
                      message.error(data.msg)
                  }
              }
          })
      }else if(type === "receipt") {
          if(!this.state.z_amountReceipt || this.state.z_amountReceipt == ""){
              return message.error("请输入本次回执金额")
          }else if(this.state.z_amountReceipt && this.state.z_amountReceipt<=0){
              return message.error("回执金额必须大于0")
          }else if(!this.state.z_paymentMethod || this.state.z_paymentMethod == ""){
              return message.error("请选择回执方式")
          }else if(!this.state.z_receiptDate || this.state.z_receiptDate == ""){
              return message.error("请选择回执日期")
          }else {
              // else if(this.z_msg.length == 0){
              //      return message.error("请上传回执附件")
              // }
              this.props.dispatch(insertReceipt({//添加回执信息
                  customerId:getUrlParam('customerId'),
                  contractId:getUrlParam('id'),
                  topicId:this.props.selectContract.topicId,
                  totalAmount:this.props.totalAmount,
                  receipt:this.props.residue,
                  amountReceipt:this.state.z_amountReceipt,
                  paymentMethod:this.state.z_paymentMethod,
                  receiptDate:this.state.z_receiptDate,
                  recRemarks:this.state.z_remarks,
                  ids:this.z_msg,
              })).then((data)=>{
                  if(data && data.code === 0){
                      message.success(data.msg)
                      //获取回执/到款信息
                      this.props.dispatch(selectReceiptList({contractID:getUrlParam('id')}))
                      //清空Modal中数据
                      this.setState({
                          receiptMod_visible:false,
                          z_amountReceipt:"",
                          z_paymentMethod:"",
                          z_receiptDate:"",
                          z_remarks:"",
                      })
                      this.z_msg = []
                      //清空Upload已经上传的文件列表
                      var $jObject = $('.anticon-cross');
                      if($jObject.length>0){
                          this.setState({
                              hideMessage:true,
                          })
                      }
                      setTimeout(()=>{
                          for(var i=0;i<$jObject.length;i++){
                              $('.anticon-cross').click()
                          }
                      },1000)
                      setTimeout(()=>{
                          this.setState({
                              hideMessage:false,
                          })
                      },3000)

                  }else{
                      if(data){
                          message.error(data.msg)
                      }
                  }
              })
          }
      }else if(type === "insertBill") {
          if(!this.state.i_financer || this.state.i_financer == ""){
              return message.error("请选择开票人")
          }else if(!this.state.i_billingDate || this.state.i_billingDate == ""){
              return message.error("请选择开票日期")
          }else if(!this.state.i_deliveryType || this.state.i_deliveryType == ""){
              return message.error("请选择开票种类")
          }else if(!this.state.i_invoiceNumber || this.state.i_invoiceNumber == ""){
              return message.error("请输入发票号")
          }else if(!this.state.i_headUp || this.state.i_headUp == ""){
              return message.error("请输入发票抬头")
          }else if(!this.state.i_dutyParagraph || this.state.i_dutyParagraph == ""){
              return message.error("请输入税号")
          }else if(this.state.i_deliveryType == 1 && (!this.state.i_bankAccounts || this.state.i_bankAccounts == "")){
              return message.error("请输入开户行及账号")
          }else if(this.state.i_deliveryType == 1 && (!this.state.i_addressPhone || this.state.i_addressPhone == "")){
              return message.error("请输入地址、电话")
          }else if(!this.state.i_billingMoney || this.state.i_billingMoney == ""){
              return message.error("请输入开票金额")
          }else if(parseInt(this.state.i_billingMoney)<0){
              return message.error("发票金额不能小于0")
          }else if(parseInt(this.state.i_billingMoney)>this.props.bill_residue){
              return message.error("发票金额不能大于未开发票金额")
          }else if(!this.state.i_commission || this.state.i_commission == ""){
              return message.error("请选择是否有佣金")
          }
          var errorType = 0

          if(this.state.bShowCommission){
              for(var i=0;i<this.commissionList.length;i++){
                  if(!this.commissionList[i].userId || this.commissionList[i].userId == ""){
                     errorType = 1
                  }
                  if(!this.commissionList[i].money || this.commissionList[i].money == ""){
                     errorType = 2
                  }
              }
          }else{
              this.commissionList = []
          }

          if(errorType === 1){
              return message.error("请选择佣金人")
          }else if(errorType === 2){
              return message.error("请输入佣金金额")
          }else{
              this.props.dispatch(addBill({//添加发票
                  id:this.state.billId,
                  contractId:getUrlParam('id'),
                  financer:this.state.i_financer,
                  billingDate:this.state.i_billingDate,
                  deliveryType:this.state.i_deliveryType,
                  invoiceNumber:this.state.i_invoiceNumber,
                  headUp:this.state.i_headUp,
                  dutyParagraph:this.state.i_dutyParagraph,
                  invoiceNumber:this.state.i_invoiceNumber,
                  bankAccounts:this.state.i_bankAccounts||"",
                  addressPhone:this.state.i_addressPhone||"",

                  billingMoney:this.state.i_billingMoney,
                  commission:this.state.i_commission,
                  commissionList:JSON.stringify(this.commissionList),
                  annexList:this.f_msg,
              })).then((data)=>{
                  if(data && data.code === 0){
                      //新增成功 清空modal数据
                      this.setState({
                          insertBillMod_visible:false,
                          i_headUp:"",
                          i_dutyParagraph:"",
                          i_invoiceNumber:"",
                          i_bankAccounts:"",
                          i_addressPhone:"",
                          i_billingMoney:"",
                          i_deliveryType:"",
                          i_billingDate:"",
                          i_drawer:"",
                          bShowCommission:false,
                          billingDateChange:false,
                          commissionList:[],
                          bShowCommissionChange:false,
                      })
                      message.success(data.msg)
                      // this.commissionList = [] //移除
                      //发票/寄送记录
                      this.f_msg = [];
                       //清空Upload已经上传的文件列表
                       var $jObject = $('.anticon-cross');
                       if($jObject.length>0){
                           this.setState({
                               hideMessage:true,
                           })
                       }
                       setTimeout(()=>{
                           for(var i=0;i<$jObject.length;i++){
                               $('.anticon-cross').click()
                           }
                       },1000)
                       setTimeout(()=>{
                           this.setState({
                               hideMessage:false,
                           })
                       },3000)
                      this.props.dispatch(selectBillList({contractID:getUrlParam('id')}))
                  }else{
                      if(data){
                          message.error(data.msg)
                      }
                  }
              })
          }


          // if(this.f_msg.length<1){
          //     return message.error("请上传相关附件")
          // }


      }else if(type === "insertPayment") {
          if(!this.state.b_receiptUserId || this.state.b_receiptUserId == ""){
              return message.error("请选择回执人")
          }else if(!this.state.b_receiptDate || this.state.b_receiptDate == ""){
              return message.error("请选择回执日期")
          }else if(!this.state.b_amountReceipt || this.state.b_amountReceipt == ""){
              return message.error("请输入回执金额")
          }else if(!this.state.b_paymentMethod || this.state.b_paymentMethod == ""){
              return message.error("请选择回款方式")
          }else if(!this.state.b_arrivalDate || this.state.b_arrivalDate == ""){
              return message.error("请选择回款日期")
          }else if(!this.state.b_amountBack || this.state.b_amountBack == ""){
              return message.error("请输入回款金额")
          }else if(parseInt(this.state.b_amountBack) < 0){
              return message.error("回款金额必须大于0")
          }else if(parseInt(this.state.b_amountBack) > this.props.residue){
              return message.error("回款金额超出未回款金额"+this.props.residue)
          }

              this.props.dispatch(insertPayment({//新增回款
                  id:this.state.b_id,
                  contractId:this.state.b_contractId,
                  receiptUserId:this.state.b_receiptUser||this.state.b_receiptUserId,
                  receiptDate:this.state.b_receiptDate,
                  amountReceipt:this.state.b_amountReceipt,
                  paymentMethod:this.state.b_paymentMethod,
                  arrivalDate:this.state.b_arrivalDate || '',
                  amountBack:this.state.b_amountBack,
                  commission:this.state.b_commission||0,
                  remarks:this.state.b_remarks||"",
              })).then((data)=>{
                  if(data && data.code === 0){
                      message.success(data.msg)
                      this.setState({
                          insertPaymentMod_visible:false,
                      })
                      //获取回执/到款信息
                      this.props.dispatch(selectReceiptList({contractID:getUrlParam('id')}))
                  }else{
                      if(data){
                          message.error(data.msg)
                      }
                  }
              })

      }else if(type === "sendInvoice"){//寄送发票
          if(!this.state.s_addressee || this.state.s_addressee == ""){
              return message.error("请输入收件人")
          }else if(!this.state.s_address || this.state.s_address == ""){
              return message.error("请输入收件人地址")
          }else if(!this.state.s_phone || this.state.s_phone == ""){
              return message.error("请输入收件人电话")
          }else if(!this.state.s_company || this.state.s_company == ""){
              return message.error("请选择快递公司")
          }else if(!this.state.s_number || this.state.s_number == ""){
              return message.error("请输入邮寄单号")
          }else if(!this.state.s_maildate || this.state.s_maildate == ""){
              return message.error("请选择邮寄日期")
          }else{
              this.props.dispatch(insertSendBill({
                  id:this.state.receiptId,
                  contractId:this.state.contractId,
                  mailUserId:this.state.s_mailUserId || this.props.userId,
                  addressee:this.state.s_addressee,
                  address:this.state.s_address,
                  phone:this.state.s_phone,
                  company:this.state.s_company,
                  number:this.state.s_number,
                  maildate:this.state.s_maildate,
                  remarks:this.state.s_remarks||"",
              })).then((data)=>{
                  if(data && data.code === 0){
                      message.success(data.msg)
                      this.setState({
                          sendInvoiceMod_visible:false,
                      })
                      //发票/寄送记录
                      this.props.dispatch(selectBillList({contractID:getUrlParam('id')}))
                  }else {
                      if(data){
                          message.error(data.msg)
                      }
                  }
              })
          }

      }else if(type === "payment"){//修改回款回执的详细信息
            this.props.dispatch(updatePayment({
                id:this.props.selectPayment.crmPayment.id,
                contractId:getUrlParam('id'),
                receiptUserId:this.state.p_receiptUserId||this.props.selectPayment.crmPayment.receiptUserId,
                receiptDate:this.state.p_receiptDate||this.props.selectPayment.crmPayment.receiptDate,
                amountReceipt:this.state.p_amountReceipt||this.props.selectPayment.crmPayment.amountReceipt,
                paymentMethod:this.state.p_paymentMethod||this.props.selectPayment.crmPayment.paymentMethod,
                arrivalDate:this.state.p_arrivalDate||this.props.selectPayment.crmPayment.arrivalDate || '' ,
                amountBack:this.state.p_amountBack||this.props.selectPayment.crmPayment.amountBack,
                commission:this.state.p_commission||this.props.selectPayment.crmPayment.commission,
                userId:this.state.p_userId||this.props.selectPayment.crmPayment.userId,
                money:this.state.p_money||this.props.selectPayment.crmPayment.money||"",
                remarks:this.state.p_remarks||this.props.selectPayment.crmPayment.remarks,
                recRemarks:this.state.p_recRemarks||this.props.selectPayment.crmPayment.recRemarks,
            })).then((data)=>{
                if(data && data.code === 0){
                    this.setState({
                        p_paymentMethod:null,
                        paymentDetailMod_visible:false,
                    })
                    message.success(data.msg)
                    //获取回执/到款信息
                    this.props.dispatch(selectReceiptList({contractID:getUrlParam('id')}))
                }else {
                    if(data){
                        return message.error(data.msg);
                    }
                }
            })
      }else if(type === "receiptDetail"){
          if(getUrlParam('type') == 1){
              var allCommission = [];
              // console.log(this.commissionList);
              // console.log(this.commissionList2);
              if(this.isAddcommission){
                   allCommission = this.commissionList.concat(this.commissionList2);
              }else{
                   allCommission = this.commissionList;
              }
              var errorType = 0
              if(this.props.selectBill.crmBill.commission == "1" || this.state.p_commission == "1"){
                  allCommission.forEach((v,i)=>{
                      if (i < 3){
                        if(v.userId === ""){
                            errorType = 1
                       }
                       if(v.money === ""){
                           errorType = 2
                       }
                      }
                  })
              }

              // console.log(allCommission);
              if(errorType === 1){
                  return message.error("请选择佣金人")
              }else if(errorType === 2){
                  return message.error("请输入佣金金额")
              }else{
                  var commission2 = this.state.p_commission||this.props.selectBill.crmBill.commission
                  this.props.dispatch(updateBill({
                      id:this.props.selectBill.crmBill.id,
                      headUp:this.state.u_headUp||this.props.selectBill.crmBill.headUp,
                      dutyParagraph:this.state.u_dutyParagraph||this.props.selectBill.crmBill.dutyParagraph,
                      invoiceNumber:this.state.u_invoiceNumber||this.props.selectBill.crmBill.invoiceNumber,
                      bankAccounts:this.state.u_bankAccounts||this.props.selectBill.crmBill.bankAccounts,
                      addressPhone:this.state.u_addressPhone||this.props.selectBill.crmBill.addressPhone,
                      billingMoney:this.state.u_billingMoney||this.props.selectBill.crmBill.billingMoney,
                      deliveryType:this.state.u_deliveryType||this.props.selectBill.crmBill.deliveryType,
                      billingDate:this.state.u_billingDate||this.props.selectBill.crmBill.billingDate||"",
                      drawer:this.state.u_drawer||this.props.selectBill.crmBill.drawer,
                      financer:this.state.u_financer||this.props.selectBill.crmBill.financer,
                      mailUserId:this.state.u_mailUserId||this.props.selectBill.crmBill.mailUserId,
                      addressee:this.state.u_addressee||this.props.selectBill.crmBill.addressee,
                      address:this.state.u_address||this.props.selectBill.crmBill.address,
                      phone:this.state.u_phone||this.props.selectBill.crmBill.phone,
                      company:this.state.u_company||this.props.selectBill.crmBill.company,
                      number:this.state.u_number||this.props.selectBill.crmBill.number,
                      maildate:this.state.u_maildate?this.state.u_maildate:this.props.selectBill.crmBill.maildate != null?this.props.selectBill.crmBill.maildate:"",
                      remarks:this.state.u_remarks||this.props.selectBill.crmBill.remarks,
                      commission:this.state.p_commission||this.props.selectBill.crmBill.commission,
                      commissionList:commission2 === 0 ? "" : JSON.stringify(allCommission),
                  })).then((data)=>{
                      if(data && data.code === 0){
                          message.success(data.msg)
                          this.isAddcommission = false
                          this.setState({
                              receiptDetailMod_visible:false,
                              bBillingMoneychange:false,
                              bShowCommission:false,
                              bAddresseechange:false,
                              bAddresschange:false,
                              bPhonechange:false,
                              bNumberchange:false,
                              bRemarkschange:false,
                              uCcompanyChange:false,
                              iMoneyChange:false,
                          })
                          this.commissionList = []
                          this.commissionList2 = []

                          this.props.dispatch(selectBillList({contractID:getUrlParam('id')}))
                      }else {
                          if(data){
                              return message.error(data.msg);
                          }
                      }
                  })
              }

          }else{
              this.setState({
                  receiptDetailMod_visible:false,
              })
          }
      }else if(type == "subcontract"){
          if(this.state.subsidiary_id){
              this.props.dispatch(insertSubsidiaryContract({
                  relationNumber:getUrlParam('id')||"",
                  id:this.state.subsidiary_id||"",
                  remark:this.state.subsidiaryRemark||"",
              })).then((data)=>{
                  if(data && data.code === 0){
                      message.success(data.msg)
                      this.setState({
                          insertSubcontractMod_visible:false,
                          subsidiaryContractNumber:"",
                          subsidiary_customerName:"",
                          subsidiary_totalAmount:"",
                          subsidiaryRemark:"",
                      })

                      //子公司合同信息
                      this.props.dispatch(selectSubsidiaryList({contractID:getUrlParam('id')}))
                  }else {
                      if(data){
                          return message.error(data.msg);
                      }
                  }
              })
          }else{
              return message.error("请检查输入的子合同账号编号是否有误");
          }
      }else if(type === "appleReceipt"){//申请开票
          if(!this.state.a_receiptMoney || this.state.a_receiptMoney == ""){
              return message.error("请输入申请开票金额")
          }else if(!this.state.a_receiptUserId || this.state.a_receiptUserId == ""){
              return message.error("请选择申请开票人")
          }else if(!this.state.a_applyDate || this.state.a_applyDate == ""){
              return message.error("请选择申请日期")
          }else if(!this.state.a_receiptType || this.state.a_receiptType == ""){
              return message.error("请选择开票种类")
          }else if(!this.state.a_head || this.state.a_head == ""){
              return message.error("请输入发票抬头")
          }else if(!this.state.a_dutyParagraph || this.state.a_dutyParagraph == ""){
              return message.error("请输入税号")
          }else if((this.state.a_receiptType === "1" && !this.state.a_bankofDeposit) || (this.state.a_receiptType === "1" && this.state.a_bankofDeposit == "")){
              return message.error("请输入开户行及账号")
          }else if((this.state.a_receiptType === "1" && !this.state.a_addrPhone) || (this.state.a_receiptType === "1" && this.state.a_addrPhone == "")){
              return message.error("请输入地址，电话")
          }else{
              this.props.dispatch(insertBill({
                  contractId:getUrlParam('id'),
                  billingMoney:this.state.a_receiptMoney,
                  drawer:this.state.a_receiptUserId,
                  applyDate:this.state.a_applyDate,
                  deliveryType:this.state.a_receiptType,
                  headUp:this.state.a_head,
                  dutyParagraph:this.state.a_dutyParagraph,
                  bankAccounts:this.state.a_bankofDeposit||"",
                  addressPhone:this.state.a_addrPhone||"",
              })).then((data)=>{
                  if(data && data.code === 0){
                      message.success(data.msg)
                      this.setState({
                          appleReceiptMod_visible:false,
                          a_receiptMoney:"",
                          a_head:"",
                          a_dutyParagraph:"",
                          a_bankofDeposit:"",
                          a_addrPhone:"",

                          i_addressPhone:"",
                          i_billingMoney:"",
                          i_billingDate:"",
                          i_drawer:"",
                          a_receiptUserName:null,
                          a_applyDate:null,
                          a_receiptType:null,
                      })
                      //发票/寄送记录
                      this.props.dispatch(selectBillList({contractID:getUrlParam('id')}))
                  }else {
                      if(data){
                          message.error(data.msg)
                      }
                  }
              })
          }
      }else if(type === "datumDetail"){
          if(!this.state.d_meterialId || this.state.d_meterialId == ""){
              return message.error("请选择资料类型")
          }else if(!this.state.d_totalPage || this.state.d_totalPage == ""){
              return message.error("请输入总页数");
          }else if(!this.state.d_currentPage || this.state.d_currentPage == ""){
              return message.error("请输入当前页");
          }else if(this.d_msg.length == 0){
              return message.error("请上传图片");
          }else if(this.state.d_totalPage < this.state.d_currentPage){
            return message.error("当前页不能大于总页数");
          }else if(this.state.d_totalPage < 1){
            return message.error("总页数不能小于1");
          }else if(this.state.d_currentPage < 1){
            return message.error("当前页数不能小于1");
          } else{
              this.props.dispatch(updateContractMeterial({
                  sourceId:getUrlParam('id'),
                  // id:this.state.meterial_id||"",
                  category:this.state.d_meterialId,
                  totalPage:this.state.d_totalPage,
                  currentPage:this.state.d_currentPage,
                  isComplete:this.state.isComplete,
                  id:this.d_msg!=""?this.d_msg:this.state.d_msg,//附件id
              })).then((data)=>{
                  if(data && data.code === 0){
                      message.success(data.msg)
                      this.setState({
                          datumDetailMod_visible:false,
                          d_totalPage:"",
                          d_currentPage:"",
                          isComplete:"1",
                          bCanupload:false,
                      })

                    this.d_msg = []
                    //清空Upload已经上传的文件列表
                    var $jObject = $('.anticon-cross');
                    if($jObject.length>0){
                        this.setState({
                            hideMessage:true,
                        })
                    }
                    setTimeout(()=>{
                        for(var i=0;i<$jObject.length;i++){
                            $('.anticon-cross').click()
                        }
                    },1000)
                    setTimeout(()=>{
                        this.setState({
                            hideMessage:false,
                        })
                    },3000)
                      //重新获取合同资料明细
                      this.props.dispatch(selectContractMeterialPage({contractID:getUrlParam('id')}))
                  }else {
                      if(data){
                          message.error(data.msg)
                      }
                  }
              })
          }
      }
    }
 //删除合同资料明细
 deleteDatumdetail = (record) => {
     Modal.confirm({
       title: '确认是否删除该资料?',
       content: '',
       okText: '删除',
       cancelText: '取消',
       onOk: this.deleteDatum,
       okType: 'danger',
     })
     this.contractMeterial_id = record.id;
 }
  //操作合同
  operateAgree = (action)=>{
      if("submit" != action){
          this.setState({
            contractMod_visible: true,
          })
      }
      if("carry" === action){
              this.setState({mod_title:"执行合同",
                            moduleText:"合同执行之后",
                            moduleText2:"立即生效",
                            moduleText3:"，请谨慎操作！是否执行所选合同？",
                                })
             this.status = 1
      }else if("suspend" === action){
              this.setState({mod_title:"暂停服务",
                            moduleText:"暂停服务之后将",
                            moduleText2:"暂停服务",
                            moduleText3:"，请谨慎操作！是否暂停服务所选合同？",
                                })
             this.status = 2
       }else if("stop" === action){
              this.setState({mod_title:"终止合同",
                            moduleText:"合同终止之后将",
                            moduleText2:"终止服务",
                            moduleText3:"，请谨慎操作！是否终止所选合同？",
                                })
             this.status = 0
       }else if("pass" === action){
             this.setState({mod_title:"作废合同",
                         moduleText:"合同作废之后将",
                         moduleText2:"作废数据",
                         moduleText3:"，请谨慎操作！是否作废所选合同？",
                             })
             this.status = 5
       }else if("submit" === action){
           var m_startTime = this.state.startTime||this.props.selectContract.startTime
           var m_endTime = this.state.endTime||this.props.selectContract.endTime
           var m_status = this.state.status||this.props.selectContract.status
           if(this.state.u_customerNameChange && this.state.customerName == ""){
               return message.error("请输入对应客户")
           }else if(this.state.u_businessIdChangae && this.state.businessId == ""){
               return message.error("请选择对应商机")
           }else if(this.state.u_totalAmountChange && this.state.totalAmount == ""){
               return message.error("请输入合同总金额")
           }else if(this.state.u_startTimeChange && this.state.startTime == ""){
               return message.error("请选择合同开始日期")
           }else if(this.state.u_endTimeChange && this.state.endTime == ""){
               return message.error("请选择合同结束日期")
           }else if(this.state.u_statusChange && this.state.status == ""){
               return message.error("请选择合同状态")
           }else if(this.state.u_contractDateChange && this.state.contractDate == ""){
               return message.error("请选择合同签订日期")
           }else if(this.state.isContract && this.state.isContract == ""){
               return message.error("请选择合同类型")
           }else if(this.state.srSource && this.state.srSource == ""){
               return message.error("请选择合同收入来源")
           }else if(this.state.u_contracDesChange && this.state.contracDes == ""){
               return message.error("请输入合同描述")
           }else if(!this.state.startTime && this.props.selectContract.startTime == null){
               return message.error("请选择合同开始日期")
           }else if(!this.state.endTime && this.props.selectContract.endTime == null){
               return message.error("请选择合同结束日期")
           }else if(!this.state.contractDate && this.props.selectContract.contractDate == null){
               return message.error("请选择合同签订日期")
           }else if(getBigDate(m_startTime,m_endTime) === 1){
               return message.error("合同开始日期应小于合同结束日期")
           } else{
                if(this.state.isContract == 3 || this.props.selectContract.isContract == 3){
                if (!(this.state.relationNumber||this.props.selectContract.relationNumber)) {
                     return message.error('请填写关联合同编号');
                }
            }
               this.props.dispatch(updateContract({
                   id:getUrlParam('id'),
                   userId:this.props.userId,
                   customerName:this.state.customerName||this.props.selectContract.customerName,
                   customerId:getUrlParam('customerId'),
                   businessId:this.state.businessId||this.props.selectContract.businessId,
                   totalAmount:this.state.totalAmount||this.props.selectContract.totalAmount,
                   startTime:this.state.startTime||this.props.selectContract.startTime,
                   endTime:this.state.endTime||this.props.selectContract.endTime,
                   status:this.state.status||this.props.selectContract.status,
                   contractDate:this.state.contractDate||this.props.selectContract.contractDate,
                   isContract:this.state.isContract||this.props.selectContract.isContract,
                   relationNumber:this.state.relationNumber||this.props.selectContract.relationNumber,
                   srSource:this.state.srSource||this.props.selectContract.srSource,
                   contracDes:this.state.contracDes||this.props.selectContract.contracDes,
               })).then((data)=>{
                   if(data && data.code === 0){
                       message.success(data.msg)
                   }else {
                       if(data){
                           return message.error(data.msg);
                       }
                   }
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
               if(productList.length != 0){
                   this.props.dispatch(updateProductById({
                       productList: JSON.stringify(productList),
                   }))
               }
           }
       }
    }
  //渲染头部
  renderHeaser = () => {
      return (
        <TableHeader
          dataSource={this.props.contractSystem.columns}
          menuSure={this.menuSure}
          upLoadFail={this.upLoadFail}
          submitMoreAudit={this.submitMoreAudit}
          exportDoc={this.exportTable}
          type="contract"
          />
      )
    }
  //接口返回tips
  actionTips = (data)=> {
        if(data && data.code=== 0){
            return message.success(data.msg);
        }else {
            if(data){
                message.error(data.msg)
            }
        }
    }
    //查看详情
    viewDetail = (type,id,isBill,status) => {
        if(type === "receipt"){
            this.isBill = isBill;
            this.sendStatus = status;
            this.props.dispatch(selectBill({
                id:id,
            })).then((data)=>{
               if(data && data.code ===0){
                   if(data.data && data.data.crmBill){
                       this.setState({
                           p_commission:data.data.crmBill.commission,
                       })
                   }
                   if(data.data && data.data.commissionList){
                       data.data.commissionList.forEach((v,i)=>{
                           if(i<3){
                               var info={"userId":"","money":""}
                               this.commissionList.push(info)
                               this.commissionList[i].userId = v.userId;
                               this.commissionList[i].money = v.money;
                           }
                       })
                   }
               }
            })
            this.setState({
                receiptDetailMod_visible:true,
            })
        }else if(type === "payment"){
            if(isBill == 1){
                this.setState({
                    bPaymentdateDisable:true,
                })
            }else{
                this.setState({
                    bPaymentdateDisable:false,
                })
            }
            this.props.dispatch(selectPayment({
                id:id,
            })).then((data)=>{
                if(data && data.data){
                    var receiptUserId = data.data.crmPayment.receiptUserId
                    let code = ''
                    const crm = store.get('crm')
                    if (crm && crm.user && crm.user.department) {
                      code = crm.user.department.deptCode
                    }
                    this.props.dispatch(selectAllCheneseName({
                        code,
                        id:data.data.crmPayment.receiptUserId,
                    })).then((data)=>{
                        if(data && data.data){
                        }
                    })
                }
            })
            this.setState({
               paymentDetailMod_visible:true,
            })
        }else if(type === "datumDetail"){
            this.setState({
                datumDetailMod_visible:true,
                datumDetailModTitle:"修改合同资料明细",
                // meterial_id:id.id,
                d_meterialId:id.category,
                d_totalPage:id.totalPage,
                d_currentPage:id.currentPage,
                isComplete:id.isComplete,
                annexImg:"资料图片.png",
                bCanupload:false,
                d_msg:id.id,
                changeAppendix:true,
                appendixId:id.id,
            })
            this.d_msg = id.id;
        }
    }

  //删除操作
  deleteReceipt = (type,id) => {
      if(type === "payment"){
          this.props.dispatch(deleteReceipt({
              id:id,
          })).then((data)=>{
              if(data && data.code=== 0){
                  message.success(data.msg);
                  this.props.dispatch(selectReceiptList({
                      contractID:getUrlParam('id'),
                  }))
              }else {
                  if(data){
                      message.error(data.msg)
                  }
              }
          })
      }

  }
  //新增回执
  addReceipt = () => {
      this.setState({
          receiptMod_visible:true,
      })
  }
  //新增合同资料明细
  addDatumDetail = () => {
      this.setState({
          datumDetailMod_visible:true,
          datumDetailModTitle:"新增合同资料明细",
          changeAppendix:false,
          appendixId:"",
      })

  }
  //新增回款
  insertPayment = (type,record) => {
      if(type === "payment"){
          this.setState({
              b_id:record.id,
              b_contractId:record.contractId,
              b_receiptUserId:record.receiptUserId,
              b_receiptDate:record.receiptDate,
              b_amountReceipt:record.amountReceipt,
              b_amountBack:record.amountBack,
              b_paymentMethod:record.paymentMethod,
              b_paymentMethodStr:record.paymentMethodStr,
              insertPaymentMod_visible:true,
          })
      }
  }
  //申请开票
  applyReceipt = () => {
      this.setState({
          appleReceiptMod_visible:true,
      })
  }
  //添加发票
  insertBill = (record) =>{
      this.setState({
          billId:record.id,
          contractId:record.contractId,
          i_financer:this.props.userId,
          i_deliveryType:record.deliveryType,
          i_headUp:record.headUp,
          i_dutyParagraph:record.dutyParagraph,
          i_bankAccounts:record.bankAccounts,
          i_addressPhone:record.addressPhone,
          i_billingMoney:record.billingMoney,
          insertBillMod_visible:true,
      })
  }
  //寄送发票
  sendInvoice = (id,contractId) => {
      this.setState({
          receiptId:id,
          contractId:contractId,
          sendInvoiceMod_visible:true,
      })
  }
  //上传文件改变时的状态
  upLoadChange = (info,type,index) => {
      this.files = info;
    if (info.file.status === 'done') {
      if (info.file.response.code == 0) {
          this.setState({
              z_msg:info.file,
          })
         message.success(`${info.file.name}文件上传成功`)
         switch (type) {
             case "insertReceipt"://添加回执
                this.z_msg.push(info.file.response.msg)
                 break;
             case "insertBill"://新增发票
                this.f_msg.push(info.file.response.msg)
                 break;
            case "updateContractMeterial"://新增合同资料明细
                if(!this.state.changeAppendix){ //如果是修改附件
                    this.d_msg = info.file.response.msg
                }
                 this.setState({
                    annexImg:"",
                    bCanupload:true,
                 })
                 break;
             default:

         }
      } else {
          message.error(`${info.file.name}文件上传失败`)
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}文件上传失败`)
    }
  }
  //移除上次文件
  upLoadRemove = (info,type) => {
      if (info.response && info.response.code == 0) {
          if(!this.state.hideMessage){
              message.success(`${info.name}文件移除成功`)
          }
           switch (type) {
               case "insertReceipt":
               {
                   for(var i=0;i<this.z_msg.length;i++){
                       if(this.z_msg[i] == info.response.msg){
                           this.z_msg.splice(i,1);
                       }
                   }
               }
                break;
                case "insertBill":
                {
                    for(var i=0;i<this.f_msg.length;i++){
                        if(this.f_msg[i] == info.response.msg){
                            this.f_msg.splice(i,1);
                        }
                    }
                }
                 break;
                 case "updateContractMeterial":
                {
                    this.d_msg = [];
                    this.setState({
                        bCanupload:false,
                    })
                }
                 break;
               default:

           }

    } else {
        // message.error(`${info.name}文件移除失败`)
      }
  }
  //添加佣金人
  addCommission = () => {
      this.setState({
          commissionLength:this.state.commissionLength+1,
      })
      var info={"userId":"","money":""}
      this.commissionList.push(info)
      var items = this.state.commissionList
      items.push(info);
      this.setState({
          commissionList:items,
      })
  }
  addCommission2 = () => {
      this.isAddcommission = true;
      this.setState({
          bShowCommission:true,
          hiedaddCommission2:true,
      })
      var info={"userId":"","money":""}
      this.commissionList2.push(info)
      this.state.addCommissionList.push(info);
  }
  addCommission3 = (i) => {
      var info={"userId":"","money":""}
      var items = this.state.addCommissionList
      this.commissionList2.push(info)
      items.push(info)
      this.setState({
          addCommissionList:items,
      })
  }
//log翻页
  pageChange = (pageNum, pageSize) => { // 点击页数
      this.props.dispatch(selectContractOperationLog({
        contractID: getUrlParam('id'),
        pageNum: pageNum,
        pageSize: pageSize,
      }))
  }

  insertProduct = (id,type,salesUserid,serviceUserid) => {
      this.props.dispatch(insertProduct({
          topicId:getUrlParam('topicId') || this.props.selectContract.topicId,
          contractId:getUrlParam('id'),
          userId:this.props.userId,
          salesUserid:salesUserid,
          serviceUserid:serviceUserid,
          productType:type,
          productId:id,
      }))
  }

  onShowSizeChange = (pageNum, pageSize) => { // 点击每页显示个数
      this.props.dispatch(selectContractOperationLog({
          contractID: getUrlParam('id'),
          pageNum: pageNum,
          pageSize: pageSize,
      }))
  }



  handleFocus = () => {
 }
 handleBlur = () => {
     this.props.dispatch(getSubsidiaryContractNumber({
         contractNumber:this.state.subsidiaryContractNumber,
     })).then((data)=>{
         if(data && data.code ===0){
             this.setState({
                 subsidiary_customerName:data.data.customerName,
                 subsidiary_totalAmount:data.data.totalAmount,
                 subsidiary_id:data.data.id,
             })
         }else{
             if(data){
                 message.error(data.msg)
             }
         }
     })
 }

  render() {
      const { columns } = this.state
      const {contractNumber,businessOpportList,selectPayment,nameList,selectBill,userId} = this.props
      const {selectContract,receiptList,billList,totalAmount,totalAmountBack,residue,bill_hasBillMoney,bill_residue,bill_totalAmount,operationLogList,subsidiaryList,collecContractAmount,subsidiaryAmount,amountBacks,meterialList} = this.props


      var statusDefault = "请选择合同状态" //合同状态
      var isContractDefault = "请选择合同类型" //合同类型
      var srSourceDefault = "请选择合同收入来源" //合同收入来源

      var paymentMethodStr = "未知"
      var amountBack = "请输入"
      if(selectPayment && selectPayment.crmPayment){
          switch (selectPayment.crmPayment.paymentMethodStr) {
              case 1:
                  paymentMethodStr = "支付宝"
                  break;
              case 2:
                  paymentMethodStr = "微信"
                  break;
              case 3:
                   paymentMethodStr = "银行卡"
                  break;
              default:
                   paymentMethodStr = "未知"
          }
          if(selectPayment.crmPayment.amountBack === 0){
              amountBack = "请输入"
          }else{
              amountBack = selectPayment.crmPayment.amountBack
          }
      }

      const rowSelection = {
        onChange: this.onSelectChange,
        getCheckboxProps: this.getCheckboxProps,
      }
      const dateFormat = 'YYYY-MM-DD';
      const type = getUrlParam('type');

      const { log_page } = this.props
      let pagination = {
        onChange: this.pageChange,
        onShowSizeChange: this.onShowSizeChange,
        total: log_page.total,
        defaultCurrent: log_page.pageNum,
        pageSize: log_page.pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
      }
      const { meterial_page } = this.props
      let pagination2 = {
        onChange: this.pageChange,
        onShowSizeChange: this.onShowSizeChange,
        total: meterial_page?meterial_page.total:1,
        defaultCurrent: meterial_page?meterial_page.pageNum:1,
        pageSize:meterial_page? meterial_page.pageSize:10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]}条数据  共${total} 条`,
      }
      var subsidiaryColumns = this.subsidiaryList
      // subsidiaryColumns.forEach((item, index) => {
      //   if(item.dataIndex === 'contractNumber'){
      //     subsidiaryColumns[index].render = (text, record) => {
      //       const url = `/CRM/contract/detail/?type=0&contractNumber=${record.contractNumber}&id=${record.id}&customerId=${record.customerId}&topName=子公司合同`
      //       return <ColumnRender.NewTable _blank text={text} url={url} />
      //     }
      //   }
      // })
      var disabled = false;
      if(getUrlParam('type')==1){
          disabled = false;
      }else {
          disabled = true;
      }

      var defaultApplyUserName = "请选择"
      if(nameList){
          nameList.forEach((v,i)=>{
              if(v.userId == this.props.userId){
                 defaultApplyUserName = v.chineseName;
              }
          })
      }
      if(userId && this.state.isFirst){
          this.state.a_receiptUserId = userId;
          this.state.isFirst = false;
      }
      if(selectContract){
          if(selectContract.isContract === 2){
              this.props.contractSystem.contractType = 1;
          }else{
              this.props.contractSystem.contractType = 0;
          }
      }

      const props = {
        name: 'file',
        showUploadList: true,
        accept: '.rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png,.xlsx',
        action: baseURL() + '/crm/uploadFile',
        multiple:true,//是否支持多选文件，
        data:{
            id:this.state.appendixId||"",
        },
        headers: {
          'X-Requested-With': null,
         },
         withCredentials:true,
      };
    return (
      <Layout>
        <Wrap>
        <div className={style.MyClueWrap}>
          <div className={style.head}>
          {selectContract &&
              <div className={style.operateAgree}>

                 {selectContract.status.toString() === '3'?
                 <Button type="ghost" className={this.state.bShowsubmitBtn?style.button:style.hidebutton} disabled={selectContract.status == 3 || (getUrlParam('type')==1 ? selectContract.status == 5 ? false : true : false) || getUrlParam('from')=="subsidiary" ? false:true}
                 onClick={()=>this.operateAgree("submit")}>提交</Button>:
                    permissionNamesHas('sys:contract:upd')?
                    <Button type="ghost" className={this.state.bShowsubmitBtn?style.button:style.hidebutton} disabled={selectContract.status == 3 || (getUrlParam('type')==1 ? selectContract.status == 5 ? false : true : false) || getUrlParam('from')=="subsidiary" ? false:true}
                    onClick={()=>this.operateAgree("submit")}>提交</Button>:null
                 }
                 {permissionNamesHas('sys:contract:implement')?
                    <Button type="ghost" disabled={selectContract.status == 5 ? true:false} className={getUrlParam('type')==1?style.button:style.hidebutton} onClick={()=>this.operateAgree("carry")}>执行合同</Button>:null
                 }
                 {permissionNamesHas('sys:contract:suspend')?
                 <Button type="ghost" disabled={selectContract.status == 5 ? true:false} className={getUrlParam('type')==1?style.button:style.hidebutton} onClick={()=>this.operateAgree("suspend")}>暂停服务</Button>:null
                 }
                 {permissionNamesHas('sys:contract:termination')?
                 <Button type="ghost" disabled={selectContract.status == 5 ? true:false} className={getUrlParam('type')==1?style.button:style.hidebutton} onClick={()=>this.operateAgree("stop")}>终止合同</Button>:null
                 }
                 {permissionNamesHas('sys:contract:void')?
                 <Button type="ghost" disabled={selectContract.status == 5 ? true:false} className={getUrlParam('type')==1?style.button:style.hidebutton} onClick={()=>this.operateAgree("pass")}>作废合同</Button>:null
                 }
             </div>
          }
          </div>
          <ContentWrap style={{ borderTop: 'none' }}>
            <div className={style.listHeader}>
              <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="合同信息" key="1">
                    {selectContract &&
                    <div>
                        <div className={style.contractInfo}>
                            <ul className={style.items}>
                                <li>
                                    <span className={style.label}><span className={style.star}>*</span>合同编号：</span>
                                    <Input className={style.input} value={getUrlParam('contractNumber')} disabled={true} placeholder="请输入"></Input>
                                </li>
                                <li>
                                    <div>
                                        <span className={style.label}><span className={style.star}>*</span>对应客户：</span>
                                        <Input className={style.input} disabled={getUrlParam('type')==1?false:true} value={!this.state.u_customerNameChange?selectContract.customerName:this.state.customerName} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'customerName')}></Input>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span className={style.label}><span className={style.star}>*</span>对应商机：</span>
                                        {businessOpportList && businessOpportList.map((v,i)=>{
                                            if(v.id == selectContract.businessId){
                                                return <Select className={style.select} key={i} disabled={getUrlParam('type')==1?false:selectContract.status==3?false:true} onChange={(e)=>this.handleChange(e,'businessId')} defaultValue={v.busNumber}
                                                 filterOption={(input, option) =>option.props.children.indexOf(input.trim()) >= 0} showSearch >
                                                {businessOpportList && businessOpportList.map((v,i)=>{
                                                    return  <Option value={v.id} key={i}>{v.busNumber}</Option>
                                                })}
                                                </Select>
                                            }
                                        })}
                                    </div>
                                </li>
                                <li>
                                    <span className={style.label}><span className={style.star}>*</span>合同总金额：</span>
                                    <Input className={style.input} type="number" disabled={getUrlParam('type')==1?false:selectContract.status==3?false:true} value={!this.state.u_totalAmountChange?selectContract.totalAmount:this.state.totalAmount} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'totalAmount')}></Input>
                                </li>
                                <li>
                                    <div>
                                        <span className={style.label}><span className={style.star}>*</span>合同开始日期：</span>
                                        <DatePicker className={style.dataPicker} defaultValue={selectContract.startTime !=null ? moment(selectContract.startTime, dateFormat):""} disabled={getUrlParam('type')=="1"?false:selectContract.status==3?false:true} onChange={(value,dateString)=>this.onEndChange(value,dateString,'startTime')}/>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span className={style.label}><span className={style.star}>*</span>合同结束日期：</span>
                                        <DatePicker className={style.dataPicker} defaultValue={selectContract.endTime != null ? moment(selectContract.endTime, dateFormat):""} disabled={getUrlParam('type')==1?false:selectContract.status==3?false:true}  onChange={(value,dateString)=>this.onEndChange(value,dateString,'endTime')}/>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                    <span className={style.label}><span className={style.star}>*</span>合同状态：</span>
                                    <DfwsSelect
                                      url={dictUrl()}
                                      showSearch
                                      allowClear={false}
                                      className={style.select}
                                      defaultValue={selectContract.status?selectContract.status.toString():""}
                                      code="ContractStatus"
                                      placeholder="请选择合同状态"
                                      onChange={(e)=>this.handleChange(e,"status")}
                                      style={{ width: 200 }}
                                      disabled={getUrlParam('type')==1?false:true}
                                      value={this.state.status?this.state.status.toString():selectContract.status.toString()}
                                    />
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span className={style.label}><span className={style.star}>*</span>合同签订日期：</span>
                                        <DatePicker className={style.dataPicker} defaultValue={selectContract.contractDate != null ? moment(selectContract.contractDate, dateFormat):""} disabled={getUrlParam('type')=="1"?false:selectContract.status==3?false:true} onChange={(value,dateString)=>this.onEndChange(value,dateString,'contractDate')}/>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                    <span className={style.label}><span className={style.star}>*</span>合同类型：</span>
                                    <Select className={style.select} disabled={(getUrlParam('type')=="1" && selectContract.status==3 && selectContract.customerType==2) ? false:true}
                                    defaultValue={selectContract.isContract?selectContract.isContract.toString():""} onChange={(e)=>this.handleChange(e,'isContract')} placeholder="请选择"  filterOption={(input, option) =>option.props.children.indexOf(input.trim()) >= 0} showSearch >
                                        <Option value="1">单体合同</Option>
                                        <Option value="2">集团版合同</Option>
                                        <Option value="3">子公司合同</Option>
                                    </Select>
                                    </div>
                                </li>
                                {(()=>{
                                    if(this.state.bShowRelationNumber && selectContract.isContract.toString() === "3" ){
                                        return <li>
                                            <span className={style.label}><span className={style.star}>*</span>关联合同编号：</span>
                                            <Input className={style.input} disabled={(getUrlParam('type')=="1" || getUrlParam('from')=="subsidiary")?false:selectContract.status==3?false:true} value={!this.state.u_relationNumberChange?selectContract.relationNumber:this.state.relationNumber} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'relationNumber')}></Input>
                                         </li>
                                    }
                                })()}
                                <li>
                                    <div>
                                        <span className={style.label}><span className={style.star}>*</span>合同收入来源：</span>
                                          <DfwsSelect
                                            showSearch
                                            url={dictUrl()}
                                            defaultValue={selectContract.srSource?selectContract.srSource.toString():""}
                                            className={style.select}
                                            code="SourceOfContractIncome"
                                            placeholder="请选择合同收入来源"
                                            onChange={(e)=>this.handleChange(e,"srSource")}
                                            style={{ width: 200 }}
                                            disabled={getUrlParam('type')=="1"?false:selectContract.status==3?false:true}
                                          />
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={style.productInfo}>
                            <div className={style.clientDescribe}>
                                <div className={style.label}>合同描述：</div>
                                <div style={{width:'61%'}}>
                                    <TextArea className={style.textarea} disabled={getUrlParam('type')==1?false:selectContract.status==3?false:true} value={!this.state.u_contracDesChange?selectContract.contracDes:this.state.contracDes} placeholder="请输入" autosize={{ minRows: 6, maxRows: 8 }}
                                    onChange={(e)=>this.handleInputChange(e,'contracDes')}/>
                                </div>
                            </div>
                            <div className={style.clientDescribe}>
                                <span className={style.label}>产品信息：</span>
                                <div style={{width:'75%'}}>
                                    <Product isContract={this.props.selectContract && this.props.selectContract.isContract} status={selectContract.status} insertProduct={this.insertProduct} id={this.props.id} contractNumber={contractNumber || getUrlParam('contractNumber')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                </TabPane>
                {this.props.selectContract && this.props.selectContract.isContract === 2?
                <TabPane tab="子公司合同" key="2">
                    <div>
                        <div className={style.tableHead}>
                            <Icon type="bars" className={style.bars} />&ensp;数据列表
                            <AuthRequire authName="sys:mycontract:addreturn"><Button className={style.receiptBtn} onClick={()=>this.operateSubsidiary("insert","")}>添加合同子账号</Button></AuthRequire>
                        </div>
                        {receiptList &&
                            <Table columns={this.subsidiaryList} className={style.productTable2} dataSource={subsidiaryList} pagination={false}/>
                        }
                        <div className={style.receivedPayments}>
                            <span className={style.text}>集团合同总金额：<span className={style.returnAmount}>{collecContractAmount}</span>元</span>
                            <span className={style.text}>子公司合同总金额：<span className={style.returnAmount}>{subsidiaryAmount}</span>元</span>
                            <span className={style.text}>子公司合同总回款金额：<span className={style.returnAmount}>{amountBacks}</span>元</span>
                        </div>
                    </div>
                </TabPane>
                :null}
                <TabPane tab={getUrlParam('type') == 0 ? "回执/到款信息" : "回执/回款信息"} key="3">
                    <div>
                        <div className={style.tableHead}>
                            <Icon type="bars" className={style.bars} />&ensp;数据列表
                            {getUrlParam('type') == 0 &&
                            <AuthRequire authName="sys:mycontract:addreturn"><Button className={style.receiptBtn} onClick={()=>this.addReceipt()}>添加回执</Button></AuthRequire>
                            }
                        </div>
                        {receiptList &&
                            <Table columns={this.paymentList} className={style.productTable2} dataSource={receiptList} pagination={false}/>
                        }
                        <div className={style.receivedPayments}>
                            <span className={style.text}>合同金额：<span className={style.returnAmount}>{totalAmount}</span>元</span>
                            <span className={style.text}>已回款金额：<span className={style.returnAmount}>{totalAmountBack}</span>元</span>
                            <span className={style.text}>未回款金额：<span className={style.returnAmount}>{residue}</span>元</span>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="发票/寄送记录" key="4">
                    <div>
                        <div className={style.tableHead}>
                            <Icon type="bars" className={style.bars} />&ensp;数据列表
                            {/* {getUrlParam('type') == 1 &&
                                <Button className={style.receiptBtn} onClick={()=>this.insertBill()}>新增发票</Button>
                            } */}
                            {getUrlParam('type') == 0 &&
                                <Button className={style.receiptBtn} onClick={()=>this.applyReceipt()}>申请开票</Button>
                            }
                        </div>
                        {billList &&
                            <Table columns={this.billList} className={style.productTable2} dataSource={billList} pagination={false}/>
                        }
                        <div className={style.receivedPayments}>
                            <span className={style.text}>合同金额：<span className={style.returnAmount}>{bill_totalAmount}</span>元</span>
                            <span className={style.text}>已开发票金额：<span className={style.returnAmount}>{bill_hasBillMoney}</span>元</span>
                            <span className={style.text}>未开发票金额：<span className={style.returnAmount}>{bill_residue}</span>元</span>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="合同资料明细" key="5">
                    <div>
                        <div className={style.tableHead}>
                            <Icon type="bars" className={style.bars} />&ensp;数据列表
                             {permissionNamesHas('sys:annx:add') && getUrlParam('type') === '1'?
                                 <Button className={style.receiptBtn} onClick={()=>this.addDatumDetail()}>新增合同资料明细</Button>:null
                             }
                        </div>
                        {meterialList &&
                            <Table columns={this.datumDetail} className={style.productTable2} dataSource={meterialList} pagination={pagination2}/>
                        }
                    </div>
                </TabPane>
                <TabPane tab="操作记录" key="6">
                    <div>
                        <div className={style.tableHead}>
                            <Icon type="bars" className={style.bars} />&ensp;数据列表
                        </div>

                        {billList &&
                            <Table columns={this.operationLogList} className={style.productTable2} dataSource={operationLogList} pagination={pagination}/>
                        }
                    </div>
                </TabPane>
              </Tabs>
            </div>
          </ContentWrap>
        </div>
        <Modal title={this.state.mod_title}
          visible={this.state.contractMod_visible}
          onOk={()=>this.onOk('contract')}
          onCancel={this.onCancel}
          width={600}
        >
        <div className={style.moduleText}>
            {this.state.moduleText}<span className={style.specialText}>{this.state.moduleText2}</span>{this.state.moduleText3}
        </div>
        </Modal>

        <Modal title={"添加回执"}
          visible={this.state.receiptMod_visible}
          onOk={()=>this.onOk('receipt')}
          onCancel={this.onCancel}
          width={770}
          destroyOnClose={true}
        >
            <div className={style.addReceipt}>
                <ul className={style.items}>
                    <li>

                        <span className={style.label}><span className={style.star}>*</span>合同总金额：</span>
                        <Input className={style.input} value={totalAmount} type="number" disabled={true}></Input>
                    </li>
                    <li>
                        <span className={style.label}><span className={style.star}>*</span>剩余回执金额：</span>
                        <Input className={style.input} value={residue} type="number" disabled={true}></Input>
                    </li>
                    <li>
                        <span className={style.label}><span className={style.star}>*</span>本次回执金额：</span>
                        <Input className={style.input} value={this.state.z_amountReceipt} type="number" placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'z_amountReceipt')} required></Input>
                    </li>

                    <li>
                        <span className={style.label}><span className={style.star}>*</span>回执方式：</span>
                        <div className={style.dfwsSelect}>
                            <DfwsSelect
                              showSearch
                              url={dictUrl()}
                              code="PaybackMode"
                              placeholder="请选择回执方式"
                              allowClear={false}
                              onChange={(e)=>this.handleChange(e,"z_paymentMethod")}
                              style={{ width: 180 }}
                              value={this.state.z_paymentMethod}
                            />
                        </div>
                    </li>
                    <li>
                        <span className={style.label}><span className={style.star}>*</span>回执日期：</span>
                        <div className={style.dfwsSelect}>
                            <DatePicker allowClear={false} value={this.state.z_receiptDate ? moment(this.state.z_receiptDate, dateFormat):""} onChange={(value,dateString)=>this.onEndChange(value,dateString,'z_receiptDate')}/>
                        </div>
                    </li>
                </ul>
            </div>
            <div className={style.productInfo}>
                <div className={style.clientDescribe}>
                    <span className={style.label}>备注：</span>
                    <TextArea className={style.textarea} value={this.state.z_remarks} placeholder="请输入" autosize={{ minRows: 6, maxRows: 8 }} onChange={(e)=>this.handleInputChange(e,'z_remarks')} required/>
                </div>
            </div>
            <div className={style.productInfo}>
                <div className={style.clientDescribe}>
                        <span className={style.label}>回执附件：</span>
                        <div className={style.upload}>
                            <Dragger
                            {...props}
                            title="点击或拖动文件上传"
                            // fileList={this.state.z_msg}
                            onChange={info => this.upLoadChange(info,"insertReceipt")}
                            onRemove={info => this.upLoadRemove(info,"insertReceipt")}
                            multiple={true}
                            >
                                <Icon type="upload" className={style.bars}/>
                                <div className={style.tip}>点击或拖动文件上传</div>
                                <div className={style.tip2}>支持单个或批量上传。支持上传rar、zip、doc、docx、pdf、jpg、png、xlsx等格式</div>
                            </Dragger>
                        </div>
                </div>
            </div>
        </Modal>
        <Modal title={"查看详情"}
          visible={this.state.receiptDetailMod_visible}
          onOk={()=>this.onOk('receiptDetail')}
          onCancel={this.onCancel}
          width={800}
        >
        {selectBill && selectBill.crmBill &&
            <div className={style.receiptDetail}>
                <div style={{height:'900px'}}>
                    <ul className={style.items}>
                        <li>
                            <span className={style.label}>申请开票金额：</span>
                            <Input className={style.input} placeholder="请输入" type="number" value={this.state.bBillingMoneychange?this.state.u_billingMoney:selectBill.crmBill.billingMoney} disabled={disabled} onChange={(e)=>this.handleInputChange(e,'u_billingMoney')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>申请开票人：</span>
                            <div>
                                {nameList && nameList.map((v,i)=>{
                                    if(v.userId === selectBill.crmBill.drawer){
                                        return <Select className={style.select} defaultValue={v.chineseName} disabled={disabled} onChange={(e)=>this.handleChange(e,'u_drawer')}
                                         filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                        {nameList && nameList.map((v,i)=>{
                                            return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()}>{v.chineseName}</Option>
                                        })}
                                        </Select>
                                    }
                                })}
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>申请日期：</span>
                            <div>
                                <DatePicker className={style.dataPicker}
                                value={this.state.u_applyDateChange?moment(this.state.u_applyDate,dateFormat):selectBill.crmBill.applyDate != null ? moment(selectBill.crmBill.applyDate, dateFormat):"请选择"} disabled={disabled} onChange={(value,dateString)=>this.onEndChange(value,dateString,'u_applyDate')}/>
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>开票种类：</span>
                            <div>
                                <DfwsSelect
                                  showSearch
                                  url={dictUrl()}
                                  code="BillingType"
                                  placeholder="请选择开票种类"
                                  allowClear={false}
                                  onChange={(e)=>this.handleChange(e,"u_deliveryType")}
                                  disabled={disabled}
                                  style={{ width: 180,marginLeft: 10 }}
                                  value={this.state.BdeliveryTypeChange?this.state.u_deliveryType:selectBill.crmBill.deliveryType?selectBill.crmBill.deliveryType.toString() :""}
                                />
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>开票人：</span>
                            <div>
                                {nameList && nameList.map((v,i)=>{
                                    if(v.userId === selectBill.crmBill.financer){
                                        return <Select className={style.select} defaultValue={v.chineseName} disabled={getUrlParam('type')==0?true:this.isBill===0?true:false} onChange={(e)=>this.handleChange(e,'u_financer')}
                                         filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                        {nameList && nameList.map((v,i)=>{
                                            return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()}>{v.chineseName}</Option>
                                        })}
                                        </Select>
                                    }
                                })}
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>开票日期：</span>
                            <div>
                                <DatePicker className={style.dataPicker} allowClear={false}
                                value={this.state.u_billingDateChange?moment(this.state.u_billingDate,dateFormat):selectBill.crmBill.billingDate != null?moment(selectBill.crmBill.billingDate, dateFormat):""} disabled={getUrlParam('type')==0?true:this.isBill===0?true:false} onChange={(value,dateString)=>this.onEndChange(value,dateString,'u_billingDate')}/>
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>发票抬头：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bHeadUpchange?this.state.u_headUp:selectBill.crmBill.headUp} disabled={disabled} onChange={(e)=>this.handleInputChange(e,'u_headUp')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>税号：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bDutyParagraphchange?this.state.u_dutyParagraph:selectBill.crmBill.dutyParagraph} disabled={disabled} onChange={(e)=>this.handleInputChange(e,'u_dutyParagraph')}></Input>
                        </li>

                        <li>
                            <span className={style.label}>开户行及账号：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bBankAccountschange?this.state.u_bankAccounts:selectBill.crmBill.bankAccounts} disabled={disabled} onChange={(e)=>this.handleInputChange(e,'u_bankAccounts')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>地址、电话：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bAddressPhonechange?this.state.u_addressPhone:selectBill.crmBill.addressPhone} disabled={disabled} onChange={(e)=>this.handleInputChange(e,'u_addressPhone')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>发票号：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bInvoiceNumberchange?this.state.u_invoiceNumber:selectBill.crmBill.invoiceNumber} disabled={getUrlParam('type')==0?true:this.isBill===0?true:false} onChange={(e)=>this.handleInputChange(e,'u_invoiceNumber')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>开票金额：</span>
                            <Input className={style.input} placeholder="请输入" type="number" value={this.state.bBillingMoneychange?this.state.u_billingMoney:selectBill.crmBill.billingMoney} disabled={getUrlParam('type')==1?false:true} onChange={(e)=>this.handleInputChange(e,'u_billingMoney')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>是否有佣金：</span>
                            <div>
                                <Select className={style.select}  disabled={getUrlParam('type')==0?true:this.isBill===0?true:false} value={this.state.p_commissionChange?this.state.p_commissionText:selectBill.crmBill.commission === 1?"是":'否'} onChange={(e)=>this.handleChange(e,'p_commission')}
                                 filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            </div>
                        </li>
                        {this.state.p_commission == "1" && selectBill.crmBill.commission === 1  &&  selectBill.commissionList && selectBill.commissionList.map((v,i)=>{
                            if(i<3){
                                return <li>
                                    <span className={style.label}>佣金：</span>
                                    <span className={style.money}>
                                    {nameList && nameList.map((d,j)=>{
                                        if(d.userId == v.userId){
                                            return <Select className={style.select2} key={j}  disabled={getUrlParam('type')==1?false:true} defaultValue={d.chineseName} onChange={(e)=>this.handleChange(e,'p_userId')}  filterOption={(input, option)=>filterOption(input, option)} showSearch >
                                                {nameList && nameList.map((v,i)=>{
                                                    return <Option key={i} userPinyin={v.userPinyin} value={v.userId}>{v.chineseName}</Option>
                                                })}
                                            </Select>
                                        }
                                    })}
                                    </span>
                                    <Input value={this.state.iMoneyChange?this.commissionList[i].money:v.money}  disabled={getUrlParam('type')==1?false:true} className={style.commission} onChange={(e)=>this.handleInputChange(e,'i_money',i)}/>
                                    {i == selectBill.commissionList.length-1 && selectBill.commissionList.length<3? <div className={!this.state.hiedaddCommission2?style.addCommission:style.addCommission2} onClick={()=>this.addCommission2()}>+</div>:null}
                                </li>
                            }
                        })}

                        {this.state.bShowCommission && this.state.addCommissionList.map((v,i)=>{
                            if((this.state.addCommissionList.length+selectBill.commissionList.length) <=3){
                                return <li key={i}>
                                    <span className={style.label}>佣金：</span>
                                    <span className={style.money}>
                                            <Select className={style.select2} defaultValue="请选择" onChange={(e)=>this.handleChange(e,'i_userId2',i)} filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                            {nameList && nameList.map((v,i)=>{
                                                if(i>0){
                                                    return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()}>{v.chineseName}</Option>
                                                }
                                            })}
                                            </Select>
                                    </span>
                                    <Input type={"number"} refs={"money_"+i} className={style.commission} onChange={(e)=>this.handleInputChange(e,'i_money2',i)}/>
                                    {i == this.state.addCommissionList.length-1 && this.state.addCommissionList.length<3 && (this.state.addCommissionList.length+selectBill.commissionList.length)<3 &&
                                    <div className={style.addCommission} onClick={()=>this.addCommission3(i)}>+</div>
                                   }
                                </li>
                            }
                        })}

                        <div className={style.productInfo}>
                            <div className={style.clientDescribe}>
                                    <span className={style.label}>发票相关附件：</span>
                                    {(()=>{
                                        if(selectBill.annexList && selectBill.annexList.length>0){
                                            return <div className={style.appendixList}>
                                                {selectBill.annexList.map((v,i)=>{
                                                    var fileName = v.annexName;
                                                    var fileUrl = fileBaseurl+v.annexUrl
                                                    if(fileName.length>15){//文件件太长 中间显示...
                                                        fileName = fileName.substr(0,10)+"..."+fileName.substr(fileName.length-5,5);
                                                    }
                                                    return <a className={style.list} onClick={(e)=>{
                                                        e.preventDefault()
                                                        newWindow(fileUrl, fileName)
                                                    }}> <div className={style.fileName}>{fileName}</div>
                                                        <div className={style.oval}></div></a>
                                                })}
                                            </div>
                                        }else {
                                            return <div className={style.appendixList}>暂无附件</div>
                                        }
                                    })()}


                            </div>
                        </div>


                        <li>
                            <span className={style.label}>寄送人：</span>
                            <div>
                                {nameList && nameList.map((v,i)=>{
                                    if(v.userId === selectBill.crmBill.mailUserId){
                                        return <Select className={style.select} defaultValue={v.chineseName} disabled={getUrlParam('type')==0?true:this.sendStatus===3?false:true} onChange={(e)=>this.handleChange(e,'u_mailUserId')}  filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                        {nameList && nameList.map((v,i)=>{
                                            return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()}>{v.chineseName}</Option>
                                        })}
                                        </Select>
                                    }
                                })}
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>收件人：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bAddresseechange?this.state.u_addressee:selectBill.crmBill.addressee} disabled={getUrlParam('type')==0?true:this.sendStatus===3?false:true} onChange={(e)=>this.handleInputChange(e,'u_addressee')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>收件人地址：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bAddresschange?this.state.u_address:selectBill.crmBill.address} disabled={getUrlParam('type')==0?true:this.sendStatus===1?false:true} onChange={(e)=>this.handleInputChange(e,'u_address')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>收件人电话：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bPhonechange?this.state.u_phone:selectBill.crmBill.phone} disabled={getUrlParam('type')==0?true:this.sendStatus===1?false:true} onChange={(e)=>this.handleInputChange(e,'u_phone')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>快递公司：</span>
                            <div>
                                <DfwsSelect
                                    showSearch
                                    url={dictUrl()}
                                    className={style.select}
                                    disabled={getUrlParam('type')==0?true:this.sendStatus===1?false:true}
                                    code="Express"
                                    placeholder="请选择快递公司"
                                    onChange={(e)=>this.handleChange(e,'u_company')}
                                    value={this.state.uCcompanyChange?this.state.u_company.toString():selectBill.crmBill.company?selectBill.crmBill.company.toString() : "请选择"}
                                />
                            </div>

                        </li>
                        <li>
                            <span className={style.label}>邮寄单号：</span>
                            <Input className={style.input} placeholder="请输入" value={this.state.bNumberchange?this.state.u_number:selectBill.crmBill.number} disabled={getUrlParam('type')==0?true:this.sendStatus===1?false:true} onChange={(e)=>this.handleInputChange(e,'u_number')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>邮寄日期：</span>
                            <div>
                                <DatePicker className={style.dataPicker} disabled={getUrlParam('type')==0?true:this.sendStatus===1?false:true} value={this.state.u_maildateChange ? moment(this.state.u_maildate,dateFormat) : selectBill.crmBill.maildate != null ? moment(selectBill.crmBill.maildate, dateFormat):""}
                                onChange={(value,dateString)=>this.onEndChange(value,dateString,'u_maildate')}/>
                            </div>
                        </li>
                        <div className={style.clientDescribe}>
                                <span className={style.label}>开票备注：</span>
                                <TextArea className={style.textarea} disabled={getUrlParam('type')==0?true:this.sendStatus===1?false:true} value={this.state.bRemarkschange?this.state.u_remarks:selectBill.crmBill.remarks}  autosize={{ minRows: 6, maxRows: 8 }} onChange={(e)=>this.handleInputChange(e,'u_remarks')} required/>
                        </div>
                    </ul>
                </div>
            </div>
        }
        </Modal>

        <Modal title={"添加发票"}
          visible={this.state.insertBillMod_visible}
          onOk={()=>this.onOk('insertBill')}
          onCancel={this.onCancel}
          width={770}
          destroyOnClose={true}
        >
            <div className={style.insertBill}>
                <ul className={style.items}>
                    <li>
                        <span className={style.label}>开票人：</span>
                        <div>
                        {nameList && nameList.map((v,i)=>{
                            if(v.userId === this.props.userId){
                                return <Select className={style.select} key={i} defaultValue={v.chineseName} onChange={(e)=>this.handleChange(e,'i_financer')} filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                     {nameList && nameList.map((v,i)=>{
                                         return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()} >{v.chineseName}</Option>
                                     })}
                                 </Select>
                            }
                        })}
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>开票日期：</span>
                        <div>
                            <DatePicker allowClear={false} className={style.dataPicker} value={this.state.billingDateChange?moment(this.state.i_billingDate,dateFormat):""} onChange={(value,dateString)=>this.onEndChange(value,dateString,'i_billingDate')}/>
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>开票种类：</span>
                        <div>
                            <DfwsSelect
                            showSearch
                            url={dictUrl()}
                            code="BillingType"
                            placeholder="请选择开票种类"
                            onChange={(e)=>this.handleChange(e,"i_deliveryType")}
                            style={{ width: 200 }}
                            allowClear={false}
                            value={this.state.i_deliveryType?this.state.i_deliveryType.toString():""}
                            />
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>发票号：</span>
                        <Input className={style.input}  value={this.state.i_invoiceNumber} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'i_invoiceNumber')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>发票抬头：</span>
                        <Input className={style.input} value={this.state.i_headUp} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'i_headUp')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>税号：</span>
                        <Input className={style.input} value={this.state.i_dutyParagraph} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'i_dutyParagraph')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>开户行及账号：</span>
                        <Input className={style.input} value={this.state.i_bankAccounts} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'i_bankAccounts')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>地址、电话：</span>
                        <Input className={style.input} value={this.state.i_addressPhone} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'i_addressPhone')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>开票金额：</span>
                        <Input className={style.input} type={"number"} value={this.state.i_billingMoney} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'i_billingMoney')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>是否有佣金：</span>
                        <div>
                            <Select className={style.select} value={this.state.bShowCommissionChange?this.state.bShowCommissionText:"请选择"}  onChange={(e)=>this.handleChange(e,'i_commission')} filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                <Option value="1">是</Option>
                                <Option value="0">否</Option>
                            </Select>
                        </div>
                    </li>
                    {this.state.bShowCommission && this.state.commissionList.map((v,i)=>{
                        return <li key={i}>
                            <span className={style.label}>佣金：</span>
                            <span className={style.money}>
                                    <Select className={style.select2} defaultValue="请选择" onChange={(e)=>this.handleChange(e,'i_userId',i)} filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                    {nameList && nameList.map((v,i)=>{
                                        if(i>0){
                                            return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()}>{v.chineseName}</Option>
                                        }
                                    })}
                                    </Select>
                            </span>
                            <Input type={"number"} refs={"money_"+i} className={style.commission} onChange={(e)=>this.handleInputChange(e,'i_money',i)}/>
                            {i == this.state.commissionList.length-1 && this.state.commissionList.length<3 &&
                            <div className={style.addCommission} onClick={()=>this.addCommission()}>+</div>
                           }
                        </li>
                    })}
                </ul>
            </div>

            <div className={style.productInfo}>
                <div className={style.clientDescribe}>
                    <span className={style.label}>相关附件：</span>
                    <div className={style.upload}>
                        <Dragger
                        {...props}
                        title="点击或拖动文件上传"
                        onChange={info => this.upLoadChange(info,"insertBill")}
                        onRemove={info => this.upLoadRemove(info,"insertBill")}
                        multiple={true}
                        >
                            <Icon type="upload" className={style.bars}/>
                            <div className={style.tip}>点击或拖动文件上传</div>
                            <div className={style.tip2}>支持单个或批量上传。支持上传rar、zip、doc、docx、pdf、jpg、png、xlsx等格式</div>
                        </Dragger>
                    </div>
                 </div>
            </div>

        </Modal>
        <Modal title={"寄送发票"}
          visible={this.state.sendInvoiceMod_visible}
          onOk={()=>this.onOk('sendInvoice')}
          onCancel={this.onCancel}
          width={770}
        >
            <div className={style.sendInvoice}>
                <ul className={style.items}>
                    <li>
                        <span className={style.label}>寄送人：</span>
                        <div>
                        {nameList && nameList.map((v,i)=>{
                            if(v.userId === this.props.userId){
                                return <Select className={style.select} key={i} defaultValue={v.chineseName}  onChange={(e)=>this.handleChange(e,'s_mailUserId')} filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                    {nameList && nameList.map((v,i)=>{
                                        if(i=>0){
                                            return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()}>{v.chineseName}</Option>
                                        }
                                    })}
                                </Select>
                            }
                        })}
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>收件人：</span>
                        <Input className={style.input} value={this.state.s_addressee} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'s_addressee')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>收件人地址：</span>
                        <Input className={style.input} value={this.state.s_address} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'s_address')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>收件人电话：</span>
                        <Input className={style.input} value={this.state.s_phone} type="number" placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'s_phone')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>快递公司：</span>
                        <div>
                            <DfwsSelect
                                showSearch
                                url={dictUrl()}
                                className={style.select}
                                defaultValue={this.state.s_company}
                                code="Express"
                                placeholder="请选择快递公司"
                                onChange={(e)=>this.handleChange(e,'s_company')}
                            />
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>邮寄单号：</span>
                        <Input className={style.input} value={this.state.s_number} placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'s_number')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>邮寄日期：</span>
                        <div>
                            <DatePicker className={style.dataPicker}  onChange={(value,dateString)=>this.onEndChange(value,dateString,'s_maildate')}/>
                        </div>
                    </li>
                </ul>
            </div>
            <div className={style.productInfo}>
                <div className={style.clientDescribe}>
                        <span className={style.label}>备注：</span>
                        <TextArea className={style.textarea} value={this.state.s_remarks} placeholder="请输入" autosize={{ minRows: 6, maxRows: 8 }} onChange={(e)=>this.handleInputChange(e,'s_remarks')}/>
                </div>
            </div>
        </Modal>
        <Modal title={"确认到款"}
          visible={this.state.insertPaymentMod_visible}
          onOk={()=>this.onOk('insertPayment')}
          onCancel={this.onCancel}
          width={770}
        >
            <div className={style.insertPayment}>
                <ul className={style.items}>
                    <li>
                        <span className={style.label}>合同总金额：</span>
                        <Input className={style.input} type="number" disabled={true} value={totalAmount} placeholder="请输入" ></Input>
                    </li>
                    <li>
                        <span className={style.label}>剩余回款金额：</span>
                        <Input className={style.input} type="number" disabled={true} value={residue} placeholder="请输入" ></Input>
                    </li>
                    <li>
                        <span className={style.label}>回执人：</span>
                        <div>
                        {nameList && nameList.map((v,i)=>{
                            if(v.userId == this.state.b_receiptUserId){
                                return <Select key={i} className={style.select} value={this.state.b_receiptUserIdChange?this.state.b_receiptUserName:v.chineseName} onChange={(e)=>this.handleChange(e,'b_receiptUser')} filterOption={(input, option)=>filterOption(input, option)} showSearch>
                                     {nameList && nameList.map((v,i)=>{
                                         return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()} >{v.chineseName}</Option>
                                     })}
                                 </Select>
                            }
                        })}
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>回执日期：</span>
                        <div>
                            <DatePicker className={style.dataPicker} allowClear={false} onChange={(value,dateString)=>this.onEndChange(value,dateString,'b_receiptDate')} defaultValue={this.state.b_receiptDate != null ? moment(this.state.b_receiptDate, dateFormat):""}/>
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>回执金额：</span>
                        <Input className={style.input} value={this.state.b_amountReceipt} type="number" placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'b_amountReceipt')}></Input>
                    </li>
                    <li>
                        <span className={style.label}>回款方式：</span>
                        <div>
                            <DfwsSelect
                              showSearch
                              url={dictUrl()}
                              code="PaybackMode"
                              placeholder="请选择回款方式"
                              onChange={(e)=>this.handleChange(e,"b_paymentMethod")}
                              style={{ width: 180 }}
                              value={this.state.b_paymentMethod?this.state.b_paymentMethod.toString():"请选择"}
                            />
                        </div>
                    </li>
                    <li>
                        <span className={style.label}>回款日期：</span>
                        <span>
                            <DatePicker className={style.dataPicker} onChange={(value,dateString)=>this.onEndChange(value,dateString,'b_arrivalDate')}/>
                        </span>
                    </li>
                    <li>
                        <span className={style.label}>回款金额：</span>
                        <Input className={style.input} value={this.state.b_amountBack===0?"请输入":this.state.b_amountBack} type="number" placeholder="请输入" onChange={(e)=>this.handleInputChange(e,'b_amountBack')}></Input>
                    </li>
                </ul>
            </div>
            <div className={style.productInfo}>
                <div className={style.clientDescribe}>
                        <span className={style.label}>备注：</span>
                        <TextArea className={style.textarea} value={this.state.b_remarks} placeholder="请输入" autosize={{ minRows: 6, maxRows: 8 }} onChange={(e)=>this.handleInputChange(e,'b_remarks')}/>
                </div>
            </div>
        </Modal>

        <Modal title={"查看详情"}
          visible={this.state.paymentDetailMod_visible}
          onOk={()=>this.onOk('payment')}
          onCancel={this.onCancel}
          width={770}
        >
            {selectPayment && selectPayment.crmPayment &&
                <div>
                <div className={style.paymentDetail}>
                    <ul className={style.items}>
                        <li>
                            <span className={style.label}>合同总金额：</span>
                            <Input className={style.input} disabled={true} type="number"  value={totalAmount}></Input>
                        </li>
                        <li>
                            <span className={style.label}>剩余回款金额：</span>
                            <Input className={style.input} disabled={true} type="number" value={residue}></Input>
                        </li>
                        <li>
                            <span className={style.label}>回执人：</span>
                            <div>
                                {nameList && nameList.map((v,i)=>{
                                    if(v.userId === selectPayment.crmPayment.receiptUserId){
                                        return <Select className={style.select} defaultValue={v.chineseName} value={this.state.p_receiptUserName?this.state.p_receiptUserName:v.chineseName}
                                         onChange={(e)=>this.handleChange(e,'p_receiptUserId')} filterOption={(input, option)=>filterOption(input, option)} showSearch >
                                        {nameList && nameList.map((v,i)=>{
                                            return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()}>{v.chineseName}</Option>
                                        })}
                                        </Select>
                                    }
                                })}
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>回执日期：</span>
                            <div>
                                <DatePicker allowClear={false} className={style.dataPicker} value={this.state.p_receiptDateChange?moment(this.state.p_receiptDate, dateFormat):selectPayment.crmPayment.receiptDate != null ? moment(selectPayment.crmPayment.receiptDate, dateFormat):""} onChange={(value,dateString)=>this.onEndChange(value,dateString,'p_receiptDate')}/>
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>回执金额：</span>
                            <Input className={style.input} type="number" value={!this.state.p_amountReceiptChange?selectPayment.crmPayment.amountReceipt:this.state.p_amountReceipt} onChange={(e)=>this.handleInputChange(e,'p_amountReceipt')}></Input>
                        </li>
                        <li>
                            <span className={style.label}>支付方式：</span>
                            <div>
                                <DfwsSelect
                                  showSearch
                                  url={dictUrl()}
                                  code="PaybackMode"
                                  placeholder="请选择回款方式"
                                  onChange={(e)=>this.handleChange(e,"p_paymentMethod")}
                                  style={{ width: 180 }}
                                  allowClear={false}
                                  defaultValue={selectPayment.crmPayment.paymentMethod?selectPayment.crmPayment.paymentMethod.toString():""}
                                  value={this.state.p_paymentMethod?this.state.p_paymentMethod.toString():selectPayment.crmPayment.paymentMethod?selectPayment.crmPayment.paymentMethod.toString():""}
                                />
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>到款日期：</span>
                            <div>
                                <DatePicker allowClear={false} className={style.dataPicker} disabled={getUrlParam('type')==1?this.state.bPaymentdateDisable:false} value={this.state.p_arrivalDateChange?moment(this.state.p_arrivalDate,dateFormat):selectPayment.crmPayment.arrivalDate != null ? moment(selectPayment.crmPayment.arrivalDate, dateFormat):""} onChange={(value,dateString)=>this.onEndChange(value,dateString,'p_arrivalDate')}/>
                            </div>
                        </li>
                        <li>
                            <span className={style.label}>到款金额：</span>
                            <Input className={style.input} type="number" placeholder="请输入" disabled={getUrlParam('type')==1?this.state.bPaymentdateDisable:false} value={!this.state.p_amountBackChange?amountBack:this.state.p_amountBack} onChange={(e)=>this.handleInputChange(e,'p_amountBack')} />
                        </li>
                    </ul>
                </div>
                <div className={style.productInfo2}>
                    <div className={style.clientDescribe}>
                            <span className={style.label}>回执附件：</span>
                            {(()=>{
                                if(selectPayment.annexList && selectPayment.annexList.length>0){
                                    return <div className={style.appendixList}>
                                        {selectPayment.annexList.map((v,i)=>{
                                            var fileName = v.annexName;
                                            var fileUrl = fileBaseurl+v.annexUrl
                                            if(fileName.length>25){//文件件太长 中间显示...
                                                fileName = fileName.substr(0,20)+"..."+fileName.substr(fileName.length-5,5);
                                            }
                                            return <a className={style.list} href={fileUrl} > <div className={style.fileName}>{fileName}</div>
                                                <div className={style.oval}></div></a>
                                        })}
                                    </div>
                                }else {
                                    return <div className={style.appendixList}>暂无附件</div>
                                }
                            })()}
                    </div>
                </div>
                <div className={style.productInfo}>
                    <div className={style.clientDescribe}>
                            <span className={style.label}>发票备注：</span>
                            <TextArea className={style.textarea} disabled={getUrlParam('type')==1?false:true} value={!this.state.p_remarksChange?selectPayment.crmPayment.remarks:this.state.p_remarks}  autosize={{ minRows: 2, maxRows: 6 }} onChange={(e)=>this.handleInputChange(e,'p_remarks')}/>
                    </div>
                </div>
                <div className={style.productInfo}>
                    <div className={style.clientDescribe}>
                            <span className={style.label}>回执备注：</span>
                            <TextArea className={style.textarea} value={!this.state.p_recRemarksChange?selectPayment.crmPayment.recRemarks:this.state.p_recRemarks}  autosize={{ minRows: 2, maxRows: 6 }} onChange={(e)=>this.handleInputChange(e,'p_recRemarks')}/>
                    </div>
                </div>
                </div>
            }
        </Modal>
        <Modal title={"添加合同子账号"}
          visible={this.state.insertSubcontractMod_visible}
          onOk={()=>this.onOk('subcontract')}
          onCancel={this.onCancel}
          width={430}
        >
        <div className={style.subcontract}>
            <div className={style.subcontractInfos}>
                <div className={style.key}>子合同账号编号：</div>
                <input className={style.value} placeholder="请输入" value={this.state.subsidiaryContractNumber||""} onChange={(e)=>this.handleInputChange(e,"insert_subsidiary")} onFocus={()=>this.handleFocus()} onBlur={()=>this.handleBlur()}/>
            </div>
            <div className={style.subcontractInfos}>
                <div className={style.key}>企业名称：</div>
                <input className={style.value} placeholder="" value={this.state.subsidiary_customerName||""} disabled={true}/>
            </div>
            <div className={style.subcontractInfos}>
                <div className={style.key}>子账号合同金额：</div>
                <input className={style.value} placeholder="" value={this.state.subsidiary_totalAmount||""} disabled={true}/>
            </div>
            <div className={style.remarks}>
                <div className={style.key}>备注：</div>
                <TextArea  className={style.remark} value={this.state.subsidiaryRemark||""}  onChange={(e)=>this.handleInputChange(e,"insert_remark")} type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            </div>
        </div>
        </Modal>

        <Modal title={"申请开票"}
          visible={this.state.appleReceiptMod_visible}
          onOk={()=>this.onOk('appleReceipt')}
          onCancel={this.onCancel}
          width={770}
        >
            <div className={style.appleyReceipty}>
            <ul className={style.items}>
                <li>
                    <span className={style.label}><span className={style.star}>*</span>申请开票金额：</span>
                    <Input className={style.input} placeholder="请输入" type="number" value={this.state.a_receiptMoney} onChange={(e)=>this.handleInputChange(e,'a_receiptMoney')}></Input>
                </li>
                <li>
                    <span className={style.label}><span className={style.star}>*</span>申请开票人：</span>
                    <div>
                         <Select className={style.select} defaultValue={defaultApplyUserName} value={this.state.a_receiptUserName?this.state.a_receiptUserName:defaultApplyUserName} onChange={(e)=>this.handleChange(e,'a_receiptUserId')} filterOption={(input, option)=>filterOption(input, option)} showSearch >
                            {nameList && nameList.map((v,i)=>{
                                return <Option key={i} userPinyin={v.userPinyin} value={v.userId.toString()}>{v.chineseName}</Option>
                            })}
                        </Select>
                    </div>
                </li>
                <li>
                    <span className={style.label}><span className={style.star}>*</span>申请日期：</span>
                    <div>
                        <DatePicker className={style.dataPicker} value={this.state.a_applyDate?moment(this.state.a_applyDate,dateFormat):""} onChange={(value,dateString)=>this.onEndChange(value,dateString,'a_applyDate')} />
                    </div>
                </li>
                <li>
                    <span className={style.label}><span className={style.star}>*</span>开票种类：</span>
                    <div>
                        <DfwsSelect
                          showSearch
                          url={dictUrl()}
                          allowClear={false}
                          code="BillingType"
                          placeholder="请选择开票种类"
                          defaultValue="请选择开票种类"
                          onChange={(e)=>this.handleChange(e,"a_receiptType")}
                          style={{ width: 180 }}
                          value={this.state.a_receiptType ? this.state.a_receiptType.toString():""}
                        />
                    </div>
                </li>
                <li>
                    <span className={style.label}><span className={style.star}>*</span>发票抬头：</span>
                    <Input className={style.input}  placeholder="请输入" value={this.state.a_head} onChange={(e)=>this.handleInputChange(e,'a_head')}></Input>
                </li>
                <li>
                    <span className={style.label}><span className={style.star}>*</span>税号：</span>
                    <Input className={style.input}  placeholder="请输入" value={this.state.a_dutyParagraph} onChange={(e)=>this.handleInputChange(e,'a_dutyParagraph')}></Input>
                </li>
                <li>
                    <span className={style.label}><span className={this.state.isSpecialticket ? style.star:style.hidestar}>*</span>开户行及账号：</span>
                    <Input className={style.input}  placeholder="请输入" value={this.state.a_bankofDeposit} onChange={(e)=>this.handleInputChange(e,'a_bankofDeposit')}></Input>
                </li>
                <li>
                    <span className={style.label}><span className={this.state.isSpecialticket ? style.star:style.hidestar}>*</span>地址，电话：</span>
                    <Input className={style.input}  placeholder="请输入" value={this.state.a_addrPhone} onChange={(e)=>this.handleInputChange(e,'a_addrPhone')}></Input>
                </li>
            </ul>
            </div>

        </Modal>

        <Modal title={this.state.datumDetailModTitle}
          visible={this.state.datumDetailMod_visible}
          onOk={()=>this.onOk('datumDetail')}
          onCancel={this.onCancel}
          width={400}
        >
        <div className={style.datumDetail}>
            <div className={style.line}>
                <div className={style.key}><span className={style.star}>*</span>资料类型</div>
                <div className={style.value}>
                    <Select className={style.select} value={this.state.d_meterialId.toString()} placeholder="请选择" onChange={(e)=>this.handleChange(e,"d_meterialId")}>
                        <Option value="1">营业执照</Option>
                        <Option value="2">身份证</Option>
                        <Option value="3">回执</Option>
                        <Option value="4">订单协议</Option>
                        <Option value="5">发票</Option>
                        <Option value="6">其他</Option>
                        <Option value="7">协议</Option>
                    </Select>
                </div>
            </div>
            <div className={style.line}>
                <div className={style.key}><span className={style.star}>*</span>总页数</div>
                <div className={style.value}>
                 <Input type="number" className={style.allPage} placeholder="请填写总页数" type="number" maxLength={"2"} max="99" value={this.state.d_totalPage} onChange={(e)=>this.handleInputChange(e,'d_totalPage')} />
                </div>
            </div>
            <div className={style.line}>
                <div className={style.key}><span className={style.star}>*</span>当前页</div>
                <div className={style.value}>
                 <Input type="number" className={style.allPage} placeholder="请填写当前是第几页" type="number" maxLength={"2"} max="99" value={this.state.d_currentPage} onChange={(e)=>this.handleInputChange(e,'d_currentPage')}/>
                </div>
            </div>
            <div className={style.line}>
                <div className={style.key}><span className={style.star}>*</span>资料是否齐全</div>
                <div className={style.value}>
                <RadioGroup  value={this.state.isComplete.toString()} onChange={(e)=>this.onRadioChange(e)}>
                  <Radio value="1">齐全</Radio>
                  <Radio value="0">不齐全</Radio>
                </RadioGroup>
                </div>
            </div>
            <div className={style.line}>
                <div className={style.key}><span className={style.star}>*</span>上传图片</div>
                <div className={style.value2}>
                    <Dragger
                    {...props}
                    title="上传图片"
                    // fileList={this.state.z_msg}
                    onChange={info => this.upLoadChange(info,"updateContractMeterial")}
                    onRemove={info => this.upLoadRemove(info,"updateContractMeterial")}
                    multiple={false}
                    className={style.upload}
                    disabled={this.state.bCanupload}
                    >
                    <div className={style.uploadText}>上传图片</div>
                    </Dragger>
                    <span>{this.state.annexImg}</span>
                </div>
            </div>
        </div>
        </Modal>


        </Wrap>
      </Layout>
    )
  }
}

export default ContractDetail
