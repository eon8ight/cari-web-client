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

import AestheticDetails from '../AestheticDetails';
import Gallery from '../Gallery';
import SimilarityWeb from '../SimilarityWeb';
import Timeline from '../Timeline';

import ExpandableSection from '../../common/ExpandableSection';

import RelatedAestheticsList from '../RelatedAestheticsList';

import { API_ROUTE_AESTHETIC_FIND_FOR_PAGE } from '../../../functions/constants';

const AestheticPage = props => {
  const match = useRouteMatch();

  const addMessage = props.addMessage;
  const session = props.session;

  const [aestheticData, setAestheticData] = useState(null);
  const [requestMade, setRequestMade] = useState(false);

  const showGallery = useState(false);
  const showSimilarityWeb = useState(false);
  const showTimeline = useState(false);

  useEffect(() => {
    if (!requestMade) {
      setRequestMade(true);

      const params = {
        includeSimilarAesthetics: true,
        includeMedia: true,
        includeGalleryContent: true,
      };

      axios.get(`${API_ROUTE_AESTHETIC_FIND_FOR_PAGE}/${match.params.aestheticUrlName}`, { params })
        .then(res => setAestheticData(res.data))
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
    }
  }, [addMessage, match.params.aestheticUrlName, requestMade, setRequestMade]);

  if(process.env.REACT_APP_PROTECTED_MODE) {
    if (session.isValid === null) {
      return <Spinner size={Spinner.SIZE_LARGE} />;
    }

    if (!session.isValid) {
        addMessage('You must be logged in to view this page', Intent.DANGER);
        return <Redirect to="/user/login" />;
    }
  }

  if (!aestheticData) {
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

  if (aestheticData.galleryContent && aestheticData.galleryContent.length > 0) {
    gallery = (
      <>
        <Card>
          <ExpandableSection header="Gallery" show={showGallery}>
            <Gallery addMessage={addMessage} aesthetic={aestheticData} />
          </ExpandableSection>
        </Card>
        <br />
      </>
    );
  }

  let relatedAesthetics = null;

  if (aestheticData.similarAesthetics && aestheticData.similarAesthetics.length > 0) {
    const relatedAestheticsList = (
      <RelatedAestheticsList addMessage={addMessage} aesthetic={aestheticData} />
    );

    const similarityWeb = <SimilarityWeb aesthetic={aestheticData} />;

    relatedAesthetics = (
      <>
        <Card>
          <ExpandableSection header="Related Aesthetics" show={showSimilarityWeb}>
            <Tabs>
              <Tab id="list" title="List View" panel={relatedAestheticsList} />
              <Tab id="graph" title="Web View" panel={similarityWeb} />
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
      {relatedAesthetics}
    </>
  );
};

export default AestheticPage;