/**
 * Created by huangchao on 17/11/2017.
 */
import React, { Component } from 'react'
  import { Input, Button, message } from 'antd'
import {withRouter} from 'react-router-dom'
import style from './style.less'
import { createForm } from 'rc-form'
import PropTypes from 'prop-types'
import * as auth from '../../actions/auth'

@createForm()
@withRouter
class Login extends Component {
  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
  }

  state = {
  }

  handleLogin = () => {
    this.props.form.validateFields((err, value) => {
      if (err) return
      if (!value.username) {
        return message.info('请输入账号')
      }
      if (!value.password) {
        return message.info('请输入密码')
      }
      auth.login({...value}).then(data => {
        if (data) {
          this.props.history.replace('/home/system')
        }
      }).catch(err => {
        return message.info(err.msg)
      })
    })
  }

  keyLogin = (event) => {
    const theEvent = event || window.event
    if (theEvent.keyCode === 13) {
      this.handleLogin()
    }
  }

  componentDidMount() {
    // auth.getDictionaries()
    window.addEventListener('keydown', this.keyLogin)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyLogin)
  }

  render() {
    const { getFieldProps } = this.props.form
    return (
      <div className={style.loginPane}>
        <div className={style.LoginWrap}>
          <div className={style.userLogin}>用户登录</div>
          <div className={style.box}>
            <div className={style.username}>
              <span>账号：</span>
              <Input
                {...getFieldProps('username')}
                placeholder="请输入账号" />
            </div>
            <div className={style.password}>
              <span>密码：</span>
              <Input type="password"
                {...getFieldProps('password')}
                placeholder="请输入密码" />
            </div>
            <div className={style.loginBtn}>
              <Button onClick={this.handleLogin} size="large" type="primary">登录</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
