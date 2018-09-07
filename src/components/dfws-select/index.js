import * as React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import jsonp from 'jsonp'
import qs from 'qs'
import 'pinyin4js'
import 'whatwg-fetch'
import _ from 'lodash'

const Option = Select.Option

export default class DfwsSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue || '',
      dataSource: [],
    }
  }

  static propTypes = {
    code: PropTypes.string,
    url: PropTypes.string,
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({ value })
    }
  }

  handleChange = value => {
    if (!('value' in this.props)) {
      this.setState({ value })
    }
    this.triggerChange(value)
  }

  triggerChange = changedValue => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue)
    }
  }

  filter = (input, option) => {
    if (option.props.children) {
      let long = window.PinyinHelper.convertToPinyinString(
        option.props.children,
        '',
        window.PinyinFormat.WITHOUT_TONE
      )
      let short = window.PinyinHelper.convertToPinyinString(
        option.props.children,
        '',
        window.PinyinFormat.FIRST_LETTER
      )
      const tf1 = long.toUpperCase().indexOf(input.trim().toUpperCase()) === 0
      const tf2 = short.toUpperCase().indexOf(input.trim().toUpperCase()) === 0
      const tf3 = option.props.children.indexOf(input.trim()) === 0
      if (tf1 || tf2 || tf3) {
        return true
      }
    }
  }

  getNotFoundContent() {
    const { notFoundContent, mode } = this.props
    const isCombobox = mode === 'combobox'
    if (isCombobox) {
      // AutoComplete don't have notFoundContent defaultly
      return notFoundContent === undefined ? null : notFoundContent
    }
    return notFoundContent === undefined ? '无匹配结果' : notFoundContent
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      !_.isEqual(this.props, nextProps) ||
      !_.isEqual(this.state, nextState)
    ) {
      return true
    } else {
      return false
    }
  }

  componentDidMount() {
    if (this.props.url) {
      fetch(
        this.props.url +
          '?' +
          qs.stringify({
            codes: this.props.code,
          })
      )
        .then(res => {
          if (res.status >= 400) throw res
          try {
            return res.json()
          } catch (err) {
            console.log(err)
            return res
          }
        })
        .then(data => {
          this.setState({
            dataSource: data ? data.codes : [],
          })
        })
        .catch(error => {
          console.error('请求错误')
        })
    } else {
      console.error('域名错误')
    }
  }

  render() {
    const { placeholder, ...restProps } = this.props

    const { dataSource, value } = this.state

    let items = []

    let defaultValueConifg = {}

    let cstConfig = {}

    if (dataSource.length > 0) {
      let data = dataSource[0]

      items = data.items

      items.filter(x => x.enable === 'Y')

      items.sort((a, b) => {
        return a.seq < b.seq ? -1 : 1
      })

      cstConfig = {
        allowClear: data.nullable === 'Y' ? true : false,
        placeholder: placeholder
          ? placeholder
          : data.nullable === 'Y'
            ? '请选择'
            : '',
      }

      if (data.nullable === 'N' && !placeholder) {
        if (!value) {
          defaultValueConifg = {
            defaultValue: items[0].code,
          }
        }
      }

      items.forEach(item => {
        if (!value) {
          if (item.isDefault === 'Y') {
            defaultValueConifg = {
              defaultValue: item.code,
            }
          }
        }
      })

      const options = items.map(i => {
        return (
          <Option key={i.code} value={i.code}>
            {i.cnname}
          </Option>
        )
      })

      return (
        <Select
          {...cstConfig}
          {...restProps}
          value={value}
          {...defaultValueConifg}
          onChange={this.handleChange}
          notFoundContent={this.getNotFoundContent()}
          filterOption={this.filter}
        >
          {options}
        </Select>
      )
    } else {
      return null
    }
  }
}
