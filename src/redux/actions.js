import { Intent } from '@blueprintjs/core';

import { uniqueId } from 'lodash/util';

const ADD_MESSAGE = 'ADD_MESSAGE';

const addMessage = (message, intent = Intent.PRIMARY) => ({
  type: ADD_MESSAGE,
  payload: { props: { message, intent }, key: `message_${uniqueId()}` },
});

export {
  ADD_MESSAGE,
  addMessage,
};