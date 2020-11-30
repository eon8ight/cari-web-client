import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AdminRouter from './components/admin/Router';
import AestheticsRouter from './components/aesthetics/Router';
import Faq from './components/Faq';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import Home from './components/Home';
import NotFoundPage from './components/error/NotFoundPage';
import Team from './components/Team';

import './Styles.scss';

const App = (props) => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/about">
        <Home />
      </Route>
      <Route path="/team">
        <Team />
      </Route>
      <Route path="/faq">
        <Faq />
      </Route>
      <Route path="/aesthetics">
        <AestheticsRouter />
      </Route>
      <Route path="/admin">
        <AdminRouter />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
    <Footer />
  </BrowserRouter>
);

export default App;
