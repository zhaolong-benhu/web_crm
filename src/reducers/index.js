/**
 * Created by huangchao on 13/11/2017.
 */
import { combineReducers } from 'redux'
import history from './history'
import home from './home'
import clueSystem from './clueSystem'
import clueDetail from './clueDetail'
import search from './search'
import myClue from './myClue'
import internationSystem from './internationSystem'
import internation from './internation'
import internationRule from './internationRule'
import selectPeople from './selectPeople'
import resourceSystem from './resourceSystem'
import clientSystem from './clientSystem'
import myClient from './myClient'
import businessSystem from './businessSystem'
import helpSystem from './helpSystem'
import delaySystem  from './delaySystem'
import contractSystem from './contractSystem'
import myInternation from './myInternation'
import followSystem from './followSystem'
import reportForms from './reportForms'
import giftSystem from './giftSystem'
import operateSystem from './operateSystem'
import department from './department'
import clientToQuit from './clientToQuit'
import powerSystem from './powerSystem'

const crmStore = combineReducers({
  history,
  home,
  search,
  clueSystem,
  clueDetail,
  myClue,
  internationSystem,
  internation,
  internationRule,
  selectPeople,
  resourceSystem,
  clientSystem,
  myClient,
  businessSystem,
  helpSystem,
  contractSystem,
  delaySystem,
  myInternation,
  followSystem,
  reportForms,
  giftSystem,
  operateSystem,
  department,
  clientToQuit,
  powerSystem,
})

export default crmStore
