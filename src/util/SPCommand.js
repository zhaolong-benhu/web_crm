export default class SPCommand {
  constructor(wssoftphone, ecommand, ins, delegatorId) {
    /**
     * 命令枚举值
     */
    this.command = ecommand
    this.objectClass = 'SPCommand'
    if (wssoftphone) {
      this.delegatorId = wssoftphone.delegatorId
      this.ins = wssoftphone.ins
    } else {
      this.delegatorId = delegatorId
      this.ins = ins
    }
    /**
     * 命令参数，以KeyValue的方式存储，实际参数需要参考具体的API定义
     */
    this.params = {}
  }

  pushParams(key, value) {
    this.params[key] = value
  }

  toString() {
    JSON.stringify(this)
  }
}
