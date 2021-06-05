import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, useRouteMatch } from 'react-router-dom';

import axios from 'axios';
import {
  Card,
  Intent,
  Spinner,
  Tab,
  Tabs,
} from '@blueprintjs/core';

import { cloneDeep } from 'lodash';

import AestheticDetails from '../AestheticDetails';
import Gallery from '../Gallery';
import Timeline from '../Timeline';

import ExpandableSection from '../../common/ExpandableSection';

import AestheticsGrid from '../AestheticsGrid';
import AestheticsList from '../AestheticsList';

import {
  API_ROUTE_AESTHETIC_FIND_FOR_PAGE,
  ARENA_API_MAX,
} from '../../../functions/constants';

const SORT_FIELD_END_YEAR = 'endYear';
const SORT_FIELD_NAME = 'name';
const SORT_FIELD_START_YEAR = 'startYear';

const AestheticPage = props => {
  const match = useRouteMatch();

  const addMessage = props.addMessage;
  const session = props.session;

  const [aestheticData, setAestheticData] = useState(null);
  const [aestheticDataRequestMade, setAestheticDataRequestMade] = useState(false);
  const [initialGalleryData, setInitialGalleryData] = useState(null);
  const [initialGalleryDataRequestMade, setInitialGalleryDataRequestMade] = useState(false);

  const showGallery = useState(false);
  const showSimilarityWeb = useState(false);
  const showTimeline = useState(false);

  const [relatedAesthetics, setRelatedAesthetics] = useState(null);

  const [relatedAestheticsSortField, setRelatedAestheticsSortField] = useState(SORT_FIELD_NAME);
  const [relatedAestheticsSortAsc, setRelatedAestheticsSortAsc] = useState(true);

  useEffect(() => {
    if (!aestheticDataRequestMade) {
      setAestheticDataRequestMade(true);

      const params = {
        includeSimilarAesthetics: true,
        includeMedia: true,
      };

      axios.get(`${API_ROUTE_AESTHETIC_FIND_FOR_PAGE}/${match.params.aestheticUrlName}`, { params })
        .then(res => {
          setAestheticData(res.data);
          setRelatedAesthetics(res.data.similarAesthetics);
        })
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
    }

    if (aestheticData) {
      if (aestheticData.mediaSourceUrl) {
        if (!initialGalleryDataRequestMade) {
          setInitialGalleryDataRequestMade(true);

          axios.get(`${aestheticData.mediaSourceUrl}?page=1&per=${ARENA_API_MAX}`)
            .then(res => setInitialGalleryData(res.data))
            .catch(err => {
              const errorStatusCode = err.response.status;
              let errorMessage = `Could not retrieve gallery content - call to Are.na API returned status code ${errorStatusCode}. `;

              switch (err.response.status) {
                case 401:
                  errorMessage += 'This usually means the Are.na is private. Please make it public or remove it from the aesthetic.';
                  break;
                case 404:
                  errorMessage += 'Please either remove the Are.na link from the aesthetic or update it to an existing Are.na.';
                  break;
                default:
                  errorMessage += 'This is an unhandled exception.';
                  break;
              }

              console.log(errorMessage);
              setInitialGalleryData({ length: 0 });
            });
        }
      } else {
        setInitialGalleryData({ length: 0 });
      }
    }
  }, [
    addMessage,
    match.params.aestheticUrlName,
    aestheticDataRequestMade,
    setAestheticDataRequestMade,
    aestheticData,
    initialGalleryDataRequestMade,
  ]);

  const sortRelatedAesthetics = params => {
    if (typeof params === 'undefined' || params === null) {
      params = {};
    }

    const useSortField = params.sortField ?? relatedAestheticsSortField;
    const useAsc = params.asc !== null ? params.asc : relatedAestheticsSortAsc;

    const newAesthetics = cloneDeep(relatedAesthetics);

    newAesthetics.sort((firstEl, secondEl) => {
      let rval;

      switch (useSortField) {
        case SORT_FIELD_NAME:
          rval = firstEl.name.localeCompare(secondEl.name);

          if (!useAsc) {
            rval = -rval;
          }

          break;
        case SORT_FIELD_START_YEAR:
          const firstElStartYear = firstEl.approximateStartYear;
          const secondElStartYear = secondEl.approximateStartYear;

          if (firstElStartYear === null && secondElStartYear === null) {
            rval = 0;
          } else if (firstElStartYear === null) {
            rval = -1;
          } else if (secondElStartYear === null) {
            rval = 1;
          } else {
            rval = firstElStartYear - secondElStartYear;

            if (!useAsc) {
              rval = -rval;
            }
          }

          break;
        case SORT_FIELD_END_YEAR:
          const firstElEndYear = firstEl.approximateEndYear;
          const secondElEndYear = secondEl.approximateEndYear;

          if (firstElEndYear === null && secondElEndYear === null) {
            rval = 0;
          } else if (firstElEndYear === null) {
            rval = -1;
          } else if (secondElEndYear === null) {
            rval = 1;
          } else {
            rval = firstElEndYear - secondElEndYear;

            if (!useAsc) {
              rval = -rval;
            }
          }

          break;
        default:
          rval = 0;
      }

      return rval;
    });

    setRelatedAesthetics(newAesthetics);
  };

  if (process.env.REACT_APP_PROTECTED_MODE) {
    if (session.isValid === null) {
      return <Spinner size={Spinner.SIZE_LARGE} />;
    }

    if (!session.isValid) {
      addMessage('You must be logged in to view this page', Intent.DANGER);
      return <Redirect to="/user/login" />;
    }
  }

  if (!aestheticData || initialGalleryData === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  let timeline = null;

  if (aestheticData.media && aestheticData.media.length > 0) {
    timeline = (
      <>
        <Card>
          <ExpandableSection header="Timeline" show={showTimeline}>
            <Timeline aesthetic={aestheticData} />
          </ExpandableSection>
        </Card>
        <br />
      </>
    );
  }

  let gallery = null;

  if (initialGalleryData !== null && initialGalleryData.length > 0) {
    gallery = (
      <>
        <Card>
          <ExpandableSection header="Gallery" show={showGallery}>
            <Gallery addMessage={addMessage} aesthetic={aestheticData}
              initialContent={initialGalleryData} />
          </ExpandableSection>
        </Card>
        <br />
      </>
    );
  }

  let relatedAestheticsElem = null;

  if (aestheticData.similarAesthetics && aestheticData.similarAesthetics.length > 0) {
    const relatedAestheticsList = (
      <AestheticsList aesthetics={relatedAesthetics} sortField={relatedAestheticsSortField}
        setSortField={setRelatedAestheticsSortField} asc={relatedAestheticsSortAsc}
        setAsc={setRelatedAestheticsSortAsc} callApi={sortRelatedAesthetics} />
    );

    const relatedAestheticsGrid = (
      <AestheticsGrid aesthetics={relatedAesthetics} sortField={relatedAestheticsSortField}
        setSortField={setRelatedAestheticsSortField} asc={relatedAestheticsSortAsc}
        setAsc={setRelatedAestheticsSortAsc} callApi={sortRelatedAesthetics} />
    );

    relatedAestheticsElem = (
      <>
        <Card>
          <ExpandableSection header="Related Aesthetics" show={showSimilarityWeb}>
            <Tabs>
              <Tab id="grid" title="Grid View" panel={relatedAestheticsGrid} />
              <Tab id="list" title="List View" panel={relatedAestheticsList} />
            </Tabs>
          </ExpandableSection>
        </Card>
        <br />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>CARI | Aesthetic | {aestheticData.name}</title>
      </Helmet>
      <AestheticDetails aesthetic={aestheticData} session={props.session} />
      {timeline}
      {gallery}
      {relatedAestheticsElem}
    </>
  );
};

export default AestheticPage;