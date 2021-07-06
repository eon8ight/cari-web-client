import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import {
  Intent,
  Spinner,
  UL
} from '@blueprintjs/core';

import Paginator from './common/Paginator';

import { API_ROUTE_UPDATES } from '../functions/constants';
import { valueExists } from '../functions/utils';

import styles from './styles/Updates.module.scss';

const MAX_PER_PAGE = 20;

const Updates = props => {
  const addMessage = props.addMessage;

  const [getUpdatesRequestMade, setGetUpdatesRequestMade] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [updates, setUpdates] = useState(null);

  const callApiRouteUpdates = params => {
    if (!getUpdatesRequestMade) {
      if (typeof params === 'undefined' || params === null) {
        params = {};
      }

      setGetUpdatesRequestMade(true);

      if (!valueExists(params, 'page')) {
        params.page = 0;
      }

      params = { limit: MAX_PER_PAGE };

      axios.get(API_ROUTE_UPDATES, { params })
        .then(res => {
          setTotalPages(res.data.totalPages);
          setUpdates(res.data.content);
          setGetUpdatesRequestMade(false);
        })
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
    }
  };

  const callApiRouteUpdatesCallback = useCallback(
    callApiRouteUpdates,
    [addMessage, getUpdatesRequestMade]
  );

  useEffect(() => {
    if(!updates) {
      callApiRouteUpdatesCallback({ page: 0 });
    }
  });

  const handlePageChange = data => {
    setCurrentPage(data.selected);
    callApiRouteUpdates({ page: data.selected });
  }

  let updatesList = <Spinner size={100} />;

  if(updates) {
    const updatesFormatted = updates.map(update => {
      const updateEntries = update.entries.map(entry => (
          <li>
            <span dangerouslySetInnerHTML={{__html: entry }}></span>
          </li>
      ));

      return (
        <>
          <h4>{update.created}</h4>
          <UL>
            {updateEntries}
          </UL>
        </>
      )
    });

    updatesList = (
      <>
        <UL>
          {updatesFormatted}
        </UL>
        {totalPages > 0 && <Paginator currentPage={currentPage} className={styles.paginator}
          pageCount={totalPages} onPageChange={handlePageChange} />}
      </>
    );
  } else {
    updatesList = <p>No recent updates or news.</p>;
  }

  return (
    <>
      <Helmet>
        <title>CARI | News and Updates</title>
      </Helmet>
      <h1>Latest Updates</h1>
      {updatesList}
    </>
  )
};

export default Updates;