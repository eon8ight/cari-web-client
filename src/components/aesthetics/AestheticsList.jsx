import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles/AestheticsList.module.scss';

const SORT_FIELD_NAME = "name";
const SORT_FIELD_START_YEAR = "startYear";

const CHAR_CODE_DOWN_TRIANGLE = 9660;
const CHAR_CODE_UP_TRIANGLE = 9652;

export default (props) => {
  const aestheticRows = props.aesthetics.map(a => (
    <tr key={a.aesthetic}>
      <td><Link to={`/aesthetics/${a.urlSlug}`}>{a.name}</Link></td>
      <td>{a.startYear} - {a.endYear || 'present'}</td>
    </tr>
  ));

  const handleSortClick = (newSortField) => {
    let newSortAsc;
  
    if (props.sortField === newSortField) {
      newSortAsc = props.sortAsc === null ? true : !props.sortAsc;
    } else {
      newSortAsc = true;
      props.setSortField(newSortField);
    }

    props.setSortAsc(newSortAsc);
    props.callApi(0, newSortField, newSortAsc);
  };

  const getSortSymbol = (fieldName) => props.sortField === fieldName
    ? String.fromCharCode(props.sortAsc ? CHAR_CODE_DOWN_TRIANGLE : CHAR_CODE_UP_TRIANGLE)
    : null;

  return (
    <table>
      <colgroup>
        <col span="1" className={styles.nameColumn} />
        <col span="1" />
      </colgroup>
      <thead>
        <tr>
          <th className="sortable" onClick={() => handleSortClick(SORT_FIELD_NAME)}>
            Name {getSortSymbol(SORT_FIELD_NAME)}
          </th>
          <th className="sortable" onClick={() => handleSortClick(SORT_FIELD_START_YEAR)}>
            Circa {getSortSymbol(SORT_FIELD_START_YEAR)}
          </th>
        </tr>
      </thead>
      <tbody>
        {aestheticRows}
      </tbody>
    </table>
  );
};