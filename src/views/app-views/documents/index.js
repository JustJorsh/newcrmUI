import React from 'react'
import { Route, Switch } from 'react-router-dom';
import List from './list';

const Documents = props => {
  const { match } = props
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={List} />
    </Switch>
  )
}

export default Documents

