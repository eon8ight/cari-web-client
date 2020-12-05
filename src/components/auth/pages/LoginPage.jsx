import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import {
  AnchorButton,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';

import PasswordInput from '../../common/PasswordInput';

import { addMessage, login } from '../../../redux/actions';

const LoginPage = props => {
  const [username, setUsername] = useState('');
  const [usernameIntent, setUsernameIntent] = useState(Intent.NONE);
  const [usernameHelperText, setUsernameHelperText] = useState('');

  const [password, setPassword] = useState('');
  const [passwordIntent, setPasswordIntent] = useState(Intent.NONE);
  const [passwordHelperText, setPasswordHelperText] = useState('');

  const [rememberMe, setRememberMe] = useState(false);

  const handleUsernameChange = event => {
    const value = event.target.value;
    setUsername(value);
  }

  const handlePasswordChange = event => {
    const value = event.target.value;
    setPassword(value);
  }

  const handleRememberMeChange = event => setRememberMe(event.target.checked);

  const validateUsername = () => {
    let hasError = false;

    if (!username) {
      setUsernameIntent(Intent.DANGER);
      setUsernameHelperText('Email address or username is required.');
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
    } else {
      setPasswordIntent(Intent.NONE);
      setPasswordHelperText('');
    }

    return hasError;
  }

  const handleSubmit = event => {
    event.preventDefault();

    const hasUsernameError = validateUsername();
    const hasPasswordError = validatePassword();

    if (hasUsernameError || hasPasswordError) {
      return;
    }

    props.login(username, password, rememberMe, unauthorized => {
      if (unauthorized.field === 'username') {
        setUsernameIntent(Intent.DANGER);
        setUsernameHelperText(unauthorized.message);
      } else {
        setPasswordIntent(Intent.DANGER);
        setPasswordHelperText(unauthorized.message);
      }
    }, () => props.addMessage("You have successfully logged in."));
  };

  return (
    <>
      <Helmet>
        <title>CARI | Login</title>
      </Helmet>
      <Card>
        <form onSubmit={handleSubmit}>
          <FormGroup helperText={usernameHelperText}>
            <InputGroup large={true} placeholder="Email Address or Username" leftIcon="user"
              type="text" onChange={handleUsernameChange} intent={usernameIntent} />
          </FormGroup>
          <PasswordInput helperText={passwordHelperText} onChange={handlePasswordChange}
            intent={passwordIntent} />
          <Checkbox label="Remember Me" large={true} onChange={handleRememberMeChange} />
          <ButtonGroup fill={true} large={true}>
            <Button intent={Intent.PRIMARY} icon="log-in" type="submit">Login</Button>
            <AnchorButton intent={Intent.NONE} icon="help" href="/user/forgotPassword">
              Forgot Password
            </AnchorButton>
          </ButtonGroup>
        </form>
      </Card>
    </>
  );
};

export default connect(null, { addMessage, login })(LoginPage);