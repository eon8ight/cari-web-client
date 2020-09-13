import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AestheticsRouter from './components/aesthetics/Router';
import Footer from './components/common/Footer';
import Header from './components/common/Header';

import './Styles.scss';

export default (props) => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/aesthetics">
        <AestheticsRouter />
      </Route>
    </Switch>
    <Footer />
  </BrowserRouter>
);