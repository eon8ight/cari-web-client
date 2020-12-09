import React from 'react';

import {
  HTMLTable,
  Icon,
} from '@blueprintjs/core';

const SORT_FIELD_EMAIL_ADDRESS = "emailAddress";
const SORT_FIELD_INVITED = "invited";
const SORT_FIELD_REGISTERED = "registered";
const SORT_FIELD_CONFIRMED = "confirmed";
const SORT_FIELD_USERNAME = "username";

const InvitedUsersList = props => {
  const rowsUsers = props.invitedUsers.map((invitedUser) => {
    const invited = new Date(invitedUser.invited);
    const invitedAt = `${invited.toLocaleDateString()} ${invited.toLocaleTimeString()}`;

    let registeredAt = '--';
    let confirmedAt = '--';

    if (invitedUser.registered) {
      const registered = new Date(invitedUser.registered);
      registeredAt = `${registered.toLocaleDateString()} ${registered.toLocaleTimeString()}`;
    }

    if (invitedUser.confirmed) {
      const confirmed = new Date(invitedUser.confirmed);
      confirmedAt = `${confirmed.toLocaleDateString()} ${confirmed.toLocaleTimeString()}`;
    }

    return (
      <tr key={invitedUser.emailAddress}>
        <td>{invitedUser.emailAddress}</td>
        <td>{invitedAt}</td>
        <td>{registeredAt}</td>
        <td>{confirmedAt}</td>
        <td>{invitedUser.username || '--'}</td>
      </tr>
    );
  });

  const handleSortClick = newSortField => {
    let newAsc;

    if (props.sortField === newSortField) {
      newAsc = props.asc === null ? true : !props.asc;
    } else {
      newAsc = true;
      props.setSortField(newSortField);
    }

    props.setAsc(newAsc);
    props.callApi({ page: 0, sortField: newSortField, asc: newAsc });
  };

  const getSortSymbol = fieldName => props.sortField === fieldName
    ? <Icon icon={props.asc ? 'sort-asc' : 'sort-desc'} />
    : null;

  return (
    <>
      <p>Users you have invited:</p>
      <br />
      <HTMLTable bordered={true} condensed={true} striped={true}>
        <thead>
          <tr>
            <th onClick={() => handleSortClick(SORT_FIELD_EMAIL_ADDRESS)}>
              Email Address {getSortSymbol(SORT_FIELD_EMAIL_ADDRESS)}
            </th>
            <th onClick={() => handleSortClick(SORT_FIELD_INVITED)}>
              Invited {getSortSymbol(SORT_FIELD_INVITED)}
            </th>
            <th onClick={() => handleSortClick(SORT_FIELD_REGISTERED)}>
              Registered {getSortSymbol(SORT_FIELD_REGISTERED)}
            </th>
            <th onClick={() => handleSortClick(SORT_FIELD_CONFIRMED)}>
              Confirmed {getSortSymbol(SORT_FIELD_CONFIRMED)}
            </th>
            <th onClick={() => handleSortClick(SORT_FIELD_USERNAME)}>
              Username {getSortSymbol(SORT_FIELD_USERNAME)}
            </th>
          </tr>
        </thead>
        <tbody>
          {rowsUsers}
        </tbody>
      </HTMLTable>
    </>
  );
};

export default InvitedUsersList;