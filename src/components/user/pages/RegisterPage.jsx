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
  Intent,
  Spinner,
} from '@blueprintjs/core';

import PasswordInput from '../../common/PasswordInput';

import { addMessage } from '../../../redux/actions';

import {
  API_ROUTE_USER_REGISTER,
  TOKEN_TYPE_INVITE,
} from '../../../functions/constants';

import useAuthtoken from '../../../hooks/useAuthtoken';
import useSession from '../../../hooks/useSession';

const RegisterPage = props => {
  const session = useSession();
  const authtoken = useAuthtoken(TOKEN_TYPE_INVITE);

  const [registered, setRegistered] = useState(false);

  const [username, setUsername] = useState('');
  const [usernameIntent, setUsernameIntent] = useState(Intent.NONE);
  const [usernameHelperText, setUsernameHelperText] = useState('');

  const [password, setPassword] = useState('');
  const [passwordIntent, setPasswordIntent] = useState(Intent.NONE);
  const [passwordHelperText, setPasswordHelperText] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordIntent, setConfirmPasswordIntent] = useState(Intent.NONE);
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('');

  if (session.isValid === null || authtoken.isValid === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (session.isValid) {
    return <Redirect to="/" />;
  }

  if (!authtoken.isValid) {
    return <Redirect to="/error/401" />;
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

  const handleUsernameChange = event => setUsername(event.target.value);
  const handlePasswordChange = event => setPassword(event.target.value);
  const handleConfirmPasswordChange = event => setConfirmPassword(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();

    const hasUsernameError = validateUsername();
    const hasPasswordError = validatePassword();

    if (hasUsernameError || hasPasswordError) {
      return;
    }

    const postBody = {
      emailAddress: authtoken.claims.emailAddress,
      username,
      password,
      token: authtoken.token,
    };

    const postOpts = { headers: { 'Content-Type': 'application/json' } };

    axios.post(API_ROUTE_USER_REGISTER, postBody, postOpts)
      .then(res => setRegistered(true))
      .catch(err => {
        if (err.response.status === 400) {
          setUsernameIntent(Intent.DANGER);
          setUsernameHelperText(err.response.data.message);
        } else {
          props.addMessage(`An error occurred: ${err}`, Intent.DANGER)
        }
      });
  };

  if (registered) {
    props.addMessage(
      'You have successfully registered. Please check your inbox for a link to confirm your account.',
      Intent.SUCCESS
    );

    return <Redirect to="/user/login" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Register</title>
      </Helmet>
      <Card>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup disabled={true} large={true}
              leftIcon="envelope" placeholder="Email Address" type="text" value={authtoken.claims.emailAddress} />
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