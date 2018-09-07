import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Select, DatePicker, Spin, Form } from 'antd'
import DfwsSelect from 'dfws-antd-select'
import moment from 'moment'
import DfwsCascader from '../dfws-cascader'
import debounce from 'lodash/debounce'
import { selectExterpriseName } from '../../actions/internationRule'
import { dictUrl } from '../../config'
const Option = Select.Option

const propTypes = {
  Item: PropTypes.object,
  getFieldDecorator: PropTypes.any,
  fieldValues: PropTypes.any,
}

class Field extends Component {
  constructor(props) {
    super(props)
    this.fetchExterpriseName = debounce(this.fetchExterpriseName, 800)
  }
  state = {
    data: [],
    value: [],
    fetching: false,
  }
  fetchExterpriseName = value => {
    this.props
      .dispatch(
        selectExterpriseName({
          str: value,
        })
      )
      .then(data => {
        if (data && data.data) {
          this.setState({
            data: data.data,
            fetching: false,
          })
        }
      })
  }
  handleChange = value => {
    this.setState({
      data: [],
      fetching: false,
    })
  }
  handleCascaderChange = (value, selectedOptions) => {
    const fieldValues = {
      key: [],
      label: [],
    }
    selectedOptions.forEach(item => {
      fieldValues.key.push(item.value)
      fieldValues.label.push(item.label)
    })
    this.props.form.setFieldsValue({
      CascaderValue: fieldValues,
    })
  }
  render() {
    const { Item, getFieldDecorator, fieldValues, extendedField } = this.props
    const { fetching, data } = this.state
    if (Item) {
      if (Item.sitType === 'text') {
        return (
          <React.Fragment key={Item.id}>
            {getFieldDecorator('fieldValues', {
              initialValue: fieldValues || '',
            })(<Input />)}
          </React.Fragment>
        )
      }
      if (Item.sitType === 'select') {
        return (
          <React.Fragment key={Item.id}>
            {getFieldDecorator('fieldValues', {
              initialValue: fieldValues
              ? { key: fieldValues, label: extendedField }
              : { key: '0', label: '' },
            })(
              <Select labelInValue>
                {Item.list.map(item => {
                  return <Option key={item.id} value={item.id}>{item.dictName}</Option>
                })}
              </Select>
            )}
          </React.Fragment>
        )
      }
      if (Item.sitType === 'dictSelect') {
        return (
          <React.Fragment key={Item.id}>
            {getFieldDecorator('fieldValues', {
              initialValue: fieldValues
                ? { key: fieldValues, label: extendedField }
                : { key: '', label: '' },
            })(
              <DfwsSelect labelInValue url={dictUrl()} code={Item.dictionary} />
            )}
          </React.Fragment>
        )
      }
      if (Item.sitType === 'time') {
        return (
          <React.Fragment key={Item.id}>
            {getFieldDecorator('fieldValues', {
              initialValue: fieldValues ? moment(fieldValues) : '',
            })(<DatePicker style={{ width: '100%' }} />)}
          </React.Fragment>
        )
      }
      if (Item.sitType === 'dictCascader') {
        const province = fieldValues.slice(0, 6)
        const city = fieldValues.slice(6, 12)
        const area = fieldValues.slice(12, 18)
        return (
          <React.Fragment key={Item.id}>
            {getFieldDecorator('fieldValues', {
              initialValue: (fieldValues && [province, city, area]) || '',
            })(
              <DfwsCascader
                url={dictUrl()}
                placeholder="请选择"
                changeOnSelect
                onChange={this.handleCascaderChange}
                code={Item.dictionary.split(',')}
              />
            )}
            {getFieldDecorator('CascaderValue', {
              initialValue: {
                key: (fieldValues && fieldValues.split(',')) || [],
                label: (extendedField && extendedField.split(',')) || [],
              },
            })(<Input hidden="hidden" />)}
          </React.Fragment>
        )
      }
      if (Item.sitType === 'search') {
        return (
          <React.Fragment key={Item.id}>
            {getFieldDecorator('fieldValues', {
              initialValue: fieldValues
                ? { key: fieldValues, label: fieldValues }
                : { key: '', label: '' },
            })(
              <Select
                showSearch
                labelInValue
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchExterpriseName}
                onChange={this.handleChange}
              >
                {data.map(d => <Option key={d.id}>{d.name}</Option>)}
              </Select>
            )}
          </React.Fragment>
        )
      }
    } else {
      return (
        <React.Fragment key={0}>
          <Input placeholder="请填写字段值" />
        </React.Fragment>
      )
    }
  }
}

Field.propTypes = propTypes

export default Field
