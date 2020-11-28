import React from 'react';

import parse from 'html-react-parser';

import styles from './styles/AestheticDetails.module.scss';

export default (props) => {
  let websites = null;

  if (props.aesthetic.websites && props.aesthetic.websites.length > 0) {
    const websitesLis = props.aesthetic.websites.map(w => (
      <li key={w.website}>
        <a href={w.url} target="_blank" rel="noopener noreferrer">{w.websiteType.label} - {w.url}</a>
      </li>
    ));

    websites = (
      <>
        <h3>Links</h3>
        <ol>
          {websitesLis}
        </ol>
      </>
    );
  }

  return (
    <>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLine}>
          <h1>{props.aesthetic.name}</h1>
          <h3>{props.aesthetic.symbol && `(${props.aesthetic.symbol})`}</h3>
        </div>
        <div className={styles.sectionHeaderLine}>
          <h3>circa</h3>
          <h2>
            {props.aesthetic.startYear || '?'} - {props.aesthetic.endYear || '?'}
          </h2>
        </div>
      </div>
      <p>{props.aesthetic.description ? parse(props.aesthetic.description) : 'No description.'}</p>
      {websites}
    </>
  );
};
