import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch } from 'react-router-dom';

import axios from 'axios';
import {
  Card,
  Intent,
  Spinner,
} from '@blueprintjs/core';

import AestheticDetails from '../AestheticDetails';
import Gallery from '../Gallery';
import SimilarityWeb from '../SimilarityWeb';
import Timeline from '../Timeline';

import ExpandableSection from '../../common/ExpandableSection';

import { API_ROUTE_AESTHETIC_FIND_FOR_PAGE } from '../../../functions/constants';

const AestheticPage = props => {
  const match = useRouteMatch();

  const addMessage = props.addMessage;

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

  if (!aestheticData) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  let timeline = null;

  if (aestheticData.media && aestheticData.media.length > 0) {
    timeline = (
      <>
        <Card>
          <ExpandableSection content={<Timeline aesthetic={aestheticData} />} header="Timeline"
            show={showTimeline} />
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
          <ExpandableSection content={<Gallery addMessage={addMessage} aesthetic={aestheticData} />}
            header="Gallery" show={showGallery} />
        </Card>
        <br />
      </>
    );
  }

  let similarityWeb = null;

  if (aestheticData.similarAesthetics && aestheticData.similarAesthetics.length > 0) {
    similarityWeb = (
      <>
        <Card>
          <ExpandableSection content={<SimilarityWeb aesthetic={aestheticData} />}
            header="Related Aesthetics" show={showSimilarityWeb} />
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
      {similarityWeb}
    </>
  );
};

export default AestheticPage;