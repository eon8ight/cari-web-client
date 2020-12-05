import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Spinner } from '@blueprintjs/core';

import { addMessage, logout } from '../../../redux/actions';

const LogoutPage = props => {
  useEffect(() => {
    if(props.session.isValid) {
      props.logout(() => props.addMessage('You have successfully logged out.'));
    }
  }, [props]);

  if(props.session.isValid === false) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Logout</title>
      </Helmet>
      <Spinner size={100} />
    </>
  );
};

export default connect(
  state => ({ session: { isValid: state.session.isValid } }),
  { addMessage, logout }
)(LogoutPage);