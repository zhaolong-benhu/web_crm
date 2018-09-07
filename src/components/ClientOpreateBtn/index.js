/**
 * Created by liuli on 20/03/2018.
 *
 */

import React from 'react'
import { Button } from 'antd'
import queryString from 'query-string'
import AuthRequire from '../AuthRequire'
import {getUrlParam} from '../../util'

class ClientOpreateBtn extends React.Component {

  state = {
    isdis: false,
  }

  componentDidMount() {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName, status} = parsed
    if (status === '2' || status === '3') {
      this.setState({
        isdis: true,
      })
    }
  }
  goBack = (from) => {
      if(from === "myInternation"){
          window.location.href = '/CRM/myInternation?topName=我的公海'
      }else if(from === "myclient"){
          window.location.href = '/CRM/myClient?topName=我的客户'
      }else if(from === "clientSystem"){
          window.location.href = '/CRM/clientSystem?topName=客户管理'
      }
  }
  render() {
    const search = this.props.location.search
    const parsed = queryString.parse(search)
    const {topName} = parsed
    if(this.props.distrBtn){
        this.state.isdis = true
    }
    if (topName === '我的公海') {
      return (
        <div>
          <AuthRequire authName="sys:mypool:move">
          <Button onClick={()=>this.goBack("myInternation")}>返回</Button>&emsp;
          </AuthRequire>
          <AuthRequire authName="sys:mypool:move">
          <Button onClick={()=>this.props.removeClient()}>移出客户</Button>&emsp;
          </AuthRequire>
          <AuthRequire authName={"sys:myclient:distribution"}>
          <Button onClick={() => this.props.assignMent(8)}>分配客户</Button>&emsp;
          </AuthRequire>
          <AuthRequire authName="sys:mypool:drawin">
          <Button onClick={this.props.getInto}>揽入客户</Button>&emsp;
          </AuthRequire>
        </div>
      )
    }
    if (topName === '资源管理') {
      return (
        <div>
          <AuthRequire authName="sys:myclient:distribution">
          <Button onClick={() => this.props.assignMent(9)}>保存</Button>&emsp;
          <Button onClick={() => this.props.assignMent(3)}>分配至公海</Button>&emsp;
          </AuthRequire>
        </div>
      )
    }
    if (topName === '协同客户') {
      return (
        <div>
          <AuthRequire authName="sys:myclue:adden">
          <Button onClick={() => this.props.assignMent(5)}>放弃协助</Button>&emsp;
          </AuthRequire>
        </div>
      )
    }
    if (topName === '延期处理') {
      return (
        <div>
          <AuthRequire authName="sys:myclue:adden">
          <Button disabled = {this.state.isdis} onClick={() => this.props.assignMent(6)}>审核不通过</Button>&emsp;
          </AuthRequire>
          <AuthRequire authName="sys:myclue:adden">
          <Button disabled = {this.state.isdis} onClick={() => this.props.assignMent(7)}>审核通过</Button>
          </AuthRequire>
        </div>
      )
    }
    if (topName === '客户管理') {
      return (
        <div>
          <AuthRequire authName="sys:mypool:move">
          <Button onClick={()=>this.goBack("clientSystem")}>返回</Button>&emsp;
          </AuthRequire>
          <AuthRequire authName="sys:mypool:move">
          <Button onClick={this.props.removeClient}>移出客户</Button>&emsp;
          </AuthRequire>
          <AuthRequire authName="sys:myclient:distribution">
          <Button onClick={() => this.props.assignMent(8)}>分配客户</Button>&emsp;
          </AuthRequire>
        </div>
      )
    } else {
      return (
        <div>
          <AuthRequire authName="sys:mypool:move">.
          {/*<Button onClick={()=>this.goBack("myclient")}>返回</Button>&emsp;*/}
          </AuthRequire>
          {getUrlParam("topName") === "离职员工客户" ? null:
              <AuthRequire authName="sys:mypool:move">
                <Button onClick={this.props.editClient}>保存</Button>&emsp;
              </AuthRequire>
         }
          <AuthRequire authName="sys:mypool:move">
            <Button onClick={()=>this.props.removeClient(getUrlParam('topName'))}>移出客户</Button>&emsp;
          </AuthRequire>
         {getUrlParam("topName") === "离职员工客户" ? null:
               <AuthRequire authName="sys:myclient:delay">
                 <Button onClick={() => this.props.assignMent(1)}>申请延期</Button>&emsp;
               </AuthRequire>
          }
          {getUrlParam("topName") === "离职员工客户" ? null:
              <AuthRequire authName="sys:myclient:audit">
                <Button onClick={() => this.props.assignMent(2)}>查看审核结果</Button>&emsp;
              </AuthRequire>
          }
         <AuthRequire authName="sys:myclient:distribution">
            <Button onClick={() => this.props.assignMent(8)} disabled={this.props.distrBtn}>分配客户</Button>&emsp;
         </AuthRequire>
          {getUrlParam("topName") === "离职员工客户" ? null:
             <AuthRequire authName="sys:myclient:assist">
                <Button onClick={() => this.props.assignMent(4)}>请求协助</Button>&emsp;
             </AuthRequire>
          }
        </div>
      )
    }
  }
}

export default ClientOpreateBtn
