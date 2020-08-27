import React from 'react';
import { Link } from 'react-router-dom';

import cariLogo from '../../assets/images/cari_logo.png';

export default (props) => (
  <header>
    <nav id="headerNav">
      <Link id="homeLink" to="/">
        <img alt="Consumer Aesthetics Research Institute"
             src={cariLogo} width="88.9" />
      </Link>
      <Link className="nav-text-link" to="/team">our team</Link>
      <Link className="nav-text-link" to="/glossary">glossary of terms</Link>
      <Link className="nav-text-link" to="/aesthetics">aesthetic categories</Link>
      <Link className="nav-text-link" to="/about">about</Link>
    </nav>
  </header>
);
