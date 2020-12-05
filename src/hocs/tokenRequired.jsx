import React from 'react';
import { Redirect } from 'react-router-dom';

import { Spinner } from '@blueprintjs/core';

import useAuthtoken from '../hooks/useAuthtoken';

const tokenRequired = Component => (props => {
  const authtoken = useAuthtoken();
  const token = authtoken.token;

  if (typeof token === 'undefined')
    return <Spinner size={100} />;

  if (!token)
    return <Redirect to="/oops/401" />;

  return <Component authtoken={authtoken} {...props} />;
});

export default tokenRequired;