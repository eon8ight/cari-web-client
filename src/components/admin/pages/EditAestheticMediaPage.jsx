import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, useRouteMatch } from 'react-router-dom';

import axios from 'axios';

import {
  Intent,
  Spinner,
} from '@blueprintjs/core';

import EditAestheticMediaForm from '../EditAestheticMediaForm';

import {
  API_ROUTE_AESTHETIC_FIND_FOR_EDIT,
  ROLE_CURATOR,
} from '../../../functions/constants';

import { entityHasPermission } from '../../../functions/utils';

const EditAestheticMediaPage = props => {
  const addMessage = props.addMessage;
  const session = props.session;
  const match = useRouteMatch();

  const [requestMade, setRequestMade] = useState(false);
  const [aestheticData, setAestheticData] = useState(null);

  useEffect(() => {
    if(!requestMade) {
      setRequestMade(true);

      axios.get(`${API_ROUTE_AESTHETIC_FIND_FOR_EDIT}/${match.params.aesthetic}`)
        .then(res => setAestheticData(res.data))
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));;
    }
  }, [addMessage, match.params.aesthetic, requestMade, setRequestMade]);

  if (session.isValid === null || !aestheticData) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (!(session.isValid && entityHasPermission(session, ROLE_CURATOR))) {
    return <Redirect to="/error/403" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Admin | Edit {aestheticData.name}</title>
      </Helmet>
      <EditAestheticMediaForm addMessage={addMessage} aesthetic={aestheticData} />
    </>
  );
};

export default EditAestheticMediaPage;