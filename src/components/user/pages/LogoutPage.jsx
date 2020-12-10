import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

import {
  Intent,
  Spinner
} from '@blueprintjs/core';

import { addMessage } from '../../../redux/actions';
import useSession from '../../../hooks/useSession';

import { API_ROUTE_AUTH_LOGOUT } from '../../../functions/constants';

const LogoutPage = props => {
  const session = useSession();

  const [calledLogout, setCalledLogout] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const addMessage = props.addMessage;

  useEffect(() => {
    if(session.isValid && !calledLogout) {
      setCalledLogout(true);

      axios.post(API_ROUTE_AUTH_LOGOUT, {}, { withCredentials: true })
      .then(res => {
        addMessage('You have successfully logged out.');
        setLoggedOut(true);
      })
      .catch(err => addMessage(`An error occurred: ${err}`, Intent.DANGER));
    }
  }, [session.isValid, addMessage, calledLogout]);

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

export default connect(
  null,
  { addMessage }
)(LogoutPage);