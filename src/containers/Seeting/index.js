import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import style from './style.less'
import PropTypes from 'prop-types'
import { Form, Input, Button, Checkbox, Icon, Avatar } from 'antd'
import Layout from '../Wrap'
import ContentWrap from '../Content'

const {Wrap} = Layout
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
}

class $Logs extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  state = {
    checkNick: false,
  }
  check = () => {
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          console.info('success')
        }
      },
    )
  }
  handleChange = (e) => {
    this.setState({
      checkNick: e.target.checked,
    }, () => {
      this.props.form.validateFields(['nickname'], { force: true })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Layout className={style.LogsWrap}>
        <Wrap>
          <ContentWrap>
            <div className={style.listTitle}>
              <div>
                <Icon type="user" className={style.user} />
                &ensp;账户设置
              </div>
            </div>
            <div>
              <div className={style.listTop}>
                <Avatar size="large" icon="user" />
                <div>
                  <FormItem {...formItemLayout} label="用户名">
                    {getFieldDecorator('username', {
                      rules: [{
                        required: true,
                        message: '请填写用户名',
                      }],
                    })(
                      <Input placeholder="请填写用户名" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="昵称">
                    {getFieldDecorator('nickname', {
                      rules: [{
                        required: this.state.checkNick,
                        message: '请填写昵称',
                      }],
                    })(
                      <Input placeholder="请填写昵称" />
                    )}
                  </FormItem>
                  <FormItem {...formTailLayout}>
                    <Checkbox
                      value={this.state.checkNick}
                      onChange={this.handleChange}
                    >
                      验证昵称
                    </Checkbox>
                  </FormItem>
                  <FormItem {...formTailLayout}>
                    <Button type="primary" onClick={this.check}>
                      提交
                    </Button>
                  </FormItem>
                </div>
              </div>
            </div>
          </ContentWrap>
        </Wrap>
      </Layout>
    )
  }
}
const Logs = Form.create()($Logs)
export default Logs
