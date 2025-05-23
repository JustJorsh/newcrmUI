import React from 'react'
import { Route, Switch } from 'react-router-dom';
import UsersList from './list'
import SearchUser from './user2'
import User from './user'


const Users = props => {
  const { match } = props
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={UsersList} />
      <Route exact path={`${match.url}/search`} component={SearchUser} />
      <Route exact path={`${match.url}/:id`} component={User} />
    </Switch>
  )
}

export default Users

