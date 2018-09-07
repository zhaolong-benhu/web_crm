/**
 * Created by huangchao on 15/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框 4.勾选框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.less'
import { Input, Select, DatePicker, Cascader, TreeSelect, InputNumber } from 'antd'
import DfwsSelect from 'dfws-antd-select'
import DfwsCascader from 'dfws-antd-cascader'
import { dictUrl } from '../../config'
import { options } from '../../static/data'
import { filterOption } from '../../util'
import store from 'store'
import moment from 'moment'
import ColumnGroup from 'antd/lib/table/ColumnGroup';
const Option = Select.Option
const { RangePicker } = DatePicker

class QueryItem extends Component {
  // 文本输入框
  static propTypes = {
    data: PropTypes.object,
  }

  state = {
    disabled: false,
  }

  render() {
    const data = this.props.data
    return (
      <div className={style.QueryItemWrap}>
        <div
          className={this.props.hidename === '1' ? style.hidename : style.name}
        >
          {data.name}：
        </div>
        <div
          className={
            this.props.hidename === '1' ? style.selectBox2 : style.selectBox
          }
        >
          <Input
            placeholder={data.placeholder}
            disabled={data.disabled}
            {...this.props}
          />
        </div>
      </div>
    )
  }
}
class QuerySelect extends Component {
  // 下拉选择
  static propTypes = {
    data: PropTypes.object,
  }

  onChange = (data, datastring) => {
    this.props.onChange(datastring)
  }

  render() {
    const { data, onChange } = this.props
    let selectView = null
    if (data.keyword === 'enIsGroup') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}

        >
          <Option value="">请选择</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      )
    } else if (data.keyword === 'enIsBuild') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      )
    }  else if (data.keyword === 'isDeal') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      )
    } else if (data.keyword === 'coStatus') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="0">合同结束/终止</Option>
          <Option value="1">服务中</Option>
          <Option value="2">合同未结束/暂停服务</Option>
          <Option value="3">未定</Option>
          <Option value="4">作废</Option>
        </Select>
      )
    } else if (data.keyword === 'exIsEnable') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      )
    } else if (data.keyword === 'peSex') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">男</Option>
          <Option value="0">女</Option>
        </Select>
      )
    } else if (data.keyword === 'status') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      )
    } else if (data.keyword === 'isAssist') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      )
    } else if (data.keyword === 'hasJob') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      )
    } else if (data.keyword === 'exDisMode') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="2">自动分配</Option>
          <Option value="1">手动分配</Option>
        </Select>
      )
    } else if (data.keyword === 'checkStatus') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={'1'}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">未分配</Option>
          <Option value="2">已分配</Option>
        </Select>
      )
    } else if (data.keyword === 'exType') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">个人客户</Option>
          <Option value="2">企业客户</Option>
        </Select>
      )
    } else if (data.keyword === 'depCode') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
        <Option value="" key="default" >请选择</Option>
        {this.props.depCodeList && this.props.depCodeList.map((v,i)=>{
          return <Option key={v.departmentCode} value={v.departmentCode}>{v.departmentName}</Option>
        })}
        </Select>
      )
    } else if (data.keyword === 'coPaymentSit') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">待支付</Option>
          <Option value="2">支付完毕</Option>
          <Option value="3">不需支付</Option>
        </Select>
      )
    } else if (data.keyword === 'exStatus') {
      selectView = (
        <Select
          disabled={data.disabled}
          defaultValue={this.props.defaultExamineStatus === "1"?"1":""}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
        >
          <Option value="">请选择</Option>
          <Option value="1">未审核</Option>
          <Option value="2">审核通过</Option>
          <Option value="3">审核未通过</Option>
        </Select>
      )
    } else if (data.keyword === 'buTopicId' || data.keyword === 'coTopicId') {
      selectView = (
        <Select
          showSearch
          placeholder={data.placeholder}
          optionFilterProp="children"
          className={style.select}
          onChange={onChange}
          filterOption={(input, option) =>
            option.props.children.indexOf(input.trim()) >=
            0
          }
        >
          {this.props.topicList.map((d, i) => {
            return (
              <Option key={d.id} value={String(d.id)}>
                {d.name}
              </Option>
            )
          })}
        </Select>
      )
    } else if (data.keyword === 'deps') {
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
      selectView = (
        <TreeSelect
          placeholder="请选择部门"
          treeDefaultExpandAll
          className={style.select}
          treeData={departments}
          onChange={onChange}
        />
      )
    } else if (data.keyword === 'userId') {
      selectView = (
        <Select
          showSearch
          placeholder="请选择客户所属人"
          optionFilterProp="children"
          onChange={onChange}
          className={style.select}
          filterOption={(input, option)=>filterOption(input, option)}
        >
        {this.props.nameList.map((d, i) => {
          return (
            <Option key={d.userId} value={String(d.userId)} userPinyin={d.userPinyin}>
              {d.chineseName}
            </Option>
          )
        })}
        </Select>
      )
    } else if (data.keyword === 'buType') {
      selectView = (
        <DfwsSelect
          url={dictUrl()}
          code={"TypesOfBusinessOpportunities"}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
          allowClear={false}
        />
      )
    } else if (data.keyword === 'industryOwned') {
      selectView = (
        <DfwsSelect
          url={dictUrl()}
          defaultValue={data.placeholder}
          code={"IndustryCategory"}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
          allowClear={false}
        />
      )
    } else  {
      selectView = (
        <DfwsSelect
          url={dictUrl()}
          code={data.keyword}
          disabled={data.disabled}
          defaultValue={data.keyword==='exStatus'?'1': data.keyword==='FollowUpStatus'?'0':''}
          className={style.select}
          placeholder={data.placeholder}
          onChange={onChange}
          allowClear={false}
        />
      )
    }
    return (
      <div className={style.QueryItemWrap}>
        <div
          className={this.props.hidename === '1' ? style.hidename : style.name}
        >
          {data.name}：
        </div>
        <div
          className={
            this.props.hidename === '1' ? style.selectBox2 : style.selectBox
          }
        >
          {selectView}
        </div>
      </div>
    )
  }
}
class QueryTime extends Component {
  // 日期选择
  static propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func,
  }

  onChange = (data, datastring) => {
    this.props.onChange(datastring)
  }

  render() {
    const data = this.props.data
    const dateFormat = 'YYYY-MM-DD'
    return (
      <div className={style.QueryItemWrap}>
        <div
          className={this.props.hidename === '1' ? style.hidename : style.name}
        >
          {data.name}：
        </div>
        <div
          className={
            this.props.hidename === '1' ? style.selectBox2 : style.selectBox
          }
        >
          <RangePicker
            onChange={this.onChange}
            style={{width: '250px'}}
            defaultValue={[
              this.props.startTime
                ? moment(this.props.startTime, dateFormat)
                : null,
              this.props.endTime
                ? moment(this.props.endTime, dateFormat)
                : null,
            ]}
            size="Large"
            allowClear={false}
          />
        </div>
      </div>
    )
  }
}
class QueryMoney extends Component {
  // 金钱选择
  static propTypes = {
    data: PropTypes.object,
  }



  render() {
    const data = this.props.data
    return (
      <div className={style.QueryItemWrap}>
        <div
          className={(data.keyword === 'amountBackEnd' || data.keyword === 'esMoneyEnd' || data.keyword === 'totalAmountEnd' || data.keyword === 'inTimeEnd') ? style.hidename : style.name}
        >
          {data.name}：
        </div>
        <div
          className={
            this.props.hidename === '1' ? style.selectBox2 : style.selectBox
          }
        >
          <Input placeholder="请输入"  style={{width: '100px'}} type="number" {...this.props} />
          <span className={(data.keyword === 'amountBackStart' ||  data.keyword === 'esMoneyStart' || data.keyword ==='totalAmountStart' || data.keyword ==='inTimeStart') ? style.wave : style.hidewave}>~</span>
        </div>
      </div>
    )
  }
}
class QueryProduct extends Component {
  // 金钱选择
  static propTypes = {
    data: PropTypes.object,
  }

  render() {
    const data = this.props.data
    return (
      <div className={style.QueryItemWrap}>
        <div
          className={(data.keyword === 'amountBackEnd' || data.keyword === 'esMoneyEnd') ? style.hidename : style.name}
        >
          {data.name}：
        </div>
        <div
          className={
            this.props.hidename === '1' ? style.selectBox2 : style.selectBox
          }
        >
        <Cascader data={data} options={this.props.options}  placeholder="选择产品名称" {...this.props}/>
        </div>
      </div>
    )
  }
}
class QueryCascader extends Component {
  // 级联选择类型
  render() {
    const data = this.props.data
    return (
      <div className={style.QueryItemWrap}>
        <div
          className={this.props.type == 'form' ? style.hidename : style.name}
        >
          {data.name}：
        </div>
        <div
          className={
            this.props.hidename === '1' ? style.selectBox2 : style.selectBox
          }
        >
          <DfwsCascader
            {...this.props}
            url={dictUrl()}
            placeholder={data.placeholder}
            defaultValue={String(data.defaultValue)}
            className={style.select}
            code={['province', 'city', 'area']}
            changeOnSelect
            allowClear={false}
          />
        </div>
      </div>
    )
  }
}

export { QueryItem, QuerySelect, QueryTime, QueryCascader,QueryMoney,QueryProduct }
window.store = store
