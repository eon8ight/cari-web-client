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
  const [ keyword, setKeyword ] = useState(null);

  const callApi = (params) => {
    if(!requestMade) {
      setRequestMade(true);

      if(!params.page) {
        params.page = 0;
      }

      if(sortField && !params.sortField) {
        params.sortField = sortField;
      }

      if(sortAsc !== null && params.sortAsc === null) {
        params.asc = sortAsc;
      }

      if(keyword && params.keyword === null) {
        params.keyword = keyword;
      }

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
      callApiCallback({ page: 0 });
  }, [ aesthetics, callApiCallback ]);

  if(!aesthetics) {
    return null;
  }

  const handleKeywordChange = event => {
    setKeyword(event.target.value);
    callApi({ keyword: event.target.value });
  }

  const handlePageChange = data => callApi({ page: data.selected });

  return (
    <>
      <Helmet>
        <title>CARI | Aesthetics</title>
      </Helmet>
      <div id="aestheticsListPaginatorContainer">
        <div id="aestheticsListFilters">
          <div>
            <label for="keyword">Keyword:</label>
            &nbsp;
            <input type="text" id="keyword" value={keyword} onChange={handleKeywordChange} />
          </div>
          <Paginator pageCount={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
      <AestheticsList aesthetics={aesthetics} sortField={sortField} setSortField={setSortField}
                      sortAsc={sortAsc} setSortAsc={setSortAsc} callApi={callApi} />
    </>
  );
};
