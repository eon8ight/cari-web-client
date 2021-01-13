import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import CreateAestheticPage from './pages/CreateAestheticPage';
import EditAestheticMediaPage from './pages/EditAestheticMediaPage';
import EditAestheticPage from './pages/EditAestheticPage';

const Router = props => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/create`}>
        <CreateAestheticPage {...props} />
      </Route>
      <Route path={`${match.url}/edit/:aesthetic`}>
        <EditAestheticPage {...props} />
      </Route>
      <Route path={`${match.url}/editMedia/:aesthetic`}>
        <EditAestheticMediaPage {...props} />
      </Route>
    </Switch>
  );
};

export default Router;