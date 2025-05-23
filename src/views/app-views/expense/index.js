import React from 'react'
import { Route, Switch } from 'react-router-dom';
import List from './list';
import Details from  './details';

const Users = props => {
  const { match } = props
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={List} />
      <Route exact path={`${match.url}/:status`} component={List} />
      <Route exact path={`${match.url}/details/:id`} component={Details} />
    </Switch>
  )
}

export default Users

