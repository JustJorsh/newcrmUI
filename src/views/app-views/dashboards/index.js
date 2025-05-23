import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Dashboards = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}/`} component={lazy(() => import(`./default`))} />
    </Switch>
  );
};

export default Dashboards;
