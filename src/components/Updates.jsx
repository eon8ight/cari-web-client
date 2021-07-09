import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import {
  Intent,
  OL,
  Spinner,
} from '@blueprintjs/core';

import Paginator from './common/Paginator';

import {
  API_ROUTE_UPDATES,
  EVENT_TYPE_CREATED,
  EVENT_TYPE_UPDATED,
} from '../functions/constants';

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
    if (!updates) {
      callApiRouteUpdatesCallback({ page: 0 });
    }
  });

  if (!updates) {
    return <Spinner size={100} />;
  }

  const handlePageChange = data => {
    setCurrentPage(data.selected);
    callApiRouteUpdates({ page: data.selected });
  }

  let updatesList = <p>No recent news or updates.</p>;

  if (updates.length > 0) {
    const updatesFormatted = updates.map(update => {
      const updateEntries = update.entries.map(e => {
        let description = null;

        if (e.descriptionOverride) {
          description = e.descriptionOverride;
        } else {
          let updatedFields = e.updatedFields.map(f => f.oldValue
            ? f.name + ' (was <strong>' + f.oldValue + '</strong>)'
            : f.name
          );

          const aestheticLink = <Link to={`/aesthetics/${e.aestheticUrlSlug}`}>{e.aestheticName}</Link>;

          switch (e.eventType) {
            case EVENT_TYPE_CREATED:
              description = (
                <span>
                  {e.eventTypeLabel} <span dangerouslySetInnerHTML={{ __html: updatedFields[0] }}></span> for {aestheticLink}.
                </span>
              );

              break;
            case EVENT_TYPE_UPDATED:
              description = (
                <span>
                  {e.eventTypeLabel} {aestheticLink}: changed <span dangerouslySetInnerHTML={{ __html: updatedFields.join(', ') }}></span>.
                </span>
              );

              break;
            default:
              return e.descriptionOverride;
          }
        }

        return (
          <li className={styles.entryLogLi} key={e.updateLog}>
            <span className={styles.entryLogTime}>{e.createdTime}</span>
            <span>{description}</span>
          </li>
        );
      });

      return (
        <li key={update.created}>
          <h4>{update.created}</h4>
          <OL>
            {updateEntries}
          </OL>
        </li>
      )
    });

    updatesList = (
      <>
        <OL className={styles.entriesForDate}>
          {updatesFormatted}
        </OL>
        {totalPages > 0 && <Paginator currentPage={currentPage} className={styles.paginator}
          pageCount={totalPages} onPageChange={handlePageChange} />}
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>CARI | News & Updates</title>
      </Helmet>
      <h1>Latest News and Updates</h1>
      {updatesList}
    </>
  )
};

export default Updates;