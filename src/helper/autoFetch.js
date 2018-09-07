/**
 * Created by huangchao on 13/11/2017.
 */
import { message } from 'antd'
import {pipeline} from './fetching'

export const singleFetch = (uri, args = {}) => {
  return pipeline(uri, args)
    .then(json => {
      if (json.code === -1) {
        throw json
      }
      return json
    })
    .catch(err => {
      message.error(err.msg || '接口请求出错，请检查！', 1)
      throw err
    })
}
