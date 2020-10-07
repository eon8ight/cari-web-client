import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AestheticsRouter from './components/aesthetics/Router';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import Home from './components/Home';

import './Styles.scss';

export default (props) => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/aesthetics">
        <AestheticsRouter />
      </Route>
    </Switch>
    <Footer />
  </BrowserRouter>
);