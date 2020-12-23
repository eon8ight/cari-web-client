import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, useRouteMatch } from 'react-router-dom';

import axios from 'axios';

import {
  Intent,
  Spinner,
} from '@blueprintjs/core';

import EditAestheticForm from '../EditAestheticForm';

import { API_ROUTE_AESTHETIC_FIND_FOR_EDIT } from '../../../functions/constants';

const EditAestheticPage = props => {
  const session = props.session;
  const match = useRouteMatch();

  const [requestMade, setRequestMade] = useState(false);
  const [aestheticData, setAestheticData] = useState(null);

  useEffect(() => {
    if(!requestMade) {
      setRequestMade(true);

      axios.get(`${API_ROUTE_AESTHETIC_FIND_FOR_EDIT}/${match.params.aesthetic}`)
        .then(res => setAestheticData(res.data));
    }
  }, [match.params.aesthetic, requestMade, setRequestMade]);

  if (session.isValid === null || !aestheticData) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (!session.isValid) {
      props.addMessage('You must be logged in to view this page', Intent.DANGER);
      return <Redirect to="/user/login" />;
  }

  return (
    <>
      <Helmet>
        <title>CARI | Admin | Edit {aestheticData.name}</title>
      </Helmet>
      <EditAestheticForm aesthetic={aestheticData} />
    </>
  );
};

export default EditAestheticPage;