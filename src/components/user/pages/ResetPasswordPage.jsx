import axios from 'axios';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Button,
  Card,
  Intent
} from '@blueprintjs/core';

import PasswordInput from '../../common/PasswordInput';

import { API_ROUTE_USER_RESET_PASSWORD } from '../../../functions/constants';
import { addMessage } from '../../../redux/actions';

const ResetPasswordPage = props => {
  const [passwordReset, setPasswordReset] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordIntent, setPasswordIntent] = useState(Intent.NONE);
  const [passwordHelperText, setPasswordHelperText] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordIntent, setConfirmPasswordIntent] = useState(Intent.NONE);
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('');

  const token = props.authtoken.token;

  const validatePassword = () => {
    let hasError = false;

    if (!password) {
      setPasswordIntent(Intent.DANGER);
      setPasswordHelperText('Password is required.');
      hasError = true;
    } else if (!confirmPassword) {
      setConfirmPasswordIntent(Intent.DANGER);
      setConfirmPasswordHelperText('Password is required.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordIntent(Intent.DANGER);
      setConfirmPasswordIntent(Intent.DANGER);
      setConfirmPasswordHelperText('Passwords must match.');
      hasError = true;
    } else {
      setPasswordIntent(Intent.NONE);
      setConfirmPasswordIntent(Intent.NONE);
      setPasswordHelperText('');
      setConfirmPasswordHelperText('');
    }

    return hasError;
  };

  const handlePasswordChange = event => setPassword(event.target.value);
  const handleConfirmPasswordChange = event => setConfirmPassword(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();

    if (validatePassword(password, confirmPassword))
      return;

    const postUrl = `${API_ROUTE_USER_RESET_PASSWORD}?authtoken=${token}`;
    const postBody = { token, password };
    const postOpts = { headers: { 'Content-Type': 'application/json' } };

    axios.post(postUrl, postBody, postOpts)
      .then(res => setPasswordReset(true))
      .catch(err => props.addMessage(`An error has occurred: ${err}`, Intent.DANGER));
  };

  if (passwordReset) {
    props.addMessage(
      'Your password has been successfully reset. You may now use your new password to log in.',
      Intent.SUCCESS
    );

    return <Redirect to="/auth/login" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Reset Password</title>
      </Helmet>
      <Card>
        <p>Please enter a new password.</p>
        <form onSubmit={handleSubmit}>
          <PasswordInput helperText={passwordHelperText} intent={passwordIntent}
            onChange={handlePasswordChange} placeholder="New Password" />
          <PasswordInput helperText={confirmPasswordHelperText} intent={confirmPasswordIntent}
            onChange={handleConfirmPasswordChange} placeholder="Confirm New Password" />
          <Button icon="confirm" intent={Intent.PRIMARY} type="submit">Reset Password</Button>
        </form>
      </Card>
    </>
  );
};

export default connect(null, { addMessage })(ResetPasswordPage);