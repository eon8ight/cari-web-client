import { combineReducers } from 'redux';

import {
  ADD_MESSAGE,
  REQUEST_CHECK_SESSION,
  RECEIVE_CHECK_SESSION,
  RECEIVE_LOG_IN,
  RECEIVE_LOG_OUT,
  REQUEST_LOG_IN,
  REQUEST_LOG_OUT,
  UPDATE_SESSION,
} from './actions';

import { TOKEN_VALIDITY_VALID } from '../functions/constants';

const DEFAULT_SESSION_STATE = {
  isFetching: false,
  isValid: undefined,
  claims: undefined,
  error: undefined,
};

const messages = (state = [], action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return [...state, action.payload];
    default:
      return state;
  }
};

const session = (state = DEFAULT_SESSION_STATE, action) => {
  let newState = {};

  switch (action.type) {
    case REQUEST_CHECK_SESSION:
    case REQUEST_LOG_IN:
    case REQUEST_LOG_OUT:
      return Object.assign({}, state, { isFetching: true });
    case RECEIVE_CHECK_SESSION:
    case RECEIVE_LOG_IN:
      newState = { isFetching: false };

      if (action.error) {
        newState.isValid = false;
        newState.claims = null;
        newState.error = action.payload;
      } else {
        newState.isValid = action.payload.status === TOKEN_VALIDITY_VALID;
        newState.claims = action.payload.tokenClaims;
        newState.error = null;
      }

      return Object.assign({}, state, newState);
    case RECEIVE_LOG_OUT:
      newState = { isFetching: false };

      if (action.error) {
        newState.error = action.payload;
      } else {
        newState.isValid = false;
        newState.claims = null;
        newState.error = null;
      }

      return Object.assign({}, state, newState);
    case UPDATE_SESSION:
      newState = {
        isFetching: false,
        isValid: true,
        error: null,
      };

      return Object.assign({}, state, newState);
    default:
      return state;
  }
};

export default combineReducers({ messages, session });