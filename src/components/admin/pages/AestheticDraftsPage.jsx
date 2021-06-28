import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

import {
  HTMLTable,
  Intent,
  Spinner,
} from '@blueprintjs/core';

import {
  API_ROUTE_AESTHETIC_FIND_DRAFT,
  ROLE_CURATOR,
  ROLE_LEAD_CURATOR,
  ROLE_LEAD_DIRECTOR,
} from '../../../functions/constants';

import { entityHasPermission } from '../../../functions/utils';

import styles from './styles/AestheticDraftsPage.module.scss';

const AestheticDraftsPage = props => {
  const addMessage = props.addMessage;
  const session = props.session;

  const [requestMade, setRequestMade] = useState(false);
  const [draftAesthetics, setDraftAesthetics] = useState(null);

  useEffect(() => {
    if (!requestMade) {
      setRequestMade(true);

      axios.get(`${API_ROUTE_AESTHETIC_FIND_DRAFT}`)
        .then(res => setDraftAesthetics(res.data))
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
    }
  }, [addMessage, requestMade]);

  if (session.isValid === null || !draftAesthetics) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (!entityHasPermission(session, ROLE_LEAD_DIRECTOR, ROLE_LEAD_CURATOR, ROLE_CURATOR)) {
    return <Redirect to="/error/403" />;
  }

  let draftRows = (
    <tr>
      <td className={styles.fullSpanCell} colSpan="2">No draft aesthetics.</td>
    </tr>
  );

  if(draftAesthetics.length) {
    draftRows = draftAesthetics.map(a => {
      const modifiedParts = a.modified.match(/^([0-9-]+)T([0-9:]+)/);

      return (
        <tr key={a.aesthetic}>
          <td><a href={`/admin/edit/${a.aesthetic}`}>{a.name}</a></td>
          <td>{modifiedParts[1]} at {modifiedParts[2]}</td>
        </tr>
      );
    });
  }

  return (
    <>
      <Helmet>
        <title>CARI | Admin | Draft Aesthetics</title>
      </Helmet>
      <HTMLTable className={styles.listTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Updated Time</th>
          </tr>
        </thead>
        <tbody>
          {draftRows}
        </tbody>
      </HTMLTable>
    </>
  );
}

export default AestheticDraftsPage;