import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch } from 'react-router-dom';

import { json } from 'd3';

import AestheticDetails from '../AestheticDetails';
import Gallery from '../Gallery';
import SimilarityWeb from '../SimilarityWeb';

export default (props) => {
  const match = useRouteMatch();

  const [ aestheticData, setAestheticData ] = useState(null);
  const [ requestMade, setRequestMade ] = useState(false);

  const [ showGallery, setShowGallery ] = useState(false);
  const [ showSimilarityWeb, setShowSimilarityWeb ] = useState(false);

  useEffect(() => {
    if(!requestMade) {
      setRequestMade(true);

      json('/test_data.json')
        .then(data => {

          data.forEach(d => {
            if(d.urlName === match.params.aestheticUrlName) {
              setAestheticData(d);
            }
          });
        });
    }
  }, [ match.params.aestheticUrlName, requestMade, setRequestMade ]);

  if(!aestheticData) {
    return null;
  }

  let gallery = null;

  if(showGallery) {
    gallery = (
      <div>
        <Gallery />
      </div>
    );
  }

  let similarityWeb = null;

  if(showSimilarityWeb) {
    similarityWeb = (
      <div style={{ margin: 'auto', width: '50%' }}>
        <SimilarityWeb aestheticData={aestheticData} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>CARI | Aesthetic | {aestheticData.name}</title>
      </Helmet>
      <AestheticDetails aestheticData={aestheticData} />
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
