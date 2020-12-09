import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

import {
  Button,
  Card,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';

import PasswordInput from '../../../common/PasswordInput';

import { API_ROUTE_USER_UPDATE } from '../../../../functions/constants';
import { addMessage, updateSession } from '../../../../redux/actions';

const ProfileForm = (props) => {
  const [isUpdating, setIsUpdating] = useState(null);

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
    } else if (!/^.+@.+$/.test(emailAddress)) {
      setEmailAddressIntent(Intent.DANGER);
      setEmailAddressHelperText('Must be an email address.');
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

    setIsUpdating(true);

    const putRoute = `${API_ROUTE_USER_UPDATE}/${props.session.data.sub}`;
    const putOpts = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const putData = {};

    if(username) {
      putData.username = username;
    }

    if(emailAddress) {
      putData.emailAddress = emailAddress;
    }

    if(password) {
      putData.password = password;
    }

    axios.put(putRoute, putData, putOpts)
      .then(() => setIsUpdating(false))
      .catch(err => props.addMessage(`An error occurred: ${err}`, Intent.DANGER));
  };

  useEffect(() => {
    if (isUpdating === false) {
      props.addMessage('Profile update successful.', Intent.SUCCESS);
      props.updateSession({ username, emailAddress });
    }
  }, [isUpdating, emailAddress, username, props]);

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <FormGroup helperText={emailAddressHelperText} label="Email Address">
          <InputGroup intent={emailAddressIntent} onChange={handleEmailAddressChange}
            placeholder="New Email Address" value={emailAddress} />
        </FormGroup>
        <FormGroup helperText={usernameHelperText} label="Username">
          <InputGroup intent={usernameIntent} onChange={handleUsernameChange}
            placeholder="New Username" value={username} />
        </FormGroup>
        <PasswordInput helperText={passwordHelperText} intent={passwordIntent} large={false}
          label="Password" onChange={handlePasswordChange} placeholder="New Password" />
        <PasswordInput helperText={confirmPasswordHelperText} intent={confirmPasswordIntent}
          large={false} onChange={handleConfirmPasswordChange}placeholder="Confirm New Password" />
        <Button intent={Intent.PRIMARY} icon="confirm" type="submit">Save</Button>
      </form>
    </Card>
  );
};

export default connect(
  (state) => ({ session: { data: state.session.data } }),
  { addMessage, updateSession }
)(ProfileForm);