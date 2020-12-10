import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Intent, Spinner } from '@blueprintjs/core';

import { addMessage } from '../../../redux/actions';
import useAuthtoken from '../../../hooks/useAuthtoken';
import useSession from '../../../hooks/useSession';

import {
  API_ROUTE_USER_CONFIRM,
  TOKEN_TYPE_CONFIRM,
} from '../../../functions/constants';

const ConfirmPage = (props) => {
  const session = useSession();
  const authtoken = useAuthtoken(TOKEN_TYPE_CONFIRM);

  const [calledApi, setCalledApi] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const addMessage = props.addMessage;

  useEffect(() => {
    if(authtoken.token && !calledApi) {
      setCalledApi(true);

      const postBody = { token: authtoken.token };
      const postOpts = { headers: { 'Content-Type': 'application/json' } };

      axios.post(API_ROUTE_USER_CONFIRM, postBody, postOpts)
        .then(res => setConfirmed(true))
        .catch(err => addMessage(`An error has occurred: ${err}`, Intent.DANGER));
    }
  }, [addMessage, authtoken.token, calledApi]);

  if (session.isValid === null || authtoken.isValid === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (session.isValid) {
    return <Redirect to="/" />;
  }

  if (!authtoken.isValid) {
    return <Redirect to="/error/401" />;
  }

  if(confirmed) {
    addMessage(
      'You have successfully confirmed your account. You may now log in.',
      Intent.SUCCESS
    );

    return <Redirect to="/user/login" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Confirm Your Account</title>
      </Helmet>
      <Spinner size={Spinner.SIZE_LARGE} />
    </>
  );
};

export default connect(null, { addMessage })(ConfirmPage);