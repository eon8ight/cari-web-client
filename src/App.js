import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';
import { uniqueId } from 'lodash/util';

import {
  Intent,
  Position,
  Spinner,
  Toaster,
} from '@blueprintjs/core';

import AdminRouter from './components/admin/Router';
import AestheticsRouter from './components/aesthetics/Router';
import ErrorRouter from './components/error/Router';
import UserRouter from './components/user/Router';
import Faq from './components/Faq';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import Home from './components/Home';
import NotFoundPage from './components/error/pages/NotFoundPage';
import Team from './components/Team';

import {
  API_ROUTE_AUTH_CHECK_SESSION,
  TOKEN_VALIDITY_VALID,
} from './functions/constants';

import '@blueprintjs/core/lib/css/blueprint.css';

import './Styles.scss';

const TOASTER = Toaster.create({
  autoFocus: true,
  canEscapeKeyClear: true,
  maxToasts: 1,
  position: Position.TOP,
});

const App = props => {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if(session === null) {
      const getOpts = {
        withCredentials: true,
        validateStatus: (httpCode => httpCode === 200 || httpCode === 401),
      };

      axios.get(API_ROUTE_AUTH_CHECK_SESSION, getOpts)
        .then(res => {
          const claims = res.data.tokenClaims;

          if(claims.iss) {
            claims.iss = parseInt(claims.iss);
          }

          if(claims.sub) {
            claims.sub = parseInt(claims.sub);
          }

          if(claims.roles) {
            claims.roles = claims.roles.split(',').map(r => parseInt(r.trim()));
          }

          setSession({
            isValid: res.data.status === TOKEN_VALIDITY_VALID,
            claims: claims,
          });
        })
        .catch(err => setSession({ isValid: false }));
    }
  }, [session]);

  useEffect(() => {
    TOASTER.clear();
    messages.forEach(msg => TOASTER.show(msg.props, msg.key));
  }, [messages]);

  const addMessage = useCallback((message, intent) => {
    const messageObject = {
      props: {
        message,
        intent: intent || Intent.PRIMARY,
      },
      key: uniqueId('message_'),
    };

    const newMessages = cloneDeep(messages);
    newMessages.push(messageObject);
    setMessages(newMessages);
  }, [messages]);

  if (session === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  return (
    <BrowserRouter>
      <Header session={session} />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/about">
          <Home />
        </Route>
        <Route path="/team">
          <Team addMessage={addMessage} />
        </Route>
        <Route path="/faq">
          <Faq />
        </Route>
        <Route path="/aesthetics">
          <AestheticsRouter addMessage={addMessage} session={session} />
        </Route>
        <Route path="/admin">
          <AdminRouter addMessage={addMessage} session={session} />
        </Route>
        <Route path="/error">
          <ErrorRouter />
        </Route>
        <Route path="/user">
          <UserRouter addMessage={addMessage} session={session} setSession={setSession} />
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
