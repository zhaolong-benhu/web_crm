import React, { Component } from 'react'
import store from 'store'
import { logout } from '../../config'

export default class Logout extends Component {
  componentDidMount() {
    store.remove('crm')
    window.location.href = logout()
  }
  render() {
    return null
  }
}
