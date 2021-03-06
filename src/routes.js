import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

export default (
  <Switch>
    <Route
      path="/home/system"
      component={require('./containers/Home').default} />
    <Route
      path="/home/seeting"
      component={require('./containers/Seeting').default}
    />
    <Route
      path="/home/logs"
      component={require('./containers/Logs').default}
    />
    <Route
      path="/home/operate"
      component={require('./containers/Operate').default}
    />
    <Route
      path="/CRM/clueSystem"
      component={require('./containers/ClueSystem').default}
    />
    <Route
      path="/CRM/resourceSystem"
      component={require('./containers/ResourceSystem').default}
    />
    <Route
      path="/CRM/myClue"
      component={require('./containers/MyClue').default}
    />
    <Route
      path="/CRM/myInternation"
      component={require('./containers/MyInternation').default}
    />
    <Route
      path="/CRM/myClient"
      component={require('./containers/MyClient').default}
    />
    <Route
      path="/CRM/myBusiness"
      component={require('./containers/MyBusiness').default}
    />
    <Route
      path="/contact"
      component={require('./containers/Contact').default}
    />
    <Route
      path="/follow"
      component={require('./containers/Follow').default}
    />
    <Route
      path="/gift"
      component={require('./containers/Gift').default}
    />
    <Route
      path="/CRM/internationSystem"
      component={require('./containers/InternationSystem').default}
    />
    <Route
      path="/CRM/clientSystem"
      component={require('./containers/ClientSystem').default}
    />
    <Route
      path="/CRM/client"
      component={require('./containers/Client').default}
    />
    <Route
      path="/CRM/businessSystem"
      component={require('./containers/BusinessSystem').default}
    />
    <Route
      path="/CRM/helpSystem"
      component={require('./containers/HelpSystem').default}
    />
    <Route
      path="/CRM/delaySystem"
      component={require('./containers/DelaySystem').default}
    />
    <Route
      path="/CRM/followSystem"
      component={require('./containers/FollowSystem').default}
    />
    <Route
      path="/CRM/myContract"
      component={require('./containers/MyContract').default}
    />
    <Route
      path="/CRM/contract/detail"
      component={require('./containers/ContractDetail').default}
    />
    <Route
      path="/CRM/newContract"
      component={require('./containers/NewContract').default}
    />
    <Route
      path="/CRM/contractSystem"
      component={require('./containers/ContractSystem').default}
    />
    <Route
      path="/form/followupRecord"
      component={require('./containers/ReportForms/FollowupRecord').default}
    />
    <Route
      path="/form/salesCalculate"
      component={require('./containers/ReportForms/SalesCalculate').default}
    />
    <Route
      path="/form/salesfunnel"
      component={require('./containers/ReportForms/Salesfunnel').default}
    />
    <Route
      path="/form/vocationalGather"
      component={require('./containers/ReportForms/VocationalGather').default}
    />
    <Route
      path="/form/contractGather"
      component={require('./containers/ReportForms/ContractGather').default}
    />
    <Route
      path="/form/salesRank"
      component={require('./containers/ReportForms/SalesRank').default}
    />
    <Route
      path="/form/blueChangeRate"
      component={require('./containers/ReportForms/BlueChangeRate').default}
    />
    <Route
      path="/CRM/internation"
      component={require('./containers/Internation').default}
    />
    <Route
      path="/CRM/internationRule"
      component={require('./containers/InternationRule').default}
    />
    <Route
      path="/CRM/powerSystem"
      component={require('./containers/PowerSystem').default}
    />
    <Route
      path="/personnel/PermissionSystem"
      component={require('./containers/PermissionSystem').default}
    />
    <Route
      path="/personnel/clientToQuit"
      component={require('./containers/ClientToQuit').default}
    />
    <Route
      path="/clue"
      component={require('./containers/Clue').default}
    />
    <Route
      path="/login"
      component={require('./containers/Login').default}
    />
    <Route
    path="/transfer"
    component={require('./containers/Transfer').default}
    />
    <Route
    path="/fed/logout"
    component={require('./containers/Logout').default}
    />
    <Redirect to="/login" />
  </Switch>
)
