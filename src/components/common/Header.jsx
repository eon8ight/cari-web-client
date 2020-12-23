import React from 'react';
import { Link } from 'react-router-dom';

import {
  AnchorButton,
  ButtonGroup,
} from '@blueprintjs/core';

import cariLogo from '../../assets/images/cari_logo.png';

import styles from './styles/Header.module.scss';

const Header = props => {
  let userActions = null;

  if(props.session.isValid) {
    userActions = (
      <div>
        <ButtonGroup>
          <AnchorButton href="/user/logout" icon="log-out" text="Logout" />
          <AnchorButton href="/user/settings" icon="cog" text="Settings" />
        </ButtonGroup>
      </div>
    );
  }

  return (
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
        {userActions}
      </nav>
    </header>
  );
};

export default Header;