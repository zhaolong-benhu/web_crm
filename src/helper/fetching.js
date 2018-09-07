import store from 'store'
// import Cookies from 'js-cookie'

/**
 * action 生成器
 * @param {object} options
 * url: 请求地址
 * type: action type
 * should: 判断缓存失效
 * begin: 请求开始前
 * done: 请求完成
 * error: 请求错误时
 */
export default (options) => {
  return (params = {}, opts = {}) => (dispatch, getState) => {
    const { url, type, should, begin, done, error } = { ...options, ...opts }

    if (!should || should(params, getState)) {
      begin && dispatch({
        type: type.begin,
        ...begin(params, getState),
      })
      return pipeline(url, params).then(json => {
        dispatch({
          type,
          ...done(json, params, getState),
        })
        return json
      }).catch(err => {
        dispatch({
          type: type.error,
          ...(error ? error(err, params, getState) : { error: err }),
        })
        throw err
      })
    } else {
      return Promise.resolve(null)
    }
  }
}

export function pipeline(uri, params, opt = {}) {
  // const sUrl = toRealUrl(uri)
  const headers = new Headers()
  headers.append('x-requested-with', 'XMLHttpRequest')
  // headers.append('Content-Type', 'application/x-www-form-urlencoded')
  return fetch(uri, {
    credentials: 'include',
    method: 'post',
    headers,
    body: parseBody(params),
    ...opt,
  }).then(res => {
    if (res.status >= 400) throw res
    try {
      return res.json()
    } catch (err) {
      console.log(err)
      return res
    }
  })
}

/**
 * 请求参数处理
 * @param {object} params
 */
export function parseBody(params = {}) {
  const auth = store.get('crm') || {}
  const user = auth.user || {}
  params = {
    ...params,
    token: auth.token,
    loginName: user.username || user.userName,
  }
  const formData = new FormData()
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key])
  })
  return formData
}
