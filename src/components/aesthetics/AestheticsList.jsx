import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles/AestheticsList.module.scss';

const SORT_FIELD_NAME = 'name';
const SORT_FIELD_START_YEAR = 'startYear';
const SORT_FIELD_END_YEAR = 'endYear';

const CHAR_CODE_DOWN_TRIANGLE = 9660;
const CHAR_CODE_UP_TRIANGLE = 9652;

export default (props) => {
  const aestheticRows = props.aesthetics.map(a => (
    <tr key={a.aesthetic}>
      <td><Link to={`/aesthetics/${a.urlSlug}`}>{a.name}</Link></td>
      <td>{a.startYear || '?'}</td>
      <td>{a.endYear || '?'}</td>
    </tr>
  ));

  const handleSortClick = (newSortField) => {
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

  const getSortSymbol = (fieldName) => props.sortField === fieldName
    ? String.fromCharCode(props.asc ? CHAR_CODE_DOWN_TRIANGLE : CHAR_CODE_UP_TRIANGLE)
    : null;

  return (
    <table>
      <colgroup>
        <col span="1" className={styles.nameColumn} />
        <col span="1" />
        <col span="1" />
      </colgroup>
      <thead>
        <tr>
          <th className="sortable" onClick={() => handleSortClick(SORT_FIELD_NAME)}>
            Name {getSortSymbol(SORT_FIELD_NAME)}
          </th>
          <th className="sortable" onClick={() => handleSortClick(SORT_FIELD_START_YEAR)}>
            First Known Example {getSortSymbol(SORT_FIELD_START_YEAR)}
          </th>
          <th className="sortable" onClick={() => handleSortClick(SORT_FIELD_END_YEAR)}>
            End of Popularity {getSortSymbol(SORT_FIELD_END_YEAR)}
          </th>
        </tr>
      </thead>
      <tbody>
        {aestheticRows}
      </tbody>
    </table>
  );
};