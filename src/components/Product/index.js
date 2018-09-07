import React, { Component } from 'react'
import style from './style.less'
import { Input, Select, DatePicker, Modal, Button, message, Tabs } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import store from 'store'
import $ from 'jquery'
import { selectAllCheneseName } from '../../actions/clientSystem'
import { getProductList } from '../../actions/businessSystem'
import {permissionNamesHas} from '../../util/isAuth'
import { deleteProduct, getProListByContId, getContractUrl, refreshProductFor3 } from '../../actions/contractSystem'
import { getUrlParam, filterOption, newWindow } from '../../util'
const Option = Select.Option
const TabPane = Tabs.TabPane

@connect(state => {
  return {
    nameList: state.clientSystem.nameList,
    contractSystem: state.contractSystem,
    productList: state.contractSystem.productList,
    selproductList: state.businessSystem.productList,
  }
})
class Product extends Component {
  state = {
    tableHeader: [
      { name: '序号' },
      { name: '产品名称' },
      { name: '产品金额' },
      { name: '销售人员' },
      { name: '服务人员' },
      { name: '服务开始时间' },
      { name: '服务结束时间' },
      { name: '操作' },
    ],
    selectProductMod_visible: false,
    newProductList: [],
    tableHeaderFor3: [
      { name: '序号' },
      { name: '院校查看数' },
      { name: '简历查看数' },
      { name: '职位发布数' },
      { name: '是否开通全国' },
      { name: '操作' },
    ],
  }
  constructor(props) {
    super(props)
    this.productId = 1
    this.saleUserId = ''
    this.serviceUserId = ''
    this.contractNumber = ''
    this.jobNum = ''
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.contractNumber && nextProps.contractNumber) {
      this.contractNumber = nextProps.contractNumber
          //获取产品列表(表格列表显示)
    this.props.dispatch(
      getProListByContId({
        number:
        this.contractNumber || getUrlParam('contractNumber') || this.props.contractNumber || '',
        contractId: this.props.id || getUrlParam('id') || '',
      })
    )
    }
  }

  componentDidMount() {
    //获取4大品牌产品列表
    this.props.dispatch(getProductList({}))

    //查询所有人
    let code = ''
    const crm = store.get('crm')
    if (crm && crm.user && crm.user.department) {
      code = crm.user.department.deptCode
      this.setState({
        userId: crm.user.id,
        jobNum: crm.user && crm.user.userBasicInfo && crm.user.userBasicInfo.jobNum || '',
        displayName: crm.user.displayName,
      })
      if(crm && crm.user && crm.user.userBasicinfo){
        this.jobNum = crm.user.userBasicinfo.jobNum;
        this.jobNum = this.jobNum.replace(/\b(0+)/gi,"");
      }else{
      }
    }
    this.props.dispatch(
      selectAllCheneseName({
        code,
      })
    )
    if (this.props.isContract && this.props.isContract.toString() === '3') {
      this.props.dispatch(
        getContractUrl({
          contractId: this.props.id || getUrlParam('id') || '',
        })
      ).then(data => {
        if (data) {
          this.sonContractId = data.data.sonContractId
          this.sonCustomerId = data.data.sonCustomerId
          this.sysCustomerId = data.data.sysCustomerId
          this.props.dispatch(refreshProductFor3({
            sysCustomerId: this.sysCustomerId,
            sonContractId: this.sonContractId,
          }))
        }
      })
    } else {
      this.props.dispatch(
        getProListByContId({
          number:
          this.contractNumber || getUrlParam('contractNumber') || this.props.contractNumber || '',
          contractId: this.props.id || getUrlParam('id') || '',
        })
      )
    }
  }

  //刷新数据
  renovateData = () => {
    if (this.props.isContract && this.props.isContract.toString() === '3') {
      if(this.sysCustomerId) {
        this.props.dispatch(refreshProductFor3({
          sysCustomerId: this.sysCustomerId,
          sonContractId: this.sonContractId,
        }))
      }
    } else {
      this.props.dispatch(
        getProListByContId({
          number:
          this.contractNumber || getUrlParam('contractNumber') || this.props.contractNumber || '',
          contractId: this.props.id || getUrlParam('id') || '',
        })
      )
    }
  }
  //选择产品
  selectProduct = () => {
    if (!(this.props.id || getUrlParam('id'))) {
      message.error('请先提交合同！')
    } else {
      if (this.props.isContract && this.props.isContract.toString() === '3') {
        this.props.dispatch(
          getContractUrl({
            contractId: this.props.id || getUrlParam('id') || '',
          })
        ).then(data => {
            if(data && data.data){
                newWindow(data.data.dfwsUrl)
                this.sonContractId = data.data.sonContractId
                this.sonCustomerId = data.data.sonCustomerId
                this.sysCustomerId = data.data.sysCustomerId
            }
        })
      } else {
        this.setState({
          selectProductMod_visible: true,
        })
      }
    }
  }
  //取消
  onCancel = () => {
    this.setState({
      selectProductMod_visible: false,
    })
    this.renovateData()
  }
  //删除产品
  deleteProduct = (id, type) => {
    if (type === 3 || type === 4) {
      var items = this.state.newProductList
      var array = items
      items.forEach((v, i) => {
        if (id == v.id) {
          array.splice(i, 1)
        }
      })
      this.setState({
        newProductList: array,
      })
      this.props.contractSystem.newproductList = array
    } else {
      this.props
        .dispatch(
          deleteProduct({
            id: id,
            type: type,
          })
        )
        .then(data => {
          if (data && data.code === 0) {
            message.success(data.msg)
            this.renovateData()
          } else {
            if (data) {
              message.error(data.msg)
            }
          }
        })
    }
  }
  onInputChange = (e, id, type) => {
    if (type == 3 || type == 4) {
      var items = this.state.newProductList
      this.state.newProductList.forEach((v, i) => {
        if (v.id == id) {
          items[i].money = e.target.value
        }
      })
      this.setState({
        newProductList: items,
      })
      this.props.contractSystem.newproductList = items
    } else {
      this.prop.productList &&
        this.prop.productList.forEach((v, i) => {
          if (v.id == id) {
            this.prop.productList[i].money = e.target.value
          }
        })
    }
  }
  //选择人员
  handleChange = (value, type, data) => {
    if (type === 'u_user') {
      if (data.type == 3 || data.type == 4) {
        var items = this.state.newProductList
        this.state.newProductList.forEach((v, i) => {
          if (v.id == data.id) {
            items[i].saleUserId = `${value}`
            this.saleUserId = `${value}`
          }
        })
        this.setState({
          newProductList: items,
        })
        this.props.contractSystem.newproductList = items
      } else {
        this.props.productList &&
          this.props.productList.forEach((v, i) => {
            if (v.id == data.id) {
              this.props.productList[i].saleUserId = `${value}`
              this.saleUserId = `${value}`
            }
          })
      }
    } else if (type == 'u_service') {
      if (data.type == 3 || data.type == 4) {
        var items = this.state.newProductList
        this.state.newProductList.forEach((v, i) => {
          if (v.id == data.id) {
            items[i].serviceUserId = `${value}`
            this.serviceUserId = `${value}`
          }
        })
        this.setState({
          newProductList: items,
        })
        this.props.contractSystem.newproductList = items
      } else {
        this.props.productList &&
          this.props.productList.forEach((v, i) => {
            if (v.id == data.id) {
              this.props.productList[i].serviceUserId = `${value}`
              this.serviceUserId = `${value}`
            }
          })
      }
    }
    this.props.insertProduct(
      data.id,
      data.type,
      this.saleUserId,
      this.serviceUserId
    )
  }

  onEndChange = (value, dateString, v, id, type) => {
    if (v === 'startTime') {
      if (type == 3 || type == 4) {
        var items = this.state.newProductList
        this.state.newProductList.forEach((v, i) => {
          if (v.id == id) {
            items[i].startTime = dateString
          }
        })
        this.setState({
          newProductList: items,
        })
        this.props.contractSystem.newproductList = items
      } else {
        this.props.productList &&
          this.props.productList.forEach((v, i) => {
            if (v.id == id) {
              this.props.productList[i].startTime = dateString
            }
          })
      }
    } else if (v === 'endTime') {
      if (type == 3 || type == 4) {
        var items = this.state.newProductList
        this.state.newProductList.forEach((v, i) => {
          if (v.id == id) {
            items[i].endTime = dateString
          }
        })
        this.setState({
          newProductList: items,
        })
        this.props.contractSystem.newproductList = items
      } else {
        this.props.productList &&
          this.props.productList.forEach((v, i) => {
            if (v.id == id) {
              this.props.productList[i].endTime = dateString
            }
          })
      }
    }
  }
  linkProduct = (e, url, text) => {
    e.preventDefault()
    if (text === '迈点服务' || text === '乔邦服务') {
      this.setState({
        selectProductMod_visible: false,
      })
      var m_product = {
        id: '',
        cname: '',
        money: '',
        cname: '',
        saleUserId: '',
        serviceUserId: '',
        startTime: '',
        endTime: '',
        type: '',
      }
      m_product.id = this.productId++
      m_product.cname = text
      m_product.money = 0
      m_product.saleUserId = this.state.userId
      m_product.serviceUserId = this.state.userId
      m_product.type = text === '迈点服务' ? 3 : 4
      m_product.startTime = ''
      m_product.endTime = ''
      this.state.newProductList.push(m_product)
      this.props.contractSystem.newproductList = this.state.newProductList
    } else {
      newWindow(url, text)
    }
  }

  newLocalWindow = (url, text) => {
    const iWidth = 900 //弹出窗口的宽度;
    const iHeight = 700 //弹出窗口的高度;
    const iTop = (window.screen.height - 30 - iHeight) / 2 //获得窗口的垂直位置;
    const iLeft = (window.screen.width - 10 - iWidth) / 2 //获得窗口的水平位置;
    const w = window.open(
      url,
      '_blank',
      `location=no,menubar=no,toolbar=no,status=no,scrollbars=yes,height=${iHeight},width=${iWidth},top=${iTop},left=${iLeft}`
    )
    setTimeout(() => {
        try{
            w.document.title = text
        }catch(err){
            console.log(err);
        }
    }, 1000)

    const popupTick = setInterval(() => {
      if (w.closed) {
        clearInterval(popupTick);
        this.renovateData()
      }
    }, 500);
  }

  callbackProduct = () => {}
  render() {
    const { selproductList, nameList, productList,contractSystem } = this.props
    const dateFormat = 'YYYY-MM-DD'
    var AllproductList = productList.concat(this.state.newProductList)
    var veryeast_updateUrl = 'http://manage.veryeast.cn/m/contract-detail/update'
    var veryeast_viewUrl = 'http://manage.veryeast.cn/m/contract-detail/update'
    var xz_updateUrl = 'http://manage.9first.com/crm/product/update'
    var xz_viewUrl = 'http://manage.9first.com/crm/product/view'
    var id = ''
    if (this.props.id) {
      id = this.props.id
    } else {
      id = getUrlParam('id')
    }
    return (
      <div>
        <div className={style.productInfo}>
          <div className={style.clientDescribe}>
            <div className={style.table}>
              {this.props.isContract && this.props.isContract.toString() === '3' ? <React.Fragment><div className={style.header}>
              {this.state.tableHeaderFor3.map((v, i) => {
                return (
                  <div
                    className={ i === 5
                          ? style.columns5
                          : style.columns
                    }
                    key={i}
                  >
                    {v.name}
                  </div>
                )
              })}
            </div>
            <React.Fragment>{AllproductList &&
              AllproductList.map((value, j) => {
                return (
                  <div className={style.body} key={j}>
                    <div className={style.columns}>{value.id}</div>
                    <div className={style.columns}>{value.collegeViewAllowedNum}</div>
                    <div className={style.columns}>{value.contactViewAllowedNum}</div>
                    <div className={style.columns}>
                    {value.jobAllowedNum}
                    </div>
                    <div className={style.columns}>
                    {value.isWorkPlaceUnlimited ? '是' : '否'}
                    </div>
                    <div className={style.columns5}>
                      {(() => {

                          if(getUrlParam('type') === '0'){
                              return (
                                <a
                                  onClick={e => {
                                    e.preventDefault()
                                    this.newLocalWindow(
                                     value.url,
                                      '修改产品'
                                    )
                                  }}
                                >
                                  {this.props.status == 3?"修改产品":""}
                                </a>
                              )
                          }

                          if(getUrlParam('type') === '1'){
                              return (
                                <a
                                  onClick={e => {
                                    e.preventDefault()
                                    this.newLocalWindow(
                                     value.url,
                                      '修改产品'
                                    )
                                  }}
                                >
                                  {this.props.status == 3?"修改产品":permissionNamesHas('sys:product:add')?"修改产品":""}
                                </a>
                              )
                          }



                          // return (
                          //   <a
                          //     onClick={e => {
                          //       e.preventDefault()
                          //       this.newLocalWindow(
                          //        value.url,
                          //         '修改产品'
                          //       )
                          //     }}
                          //   >
                          //     {this.props.status == 3?"修改产品":permissionNamesHas('sys:product:add')?"修改产品":""}
                          //   </a>
                          // )
                      })()}
                    </div>
                  </div>
                )
              })} </React.Fragment></React.Fragment>: <React.Fragment><div className={style.header}>
              {this.state.tableHeader.map((v, i) => {
                return (
                  <div
                    className={
                      i === 0 || i === 2 || i === 3 || i === 4
                        ? style.columns3
                        : i === 7
                          ? style.columns4
                          : style.columns
                    }
                    key={i}
                  >
                    {v.name}
                  </div>
                )
              })}
            </div>
            <React.Fragment>{AllproductList &&
              AllproductList.map((value, j) => {
                return (
                  <div className={style.body} key={j}>
                    <div className={style.columns3}>{value.id}</div>
                    <div className={style.columns}>{value.cname}</div>
                    <div className={style.columns3}>
                      {value.money?value.money.match(/^\d+(?:\.\d{0,2})?/):value.money}
                    </div>
                    <div className={style.columns3}>
                      {value.saleUserName}
                    </div>

                    <div className={style.columns3}>
                      {value.serviceUserName}
                    </div>

                    <div className={style.columns}>
                      {value.startTime? moment(value.startTime).format(dateFormat) : ''}
                    </div>
                    <div className={style.columns}>
                      {value.endTime ? moment(value.endTime).format(dateFormat) : ''}
                    </div>
                    <div className={style.columns4}>
                      {(() => {
                        if (value.type === 1) {
                          return (
                            <a
                              onClick={e => {
                                e.preventDefault()
                                this.newLocalWindow(
                                  veryeast_updateUrl + '?id=' + value.id + '&CompanyChainBranch[adminId]='+ this.state.userId + '&CompanyChainBranch[adminName]=' + this.state.displayName,
                                  '修改产品'
                                )
                              }}
                            >
                              修改产品
                            </a>
                          )
                        }
                        if (value.type === 2) {
                          return (
                            <a
                              onClick={e => {
                                e.preventDefault()
                                this.newLocalWindow(
                                  xz_updateUrl + '?id=' + value.id,
                                  '修改产品'
                                )
                              }}
                            >
                              修改产品
                            </a>
                          )
                        }
                      })()}
                      {' '}
                      {(() => {
                        if (value.type === 1) {
                          return (
                            <a
                              onClick={e => {
                                e.preventDefault()
                                newWindow(
                                  veryeast_viewUrl + '?id=' + value.id,
                                  '查看服务'
                                )
                              }}
                            >
                              查看服务
                            </a>
                          )
                        }
                        if (value.type === 2) {
                          return (
                            <a
                              onClick={e => {
                                e.preventDefault()
                                newWindow(
                                  xz_viewUrl + '?id=' + value.id,
                                  '查看服务'
                                )
                              }}
                            >
                              查看服务
                            </a>
                          )
                        }
                      })()}
                    </div>
                  </div>
                )
              })}</React.Fragment></React.Fragment>}
            </div>
            <div className={style.btns}>
              <Button
                className={style.button}
                onClick={() => this.renovateData()}
              >
                刷新数据
              </Button>
              <Button
                className={style.button}
                onClick={() => this.selectProduct()}
                disabled={this.props.isContract && this.props.isContract.toString() === '3' && AllproductList.length === 1}
              >
                选择产品
              </Button>
            </div>

          </div>
        </div>

        <Modal
          title={'选择产品'}
          visible={this.state.selectProductMod_visible}
          onOk={() => this.onOk('payment')}
          onCancel={this.onCancel}
          width={500}
          footer={null}
        >
          <div className={style.productList}>
            <Tabs defaultActiveKey="0" onChange={this.callbackProduct}>
              <TabPane tab={'最佳东方'} key={'0'}>
                {selproductList &&
                  selproductList.map((v, i) => {
                    if (v.type === 1) {
                      const url =
                        v.url +
                        '&Contract[coding]=' +
                        (getUrlParam('contractNumber') ||
                          this.props.contractNumber) +
                        '&Contract[status]=2' +
                        '&ContractDetail[Product]=' +
                        v.id +
                        '&ContractDetail[IsGroup]=' +
                        (this.props.isContract && this.props.isContract.toString() === '2' ? 1 : 0) +
                        '&ContractDetail[cUserId]=' +
                         this.jobNum +
                        '&ContractDetail[cTrueName]=' +
                        this.state.displayName +
                        '&Contract[id]=' + id+
                        '&CompanyChainBranch[adminId]='+
                        this.state.userId +
                        '&CompanyChainBranch[adminName]='+
                        this.state.displayName
                      return (
                        <div key={i} className={style.productName}>
                          <a
                            onClick={e => {
                              this.linkProduct(e, url, v.cname)
                            }}
                            title={v.cname}
                          >
                            {v.cname}
                          </a>
                        </div>
                      )
                    }
                  })}
              </TabPane>
              <TabPane tab={'先之'} key={'1'}>
                {selproductList &&
                  selproductList.map((v, i) => {
                    if (v.type === 2) {
                      if (v.url.indexOf('manage.veryeast.cn') > 0) {
                        const url =
                          v.url +
                          '&Contract[coding]=' +
                          (getUrlParam('contractNumber') ||
                            this.props.contractNumber) +
                          '&Contract[status]=2' +
                          '&ContractDetail[Product]=' +
                          v.id +
                          '&ContractDetail[cUserId]=' +
                          this.state.userId +
                          '&ContractDetail[cTrueName]=' +
                          this.state.displayName +
                          '&Contract[id]=' + id
                        return (
                          <div key={i} className={style.productName}>
                            <a
                              onClick={e => {
                                this.linkProduct(e, url, v.cname)
                              }}
                              title={v.cname}
                            >
                              {v.cname}
                            </a>
                          </div>
                        )
                      } else {
                        const url = v.url + '&number=' +
                          (getUrlParam('contractNumber') ||
                            this.props.contractNumber) +
                          '&contractId=' + id
                        return (
                          <div key={i} className={style.productName}>
                            <a
                              onClick={e => {
                                this.linkProduct(e, url, v.cname)
                              }}
                              title={v.cname}
                            >
                              {v.cname}
                            </a>
                          </div>
                        )
                      }
                    }
                  })}
              </TabPane>
              <TabPane tab={'迈点'} key={'2'}>
                {selproductList &&
                  selproductList.map((v, i) => {
                    if (v.type === 3) {
                      return (
                        <div key={i} className={style.productName}>
                          <a
                            onClick={e => {
                              this.linkProduct(e, '', '迈点服务')
                            }}
                            title={v.cname}
                          >
                            {v.cname}
                          </a>
                        </div>
                      )
                    }
                  })}
              </TabPane>
              <TabPane tab={'乔邦猎头'} key={'3'}>
                {selproductList &&
                  selproductList.map((v, i) => {
                    if (v.type === 4) {
                      return (
                        <div key={i} className={style.productName}>
                          <a
                            onClick={e => {
                              this.linkProduct(e, '', '乔邦服务')
                            }}
                            title={v.cname}
                          >
                            {v.cname}
                          </a>
                        </div>
                      )
                    }
                  })}
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Product
