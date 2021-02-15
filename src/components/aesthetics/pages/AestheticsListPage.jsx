import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';

import {
  AnchorButton,
  Button,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  NumericInput,
  Spinner,
} from '@blueprintjs/core';

import AestheticsList from '../AestheticsList';
import Paginator from '../../common/Paginator';

import {
  API_ROUTE_AESTHETIC_FIND_FOR_LIST,
  ROLE_LEAD_CURATOR,
  ROLE_LEAD_DIRECTOR,
} from '../../../functions/constants';

import {
  entityHasPermission,
  valueExists,
} from '../../../functions/utils';

import styles from './styles/AestheticsListPage.module.scss';

const AestheticsListPage = props => {
  const addMessage = props.addMessage;

  const [requestMade, setRequestMade] = useState(false);
  const [aesthetics, setAesthetics] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [sortField, setSortField] = useState(null);
  const [asc, setAsc] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);

  const callApi = params => {
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

      axios.get(API_ROUTE_AESTHETIC_FIND_FOR_LIST, { params })
        .then(res => {
          setAesthetics(res.data.content);
          setTotalPages(res.data.totalPages);
          setRequestMade(false);
        })
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));;
    }
  };

  const callApiCallback = useCallback(callApi, [addMessage, asc, keyword, endYear, requestMade, sortField, startYear]);

  useEffect(() => {
    if (!aesthetics)
      callApiCallback({ page: 0 });
  }, [aesthetics, callApiCallback]);

  const handlePageChange = data => {
    setCurrentPage(data.selected);
    callApi({ page: data.selected });
  };

  let aestheticsList = null;

  if (!aesthetics) {
    aestheticsList = <Spinner size={Spinner.SIZE_LARGE} />;
  } else {
    aestheticsList = (
      <>
        <AestheticsList aesthetics={aesthetics} sortField={sortField} setSortField={setSortField}
          asc={asc} setAsc={setAsc} callApi={callApi} />
        {totalPages > 0 && <Paginator currentPage={currentPage} className={styles.paginator}
          pageCount={totalPages} onPageChange={handlePageChange} />}
      </>
    );
  }

  const handleKeywordChange = event => setKeyword(event.target.value);
  const handleStartYearChange = value => setStartYear(value);
  const handleEndYearChange = value => setEndYear(value);

  const handleSubmit = event => {
    event.preventDefault();
    callApi();
  };

  const handleClearFilters = event => {
    event.preventDefault();
    setKeyword('');
    setStartYear(0);
    setEndYear(0);
  };

  let addButton = null;

  if (entityHasPermission(props.session, ROLE_LEAD_CURATOR, ROLE_LEAD_DIRECTOR)) {
    addButton = (
      <FormGroup>
        <AnchorButton href="/admin/create" icon="add" intent={Intent.PRIMARY}
          large={true} text="Create" />
      </FormGroup>
    );
  }

  return (
    <>
      <Helmet>
        <title>CARI | Aesthetics</title>
      </Helmet>
      <form onSubmit={handleSubmit}>
        <FormGroup label="Search and filter by...">
          <ControlGroup>
            <InputGroup fill={true} onChange={handleKeywordChange} placeholder="Keyword"
              value={keyword || ''} />
            <NumericInput min={1950} max={2030} onValueChange={handleStartYearChange}
              placeholder="Year of First Known Example" value={startYear || ''} />
            <NumericInput min={1950} max={2030} onValueChange={handleEndYearChange}
              placeholder="Year of End of Popularity" value={endYear || ''} />
            <Button icon="search" type="submit">Search</Button>
            <Button icon="filter-remove" onClick={handleClearFilters} type="reset">
              Clear Filters
            </Button>
          </ControlGroup>
        </FormGroup>
        {addButton}
      </form>
      {aestheticsList}
    </>
  );
};

export default AestheticsListPage;
