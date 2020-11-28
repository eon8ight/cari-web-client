import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';

import AestheticsList from '../AestheticsList';
import Paginator from '../../common/Paginator';
import Spinner from '../../common/Spinner';

import styles from './styles/AestheticsListPage.module.scss';

const valueExists = (arr, key) => (typeof arr[key] !== 'undefined') && arr[key] !== null;

export default (props) => {
  const [requestMade, setRequestMade] = useState(false);
  const [aesthetics, setAesthetics] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const [sortField, setSortField] = useState(null);
  const [asc, setAsc] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);

  const callApi = (params) => {
    if (!requestMade) {
      if (typeof params === 'undefined' || params === null) {
        params = {};
      }

      setRequestMade(true);

      if (!valueExists(params, 'page')) {
        params.page = 0;
      }

      if (sortField && !valueExists(params, 'sortField')) {
        params.sortField = sortField;
      }

      if (asc !== null && !valueExists(params, 'asc')) {
        params.asc = asc;
      }

      if (keyword && !valueExists(params, 'keyword')) {
        params.keyword = keyword;
      }

      if (startYear && !valueExists(params, 'startYear')) {
        params.startYear = startYear;
      }

      if (endYear && !valueExists(params, 'endYear')) {
        params.endYear = endYear;
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
    if (!aesthetics)
      callApiCallback({ page: 0 });
  }, [aesthetics, callApiCallback]);

  let aestheticsList = null;

  if (!aesthetics) {
    aestheticsList = <Spinner />;
  } else {
    aestheticsList = (
      <AestheticsList aesthetics={aesthetics} sortField={sortField} setSortField={setSortField}
        asc={asc} setAsc={setAsc} callApi={callApi} />
    );
  }

  const handleKeywordChange = event => setKeyword(event.target.value);
  const handleStartYearChange = event => setStartYear(event.target.value);
  const handleEndYearChange = event => setEndYear(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    callApi();
  }

  const handlePageChange = data => callApi({ page: data.selected });

  return (
    <>
      <Helmet>
        <title>CARI | Aesthetics</title>
      </Helmet>
      <div id="aestheticsListPaginatorContainer">
        <form onSubmit={handleSubmit} id="aestheticsListFilters">
          <div>
            <label htmlFor="keyword">Keyword:</label>
            &nbsp;
            <input type="text" id="keyword" value={keyword || ''} onChange={handleKeywordChange} />
          </div>
          <div>
            <label htmlFor="startYear">Between:</label>
            &nbsp;
            <input type="number" id="startYear" className={styles.yearInput} value={startYear || ''} onChange={handleStartYearChange} />
            &nbsp;
            <label htmlFor="endYear">and</label>
            &nbsp;
            <input type="number" id="endYear" className={styles.yearInput} value={endYear || ''} onChange={handleEndYearChange} />
          </div>
          <input type="submit" value="Search" />
          <Paginator pageCount={totalPages} onPageChange={handlePageChange} />
        </form>
      </div>
      {aestheticsList}
    </>
  );
};
