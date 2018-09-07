# 更新日志

`dfws-crm-new` 严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 版本说明

* 主版本号：当你做了不兼容的 API 修改，
* 次版本号：当你做了向下兼容的功能性新增，
* 修订号：当你做了向下兼容的问题修正。

## 1.2.3

`2018-07-23`
#### Author 赵龙
- 🐞 项目所有Table表格下面增加总条数和当前所在的范围区间
- 🐞 我的客户，新增合同，对应商机是空白的，新增合同会报错，接口报400
- 🐞 合同管理，发票寄送的邮寄单号，数字和字母都可以输入，后端不要做判断限制
- 🐞 合同管理，寄送发票，收件人现在是禁止修改的，应该可以做修改
- 🐞 合同模块，添加回执和申请开票弹窗，点击回执方式和开票种类下拉框的x，下拉框会显示为undefined
- 🐞 我的合同，合同在未定状态下，合同状态应该禁止修改，应该设置为灰色
- 🐞 我的合同，新增回执时，上传附件，点击确定按钮，上传附件会报错


#### Author 郑旭江

## 1.2.2

`2018-06-21`
#### Author 赵龙

- 🐞 所有的报表模块 联系人添加'全部'选项
- 🐞 我的客户-跟进记录-添加‘查看其他业务线'按钮
- 🐞 我的线索-修改个人线索 性别为女 提交为空的问题
- 🐞 我的客户-跟进记录 列表添加跟进时间

#### Author 郑旭江


## 1.2.1

`2018-06-13`
#### Author 赵龙

- 🐞 修复了离职员工客户分配和移除返回问题
- 🐞 修复了新增礼品收件人下拉选择问题
- 🐞 修复了新增个人线索去掉客户姓名查重问题
-
#### Author 郑旭江

- 🐞 修复了地区默认值的问题
- 🐞 修复了联系方式默认值问题
- 🐞 修复了高级搜索取消无法重置状态的问题

## 1.2.0

`2018-06-11`
#### Author 赵龙

- 🐞 【报名中心】 用户名处理
- 🐞 【我的合同】【合同管理】 勾选框做处理


#### Author 郑旭江



## 1.1.9

`2018-06-11`
#### Author 赵龙

- 🐞 【我的线索】 禁用导出按钮
- 🐞 【我的合同】【合同管理】 勾选框做处理


#### Author 郑旭江
- 🌟 完善了内页新建窗口的功能
- 🐞 修复了新建窗口无法显示水平滚动条的问题


## 1.1.8

`2018-06-11`
#### Author 赵龙

- 🐞 修复了大量Bug 具体内容见JIRA
- 🐞 CRM整站中 对填写日期的开始，结束时间加判断，结束时间不能比开始时间早
- 🐞 【公海管理】公海客户标签池 删除操作添加确认框

#### Author 郑旭江

- 🐞 修复了申请延期中延期天数格式不正确的问题[#CRM-1675](http://jira.dfwsgroup.cn/browse/CRM-1675)
- 🐞 修复了行业类别错误但图标显示不正确的问题[#CRM-1671](http://jira.dfwsgroup.cn/browse/CRM-1671)
- 🌟 完善了主目录新建窗口的功能



## 1.1.7

`2018-06-09`
#### Author 赵龙

- 🐞 修复了大量Bug 具体内容见JIRA
- 🐞 程序代码优化 删除了额外无用的代码及注释
- 🐞 【资源管理】 分配至公海之后 清空modal中用户选择的数据
- 🐞 【合同管理】【线上管理】 对开始日期和结束日期做数据内容判断
- 🐞 【合同管理】【我的客户】选择产品做相关的用户优化 关闭Modal 自动刷新产品列表数据
- 🐞 【客户管理】 对dispatch返回结果做数据判断处理

#### Author 郑旭江




## 1.1.6

`2018-06-07`
#### Author 赵龙

- 🐞 修复了大量Bug 具体内容见JIRA
- 🐞 新增企业线索新增执照名称和查重功能
- 🐞 人员下拉框 增加拼音和首字母缩写查询
-
#### Author 郑旭江

- 🐞 修复了附件无法上传的问题

## 1.1.5

`2018-06-07`
#### Author 赵龙

- 🐞 修复了大量Bug 具体内容见JIRA

#### Author 郑旭江

- 🐞 修复了列表中时间格式化的问题[#CRM-1657](http://jira.dfwsgroup.cn/browse/CRM-1657)

## 1.1.4

`2018-06-07`
#### Author 赵龙
- 🐞 修复了大量Bug 具体内容见JIRA

#### Author 郑旭江

- 🐞 修复了【我的商机】中销售金额联动的问题[#CRM-1652](http://jira.dfwsgroup.cn/browse/CRM-1652)

## 1.1.3

`2018-06-06`
#### Author 赵龙
- 🐞 改进了【我的客户】中新增跟进 不能返回
- 🐞 改进了【我的线索】中新增企业线索 是否筹建  默认不选中任何状态
- 🐞 改进了【我的客户】中新建合同 文案替换
- 🐞 改进了【我的线索】搜索模块 少字段问题


#### Author 郑旭江

- 🐞 改进了【我的客户】中联系人拨号功能

## 1.1.2

`2018-06-06`
#### Author 赵龙

- 🐞 页面优化
- 🐞 【合同管理】 添加发票问题
- 🐞 【合同管理】 佣金问题


#### Author 郑旭江

- 🐞 优化了【我的客户】拨号功能


## 1.1.1

`2018-06-05`
#### Author 赵龙

- 🐞 页面优化
- 🐞 【合同管理】 子账号合同备注显示undefined问题
- 🐞 【资源管理】 审核会跳转的问题
- 🐞 【我的客户】 新增跟进成功之后 将数据清空


#### Author 郑旭江




## 1.1.0

`2018-06-05`
#### Author 赵龙

- 🐞 页面优化
- 🐞 【合同管理】 修复了佣金编辑问题
- 🐞 【我的客户】 更改备注为Textarea支持多行显示
-
#### Author 郑旭江
- 🐞 修复了【公海管理】中公海规则的一些问题 [#CRM-1631](http://jira.dfwsgroup.cn/browse/CRM-1631)


## 1.0.9

`2018-06-05`
#### Author 赵龙
- 🐞 页面优化
- 🐞 【跟进设置】 修改了跟进设置中 状态开启/关闭 导致查询条件丢失问题
- 🐞 【公海管理】 新增操作栏 可对每条公海进行规则维护 移除上面公共按钮
- 🐞 【合同管理】 发票寄送

#### Author 郑旭江
- 🐞 修复了【客户管理】中分配至个人选择器高度的问题
- 🐞 修复了各个模块搜索问题

## 1.0.8

`2018-06-04`

#### Author 赵龙
- 🐞 修复了【合同管理】操作合同 modal弹框不能关闭问题
- 🐞 改进了【线索管理】返回url错误
- 🐞 改进了【合同管理】提示填写佣金和佣金人问题

#### Author 郑旭江
- 🐞 修复了【我的客户】拨号联系人相同时无法区分的问题
- 🐞 改进了【线索管理】审核状态的默认值
- 🐞 改进了【资源管理】分配状态的默认值
- 🐞 修复了【我的客户】预设时间重复点击的问题
- 🌟 新增非宿主页拨号功能
- 🌟 新增【首页】模块

## 1.0.7

`2018-06-01`

#### Author 赵龙
- 🐞 修复了标签不显示问题
- 🐞 修复了报表部门不显示成员问题
- 🐞 修复了【合同管理】确认到款 回执人错误问题
- 🐞 修复了 其他Bug

#### Author 郑旭江
- 🐞 修复了分配方式
- 🐞 修复了合并
- 🐞 修复了【我的合同】翻页无法携带参数的问题
- 🐞 修复了【报表中心】销售额排名报表中日期显示不完全的问题
- 🐞 修复了【我的公海】重复选择数据的问题
- 🐞 修复了【我的客户】选择预设时间后无法重置数据

## 1.0.6

`2018-05-31`

#### Author 赵龙

- 🌟【合同管理】确认到款 回执人错误
- 🌟【合同管理】添加发票 选择普票也提示输入开户行账号 地址电话
- 🌟【线索管理】模版不能下载问题
- 🌟修改了部分Bug




#### Author 赵龙
- 🌟 移除了返回功能


## 1.0.5

`2018-05-30`

#### Author 赵龙
- 🐞 完成了选择产品功能
- 🐞 修改了添加发票掉字段Bug
- 🐞 修复了其他未知Bug


#### Author 郑旭江
- 🐞 修复了点击超链接无法新建Tab的问题
- 🐞 修复了【公海管理】中编辑公海规则无法正确赋值的问题
- 🐞 修复了【公海管理】中换页请求错误的问题
- 🐞 修复了【公海管理】中公海规则日期识别错误的问题
- 🐞 修复了【公海管理】中公海规则地址级联格式错误的问题
- 🐞 修复了【资源管理】中合并无效的问题
- 🌟 新增了返回功能
- 💄 调整底部高度


## 1.0.4

`2018-05-29`

#### Author 赵龙
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1489](http://jira.dfwsgroup.cn/browse/CRM-1489)\

#### Author 郑旭江
- 🐞 修复了【报表中心】中部门获取错误的问题

## 1.0.3

`2018-05-28`

#### Author 赵龙

- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1489](http://jira.dfwsgroup.cn/browse/CRM-1489)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1494](http://jira.dfwsgroup.cn/browse/CRM-1494)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1527](http://jira.dfwsgroup.cn/browse/CRM-1527)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1529](http://jira.dfwsgroup.cn/browse/CRM-1529)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1540](http://jira.dfwsgroup.cn/browse/CRM-1540)
-
#### Author 郑旭江


## 1.0.2

`2018-05-28`

#### Author 赵龙

- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1489](http://jira.dfwsgroup.cn/browse/CRM-1489)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1494](http://jira.dfwsgroup.cn/browse/CRM-1494)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1527](http://jira.dfwsgroup.cn/browse/CRM-1527)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1529](http://jira.dfwsgroup.cn/browse/CRM-1529)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1540](http://jira.dfwsgroup.cn/browse/CRM-1540)
-
#### Author 郑旭江

- 🐞 修复了超链接 `target="_blank"` 拼写错误的问题
- 🐞 修复了【延期处理】中延期审核通过/不通过没有刷新状态的问题

## 1.0.1

`2018-05-28`

#### Author 郑旭江

- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1518](http://jira.dfwsgroup.cn/browse/CRM-1518)
- 🐞 修复了【公海管理】中公海业务线允许修改的的问题 [#CRM-1512](http://jira.dfwsgroup.cn/browse/CRM-1512)
- 🐞 修复了【公海管理】中搜索没有携带参数 `deps` 的问题 [#CRM-1508](http://jira.dfwsgroup.cn/browse/CRM-1508)
- 🐞 修复了【我的客户】中点击分配客户按钮选择器选项重复的问题 [#CRM-1408](http://jira.dfwsgroup.cn/browse/CRM-1408)
- 🐞 修复了【延期处理】中点击审核不刷新的问题 [#CRM-1532](http://jira.dfwsgroup.cn/browse/CRM-1532)
- 🐞 修复了【公海管理】中自动划入客户规则日期识别不正确的问题
-
#### Author 赵龙

- 🐞 修复了【我的合同】，集团版合同关联成功子公司合同后，点击子公司编号进入查看合同详情，只有“关联合同编号”可以修改，其余项全部禁止修改，只能查看，右上角只保留“提交”按钮，其余按钮全部去掉 [#CRM-1435](http://jira.dfwsgroup.cn/browse/CRM-1435)
- 🐞 修复了【我的客户】，新增联系人成功后，联系人数据列表，查看联系人详情，传真会掉字段 [#CRM-1483](http://jira.dfwsgroup.cn/browse/CRM-1483)
- 🐞 修复了【我的客户】，根据客户名称+手机号码，点击确定，自动获取客户所有的信息，传真是空白的，没有传过来 [#CRM-1488](http://jira.dfwsgroup.cn/browse/CRM-1488)
- 🐞 修复了【我的客户】，跟进客户名称+个人手机，自动获取填充客户信息，会有两个弹窗提示，点击确定后，信息填充完毕后，需要点击2次返回按钮，才能返回主页面 [#CRM-1489](http://jira.dfwsgroup.cn/browse/CRM-1489)
- 🐞 修复了【我的客户】我的合同和合同管理，添加回执成功后，查看回执详情，修改回执人的姓名，点击取消按钮，修改却成功了，建议所有的查看详情，删除取消按钮，只保留确定按钮，取消修改直接关闭弹窗 [#CRM-1494](http://jira.dfwsgroup.cn/browse/CRM-1494)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1502](http://jira.dfwsgroup.cn/browse/CRM-1502)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1526](http://jira.dfwsgroup.cn/browse/CRM-1526)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1527](http://jira.dfwsgroup.cn/browse/CRM-1527)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1529](http://jira.dfwsgroup.cn/browse/CRM-1529)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1530](http://jira.dfwsgroup.cn/browse/CRM-1530)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1531](http://jira.dfwsgroup.cn/browse/CRM-1531)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1535](http://jira.dfwsgroup.cn/browse/CRM-1535)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1536](http://jira.dfwsgroup.cn/browse/CRM-1536)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1540](http://jira.dfwsgroup.cn/browse/CRM-1540)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1540](http://jira.dfwsgroup.cn/browse/CRM-1540)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1541](http://jira.dfwsgroup.cn/browse/CRM-1541)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1545](http://jira.dfwsgroup.cn/browse/CRM-1545)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1547](http://jira.dfwsgroup.cn/browse/CRM-1547)
- 🐞 修复了Jira中的bug 详情请见Jira详细页 [#CRM-1548](http://jira.dfwsgroup.cn/browse/CRM-1548)





## 以下示例

## 3.5.3

`2018-05-20`


- 🐞 修复了 `Affix` 当 `offsetTop === 0`, 值将变为 `undefined` 的问题 [#10566](https://github.com/ant-design/ant-design/pull/10566)
- 🐞 修复了 `Menu` item 中的高亮链接颜色问题 [09d5e36](https://github.com/ant-design/ant-design/commit/09d5e36cfa27e371a7b4d4e68276a279698ea901)
- 🐞 修复了 `Input.Group` 组件阴影被遮盖的问题 [#10230](https://github.com/ant-design/ant-design/issues/10230)
- 🐞 修复了 `Transfer` 组件 checkbox 事件触发两次的问题 [`#10480`](https://github.com/ant-design/ant-design/issues/10480)
- 💄 统一 less 的变量命名 [12d3046](https://github.com/ant-design/ant-design/commit/12d3046687a0dcdb51fece08dd2bea64f185cc40)
- 💄 微调了 `Dropdown` 的样式 [8e2f72f](https://github.com/ant-design/ant-design/commit/8e2f72ffe0eb300f5997296726b02246bf990c8f)
- 💄 现在中文文档的组件会用中文语言包进行演示。[9b17a94](https://github.com/ant-design/ant-design/commit/9b17a943f5d57d40d65041b7b0c247add09d2851)
- 💄 主站主题切换 修改为 `antd-theme-generato` ，感谢 [@mzohaibqc](https://github.com/mzohaibqc) 的工作.
- 🌟 组件 `Badge` 新增 `title` 属性支持鼠标 hover 的时候显示。[74d81c2](https://github.com/ant-design/ant-design/commit/74d81c2d078a3c84b3e44cbfbdd99b8f479ea71d) [@ludwigbacklund](https://github.com/ludwigbacklund)
- 🌟 添加 `successPercent` 为 `Progress[format]` 的参数。[#10096](https://github.com/ant-design/ant-design/issues/10096)
- 🌟 更新 `rc-notification` 到 3.1.0 来支持组件 `Notification` 的 `maxCount` 属性。[#10161](https://github.com/ant-design/ant-design/pull/10161) [@jzhangs](https://github.com/jzhangs)
- 🌟 更新 `rc-cascader` 到 1.13.0 来支持组件 `Cascader` 的 `filedNames` 属性。[react-component/cascader#23](https://github.com/react-component/cascader/pull/23) [@405go](https://github.com/405go)
- 🌟 组件 `Notification` 支持通过 key 更新通知属性。 [react-component/notification#40](https://github.com/react-component/notification/pull/40) [@yevhen-hryhorevskyi](https://github.com/yevhen-hryhorevskyi)
- 🌟 组件 `List` 支持内置的翻页功能。[#10135](https://github.com/ant-design/ant-design/pull/10135)
