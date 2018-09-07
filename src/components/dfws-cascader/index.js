import React from 'react'
import qs from 'qs'
import arrayToTree from 'array-to-tree'
import { Cascader } from 'antd'
import 'pinyin4js'
import 'whatwg-fetch'
import _ from 'lodash'

export default class DfwsCascader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { dataSouce: [] }
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
    let links = ''
    const codes = this.props.code
    for (let i = 0; i < codes.length - 1; i++) {
      links += codes[i] + '*' + codes[i + 1] + ';'
    }
    if (this.props.url) {
      fetch(
        this.props.url +
          '?' +
          qs.stringify({
            links: links,
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
          const dataSouce = data.links.length > 0 ? data.links : []
          const options = arrayToTree(this.trans(dataSouce), {
            parentProperty: 'pid',
            customID: 'id',
          })
          this.setState({
            options,
          })
        })
        .catch(error => {
          console.error('请求错误')
        })
    } else {
      console.error('域名错误')
    }
  }

  trans(links) {
    let nodes = []
    links.forEach(link => {
      if (link.source) {
        link.source.items.forEach(item => {
          if (link.source) {
            if (nodes.every(x => x.id !== item.id)) {
              if (item.enable === 'Y') {
                nodes.push({
                  id: item.id,
                  label: item.cnname
                    ? item.cnname.includes('#')
                      ? item.cnname.split('#')[0]
                      : item.cnname
                    : '',
                  value: item.code,
                  seq: item.seq,
                  key: item.key,
                  pid: 0,
                  long: window.PinyinHelper.convertToPinyinString(
                    item.cnname
                      ? item.cnname.includes('#')
                        ? item.cnname.split('#')[0]
                        : item.cnname
                      : '',
                    '',
                    window.PinyinFormat.WITHOUT_TONE
                  ).toUpperCase(),
                  short: window.PinyinHelper.convertToPinyinString(
                    item.cnname
                      ? item.cnname.includes('#')
                        ? item.cnname.split('#')[0]
                        : item.cnname
                      : '',
                    '',
                    window.PinyinFormat.FIRST_LETTER
                  ).toUpperCase(),
                })
              }
            }
          }
        })
        link.cascades.forEach(item => {
          let obj = {}
          if (link.target) {
            link.target.items.forEach(i => {
              if (item.linkItemcode === i.code) {
                obj = {
                  id: i.id,
                  label: i.cnname
                    ? i.cnname.includes('#')
                      ? i.cnname.split('#')[0]
                      : i.cnname
                    : '',
                  value: i.code,
                  seq: i.seq,
                  key: i.key,
                  long: window.PinyinHelper.convertToPinyinString(
                    i.cnname
                      ? i.cnname.includes('#')
                        ? i.cnname.split('#')[0]
                        : i.cnname
                      : '',
                    '',
                    window.PinyinFormat.WITHOUT_TONE
                  ),
                  short: window.PinyinHelper.convertToPinyinString(
                    i.cnname
                      ? i.cnname.includes('#')
                        ? i.cnname.split('#')[0]
                        : i.cnname
                      : '',
                    '',
                    window.PinyinFormat.FIRST_LETTER
                  ),
                }
                link.source.items.forEach(i => {
                  if (item.itemcode === i.code) {
                    obj.pid = i.id
                  }
                })
                nodes.push(obj)
              }
            })
          }
        })
      }
    })
    nodes.sort(function(a, b) {
      return a.seq < b.seq ? -1 : 1
    })
    return nodes
  }

  filter = (input, path) => {
    return path.some(option => {
      const tf1 =
        option.long.toUpperCase().indexOf(input.trim().toUpperCase()) === 0
      const tf2 =
        option.short.toUpperCase().indexOf(input.trim().toUpperCase()) === 0
      const tf3 = option.label.indexOf(input.trim()) === 0
      return tf1 || tf2 || tf3
    })
  }

  render() {
    return (
      <Cascader
        {...this.props}
        options={this.state.options}
        showSearch={{
          filter: this.filter,
        }}
      />
    )
  }
}
