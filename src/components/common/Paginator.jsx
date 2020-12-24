import React from 'react';
import ReactPaginate from 'react-paginate';

import { pick } from 'lodash/object';

import styles from './styles/Paginator.module.scss';
import { useEffect } from 'react';

const ACTIVE_CLASS_NAME = 'bp3-intent-primary';
const DISABLED_CLASS_NAME = 'bp3-disabled';
const LINK_CLASS_NAME = 'bp3-button';

const Paginator = props => {
  // Hack to set the value of a disabled <li>'s <a> to be disabled
  useEffect(() => {
    document.querySelectorAll(`.${styles.paginationItem} > a.${DISABLED_CLASS_NAME}`)
      .forEach(item => item.classList.remove(DISABLED_CLASS_NAME));

    document.querySelectorAll(`.${styles.paginationItem} >  a.${ACTIVE_CLASS_NAME}, li.paginationDisabled > a`)
      .forEach(item => item.classList.add(DISABLED_CLASS_NAME))
  });

  return (
    <div {...pick(props, 'id', 'className')}>
      <ReactPaginate pageCount={props.pageCount} pageRangeDisplayed={5} marginPagesDisplayed={2}
        previousLabel="<<" nextLabel=">>" breakClassName={styles.paginationItem}
        breakLinkClassName={LINK_CLASS_NAME} onPageChange={props.onPageChange}
        initialPage={props.currentPage} disableInitialCallback={true}
        containerClassName={styles.pagination} pageClassName={styles.paginationItem}
        pageLinkClassName={LINK_CLASS_NAME}
        activeClassName={styles.paginationItem}
        activeLinkClassName={ACTIVE_CLASS_NAME}
        previousClassName={styles.paginationItem}
        nextClassName={styles.paginationItem}
        previousLinkClassName={LINK_CLASS_NAME}
        nextLinkClassName={LINK_CLASS_NAME}
        disabledClassName="paginationDisabled" />
    </div>
  );
};

export default Paginator;