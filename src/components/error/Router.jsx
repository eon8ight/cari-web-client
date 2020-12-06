import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const Router = (props) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/404`}>
        <NotFoundPage {...props} />
      </Route>
      <Route exact path={`${match.url}/401`}>
        <UnauthorizedPage {...props} />
      </Route>
    </Switch>
  );
};

export default Router;