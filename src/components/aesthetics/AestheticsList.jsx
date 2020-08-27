import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {
  const aestheticLis = props.aesthetics.map(a => (
    <li>
      <Link to={`/aesthetics/${a.urlName}`}>{a.name}</Link>
    </li>
  ));

  return (
    <ul>
      {aestheticLis}
    </ul>
  );
};
