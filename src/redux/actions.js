import axios from 'axios';

import { Intent } from '@blueprintjs/core';

import {
  API_ROUTE_AUTH_CHECK_SESSION,
  API_ROUTE_AUTH_LOGIN,
  API_ROUTE_AUTH_LOGOUT,
} from '../functions/constants';
import { uniqueId } from 'lodash/util';

const ADD_MESSAGE = 'ADD_MESSAGE';
const REQUEST_CHECK_SESSION = 'REQUEST_CHECK_SESSION';
const RECEIVE_CHECK_SESSION = 'RECEIVE_CHECK_SESSION';
const REQUEST_LOG_IN = 'REQUEST_LOG_IN';
const RECEIVE_LOG_IN = 'RECEIVE_LOG_IN';
const REQUEST_LOG_OUT = 'REQUEST_LOG_OUT';
const RECEIVE_LOG_OUT = 'RECEIVE_LOG_OUT';
const UPDATE_SESSION = 'UPDATE_SESSION';

const addMessage = (message, intent = Intent.PRIMARY) => ({
  type: ADD_MESSAGE,
  payload: { props: { message, intent }, key: `message_${uniqueId()}` },
});

const requestCheckSession = () => ({
  type: REQUEST_CHECK_SESSION,
});

const receiveCheckSession = (res, err) => {
  let rval = { type: RECEIVE_CHECK_SESSION };

  if (err) {
    rval.payload = err.data;
    rval.error = true;
  } else {
    rval.payload = res.data;
  }

  return rval;
};

const requestLogin = () => ({
  type: REQUEST_LOG_IN,
});

const receiveLogin = (res, err) => {
  let rval = { type: RECEIVE_LOG_IN };

  if (err) {
    rval.payload = err.data;
    rval.error = true;
  } else {
    rval.payload = res.data;
  }

  return rval;
};

const requestLogout = () => ({
  type: REQUEST_LOG_OUT,
});

const receiveLogout = (res, err) => {
  let rval = { type: RECEIVE_LOG_OUT };

  if (err) {
    rval.payload = err.data;
    rval.error = true;
  }

  return rval;
};

const _updateSession = newSession => ({
  type: UPDATE_SESSION,
  payload: newSession,
});

const checkSession = () => {
  return ((dispatch, getState) => {
    const state = getState();

    if (state.session.isValid || state.session.isFetching) {
      return Promise.resolve();
    }

    const getOpts = {
      withCredentials: true,
      validateStatus: (httpCode => httpCode === 200 || httpCode === 401),
    };

    dispatch(requestCheckSession());

    return axios.get(API_ROUTE_AUTH_CHECK_SESSION, getOpts)
      .then(res => {
        if (res.status === 200)
          dispatch(receiveCheckSession(res));
        else
          dispatch(receiveCheckSession(null, res));
      })
      .catch(err => {
        dispatch(addMessage(`An error occurred: ${err}`, Intent.DANGER));
        dispatch(receiveCheckSession(null, err))
      });
  });
};

const login = (username, password, rememberMe, onUnauthorized, onAuthorized) => {
  return ((dispatch, getState) => {
    const state = getState();

    if (state.session.data || state.session.isFetching) {
      return Promise.resolve();
    }

    dispatch(requestLogin());

    const postBody = { username, password, rememberMe };
    const postOpts = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      validateStatus: (httpCode => httpCode === 200 || httpCode === 401),
    };

    return axios.post(API_ROUTE_AUTH_LOGIN, postBody, postOpts)
      .then(res => {
        if (res.status === 200) {
          dispatch(receiveLogin(res));
          onAuthorized();
        } else {
          dispatch(receiveLogin(null, res));
          onUnauthorized(res.data);
        }
      })
      .catch(err => {
        dispatch(addMessage(`An error occurred: ${err}`, Intent.DANGER));
        dispatch(receiveLogin(null, err));
      });
  });
};

const logout = onDeauthorized => {
  return ((dispatch, getState) => {
    const state = getState();

    if (!state.session.isValid || state.session.isFetching) {
      return Promise.resolve();
    }

    dispatch(requestLogout());

    return axios.post(API_ROUTE_AUTH_LOGOUT, {}, { withCredentials: true })
      .then(res => {
        dispatch(receiveLogout(res))
        onDeauthorized();
      })
      .catch(err => {
        dispatch(addMessage(`An error occurred: ${err}`, Intent.DANGER));
        dispatch(receiveLogout(null, err));
      });
  });
};

const updateSession = fields => ((dispatch, getState) => {
  dispatch(_updateSession(Object.assign({}, getState().session.data, fields)))
});

export {
  ADD_MESSAGE,
  REQUEST_CHECK_SESSION,
  RECEIVE_CHECK_SESSION,
  REQUEST_LOG_IN,
  RECEIVE_LOG_IN,
  REQUEST_LOG_OUT,
  RECEIVE_LOG_OUT,
  UPDATE_SESSION,
  addMessage,
  checkSession,
  login,
  logout,
  updateSession,
};