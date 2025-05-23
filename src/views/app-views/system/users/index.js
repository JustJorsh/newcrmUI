import React from 'react'
import { Route, Switch } from 'react-router-dom';
import AuditList from './list'

const Users = props => {
  const { match } = props
  return (
    <Switch>
      <Route path={`${match.url}`} component={AuditList} />
    </Switch>
  )
}

export default Users

