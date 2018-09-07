/**
 * Created by huangchao on 14/11/2017.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './style.less'
import {Icon} from 'antd'

class ConnentTop extends Component {
  static propTypes = {
    name: PropTypes.string,
  }

  state = {
    loding: false,
  }

  onRfersh = () => {
    this.setState({
      loding: true,
    })
    setTimeout(() => {
      window.location.reload()
    }, 200)
  }

  render() {
      //判断在新建线索页面（个人，企业） 不需要线索头部刷新模块
    var newcluePage = window.location.href.indexOf('/clue');
    var clueSystemPage = window.location.href.indexOf('/clueSystem');
    var needRefresh = true;
    if(newcluePage !== -1 && clueSystemPage !== -1){
        needRefresh = true
    }
    if(newcluePage !== -1 && clueSystemPage === -1){
        needRefresh = false;
    }
    return (
      <div className={style.ConnentTopWrap}>

        <div className={style.body}>
          <div className={style.left}>
            {this.props.name || '系统首页'} Version:1.2.3
          </div>
           {needRefresh ?
                <div onClick={this.onRfersh} className={style.right}>
                <Icon type="sync" spin={this.state.loding} className={style.icon} />
                  刷新
               </div>:null
           }

        </div>
      </div>
    )
  }
}

export default ConnentTop
