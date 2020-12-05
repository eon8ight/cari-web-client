import React from 'react';
import { Link } from 'react-router-dom';

import cariLogo from '../../assets/images/cari_logo.png';

import styles from './styles/Header.module.scss';

const Header = props => (
  <header className={styles.commonHeader}>
    <nav className={styles.headerLinks}>
      <Link to="/">
        <img alt="Consumer Aesthetics Research Institute"
             src={cariLogo} width="88.9" />
      </Link>
      <Link className={styles.link} to="/aesthetics">aesthetic categories</Link>
      <Link className={styles.link} to="/faq">FAQ</Link>
      <Link className={styles.link} to="/team">our team</Link>
      <Link className={styles.link} to="/about">about</Link>
    </nav>
  </header>
);

export default Header;