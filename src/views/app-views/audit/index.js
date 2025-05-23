import React from 'react'
import { Route, Switch } from 'react-router-dom';
import UserList from './list'

const Users = props => {
  const { match } = props
  return (
    <Switch>
      <Route path={`${match.url}`} component={UserList} />
    </Switch>
  )
}

export default Users

