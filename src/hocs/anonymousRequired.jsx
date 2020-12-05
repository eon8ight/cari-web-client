import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';

import { Spinner } from '@blueprintjs/core';

import { addMessage } from '../redux/actions';

const anonymousRequired = Component => connect(
  state => ({ session: { isValid: state.session.isValid } }),
  { addMessage }
)(props => {
  const loc = useLocation();

  if(typeof props.session.isValid === 'undefined') {
    return <Spinner size={100} />;
  }

  if(props.session.isValid) {
    return <Redirect to={(loc.state && loc.state.next) ? loc.state.next : '/'} />;
  }

  return <Component {...props} />;
});

export default anonymousRequired;