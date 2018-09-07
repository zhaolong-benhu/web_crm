/**
 * Created by ll on 17/11/2017.
 * type：类型：1.普通文本框 2.时间文本框 3.下拉框
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Form, Input, Row, Col, Button, Radio } from 'antd'
import moment from 'moment'
import style from '../../containers/Detail/style.less'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const FormItem = Form.Item
const RadioGroup = Radio.Group

class ListMergeAdd extends Component { // 企业表单提交
    static propTypes = {
        form: PropTypes.any,
        parsed: PropTypes.object,
        editContactBase: PropTypes.func,
        location: PropTypes.object,
    }

    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        nums: 1,
    }

    handleChange = (value) => {
    }

    onChange = (date, dateString) => {
    }

    radioOnChange = (e) => {
        this.setState({
            value: e.target.value,
        })
    }

    // handleSave = () => {
    //   this.props.editContactBase()
    // }

    handleSave = () => {
        // this.props.editContactBase()
        this.props.form.validateFields((err, values) => {
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 18 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 14 },
            },
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        }
        return (
            <Form onSubmit={this.handleSubmit}>
                <RadioGroup name="radiogroup" defaultValue={1}>
                    <Radio value={1}>
                        <FormItem
                            {...formItemLayout}
                            label="个人手机"
                        >
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator('phone', {
                                        rules: [{required: true, message: '请填写个人手机!'}],
                                    })(
                                        <Input placeholder="请输入个人手机" />
                                    )}
                                </Col>
                            </Row>
                        </FormItem>
                    </Radio>
                    <Radio value={2}>
                        <FormItem
                            {...formItemLayout}
                            label="个人手机"
                        >
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator('phone', {
                                        rules: [{required: true, message: '请填写个人手机!'}],
                                    })(
                                        <Input placeholder="请输入个人手机" />
                                    )}
                                </Col>
                            </Row>
                        </FormItem>
                    </Radio>
                </RadioGroup>
                <FormItem
                    {...formItemLayout}
                    label="个人手机"
                >
                    <Row gutter={8}>
                        <Col span={20}>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '请填写个人手机!'}],
                            })(
                                <Input placeholder="请输入个人手机" />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工作手机"
                >
                    <Row gutter={8}>
                        <Col span={20}>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '请填写工作手机!'}],
                            })(
                                <Input placeholder="请输入工作手机" />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="固定电话"
                >
                    <Row gutter={8}>
                        <Col span={20}>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '请填写固定电话!'}],
                            })(
                                <Input placeholder="请输入固定电话" />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="微信"
                >
                    <Row gutter={8}>
                        <Col span={20}>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '请填写微信!'}],
                            })(
                                <Input placeholder="请输入微信" />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="QQ"
                >
                    <Row gutter={8}>
                        <Col span={20}>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '请填写QQ!'}],
                            })(
                                <Input placeholder="请输入QQ" />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Email"
                >
                    <Row gutter={8}>
                        <Col span={20}>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '请填写Email!'}],
                            })(
                                <Input placeholder="请输入Email" />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="传真"
                >
                    <Row gutter={8}>
                        <Col span={4}>
                            <Radio value={1}>A</Radio>
                        </Col>
                        <Col span={20}>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '请填写传真!'}],
                            })(
                                <Input placeholder="请输入传真" />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Row gutter={8}>
                        <Col span={4}>
                            <Button type="primary" className={style.infoSave} onClick={() => { this.handleSave() }}>保存</Button>&emsp;
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        )
    }
}
const ListMergeAddForm = Form.create()(ListMergeAdd)

export {
    ListMergeAddForm,
}
