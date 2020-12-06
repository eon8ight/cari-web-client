import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  Intent,
  Spinner
} from '@blueprintjs/core';

import { addMessage } from '../redux/actions';

const sessionRequired = (Component, suppressRedirect) => connect(
  state => ({ session: { isValid: state.session.isValid } }),
  { addMessage }
)(props => {
  if(typeof props.session.isValid === 'undefined') {
    return <Spinner size={100} />;
  }

  if(!props.session.isValid && !suppressRedirect) {
    props.addMessage('You must be logged in to view this page', Intent.DANGER);
    return <Redirect to="/auth/login" />;
  }

  return <Component {...props} />;
});

export default sessionRequired;