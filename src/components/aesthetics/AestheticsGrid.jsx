import React from 'react';

import {
  Button,
  ButtonGroup,
  FormGroup,
} from '@blueprintjs/core';

import styles from './styles/AestheticsGrid.module.scss';

const SORT_FIELD_NAME = 'name';
const SORT_FIELD_START_YEAR = 'startYear';
const SORT_FIELD_END_YEAR = 'endYear';

const AestheticsGrid = props => {
  let aestheticBlocks = (
    <p>No aesthetics match the filter criteria.</p>
  );

  if (props.aesthetics.length > 0) {
    aestheticBlocks = props.aesthetics.map(a => {
      let gridBlockClassName = styles.gridBlockNoImage;
      let gridBlockStyle = {};

      if (a.displayImageUrl) {
        gridBlockClassName = styles.gridBlock;
        gridBlockStyle = { backgroundImage: `url("${a.displayImageUrl}")` };
      }

      return (
        <a className={styles.gridLink} href={`/aesthetics/${a.urlSlug}`}>
          <div className={gridBlockClassName} style={gridBlockStyle}>
            <div className={styles.gridBlockContent}>
              <h3>{a.name}</h3>
              <h4>{`${a.startYear || '?'} - ${a.endYear || '?'}`}</h4>
            </div>
          </div>
        </a>
      )
    });
  }

  const handleSortClick = (newSortField, newAsc) => {
    if (newSortField) {
      props.setSortField(newSortField);
    }

    if (newAsc !== null && typeof newAsc !== 'undefined') {
      props.setAsc(newAsc);
    }

    props.callApi({ page: 0, sortField: newSortField, asc: newAsc });
  };

  return (
    <>
      <FormGroup label="Sort Order">
        <ButtonGroup>
          <Button active={props.sortField === SORT_FIELD_NAME}
            onClick={() => handleSortClick(SORT_FIELD_NAME)}>
            Name
          </Button>
          <Button active={props.sortField === SORT_FIELD_START_YEAR}
            onClick={() => handleSortClick(SORT_FIELD_START_YEAR)}>
            First Known Example
          </Button>
          <Button active={props.sortField === SORT_FIELD_END_YEAR}
            onClick={() => handleSortClick(SORT_FIELD_END_YEAR)}>
            End of Popularity
          </Button>
        </ButtonGroup>
        &nbsp;
        <ButtonGroup>
          <Button active={props.asc} onClick={() => handleSortClick(null, true)}>Ascending</Button>
          <Button active={!props.asc} onClick={() => handleSortClick(null, false)}>Descending</Button>
        </ButtonGroup>
      </FormGroup>
      <div className={styles.grid}>
        {aestheticBlocks}
      </div>
    </>
  );
};

export default AestheticsGrid;