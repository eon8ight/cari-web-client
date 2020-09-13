import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch } from 'react-router-dom';

import axios from 'axios';

import AestheticDetails from '../AestheticDetails';
import Gallery from '../Gallery';
import SimilarityWeb from '../SimilarityWeb';
import Timeline from '../Timeline';

import styles from './styles/AestheticPage.module.scss';

export default (props) => {
  const match = useRouteMatch();

  const [ aestheticData, setAestheticData ] = useState(null);
  const [ requestMade, setRequestMade ] = useState(false);

  const [ showGallery, setShowGallery ] = useState(false);
  const [ showSimilarityWeb, setShowSimilarityWeb ] = useState(false);
  const [ showTimeline, setShowTimeline ] = useState(false);

  useEffect(() => {
    if(!requestMade) {
      setRequestMade(true);

      axios.get(
        `${process.env.REACT_APP_API_URL}/aesthetic/findForPage/${match.params.aestheticUrlName}`,
        {
          params: {
            includeSimilarAesthetics: true,
            includeMedia: true,
            includeGalleryContent: true,
          }
        }
      ).then(res => setAestheticData(res.data));
    }
  }, [ match.params.aestheticUrlName, requestMade, setRequestMade ]);

  if(!aestheticData) {
    return null;
  }

  let timeline = null;

  if(aestheticData.media && aestheticData.media.length > 0) {
    timeline = (
      <>
        <div className={styles.sectionHeaderLineButton}>
          <h2>Timeline</h2>
          <button onClick={() => setShowTimeline(!showTimeline)}>
            {showTimeline ? '-' : '+'}
          </button>
        </div>
        {showTimeline && <Timeline aesthetic={aestheticData} />}
      </>
    );
  }
  
  let gallery = null;

  if(aestheticData.galleryContent && aestheticData.galleryContent.length > 0) {
    gallery = (
      <>
        <div className={styles.sectionHeaderLineButton}>
          <h2>Gallery</h2>
          <button onClick={() => setShowGallery(!showGallery)}>
            {showGallery ? '-' : '+'}
          </button>
        </div>
        {showGallery && <Gallery aesthetic={aestheticData} />}
      </>
    );
  }

  let similarityWeb = null;

  if(aestheticData.similarAesthetics && aestheticData.similarAesthetics.length > 0) {
    similarityWeb = (
      <>
        <div className={styles.sectionHeaderLineButton}>
          <h2>Related Aesthetics</h2>
          <button onClick={() => setShowSimilarityWeb(!showSimilarityWeb)}>
            {showSimilarityWeb ? '-' : '+'}
          </button>
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
      <AestheticDetails aestheticData={aestheticData} />
      {timeline}
      {gallery}
      {similarityWeb}
    </>
  );
};