import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import axios from 'axios';
import { parse } from 'qs';

import AestheticsList from '../AestheticsList';

export default (props) => {
  const location = useLocation();

  const [ requestMade, setRequestMade ] = useState(false);
  const [ aesthetics, setAesthetics ] = useState(null);

  useEffect(() => {
    if(!requestMade) {
      setRequestMade(true);

      const queryParams = parse(location.search.substring(1));

      axios.get(`${process.env.REACT_APP_API_URL}/aesthetic/find?page=${queryParams.page || 0}`)
        .then(res => setAesthetics(res.data.content));
    }
  }, [ location, requestMade, setRequestMade ]);

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
