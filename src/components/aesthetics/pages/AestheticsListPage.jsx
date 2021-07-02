import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

import {
  AnchorButton,
  Button,
  ButtonGroup,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  NumericInput,
  Spinner,
  Tab,
  Tabs,
} from '@blueprintjs/core';

import AestheticsGrid from '../AestheticsGrid';
import AestheticsList from '../AestheticsList';
import Paginator from '../../common/Paginator';

import {
  API_ROUTE_AESTHETIC_FIND_FOR_LIST,
  ROLE_CURATOR,
  ROLE_LEAD_CURATOR,
  ROLE_LEAD_DIRECTOR,
} from '../../../functions/constants';

import {
  entityHasPermission,
  valueExists,
} from '../../../functions/utils';

import styles from './styles/AestheticsListPage.module.scss';

const SORT_FIELD_NAME = 'name';

const AestheticsListPage = props => {
  const addMessage = props.addMessage;
  const session = props.session;

  const [requestMade, setRequestMade] = useState(false);
  const [aesthetics, setAesthetics] = useState(null);
  const [currentPage, setCurrentPage] = useState(window.history.state?.page ?? 0);
  const [totalPages, setTotalPages] = useState(1);

  const [sortField, setSortField] = useState(window.history.state?.sortField ?? SORT_FIELD_NAME);
  const [asc, setAsc] = useState(window.history.state?.asc ?? true);
  const [keyword, setKeyword] = useState(window.history.state?.keyword);
  const [startYear, setStartYear] = useState(window.history.state?.startYear);
  const [endYear, setEndYear] = useState(window.history.state?.endYear);

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

      window.history.replaceState(params, '');
      setCurrentPage(params.page);

      axios.get(API_ROUTE_AESTHETIC_FIND_FOR_LIST, { params })
        .then(res => {
          setAesthetics(res.data.content);
          setTotalPages(res.data.totalPages);
          setRequestMade(false);
        })
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
    }
  };

  const callApiCallback = useCallback(callApi, [addMessage, asc, keyword, endYear, requestMade, sortField, startYear]);

  useEffect(() => {
    if (!aesthetics) {
      callApiCallback({ page: currentPage });
    }
  }, [aesthetics, callApiCallback, currentPage]);

  const handlePageChange = data => callApi({ page: data.selected });

  if (process.env.REACT_APP_PROTECTED_MODE) {
    if (session.isValid === null) {
      return <Spinner size={Spinner.SIZE_LARGE} />;
    }

    if (!session.isValid) {
      addMessage('You must be logged in to view this page', Intent.DANGER);
      return <Redirect to="/user/login" />;
    }
  }

  let aestheticsList = null;

  if (!aesthetics) {
    aestheticsList = <Spinner size={Spinner.SIZE_LARGE} />;
  } else {
    const gridView = (
      <AestheticsGrid aesthetics={aesthetics} sortField={sortField} setSortField={setSortField}
        asc={asc} setAsc={setAsc} callApi={callApi} />
    );

    const listView = (
      <AestheticsList aesthetics={aesthetics} sortField={sortField} setSortField={setSortField}
        asc={asc} setAsc={setAsc} callApi={callApi} />
    );

    aestheticsList = (
      <>
        <Tabs>
          <Tab id="grid" title="Grid View" panel={gridView} />
          <Tab id="list" title="List View" panel={listView} />
        </Tabs>
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
      <AnchorButton href="/admin/create" icon="add" intent={Intent.PRIMARY}
        large={true} text="Create" />
    );
  }

  let viewDraftButton = null;

  if (entityHasPermission(props.session, ROLE_CURATOR, ROLE_LEAD_CURATOR, ROLE_LEAD_DIRECTOR)) {
    viewDraftButton = (
      <AnchorButton href="/admin/drafts" icon="edit" intent={Intent.WARNING} large={true}
        text="Drafts" />
    );
  }

  let adminButtons = null;

  if (addButton || viewDraftButton) {
    adminButtons = (
      <FormGroup>
        <ButtonGroup>
          {addButton}
          {viewDraftButton}
        </ButtonGroup>
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
        {adminButtons}
      </form>
      {aestheticsList}
    </>
  );
};

export default AestheticsListPage;
