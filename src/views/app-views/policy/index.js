import React from 'react'
import { Route, Switch } from 'react-router-dom';
import List from './list';
import Cancellation from  './cancellation';
import Group from './group';
import MissedKyc from "./missedkyc";
import MissedPremium from "./missedpremuim";

const Policy = props => {
  const { match } = props
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={List} />
      <Route exact path={`${match.url}/missed-kyc`} component={MissedKyc} />
      <Route exact path={`${match.url}/missed-premuim`} component={MissedPremium} />
      <Route exact path={`${match.url}/cancellation`} component={Cancellation} />
      <Route exact path={`${match.url}/group`} component={Group} />
    </Switch>
  )
}

export default Policy

