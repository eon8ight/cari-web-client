import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Button,
  Card,
  FormGroup,
  InputGroup,
  Intent
} from '@blueprintjs/core';

import PasswordInput from '../../common/PasswordInput';

import { addMessage } from '../../../redux/actions';
import { API_ROUTE_USER_REGISTER } from '../../../functions/constants';

const RegisterPage = props => {
  const [registered, setRegistered] = useState(false);

  const [emailAddress, setEmailAddress] = useState('');
  const [emailAddressIntent, setEmailAddressIntent] = useState(Intent.NONE);
  const [emailAddressHelperText, setEmailAddressHelperText] = useState('');

  const [username, setUsername] = useState('');
  const [usernameIntent, setUsernameIntent] = useState(Intent.NONE);
  const [usernameHelperText, setUsernameHelperText] = useState('');

  const [password, setPassword] = useState('');
  const [passwordIntent, setPasswordIntent] = useState(Intent.NONE);
  const [passwordHelperText, setPasswordHelperText] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordIntent, setConfirmPasswordIntent] = useState(Intent.NONE);
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('');

  const validateEmailAddress = () => {
    let hasError = false;

    if (!emailAddress) {
      setEmailAddressIntent(Intent.DANGER);
      setEmailAddressHelperText('Email address is required.');
      hasError = true;
    } else {
      setEmailAddressIntent(Intent.NONE);
      setEmailAddressHelperText('');
    }

    return hasError
  };

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

  const handleEmailAddressChange = event => setEmailAddress(event.target.value);
  const handleUsernameChange = event => setUsername(event.target.value);
  const handlePasswordChange = event => setPassword(event.target.value);
  const handleConfirmPasswordChange = event => setConfirmPassword(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();

    const hasEmailAddressError = validateEmailAddress();
    const hasUsernameError = validateUsername();
    const hasPasswordError = validatePassword();

    if (hasEmailAddressError || hasUsernameError || hasPasswordError) {
      return;
    }

    const postBody = { emailAddress, username, password };
    const postOpts = { headers: { 'Content-Type': 'application/json' } };

    axios.post(API_ROUTE_USER_REGISTER, postBody, postOpts)
      .then(res => setRegistered(true))
      .catch(err => {
        const errRes = err.response;

        if (errRes.status === 403) {
          errRes.data.fieldErrors.forEach(fieldError => {
            console.log(fieldError);
            switch (fieldError.field) {
              case 'emailAddress':
                setEmailAddressIntent(Intent.DANGER);
                setEmailAddressHelperText(fieldError.message);
                break;
              case 'username':
                setUsernameIntent(Intent.DANGER);
                setUsernameHelperText(fieldError.message);
                break;
              default:
                props.addMessage(`An error has occurred: ${fieldError.message}`);
            }
          });
        } else {
          props.addMessage(`An error has occurred: ${err}`, Intent.DANGER);
        }
      });
  };

  if (registered) {
    props.addMessage(
      'You have successfully registered. Please check your inbox for a link to confirm your account.',
      Intent.SUCCESS
    );

    return <Redirect to="/auth/login" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Register</title>
      </Helmet>
      <Card>
        <form onSubmit={handleSubmit}>
          <FormGroup helperText={emailAddressHelperText}>
            <InputGroup intent={emailAddressIntent} large={true} leftIcon="envelope"
              onChange={handleEmailAddressChange} placeholder="Email Address" type="text"
              value={emailAddress} />
          </FormGroup>
          <FormGroup helperText={usernameHelperText}>
            <InputGroup intent={usernameIntent} large={true} leftIcon="user"
              onChange={handleUsernameChange} placeholder="Username" type="text"
              value={username} />
          </FormGroup>
          <PasswordInput helperText={passwordHelperText} intent={passwordIntent}
            onChange={handlePasswordChange} />
          <PasswordInput helperText={confirmPasswordHelperText}
            onChange={handleConfirmPasswordChange} intent={confirmPasswordIntent}
            placeholder="Confirm Password" />
          <Button intent={Intent.PRIMARY} icon="confirm" type="submit">Register</Button>
        </form>
      </Card>
    </>
  );
};

export default connect(null, { addMessage })(RegisterPage);