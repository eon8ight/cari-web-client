import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ReactPaginate from 'react-paginate';

import axios from 'axios';

import AestheticsList from '../AestheticsList';

import styles from './styles/AestheticsListPage.module.scss';

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
      <ReactPaginate pageCount={totalPages} pageRangeDisplayed={5} marginPagesDisplayed={2}
                     previousLabel="<<" nextLabel=">>" breakClassName={styles.paginationItem}
                     breakLinkClassName={styles.paginationItemLink} onPageChange={handlePageChange}
                     initialPage={0} disableInitialCallback={true}
                     containerClassName={styles.pagination} pageClassName={styles.paginationItem}
                     pageLinkClassName={styles.paginationItemLink}
                     activeClassName={styles.paginationItem}
                     activeLinkClassName={styles.paginationItemLinkActive}
                     previousClassName={styles.paginationItem}
                     nextClassName={styles.paginationItem}
                     previousLinkClassName={styles.paginationItemLinkPrevious}
                     nextLinkClassName={styles.paginationItemLinkNext}
                     disabledClassName={styles.paginationItemDisabled} />
      <AestheticsList aesthetics={aesthetics} />
    </>
  );
};
