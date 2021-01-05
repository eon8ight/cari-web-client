import React, { useState } from 'react';

import { cloneDeep } from 'lodash';

import AestheticsList from './AestheticsList';

const RelatedAestheticsList = props => {
  const [aesthetics, setAesthetics] = useState(props.aesthetic.similarAesthetics);

  const [sortField, setSortField] = useState(null);
  const [asc, setAsc] = useState(null);

  const resort = params => {
    if (typeof params === 'undefined' || params === null) {
      params = {};
    }

    const useSortField = params.sortField ?? sortField;
    const useAsc = params.asc !== null ? params.asc : asc;

    const newAesthetics = cloneDeep(aesthetics);

    newAesthetics.sort((firstEl, secondEl) => {
      let rval;

      switch(useSortField) {
        case 'name':
          rval = firstEl.name.localeCompare(secondEl.name);

          if(!useAsc) {
            rval = -rval;
          }

          break;
        case 'startYear':
          const firstElStartYear = firstEl.approximateStartYear;
          const secondElStartYear = secondEl.approximateStartYear;

          if(firstElStartYear === null && secondElStartYear === null) {
            rval = 0;
          } else if(firstElStartYear === null) {
            rval = -1;
          } else if(secondElStartYear === null) {
            rval = 1;
          } else {
            rval = firstElStartYear - secondElStartYear;

            if(!useAsc) {
              rval = -rval;
            }
          }

          break;
        case 'endYear':
          const firstElEndYear = firstEl.approximateEndYear;
          const secondElEndYear = secondEl.approximateEndYear;

          if(firstElEndYear === null && secondElEndYear === null) {
            rval = 0;
          } else if(firstElEndYear === null) {
            rval = -1;
          } else if(secondElEndYear === null) {
            rval = 1;
          } else {
            rval = firstElEndYear - secondElEndYear;

            if(!useAsc) {
              rval = -rval;
            }
          }

          break;
        default:
          rval = 0;
      }

      return rval;
    });

    setAesthetics(newAesthetics);
  };

  return <AestheticsList aesthetics={aesthetics} sortField={sortField} setSortField={setSortField}
    asc={asc} setAsc={setAsc} callApi={resort} />
};

export default RelatedAestheticsList;