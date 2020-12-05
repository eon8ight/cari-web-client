import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import AestheticPage from './pages/AestheticPage';
import AestheticsListPage from './pages/AestheticsListPage';

const Router = props => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/:aestheticUrlName`}>
        <AestheticPage {...props} />
      </Route>
      <Route path={`${match.url}`}>
        <AestheticsListPage {...props} />
      </Route>
    </Switch>
  );
};

export default Router;