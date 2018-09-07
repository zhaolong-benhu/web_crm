/**
 * Created by huangchao on 15/11/2017.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.less'
import { Input, Select, DatePicker, TreeSelect, Slider } from 'antd'
import DfwsSelect from 'dfws-antd-select'
import DfwsCascader from 'dfws-antd-cascader'
import store from 'store'
import moment from 'moment'
import { dictUrl } from '../../config'
import { filterOption } from '../../util'
// import moment from 'moment'
const Option = Select.Option
const InputGroup = Input.Group;
const { RangePicker } = DatePicker

class HeiQueryText extends Component {
  // 输入文本类型
  static propTypes = {
    data: PropTypes.object,
    select: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    getFieldDecorator: PropTypes.func,
  }

  render() {
    const { data, getFieldDecorator } = this.props

    return (
      <div className={style.QueryItemWrap}>
        <div className={style.rigitConnent}>
          <div className={style.name}>{data.name}：</div>
          <div className={style.selectBox}>
            {getFieldDecorator(data.keyword, {
              initialValue: '',
            })(
              <Input disabled={data.disabled} placeholder={data.placeholder} />
            )}
          </div>
        </div>
      </div>
    )
  }
}
class HeiQueryCascader extends Component {
  // 级联选择类型
  static propTypes = {
    data: PropTypes.object,
    select: PropTypes.func,
    getFieldDecorator: PropTypes.func,
  }

  state = {}

  render() {
    let selectView = null

    const { data, getFieldDecorator } = this.props

    if(data.keyword === 'job') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <DfwsCascader
              url={dictUrl()}
              className={style.select}
              placeholder="请选择"
              code={['Position', 'Station']}
              changeOnSelect
            />
          )}
        </React.Fragment>
      )
    }else if(data.keyword === 'industryTypeAndcategory') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <DfwsCascader
              url={dictUrl()}
              className={style.select}
              placeholder="请选择"
              code={['IndustryCategory','FormOfBusinessEnterprise']}
              changeOnSelect
            />
          )}
        </React.Fragment>
      )
    }else if(data.keyword === 'IndustryCategory') {
    selectView = (
      <React.Fragment>
        {getFieldDecorator(data.keyword, {
          initialValue: '',
        })(
          <DfwsCascader
            url={dictUrl()}
            className={style.select}
            placeholder="请选择"
            code={'IndustryCategory'}
          />
        )}
      </React.Fragment>
    )
 }else if(data.keyword === 'CustomerSource') {
    selectView = (
      <React.Fragment>
        {getFieldDecorator(data.keyword, {
          initialValue: '',
        })(
          <DfwsCascader
            url={dictUrl()}
            className={style.select}
            placeholder="请选择"
            code={'CustomerSource'}
          />
        )}
      </React.Fragment>
    )
 }else  if(data.keyword === 'RecordOfFormalSchooling') {
  selectView = (
    <React.Fragment>
      {getFieldDecorator(data.keyword, {
        initialValue: '',
      })(
        <DfwsCascader
          url={dictUrl()}
          className={style.select}
          placeholder="请选择"
          code={'RecordOfFormalSchooling'}
        />
      )}
    </React.Fragment>
  )
}else{
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <DfwsCascader
              url={dictUrl()}
              className={style.select}
              placeholder="请选择"
              code={['province', 'city', 'area']}
              allowClear={false}
              changeOnSelect
            />
          )}
        </React.Fragment>
      )
    }

    return (
      <div className={style.QueryItemWrap}>
        <div className={style.rigitConnent}>
          <div className={style.name}>{data.name}：</div>
          <div className={style.selectBox}>{selectView}</div>
        </div>
      </div>
    )
  }
}

class HeiQuerySelect extends Component {
  // 下拉选项
  static propTypes = {
    data: PropTypes.object,
    select: PropTypes.func,
    getFieldDecorator: PropTypes.func,
  }

  state = {}

  render() {
    let selectView = null
    const { data, getFieldDecorator } = this.props
    if (data.keyword === 'enIsGroup') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
              <Option value="">请选择</Option>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'enIsBuild') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
              <Option value="">请选择</Option>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'exIsEnable') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
              <Option value="">请选择</Option>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'peSex') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
              <Option value="">请选择</Option>
              <Option value="1">男</Option>
              <Option value="0">女</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'status') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
              <Option value="">请选择</Option>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'isAssist') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
              <Option value="">请选择</Option>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'hasJob') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
              <Option value="">请选择</Option>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'exDisMode') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
            <Option value="">请选择</Option>
            <Option value="2">自动分配</Option>
            <Option value="1">手动分配</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'checkStatus') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '1',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
            <Option value="">请选择</Option>
            <Option value="1">未分配</Option>
            <Option value="2">已分配</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'exType') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
            <Option value="">请选择</Option>
            <Option value="1">个人客户</Option>
            <Option value="2">企业客户</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'coPaymentSit') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
            <Option value="">请选择</Option>
            <Option value="1">待支付</Option>
            <Option value="2">支付完毕</Option>
            <Option value="3">不需支付</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'exStatus') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
            <Option value="">请选择</Option>
            <Option value="1">未审核</Option>
            <Option value="2">审核通过</Option>
            <Option value="3">审核未通过</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'enIsFollow') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
            <Option value="">请选择</Option>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
            </Select>
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'buTopicId' || data.keyword === 'coTopicId') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              showSearch
              placeholder={data.placeholder}
              optionFilterProp="children"
              className={style.select}
              filterOption={(input, option) =>
                option.props.children
                  .indexOf(input.trim()) >= 0
              }
            >
              {this.props.topicList.map((d, i) => {
                return (
                  <Option key={d.userId} value={String(d.id)}>
                    {d.name}
                  </Option>
                )
              })}
            </Select>
          )}
        </React.Fragment>
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
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <TreeSelect
              placeholder="请选择部门"
              treeDefaultExpandAll
              className={style.select}
              treeData={departments}
            />
          )}
        </React.Fragment>
      )
  } else if (data.keyword === 'userId' || data.keyword === 'conUserId') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              showSearch
              placeholder={data.placeholder}
              optionFilterProp="children"
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
          )}
        </React.Fragment>
      )
    } else if (data.keyword === 'coIsAllIn') {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <Select
              disabled={data.disabled}
              className={style.select}
              placeholder={data.placeholder}
            >
            <Option value="1">齐全</Option>
            <Option value="2">不齐全</Option>
            </Select>
          )}
        </React.Fragment>
      )
  }else if (data.keyword === 'TicketStatus') {
    selectView = (
      <React.Fragment>
        {getFieldDecorator(data.keyword, {
          initialValue: '',
        })(
          <Select
            disabled={data.disabled}
            className={style.select}
            placeholder={data.placeholder}
          >
          <Option value="">请选择</Option>
          <Option value="1">已开票</Option>
          <Option value="0">未开票</Option>
          </Select>
        )}
      </React.Fragment>
    )
} else {
      selectView = (
        <React.Fragment>
          {getFieldDecorator(data.keyword, {
            initialValue: '',
          })(
            <DfwsSelect
              code={data.keyword}
              url={dictUrl()}
              disabled={data.disabled}
              className={style.select}
              placeholder="请选择"
              allowClear={false}
            />
          )}
        </React.Fragment>
      )
    }
    return (
      <div className={style.QueryItemWrap}>
        <div className={style.rigitConnent}>
          <div className={style.name}>{data.name}：</div>
          <div className={style.selectBox}>{selectView}</div>
        </div>
      </div>
    )
  }
}

class HeiQueryTime extends Component {
  // 日期选择器
  static propTypes = {
    data: PropTypes.object,
    select: PropTypes.func,
    getFieldDecorator: PropTypes.func,
  }

  state = {}

  render() {
    const data = this.props.data
    const getFieldDecorator = this.props.getFieldDecorator
    const dateFormat = 'YYYY-MM-DD'
    return (
      <div className={style.QueryItemWrap}>
        <div className={style.rigitConnent}>
          <div className={style.name}>{data.name}：</div>
          <div className={style.selectBox}>
            <React.Fragment>
              {getFieldDecorator(data.keyword, {
                initialValue: '',
              })(
                <RangePicker
                  disabled={data.disabled}
                  onChange={this.props.onChange}
                  format={dateFormat}
                  // allowClear={false}
                />
              )}
            </React.Fragment>
          </div>
        </div>
      </div>
    )
  }
}



class HeiQueryMoney extends Component {
  // 日期选择器
  static propTypes = {
    data: PropTypes.object,
    select: PropTypes.func,
    getFieldDecorator: PropTypes.func,
  }

  state = {
       disabled: false,
  }
  handleDisabledChange = (disabled) => {
      this.setState({ disabled });
    }
  render() {
    const data = this.props.data
    const getFieldDecorator = this.props.getFieldDecorator
    const dateFormat = 'YYYY-MM-DD'
    return (
      <div className={style.QueryItemWrap}>
        <div className={style.rigitConnent}>
          <div className={style.name}>{data.name}：</div>
          <div className={style.selectBox}>
            <React.Fragment>
              {getFieldDecorator(data.keyword, {
                initialValue: '',
              })(
                <div className={style.money}>
                    <Input placeholder="请输入"  style={{width: '100px'}} type="number"  />
                    <span >~</span>
                    <Input placeholder="请输入"  style={{width: '100px'}} type="number"  />
                </div>
              )}
            </React.Fragment>
          </div>
        </div>
      </div>
    )
  }
}

export { HeiQueryText, HeiQueryCascader, HeiQuerySelect, HeiQueryTime,HeiQueryMoney }
