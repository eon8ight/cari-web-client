import React from 'react';

import parse from 'html-react-parser';

export default (props) => (
  <>
    <div className="section-header">
      <div className="section-header-line">
        <h1>{props.aestheticData.name}</h1>
        <h3>({props.aestheticData.symbol})</h3>
      </div>
      <div className="section-header-line">
        <h3>circa</h3>
        <h2>
          {props.aestheticData.start_year} - {props.aestheticData.end_year}
        </h2>
      </div>
    </div>
    <p>{parse(props.aestheticData.description)}</p>
  </>
);
