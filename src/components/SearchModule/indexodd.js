/**
 * Created by huangchao on 14/11/2017.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.less'
import {QueryItem, QuerySelect, QueryTime} from '../QueryItem'
import HeiQueryItem from '../advanceSearchItem'
import { createForm } from 'rc-form'
import {Icon, Modal, Button, Card, Form} from 'antd'
import SortTable from '../SorTable'
// import {queryData} from '../../static/data.js' // heiQueryData
const ButtonGroup = Button.Group
// const FormItem = Form.Item

@createForm()
class SearchModule extends Component {
  constructor(props) {
    super(props)
    this.isSort = true // 判断是否排序
  }
  static propTypes = {
    form: PropTypes.object,
    validateFields: PropTypes.func,
    heiQueryData: PropTypes.array,
    queryBest: PropTypes.array,
    queryHeiBest: PropTypes.array,
    handleQueryBest: PropTypes.func,
    handleHeiQuery: PropTypes.func,
    sortTable: PropTypes.func,
    saveUserCheck: PropTypes.func,
    showHeiBtn: PropTypes.any,
    getFieldDecorator: PropTypes.any,
  }

  state = {
    draggingIndex: null,
    queryHeiBest: [],
    heiQueryData: [],
    showCheckout: false,
    visible: false,
    btns: false,
  }

  showQueryItem = () => { // 初级筛选
    const getFieldProps = this.props.form.getFieldDecorator
    const queryBest = this.props.queryBest
    if (!queryBest) {
      return null
    }
    return queryBest.map((data, index) => {
      if (data.type === 1) {
        return <QueryItem key={index} {...getFieldProps(data.keyword)} data={data} />
      }
      if (data.type === 3) {
        return <QuerySelect key={index} {...getFieldProps(data.keyword)} data={data} />
      }
      if (data.type === 2) {
        return <QueryTime key={index} {...getFieldProps(data.keyword)} data={data} />
      }
      return null
    })
  }

  showHeiQueryItem = () => { // 高级筛选
    const getFieldProps = this.props.form.getFieldDecorator
    const heiQueryData = this.state.heiQueryData
    const queryHeiBest = this.state.queryHeiBest
    if (!queryHeiBest) {
      return null
    }

    if (this.isSort) {
      return queryHeiBest.map((data, index) => {
        return (
          <SortTable
            key={index}
            updateState={this.updateState}
            items={queryHeiBest}
            draggingIndex={this.state.draggingIndex}
            sortId={index}
            outline="grid"
          >
            <Card className={style.cardBox}>
              <HeiQueryItem
                key={index}
                data={data}
                showCheckout={this.state.showCheckout}
                getFieldProps={getFieldProps}
              />
            </Card>
          </SortTable>
        )
      })
    } else {
      return heiQueryData.map((data, index) => {
        return (
          <HeiQueryItem
            key={index}
            data={data}
            showCheckout={this.state.showCheckout}
            select={this.onChangeCheckbox}
            getFieldProps={getFieldProps}
          />
        )
      })
    }
  }

  updateState = (obj) => {
    // this.showHeiQueryItem()
    this.setState(obj, () => {
      this.props.sortTable(obj)
    })
  }

  saveUserCheck = () => { // 保存勾选的item
    // const data = this.state.heiQueryData
    this.isSort = true
    this.setState({
      showCheckout: false,
      btns: false,
    })
    this.props.saveUserCheck(this.state.heiQueryData)
  }

  advancedSearch = () => {
    this.setState({
      visible: true,
    })
  }

  handleCancel = () => { // 关闭
    this.isSort = true
    this.setState({
      showCheckout: false,
      btns: false,
    }, () => {
      this.setState({
        visible: false,
      })
    })
  }

  showBtns = () => { // 个性化搜索项
    const heiQueryData = this.props.heiQueryData
    this.isSort = false
    this.setState({
      heiQueryData,
      showCheckout: true,
      btns: true,
    })
  }

  cancle = () => { //  取消
    this.isSort = true
    this.setState({
      showCheckout: false,
      btns: false,
    })
  }

  resert = () => { // 重置
    this.props.form.resetFields()
  }

  onChangeCheckbox = (check, id) => { // 个性化选择item
    let index
    this.state.heiQueryData.forEach((item, i) => {
      if (item.id === id) {
        index = i
      }
    })
    const arr = [].concat(this.state.heiQueryData)
    arr[index] = {
      ...this.state.heiQueryData[index],
      checked: check,
    }

    this.setState({
      heiQueryData: arr,
    })
  }

  handleQuery = () => { // 基本搜索
    this.props.form.validateFields((err, value) => {
      if (err) return
      this.props.handleQueryBest(value)
    })
  }

  handleAdvancedSearch = (e) => { // 高级搜索
    e.preventDefault()
    this.props.form.validateFields((err, value) => {
      if (err) return
      // this.showHeiQueryItem()
      this.props.handleHeiQuery(value)
      // this.setState({
      //   visible: false,
      // })
    })
  }

  componentWillMount() {
    // this.setState({
    //   getFieldProps: this.props.form.getFieldProps,
    // })
  }
  componentWillReceiveProps(props) {
    this.props.form.validateFields((err, value) => {
      if (err) return
    })
    // const queryData = props.heiQueryData.filter(data => { return data.checked })
    this.setState({
      queryHeiBest: props.queryHeiBest, // 默认高级搜索项
      heiQueryData: props.heiQueryData, // 所有高级搜索项
    })
  }
  render() {
    // const { getFieldProps } = this.props.form
    return (
      <Form>
        <div className={style.SearchModuleWrap}>
          <div className={style.top}>
            <div className={style.topLeft}>
              <Icon className={style.icon} type="search" />&ensp;筛选查询
            </div>
            <div className={style.topRight}>
              <ButtonGroup>
                <Button onClick={this.handleQuery}>查询结果</Button>
                {this.props.showHeiBtn ? <Button onClick={this.advancedSearch}>高级检索</Button> : null}
              </ButtonGroup>
            </div>
          </div>
          <div className={style.bottom}>
            {this.showQueryItem()}
          </div>
          <Modal
            maskClosable={false}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            className={style.Modal}
            bodyStyle={{maxHeight: '400px', overflowX: 'scroll'}}
            title={
              <div className={style.ModalTitle}>
                <div className={style.title}>高级检索</div>
                <div className={style.btns}>
                  <span onClick={this.showBtns}>个性化搜索项</span>
                  <span onClick={this.saveUserCheck} className={`${style.save} ${this.state.btns ? null : style.display}`}>保存</span>
                  <span onClick={this.cancle} className={`${style.cancle} ${this.state.btns ? null : style.display}`}>取消</span>
                </div>
              </div>
            }
            footer={<div>
              <ButtonGroup>
                <Button value="large" onClick={this.resert}>重置</Button>
                <Button value="large" onClick={this.handleAdvancedSearch}>开始检索</Button>
              </ButtonGroup>
            </div>}
          >
            <div className={style.HeiQueryItem}>
              {this.showHeiQueryItem()}
            </div>
          </Modal>
        </div>
      </Form>
    )
  }
}
const SearchModuleForm = Form.create()(SearchModule)

export default SearchModuleForm
