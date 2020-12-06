import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Intent, Spinner } from '@blueprintjs/core';

import { addMessage } from '../../../redux/actions';
import { API_ROUTE_USER_CONFIRM } from '../../../functions/constants';

const ConfirmPage = (props) => {
  const [calledApi, setCalledApi] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const token = props.authtoken.token;

  useEffect(() => {
    if(token && !calledApi) {
      setCalledApi(true);

      const postBody = { token };
      const postOpts = { headers: { 'Content-Type': 'application/json' } };

      axios.post(API_ROUTE_USER_CONFIRM, postBody, postOpts)
        .then(res => setConfirmed(true))
        .catch(err => props.addMessage(`An error has occurred: ${err}`, Intent.DANGER));
    }
  }, [props, token, calledApi]);

  if(confirmed) {
    props.addMessage(
      'You have successfully confirmed your account. You may now log in.',
      Intent.SUCCESS
    );

    return <Redirect to="/auth/login" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Confirm Your Account</title>
      </Helmet>
      <Spinner className="spinner-padded" size={100} />
    </>
  );
};

export default connect(null, { addMessage })(ConfirmPage);