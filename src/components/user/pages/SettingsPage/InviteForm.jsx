import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

import {
  Button,
  Card,
  ControlGroup,
  Divider,
  FormGroup,
  InputGroup,
  Intent,
  Spinner
} from '@blueprintjs/core';

import InvitedUsersList from './InvitedUsersList';
import Paginator from '../../../common/Paginator';

import { valueExists } from '../../../../functions/utils';
import { addMessage } from '../../../../redux/actions';

import {
  API_ROUTE_USER_FIND_FOR_LIST,
  API_ROUTE_USER_INVITE,
} from '../../../../functions/constants';

import styles from './styles/InviteForm.module.scss';

const InviteForm = props => {
  const [listRequestMade, setListRequestMade] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [emailAddress, setEmailAddress] = useState('');
  const [emailAddressIntent, setEmailAddressIntent] = useState(Intent.NONE);
  const [emailAddressHelperText, setEmailAddressHelperText] = useState('');

  const [sortField, setSortField] = useState(null);
  const [asc, setAsc] = useState(null);

  const callApiRouteInvitedUsersList = params => {
    if (!listRequestMade && props.session.claims.sub) {
      if (typeof params === 'undefined' || params === null) {
        params = {};
      }

      setListRequestMade(true);

      if (!valueExists(params, 'page')) {
        params.page = 0;
      }

      if (sortField && !valueExists(params, 'sortField')) {
        params.sortField = sortField;
      }

      if (asc !== null && !valueExists(params, 'asc')) {
        params.asc = asc;
      }

      params.inviter = props.session.claims.sub;

      const getOpts = {
        params,
        withCredentials: true
      };

      axios.get(API_ROUTE_USER_FIND_FOR_LIST, getOpts)
        .then(res => {
          setInvitedUsers(res.data.content);
          setTotalPages(res.data.totalPages);
          setListRequestMade(false);
        })
        .catch(err => props.addMessage(`An error occurred: ${err}`, Intent.DANGER));
    }
  };

  const callApiRouteInvitedUsersListCallback = useCallback(
    callApiRouteInvitedUsersList,
    [asc, listRequestMade, props, sortField]
  );

  useEffect(() => {
    if (!invitedUsers) {
      callApiRouteInvitedUsersListCallback({ page: 0 });
    }
  });

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

    return hasError;
  };

  const handleEmailAddressChange = event => setEmailAddress(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();

    if (validateEmailAddress())
      return;

    const postOpts = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    axios.post(API_ROUTE_USER_INVITE, { emailAddress }, postOpts)
      .then(res => {
        props.addMessage('Invitation sent.', Intent.SUCCESS);
        setInvitedUsers(invitedUsers.concat(res.data.entity));
        setEmailAddress('');
      })
      .catch(err => {
        if (err.response.status === 400) {
          setEmailAddressIntent(Intent.DANGER);
          setEmailAddressHelperText(err.response.data.message);
        } else {
          props.addMessage(`An error occurred: ${err}`, Intent.DANGER)
        }
      });
  };

  const handlePageChange = data => {
    setCurrentPage(data.selected);
    callApiRouteInvitedUsersList({ page: data.selected });
  };

  let invitedList = <Spinner size={100} />;

  if (invitedUsers) {
    invitedList = (
      <>
        <InvitedUsersList invitedUsers={invitedUsers} sortField={sortField} setSortField={setSortField}
          asc={asc} setAsc={setAsc} callApi={callApiRouteInvitedUsersList} />
        {totalPages > 0 && <Paginator currentPage={currentPage} className={styles.paginator}
          pageCount={totalPages} onPageChange={handlePageChange} />}
      </>
    );
  } else {
    invitedList = <p>You have not invited any users.</p>;
  }

  return (
    <Card>
      <p>To invite a user, enter their email address and click "Send".</p>
      <form onSubmit={handleSubmit}>
        <FormGroup helperText={emailAddressHelperText}>
          <ControlGroup>
            <InputGroup intent={emailAddressIntent} leftIcon="envelope"
              onChange={handleEmailAddressChange} placeholder="Email Address" type="text" />
            <Button disabled={!emailAddress} icon="confirm" intent={Intent.PRIMARY} type="submit">
              Invite
            </Button>
          </ControlGroup>
        </FormGroup>
      </form>
      <p>
        The user you invite will receive an email containing a unique, secure link to the
        registration form.
      </p>
      <Divider />
      {invitedList}
    </Card>
  );
};

export default connect(
  null,
  { addMessage }
)(InviteForm);