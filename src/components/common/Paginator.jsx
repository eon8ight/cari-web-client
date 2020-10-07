import React from 'react';
import ReactPaginate from 'react-paginate';

import styles from './styles/Paginator.module.scss';

export default (props) => (
    <ReactPaginate pageCount={props.pageCount} pageRangeDisplayed={5} marginPagesDisplayed={2}
        previousLabel="<<" nextLabel=">>" breakClassName={styles.paginationItem}
        breakLinkClassName={styles.paginationItemLink} onPageChange={props.onPageChange}
        initialPage={0} disableInitialCallback={true}
        containerClassName={styles.pagination} pageClassName={styles.paginationItem}
        pageLinkClassName={styles.paginationItemLink}
        activeClassName={styles.paginationItem}
        activeLinkClassName={styles.paginationItemLinkActive}
        previousClassName={styles.paginationItem}
        nextClassName={styles.paginationItem}
        previousLinkClassName={styles.paginationItemLink}
        nextLinkClassName={styles.paginationItemLink}
        disabledClassName={styles.paginationItemDisabled} />
);