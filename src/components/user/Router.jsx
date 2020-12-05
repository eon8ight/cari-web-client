import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import anonymousRequired from '../../hocs/anonymousRequired';
import sessionRequired from '../../hocs/sessionRequired';

import ConfirmPage from './pages/ConfirmPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';

const Router = (props) => {
  const match = useRouteMatch();

  const WrappedConfirmPage = anonymousRequired(ConfirmPage);
  const WrappedForgotPasswordPage = anonymousRequired(ForgotPasswordPage);
  const WrappedRegisterPage = anonymousRequired(RegisterPage);
  const WrappedResetPasswordPage = anonymousRequired(ResetPasswordPage);
  const WrappedSettingsPage = sessionRequired(SettingsPage);

  return (
    <Switch>
      <Route path={`${match.url}/confirm`}>
        <WrappedConfirmPage {...props} />
      </Route>
      <Route exact path={`${match.url}/forgotPassword`}>
        <WrappedForgotPasswordPage {...props} />
      </Route>
      <Route path={`${match.url}/register`}>
        <WrappedRegisterPage {...props} />
      </Route>
      <Route path={`${match.url}/resetPassword`}>
        <WrappedResetPasswordPage {...props} />
      </Route>
      <Route exact path={`${match.url}/settings`}>
        <WrappedSettingsPage {...props} />
      </Route>
    </Switch>
  );
};

export default Router;