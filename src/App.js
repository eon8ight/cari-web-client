import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AestheticsRouter from './components/aesthetics/Router';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import Home from './components/Home';
import NotFoundPage from './components/error/NotFoundPage';
import Team from './components/Team';

import './Styles.scss';

export default (props) => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/team">
        <Team />
      </Route>
      <Route path="/aesthetics">
        <AestheticsRouter />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
    <Footer />
  </BrowserRouter>
);