import React, { Component } from 'react'
import store from 'store'

export default class AuthRequire extends Component {
  permissionNamesHas(authName) {
    const crm = store.get('crm')
    let isAuth = false
    if (crm) {
      if (crm.user) {
        if (Array.isArray(authName)) {
          if (crm.user.permissions) {
            crm.user.permissions.forEach(item => {
              if (authName.join().includes(item.permCode)) {
                isAuth = true
              }
            })
          }
        } else {
          if (crm.user.permissions) {
            crm.user.permissions.forEach(item => {
              if (authName === item.permCode) {
                isAuth = true
              }
            })
          }
        }
      } else {
        console.error('获取权限失败')
      }
    } else {
      console.error('未获取用户信息')
    }
    return isAuth
  }

  render() {
    const { authName, children } = this.props
    const isPermission = this.permissionNamesHas(authName)
    return isPermission ? children : null
  }
}
