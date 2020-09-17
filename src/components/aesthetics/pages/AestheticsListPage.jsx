import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';

import AestheticsList from '../AestheticsList';
import Paginator from '../../common/Paginator';

export default (props) => {
  const [ requestMade, setRequestMade ] = useState(false);
  const [ aesthetics, setAesthetics ] = useState(null);
  const [ totalPages, setTotalPages ] = useState(1);

  const [ sortField, setSortField ] = useState(null);
  const [ sortAsc, setSortAsc ] = useState(null);

  const callApi = (pageNum, forceSortField, forceSortAsc) => {
    if(!requestMade) {
      setRequestMade(true);

      const params = { pageNum };

      if(forceSortField !== null)
        params.sortField = forceSortField;
      else if(sortField !== null)
        params.sortField = sortField;

      if(forceSortAsc !== null)
        params.asc = forceSortAsc;
      else if(sortAsc !== null)
        params.asc = sortAsc;

      axios.get(`${process.env.REACT_APP_API_URL}/aesthetic/findForList`, { params })
        .then(res => {
          setAesthetics(res.data.content);
          setTotalPages(res.data.totalPages);
          setRequestMade(false);
        });
    }
  };

  const callApiCallback = useCallback(callApi);

  useEffect(() => {
    if(!aesthetics)
      callApiCallback(0);
  }, [ aesthetics, callApiCallback ]);

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
      <AestheticsList aesthetics={aesthetics} sortField={sortField} setSortField={setSortField}
                      sortAsc={sortAsc} setSortAsc={setSortAsc} callApi={callApi} />
    </>
  );
};
