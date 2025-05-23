import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig'


export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>
        <Route path={'/dashboard'} component={lazy(() => import(`./dashboards`))} />
        <Route path={'/users'} component={lazy(() => import(`./users`))} />
        <Route path={'/audit'} component={lazy(() => import(`./audit`))} />
        <Route path={'/tickets'} component={lazy(() => import(`./tickets`))} />
        <Route path={'/claims'} component={lazy(() => import(`./expense`))} />
        <Route path={'/upload-documents'} component={lazy(() => import(`./uploadDocuments`))} />
        <Route path={'/documents'} component={lazy(() => import(`./documents`))} />
        <Route path={'/upload-phonecalls'} component={lazy(() => import(`./uploadDocuments/phonecall`))} />
        <Route path={'/policy'} component={lazy(() => import(`./policy`))} />
        <Route path={'/survey'} component={lazy(() => import(`./survey`))} />
        <Route path={'/claims-statistics'} component={lazy(() => import(`./expense/statistics`))} />
        <Route path={'/system/users'} component={lazy(() => import(`./system/users`))} />
        <Route path={'/system/roles'} component={lazy(() => import(`./system/roles`))} />
      </Switch>
    </Suspense>
  )
}

export default React.memo(AppViews);
