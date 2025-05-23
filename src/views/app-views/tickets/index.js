import React from 'react'
import { Route, Switch } from 'react-router-dom';
import List from './list';
import Details from  './details';
import Complains from  './complains';

const Users = props => {
  const { match } = props
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={List} />
      <Route exact path={`${match.url}/:status`} component={List} />
      <Route exact path={`${match.url}/details/:id`} component={Details} />
      <Route exact path={`${match.url}/complains/list`} component={Complains} />
    </Switch>
  )
}

export default Users

