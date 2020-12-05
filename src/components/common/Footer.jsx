import React from 'react';

import styles from './styles/Footer.module.scss';

const Footer = props => (
  <>
    <hr />
    <footer className={styles.commonFooter}>
      &copy; Consumer Aesthetics Research Institute {new Date().getFullYear()}
    </footer>
  </>
);

export default Footer;