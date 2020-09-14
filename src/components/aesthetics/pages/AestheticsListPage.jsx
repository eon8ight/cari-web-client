import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';

import AestheticsList from '../AestheticsList';
import Paginator from '../../common/Paginator';

export default (props) => {
  const [ requestMade, setRequestMade ] = useState(false);
  const [ aesthetics, setAesthetics ] = useState(null);
  const [ totalPages, setTotalPages ] = useState(1);

  const callApi = useCallback((pageNum) => {
    if(!requestMade) {
      setRequestMade(true);

      axios.get(`${process.env.REACT_APP_API_URL}/aesthetic/findForList?page=${pageNum}`)
        .then(res => {
          setAesthetics(res.data.content);
          setTotalPages(res.data.totalPages);
          setRequestMade(false);
        });
    }
  }, [ requestMade ]);

  useEffect(() => {
    if(!aesthetics)
      callApi(0);
  }, [ aesthetics, callApi ]);

  if(!aesthetics) {
    return null;
  }

  const handlePageChange = (data) => callApi(data.selected);

  return (
    <>
      <Helmet>
        <title>CARI | Aesthetics</title>
      </Helmet>
      <div id="aestheticsListPaginatorContainer">
        <Paginator pageCount={totalPages} onPageChange={handlePageChange} />
      </div>
      <AestheticsList aesthetics={aesthetics} />
    </>
  );
};
