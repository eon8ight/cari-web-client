import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles/AestheticsList.module.scss';

export default (props) => {
  const aestheticRows = props.aesthetics.map(a => (
    <tr key={a.aesthetic}>
      <td><Link to={`/aesthetics/${a.urlSlug}`}>{a.name}</Link></td>
      <td>{a.startYear} - {a.endYear || 'present'}</td>
    </tr>
  ));

  return (
    <table>
      <colgroup>
        <col span="1" className={styles.nameColumn} />
        <col span="1" />
      </colgroup>
      <thead>
        <tr>
          <th>Name</th>
          <th>Circa</th>
        </tr>
      </thead>
      <tbody>
        {aestheticRows}
      </tbody>
    </table>
  );
};