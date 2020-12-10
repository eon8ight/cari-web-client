import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import ConfirmPage from './pages/ConfirmPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from '../user/pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';

const Router = (props) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/confirm`}>
        <ConfirmPage {...props} />
      </Route>
      <Route exact path={`${match.url}/forgotPassword`}>
        <ForgotPasswordPage {...props} />
      </Route>
      <Route path={`${match.url}/login`}>
        <LoginPage {...props} />
      </Route>
      <Route path={`${match.url}/logout`}>
        <LogoutPage {...props} />
      </Route>
      <Route path={`${match.url}/register`}>
        <RegisterPage {...props} />
      </Route>
      <Route path={`${match.url}/resetPassword`}>
        <ResetPasswordPage {...props} />
      </Route>
      <Route exact path={`${match.url}/settings`}>
        <SettingsPage {...props} />
      </Route>
    </Switch>
  );
};

export default Router;