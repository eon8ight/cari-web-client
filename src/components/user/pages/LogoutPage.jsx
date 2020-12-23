import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

import {
  Intent,
  Spinner
} from '@blueprintjs/core';

import { API_ROUTE_AUTH_LOGOUT } from '../../../functions/constants';

const LogoutPage = props => {
  const addMessage = props.addMessage;
  const session = props.session;
  const setSession = props.setSession;

  const [calledLogout, setCalledLogout] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if(session.isValid && !calledLogout) {
      setCalledLogout(true);

      axios.post(API_ROUTE_AUTH_LOGOUT, {}, { withCredentials: true })
      .then(res => {
        addMessage('You have successfully logged out.');
        setLoggedOut(true);
        setSession({ isValid: false });
      })
      .catch(err => addMessage(`An error occurred: ${err}`, Intent.DANGER));
    }
  }, [session.isValid, addMessage, calledLogout, setSession]);

  if (session.isValid === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (!session.isValid || loggedOut) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Logout</title>
      </Helmet>
      <Spinner size={100} />
    </>
  );
};

export default LogoutPage;