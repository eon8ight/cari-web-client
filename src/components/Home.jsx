import React from 'react';
import { Helmet } from 'react-helmet';

import styles from './styles/Home.module.scss';

const Home = props => (
  <>
    <Helmet>
      <title>CARI | the Consumer Aesthetics Research Institute</title>
    </Helmet>
    <section className={styles.homeText}>
      <p>
        CARI, or Consumer Aesthetics Research Institute, is an online community dedicated to
        developing a visual lexicon of consumer ephemera from the 1970s until now.
      </p>
      <p>
        We hope that you will participate with us in researching and developing this new medium
        of cataloging design history.
      </p>
    </section>
  </>
);

export default Home;