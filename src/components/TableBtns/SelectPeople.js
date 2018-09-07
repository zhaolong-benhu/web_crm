/**
 * Created by huangchao on 20/12/2017.
 * @param {string} title - this is title description.
 * @param {function} ok - 确定的回调.
 * @param {function} cancla - 取消的回调
 * @param {boolen} visible - 是否可见
 */

import React, { Component } from 'react'
import { Modal, Tree, Input, Icon } from 'antd'
import style from './style.less'
// import {treeData} from '../../static/data'
import { connect } from 'react-redux'
import _ from 'lodash'
const TreeNode = Tree.TreeNode
const Search = Input.Search

@connect(state => {
  return {
    selectPeople: state.selectPeople,
  }
})
class SelectPeople extends Component {
  state = {
    selectedKeys: [],
    autoExpandParent: true,
    expandedKeys: [],
    checkedKeys: [],
    people: [],
    searchText:"",
  }

  onExpand = expandedKeys => {
    // 要展开的项
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  onCheck = (checkedKeys, node) => {
    let people = []
    node.checkedNodes.forEach(item => {
      if (!item.props.dataRef) {
        people.push({
          title: item.props.title,
          key: item.key,
        })
      }
    })
    this.setState({ checkedKeys, people })
  }

  onChange = e => {
    // 搜索
    const { treeData } = this.props.selectPeople
    const value = e.target.value
    if (value.length == 0) return
    let expandedKeys = []
    treeData.forEach(item => {
      if (item.children && value !== '') {
        const list = item.children
        list.forEach(data => {
          if (
            data.title.indexOf(value) > -1 &&
            expandedKeys.indexOf(String(item.key)) === -1
          ) {
            expandedKeys.push(String(item.key))
          }
          const dataChildren = data.children
          if (data.children && data.children.length > 0 && value !== '') {
            dataChildren.forEach(c => {
              if (
                c.title.indexOf(value) > -1 &&
                expandedKeys.indexOf(String(data.key)) === -1
              ) {
                expandedKeys.push(String(data.key))
              }
              const children = c.children
              if (children && children.length > 0 && value !== '') {
                children.forEach(c => {
                  if (
                    c.title.indexOf(value) > -1 &&
                    expandedKeys.indexOf(String(c.key)) === -1
                  ) {
                    expandedKeys.push(String(c.key))
                  }
                })
              }
            })
          }
        })
      }
    })
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    })
  }

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })
  }

  callBack = () => {
    let checkedKeys = this.state.checkedKeys.filter(d => {
      return d.length < 6
    })
    this.props.ok(checkedKeys)
  }

  onSelect = (selectedKeys, info) => {
    // if(info.selectedNodes[0].props.children){
    //   let expandedKeys = this.state.expandedKeys
    // }
    this.setState({ expandedKeys: selectedKeys })
  }

  closeUserId = item => {
    let checkedKeys = this.state.checkedKeys
      .filter(d => {
        return d != item.key || d != item.parent
      })
      .filter(d => {
        return d != item.parent
      })
    let people = this.state.people.filter(d => {
      return d.key != item.key
    })
    this.setState({ checkedKeys, people })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isChange) {
      this.setState({
        selectedKeys: [],
        autoExpandParent: true,
        expandedKeys: [],
        checkedKeys: [],
        people: [],
      })
    }
  }
  handleInputChange(e) {
      this.setState({
          searchText:e.target.value,
      })
 }

  cancle = () => {
      //清空Search中的值
      this.setState({
          searchText:"",
      })
      this.props.cancle();
  }

  render() {
    const { treeData } = this.props.selectPeople
    return (
      <Modal
        maskClosable={false}
        title={this.props.title || '添加人员'}
        style={{ top: 160 }}
        visible={this.props.visible}
        onCancel={this.cancle}
        onOk={this.callBack}
        destroyOnClose={true}
      >
        <div className={style.selectPeopleWrap}>
          <div>
            <Search
              style={{ marginBottom: 4 }}
              placeholder="搜索"
              onChange={this.onChange}
              // value={this.state.searchText}
              // onChange={(e)=>this.handleInputChange(e)}
            />
            <Tree
              checkable
              autoExpandParent={this.state.autoExpandParent}
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              selectedKeys={this.state.selectedKeys}
              onSelect={this.onSelect}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          </div>
          <div className={style.selectPeople}>
            {this.state.people.map((item, index) => (
              <p key={index}>
                {item.title}{' '}
                {/*<Icon
                  onClick={() => {
                    this.closeUserId(item)
                  }}
                  type="close"
                />*/}
              </p>
            ))}
          </div>
        </div>
      </Modal>
    )
  }
}

export default SelectPeople
