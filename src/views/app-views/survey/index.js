import React from 'react'
import { Route, Switch } from 'react-router-dom';
import List from './list';
import Rating from  './rating';

const Survey = props => {
  const { match } = props
  return (
    <Switch>
      <Route exact path={`${match.url}`} component={List} />
      <Route exact path={`${match.url}/rating/:id`} component={Rating} />
    </Switch>
  )
}

export default Survey;

