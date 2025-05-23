import React from 'react'
import { Route, Switch } from 'react-router-dom';
import List from './list';

const Users = props => {
  const { match } = props
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={List} />
    </Switch>
  )
}

export default Users

