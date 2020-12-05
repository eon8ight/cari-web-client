import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import anonymousRequired from '../../hocs/anonymousRequired';
import sessionRequired from '../../hocs/sessionRequired';

import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';

const Router = props => {
  const match = useRouteMatch();

  const WrappedLoginPage = anonymousRequired(LoginPage);
  const WrappedLogoutPage = sessionRequired(LogoutPage, true);

  return (
    <Switch>
      <Route exact path={`${match.url}/login`}>
        <WrappedLoginPage {...props} />
      </Route>
      <Route exact path={`${match.url}/logout`}>
        <WrappedLogoutPage {...props} />
      </Route>
    </Switch>
  )
}

export default Router;