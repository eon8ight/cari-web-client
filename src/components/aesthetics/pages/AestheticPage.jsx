import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch } from 'react-router-dom';

import axios from 'axios';

import AestheticDetails from '../AestheticDetails';
import Gallery from '../Gallery';
import SimilarityWeb from '../SimilarityWeb';
import Timeline from '../Timeline';

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

      axios.get(`${process.env.REACT_APP_API_URL}/aesthetic/${match.params.aestheticUrlName}`)
        .then(res => setAestheticData(res.data));
    }
  }, [ match.params.aestheticUrlName, requestMade, setRequestMade ]);

  if(!aestheticData) {
    return null;
  }

  const timeline = showTimeline ? <Timeline aestheticData={aestheticData} /> : null;
  const gallery = showGallery ? <Gallery aestheticData={aestheticData} /> : null;
  const similarityWeb = showSimilarityWeb
    ? <SimilarityWeb aestheticData={aestheticData} />
    : null;

  return (
    <>
      <Helmet>
        <title>CARI | Aesthetic | {aestheticData.name}</title>
      </Helmet>
      <AestheticDetails aestheticData={aestheticData} />
      <div className="section-header-line-button">
        <h2>Timeline</h2>
        <button onClick={() => setShowTimeline(!showTimeline)}>
          {showTimeline ? '-' : '+'}
        </button>
      </div>
      {timeline}
      <div className="section-header-line-button">
        <h2>Gallery</h2>
        <button onClick={() => setShowGallery(!showGallery)}>
          {showGallery ? '-' : '+'}
        </button>
      </div>
      {gallery}
      <div className="section-header-line-button">
        <h2>Related Aesthetics</h2>
        <button onClick={() => setShowSimilarityWeb(!showSimilarityWeb)}>
          {showSimilarityWeb ? '-' : '+'}
        </button>
      </div>
      {similarityWeb}
    </>
  );
};
