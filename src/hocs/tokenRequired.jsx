import React from 'react';
import { Redirect } from 'react-router-dom';

import { Spinner } from '@blueprintjs/core';

import useAuthtoken from '../hooks/useAuthtoken';

const tokenRequired = (Component, type) => (props => {
  const authtoken = useAuthtoken(type);
  const claims = authtoken.claims;

  if (typeof claims === 'undefined')
    return <Spinner size={100} />;

  if (!claims)
    return <Redirect to="/error/401" />;

  return <Component authtoken={authtoken} {...props} />;
});

export default tokenRequired;