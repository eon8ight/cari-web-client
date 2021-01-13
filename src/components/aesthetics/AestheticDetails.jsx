import React from 'react';

import parse from 'html-react-parser';
import { uniqueId } from 'lodash/util';

import {
  AnchorButton,
  Intent,
} from '@blueprintjs/core';

import {
  ROLE_CURATOR,
  ROLE_LEAD_CURATOR,
  ROLE_LEAD_DIRECTOR,
} from '../../functions/constants';

import { entityHasPermission } from '../../functions/utils';

import styles from './styles/AestheticDetails.module.scss';

const AestheticDetails = props => {
  let websites = null;

  if (props.aesthetic.websites && props.aesthetic.websites.length > 0) {
    const websitesLis = props.aesthetic.websites.map(w => (
      <li key={w.website || uniqueId('website_')}>
        <a href={w.url} target="_blank" rel="noopener noreferrer">{w.type.label} - {w.url}</a>
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

  let editButton = null;

  if(props.session.isValid && entityHasPermission(props.session, ROLE_CURATOR, ROLE_LEAD_CURATOR, ROLE_LEAD_DIRECTOR)) {
    editButton = (
      <AnchorButton href={`/admin/edit/${props.aesthetic.aesthetic}`} icon="edit"
        intent={Intent.PRIMARY} large={true} text="Edit" />
    );
  }

  return (
    <>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLine}>
          <h1>{props.aesthetic.name}</h1>
          <h3>{props.aesthetic.symbol && `(${props.aesthetic.symbol})`}</h3>
          {editButton}
        </div>
        <div className={styles.sectionHeaderLine}>
          <h3>circa</h3>
          <h2>
            {props.aesthetic.startYear || '?'} - {props.aesthetic.endYear || 'Present'}
          </h2>
        </div>
      </div>
      {props.aesthetic.description ? parse(props.aesthetic.description) : 'No description.'}
      {websites}
    </>
  );
};

export default AestheticDetails;