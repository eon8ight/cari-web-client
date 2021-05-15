import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

import { Spinner } from '@blueprintjs/core';

import EditAestheticForm from '../EditAestheticForm';

import {
  ROLE_LEAD_CURATOR,
  ROLE_LEAD_DIRECTOR,
} from '../../../functions/constants';

import { entityHasPermission } from '../../../functions/utils';

const AESTHETIC_TEMPLATE = {
  aesthetic: null,
  description: '',
  endEra: 0,
  media: [],
  mediaSourceUrl: null,
  name: '',
  similarAesthetics: [],
  startEra: 0,
  websites: [],
};

const CreateAestheticPage = props => {
  const session = props.session;

  if (session.isValid === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (!entityHasPermission(session, ROLE_LEAD_DIRECTOR, ROLE_LEAD_CURATOR)) {
    return <Redirect to="/error/403" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Admin | Create</title>
      </Helmet>
      <EditAestheticForm addMessage={props.addMessage} aesthetic={AESTHETIC_TEMPLATE}
        session={session} />
    </>
  )
};

export default CreateAestheticPage;