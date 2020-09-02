import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';

import AestheticsList from '../AestheticsList';

export default (props) => {
  const [ requestMade, setRequestMade ] = useState(false);
  const [ aesthetics, setAesthetics ] = useState(null);

  useEffect(() => {
    if(!requestMade) {
      setRequestMade(true);

      axios.get(`${process.env.REACT_APP_API_URL}/aesthetics/findAllNames`)
        .then(res => setAesthetics(res.data.map(d => ({
          name: d[0],
          urlSlug: d[1],
        }))));
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
