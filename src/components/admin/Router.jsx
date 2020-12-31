import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { Spinner } from '@blueprintjs/core';

import { ROLE_ADMIN } from '../../functions/constants';

import CreateAestheticPage from './pages/CreateAestheticPage';
import EditAestheticPage from './pages/EditAestheticPage';

const Router = props => {
  const match = useRouteMatch();
  const session = props.session;

  if (session.isValid === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (!(session.isValid && session.claims.roles.includes(ROLE_ADMIN))) {
      return <Redirect to="/error/403" />;
  }

  return (
    <Switch>
      <Route path={`${match.url}/create`}>
        <CreateAestheticPage {...props} />
      </Route>
      <Route path={`${match.url}/edit/:aesthetic`}>
        <EditAestheticPage {...props} />
      </Route>
    </Switch>
  );
};

export default Router;