import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import EditAestheticPage from './pages/EditAestheticPage';

const Router = props => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/edit/:aesthetic`}>
        <EditAestheticPage {...props} />
      </Route>
    </Switch>
  );
};

export default Router;