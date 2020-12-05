import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Position,
  Toaster
} from '@blueprintjs/core';

import AdminRouter from './components/admin/Router';
import AuthRouter from './components/auth/Router';
import AestheticsRouter from './components/aesthetics/Router';
import UserRouter from './components/user/Router';
import Faq from './components/Faq';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import Home from './components/Home';
import NotFoundPage from './components/error/NotFoundPage';
import Team from './components/Team';

import { checkSession } from './redux/actions';

import './Styles.scss';

const TOASTER = Toaster.create({
  autoFocus: true,
  canEscapeKeyClear: true,
  position: Position.TOP,
});

const App = props => {
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    props.messages.forEach(msg => TOASTER.show(msg.props, msg.key));
  }, [props.messages]);

  useEffect(() => {
    if(!checkedSession) {
      props.checkSession();
    }

    return (() => setCheckedSession(true));
  }, [checkedSession, props]);

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/auth">
          <AuthRouter />
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
        <Route path="/user">
          <UserRouter />
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default connect(
  state => ({ messages: state.messages }),
  { checkSession }
)(App);
