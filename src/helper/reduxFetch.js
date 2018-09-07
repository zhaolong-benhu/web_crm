/**
 * Created by huangchao on 13/11/2017.
 */
import {singleFetch} from './autoFetch'

export function singleApi(...args) {
  const { url, action, prelude, should } = getArgs(args)
  return (args = {}) => (dispatch, getState) => {
    const state = getState()
    if (!should || should(args, state)) {
      prelude && dispatch(prelude())
      return singleFetch(url, args)
        .then(json => {
          dispatch(action(args, json))
          return json
        })
        .catch(data => {
          if (data.code === -2) {
            // console.log(state.history)
            // state.history.replace('/login')
          }
        })
    }
  }
}

function getArgs(args) {
  if (args[0] instanceof Object) {
    return args[0]
  } else {
    return {
      url: args[0],
      action: args[1],
    }
  }
}
