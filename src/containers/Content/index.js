import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import style from './style.less'

class Wrap extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

@withRouter
class ContentWrap$ extends Component {
  static propTypes = {
    children: PropTypes.any,
  }
  state = {
    params: [],
  }

  static Wrap = Wrap

  render() {
    return (
      <div className={style.listWrap}>
        <div className={style.listWrapContent}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default ContentWrap$
