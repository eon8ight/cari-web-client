import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch } from 'react-router-dom';

import axios from 'axios';
import {
  Button,
  Intent,
  Spinner,
} from '@blueprintjs/core';

import AestheticDetails from '../AestheticDetails';
import Gallery from '../Gallery';
import SimilarityWeb from '../SimilarityWeb';
import Timeline from '../Timeline';

import { API_ROUTE_AESTHETIC_FIND_FOR_PAGE } from '../../../functions/constants';

import styles from './styles/AestheticPage.module.scss';

const AestheticPage = props => {
  const match = useRouteMatch();

  const addMessage = props.addMessage;

  const [aestheticData, setAestheticData] = useState(null);
  const [requestMade, setRequestMade] = useState(false);

  const [showGallery, setShowGallery] = useState(false);
  const [showSimilarityWeb, setShowSimilarityWeb] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

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
        <div className={styles.sectionHeaderLineButton}>
          <h2>Timeline</h2>
          <Button icon={showTimeline ? 'minus' : 'plus'} onClick={() => setShowTimeline(!showTimeline)} />
        </div>
        {showTimeline && <Timeline aesthetic={aestheticData} />}
      </>
    );
  }

  let gallery = null;

  if (aestheticData.galleryContent && aestheticData.galleryContent.length > 0) {
    gallery = (
      <>
        <div className={styles.sectionHeaderLineButton}>
          <h2>Gallery</h2>
          <Button icon={showGallery ? 'minus' : 'plus'} onClick={() => setShowGallery(!showGallery)} />
        </div>
        {showGallery && <Gallery addMessage={addMessage} aesthetic={aestheticData} />}
      </>
    );
  }

  let similarityWeb = null;

  if (aestheticData.similarAesthetics && aestheticData.similarAesthetics.length > 0) {
    similarityWeb = (
      <>
        <div className={styles.sectionHeaderLineButton}>
          <h2>Related Aesthetics</h2>
          <Button icon={showSimilarityWeb ? 'minus' : 'plus'} onClick={() => setShowSimilarityWeb(!showSimilarityWeb)} />
        </div>
        {showSimilarityWeb && <SimilarityWeb aesthetic={aestheticData} />}
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