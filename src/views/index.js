import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "layouts/app-layout";
import AuthLayout from 'layouts/auth-layout';
import AppLocale from "lang";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from 'antd';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig'
import { AUTH_TOKEN } from "redux/constants";

function RouteInterceptor({ children, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{ pathname: "", state: { from: location } }}
            />
          )
      }
    />
  );
}

export const Views = (props) => {
  const { location } = props;
  const currentAppLocale = AppLocale['en'];
  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}>
      <ConfigProvider locale={currentAppLocale.antd}>
        <Switch>
          <Route exact path="/">
            <Redirect to={"/login"} />
          </Route>
          <Route path={["/login", "/reset-password", "/set-password"]}>
            <AuthLayout />
          </Route>
          <RouteInterceptor path={""} isAuthenticated={localStorage.getItem(AUTH_TOKEN)}>
            <AppLayout location={location} />
          </RouteInterceptor>
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  )
}


const mapStateToProps = ({ theme, auth }) => {
  const { locale } = theme;
  const { token } = auth;
  return { locale, token }
};

export default withRouter(connect(mapStateToProps)(Views));