import React from 'react'
import { Route, Switch } from 'react-router-dom';
import RoleList from './list'
import RolePermissionList from './permissions'

const Roles = props => {
  const { match } = props
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={RoleList} />
      <Route exact path={`${match.url}/permissions/:id`} component={RolePermissionList} />
    </Switch>
  )
}

export default Roles

