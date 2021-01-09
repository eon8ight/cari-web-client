import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import CreateAestheticPage from './pages/CreateAestheticPage';
import EditAestheticPage from './pages/EditAestheticPage';

const Router = props => {
  const match = useRouteMatch();
  const session = props.session;

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