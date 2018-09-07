/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, DatePicker, Radio } from 'antd'
import style from '../../containers/Detail/style.less'
// import store from 'store'
const { RangePicker } = DatePicker
const RadioGroup = Radio.Group

class ListTextPerson extends Component {
  static propTypes = {
    clueDetail: PropTypes.object,
    disabled: PropTypes.bool,
  }

  state = {
  }

  render() {
    const { clueDetail } = this.props
    return (
      <div>
        <div className={style.formGroup}>
          <label>企业名称：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.enterpriseName} disabled={this.props.disabled} />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>企业地址：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.address} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>详细地址：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.address} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>行业类别：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.industryType} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>星&emsp;&emsp;级：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.star} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>企业类型：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.category} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>企业规模：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.scale} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>注册资金：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.capital} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>法人代表：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.legalRe} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>成立日期：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.establDate} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>公司网址：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.companyWebsite} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>是否筹建：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.isBuild} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>开业时间：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.isGroup} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>是否集团：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.openingTime} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>上级单位：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.superiorUnit} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>客户来源：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.customerSource} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>账号编码：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.accountCode} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>企业简介：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.enterpriseProfile} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>备&emsp;&emsp;注：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.remarks} disabled />
          </div>
        </div>
      </div>
    )
  }
}

class ListTextEnterprise extends Component {
  static propTypes = {
    clueDetail: PropTypes.object,
  }

  state = {
  }

  render() {
    const { clueDetail } = this.props
    return (
      <div>
        <div className={style.formGroup}>
          <label>客户姓名：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.customerName} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>性&emsp;&emsp;别：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.sex === 1 ? '男' : '女'} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>个人手机：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.personalPhone} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>工作手机：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.workPhone} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>固定电话：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.fixedPhone} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>微&emsp;&emsp;信：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.weChat} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>Q&emsp;&emsp;&ensp;Q：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.qQ} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>邮&emsp;&emsp;箱：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.email} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>传&emsp;&emsp;真：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.fax} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>客户来源：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.customerSourceName} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>出生年月：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.birthday} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>毕业院校：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.school} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>学&emsp;&emsp;历：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.educationStr} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>毕业时间：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.graduationTime} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>工作年限：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.workingLife} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>户口地址：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.residence} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>详细地址：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.residenceDetail} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>现居住地：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.address} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>详细地址：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.addressDetail} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>身&ensp;份&ensp;证：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.idCard} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>名&emsp;&emsp;族：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.nation} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>性&emsp;&emsp;格：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.nature} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>血&emsp;&emsp;型：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.bloodType} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>账号编码：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.accountCode} disabled />
          </div>
        </div>
        <div className={style.formGroup}>
          <label>备&emsp;&emsp;注：</label>
          <div className={style.formItem}>
            <Input value={clueDetail.remarks} disabled />
          </div>
        </div>
      </div>
    )
  }
}

class ListTime extends Component { // 日期选择器
  static propTypes = {
    data: PropTypes.object,
  }

  state = {
  }

  render() {
    const data = this.props.data
      <div className={style.formGroup}>
        <label>{data.name}：</label>
        <div className={style.formItem}>
          <RangePicker
            disabled={data.disabled}
            onChange={this.onChange} />
        </div>
      </div>
    )
  }
}

class ListRadio extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  state = {
    value: 1,
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    const data = this.props.data
    const list = data.list
    const props = {...this.props}
    return (
      <div className={style.formGroup}>
        <label>{data.name}：</label>
        <div className={style.formItem}>
          <RadioGroup {...props} name="radiogroup" defaultValue={String(data.defaultValue)}>
            {
              list.map((d, i) => {
                return (
                  <Radio disabled={d.disabled} key={i} value={String(d.value)}>{d.value}</Radio>
                )
              })
            }
          </RadioGroup>
        </div>
      </div>
    )
  }
}

export {
  ListTextPerson,
  ListTextEnterprise,
  ListTime,
  ListRadio,
}
