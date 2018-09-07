/**
 * Created by huangchao on 17/11/2017.
 */
import {
  HISTORY_SET_HISTORY,
} from '../actions/history'

export default (state = {}, action) => {
  switch (action.type) {
    case HISTORY_SET_HISTORY:
      return action.history
    default:
      return state
  }
}
