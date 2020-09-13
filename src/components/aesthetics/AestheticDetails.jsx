import React from 'react';

import parse from 'html-react-parser';

import styles from './styles/AestheticDetails.module.scss';

export default (props) => (
  <>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionHeaderLine}>
        <h1>{props.aestheticData.name}</h1>
        <h3>({props.aestheticData.symbol})</h3>
      </div>
      <div className={styles.sectionHeaderLine}>
        <h3>circa</h3>
        <h2>
          {props.aestheticData.startYear} - {props.aestheticData.endYear || 'present'}
        </h2>
      </div>
    </div>
    <p>{props.aestheticData.description ? parse(props.aestheticData.description) : 'No description.'}</p>
  </>
);
