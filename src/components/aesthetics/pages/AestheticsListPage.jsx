import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { json } from 'd3';

import AestheticsList from '../AestheticsList';

export default (props) => {
  const [ requestMade, setRequestMade ] = useState(false);
  const [ aesthetics, setAesthetics ] = useState(null);

  useEffect(() => {
    if(!requestMade) {
      setRequestMade(true);

      json('/test_data.json')
        .then(data => {
          setAesthetics(data.map(d => ({
            name: d.name,
            urlName: d.urlName,
          })));
        });
    }
  }, [ requestMade, setRequestMade ]);

  if(!aesthetics) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Aesthetics</title>
      </Helmet>
      <AestheticsList aesthetics={aesthetics} />
    </>
  );
};
