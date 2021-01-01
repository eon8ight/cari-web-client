import axios from 'axios';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

import {
  Button,
  Card,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  Spinner,
} from '@blueprintjs/core';

import { API_ROUTE_MAIL_FORGOT_PASSWORD } from '../../../functions/constants';

const ForgotPasswordPage = props => {
  const session = props.session;

  const [isSending, setIsSending] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [username, setUsername] = useState('');
  const [usernameIntent, setUsernameIntent] = useState(Intent.NONE);
  const [usernameHelperText, setUsernameHelperText] = useState('');

  if (session.isValid === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (session.isValid) {
    return <Redirect to="/" />;
  }

  const validateUsername = () => {
    let hasError = false;

    if (!username) {
      setUsernameIntent(Intent.DANGER);
      setUsernameHelperText('Username is required.');
      hasError = true;
    } else {
      setUsernameIntent(Intent.NONE);
      setUsernameHelperText('');
    }

    return hasError;
  };

  const handleUsernameChange = event => setUsername(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateUsername()) {
      return;
    }

    setIsSending(true);

    const postBody = { username };
    const postOpts = { headers: { 'Content-Type': 'application/json' } };

    axios.post(API_ROUTE_MAIL_FORGOT_PASSWORD, postBody, postOpts)
      .then(res => setResetEmailSent(true))
      .catch(err => {
        if (err.response.status === 400) {
          setUsernameIntent(Intent.DANGER);
          setUsernameHelperText(err.response.data.message);
        } else {
          props.addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER);
        }

        setIsSending(false);
      });
  };

  if (resetEmailSent) {
    props.addMessage(
      'An email containing a link to reset your password has been sent to the email address you ' +
      'used to register. Please check your inbox.'
    );

    return <Redirect to="/user/login" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Forgot Password</title>
      </Helmet>
      <Card>
        <p>
          Please enter the username or email address you signed up with to receive a link to reset
          your password.
          </p>
        <form onSubmit={handleSubmit}>
          <FormGroup helperText={usernameHelperText}>
            <ControlGroup>
              <InputGroup fill={true} intent={usernameIntent} leftIcon="user" onChange={handleUsernameChange}
                placeholder="Username or Email Address" type="text" />
              <Button disabled={isSending} icon="log-in" intent={Intent.PRIMARY} type="submit">Send</Button>
            </ControlGroup>
          </FormGroup>
        </form>
        <p>
          An email containing a unique, secure link to the password reset form will be sent to the
          email address you registered with.
        </p>
        {isSending && <Spinner />}
      </Card>
    </>
  );
};

export default ForgotPasswordPage;