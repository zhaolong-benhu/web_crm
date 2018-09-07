/**
 * Created by huangchao on 22/12/2017.
 */
/**
 * Created by huangchao on 20/12/2017.
 * @param {string} title - this is title description.
 * @param {function} ok - 确定的回调.
 * @param {function} cancla - 取消的回调
 * @param {boolen} disabled - 是否可编辑
 * @param {boolen} visible - 是否可见
 * @param {array} ids - 数组id
 */

import React, { Component } from 'react'
import { Modal, Radio, Mention, Input } from 'antd'
import style from './style.less'
const RadioGroup = Radio.Group
const { toString } = Mention
const { TextArea } = Input
class Audit extends Component {

  state = {
    value: 2,
    name:"",
  }

  selectRadio = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  mentionReason = editorState => {
    this.feedback = toString(editorState)
  }

  cancle = ()=> {
      this.props.cancle();
      this.setState({
          feedback:"",
      })
  }
  callBack = () => {

    let value
    if (this.props.aType === '1') {
      value = {
        customerList: this.props.ids,
        status: this.state.value,
        remark: this.state.feedback,
      }
    }
    if (this.props.aType === '2') {
      value = {
        delayList: this.props.ids,
        status: this.state.value,
        remark: this.state.feedback,
      }
    }

    if(!this.props.disabled) {
      this.props.ok(value)
    } else {
      this.props.cancle()
    }
    setTimeout(()=>{
        this.setState({
            feedback:"",
        })
    },2000)
  }

  onInputchange = (e)=> {
      this.setState({
          feedback:e.target.value,
      })
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      name:nextProps.name,
    })
  }
  render() {
    let clueNumber
    let clueName
    let customerName
    
    if (this.props.aType === '1') {
      if (this.props.isAudit === '1') {
        if ((this.props.numbers).length > 0) {
          clueNumber = (this.props.numbers || []).join(',')
          clueName = (this.props.names || []).join(',')
        } else {
          clueNumber = this.props.number
          clueName = this.props.names
        }
      } else {
        clueNumber = (this.props.numbers || []).join(',')
        clueName = (this.props.names || []).join(',')
      }
    }
    if (this.props.aType === '2') {

      if (this.props.isAudit === '2') {
        if ((this.props.customerNames).length > 0) {
          customerName = (this.props.customerNames || []).join(',')
        } else {
          customerName = this.props.customerName
        }
      } else {
        customerName = (this.props.customerNames || []).join(',')
      }
    }
    
    return(
      <Modal
        maskClosable={false}
        title={this.props.title}
        style={{ top: 160 }}
        visible={this.props.visible}
        onCancel={this.cancle}
        onOk={this.callBack}
        className={style.Modal}
      >
        <div className={style.number}>
          <span className={style.auditSpan}>客户姓名：</span>
          {this.props.aType === '2' && this.props.isAudit === '2'?
          <span>{customerName}</span>
          :
          <span>{clueName != "" ? clueName:this.state.name}</span>
          }
        </div>
        <div>
          <span className={style.auditSpan}>是否通过：</span>
          <RadioGroup disabled={this.props.disabled} onChange={this.selectRadio} value={this.state.value}>
            <Radio value={2}>审核通过</Radio>
            <Radio value={3}>审核不通过</Radio>
          </RadioGroup>
        </div>
        <div className={style.reason}>
          <span className={style.auditSpan}>反馈详情：</span>
          <TextArea
            disabled={this.props.disabled}
            onChange={(e)=>this.onInputchange(e)}
            value={this.state.feedback}
            autosize={{ minRows: 3, maxRows: 6 }}
          />
        </div>
      </Modal>
    )
  }
}

export default Audit
