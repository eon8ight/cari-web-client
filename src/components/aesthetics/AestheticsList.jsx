import React from 'react';

import {
  HTMLTable,
  Icon,
} from '@blueprintjs/core';

import styles from './styles/AestheticsList.module.scss';

const SORT_FIELD_NAME = 'name';
const SORT_FIELD_START_YEAR = 'startYear';
const SORT_FIELD_END_YEAR = 'endYear';

const AestheticsList = props => {
  let aestheticRows = (
    <tr>
      <td colspan="3" className={styles.fullSpanCell}>No aesthetics match the filter criteria.</td>
    </tr>
  );

  if(props.aesthetics.length > 0) {
    aestheticRows = props.aesthetics.map(a => (
      <tr key={a.aesthetic}>
        {/* <Link> should work here, but it doesn't */}
        <td><a href={`/aesthetics/${a.urlSlug}`}>{a.name}</a></td>
        <td>{a.startYear || '?'}</td>
        <td>{a.endYear || '?'}</td>
      </tr>
    ));
  }

  const handleSortClick = newSortField => {
    let newAsc;

    if (props.sortField === newSortField) {
      newAsc = props.asc === null ? true : !props.asc;
    } else {
      newAsc = true;
      props.setSortField(newSortField);
    }

    props.setAsc(newAsc);
    props.callApi({ page: 0, sortField: newSortField, asc: newAsc });
  };

  const getSortSymbol = fieldName => props.sortField === fieldName
    ? <Icon icon={props.asc ? 'sort-asc' : 'sort-desc'} />
    : null;

  return (
    <HTMLTable className={styles.listTable}>
      <colgroup>
        <col className={styles.nameColumn} />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th className={styles.sortable} onClick={() => handleSortClick(SORT_FIELD_NAME)}>
            Name {getSortSymbol(SORT_FIELD_NAME)}
          </th>
          <th className={styles.sortable} onClick={() => handleSortClick(SORT_FIELD_START_YEAR)}>
            First Known Example {getSortSymbol(SORT_FIELD_START_YEAR)}
          </th>
          <th className={styles.sortable} onClick={() => handleSortClick(SORT_FIELD_END_YEAR)}>
            End of Popularity {getSortSymbol(SORT_FIELD_END_YEAR)}
          </th>
        </tr>
      </thead>
      <tbody>
        {aestheticRows}
      </tbody>
    </HTMLTable>
  );
};

export default AestheticsList;