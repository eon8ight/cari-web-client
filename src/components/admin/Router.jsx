import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import EditAestheticPage from './pages/EditAestheticPage';

import sessionRequired from '../../hocs/sessionRequired';

const Router = props => {
  const match = useRouteMatch();

  const WrappedEditAestheticPage = sessionRequired(EditAestheticPage);

  return (
    <Switch>
      <Route path={`${match.url}/edit/:aesthetic`}>
        <WrappedEditAestheticPage {...props} />
      </Route>
    </Switch>
  );
};

export default Router;