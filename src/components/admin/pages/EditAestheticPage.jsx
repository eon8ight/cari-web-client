import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch } from 'react-router-dom';

import axios from 'axios';
import { Spinner } from '@blueprintjs/core';

import EditAestheticForm from '../EditAestheticForm';

import { API_ROUTE_AESTHETIC_FIND_FOR_EDIT } from '../../../functions/Constants';

const EditAestheticPage = (props) => {
  const match = useRouteMatch();

  const [requestMade, setRequestMade] = useState(false);
  const [aestheticData, setAestheticData] = useState(null);

  useEffect(() => {
    if(!requestMade) {
      setRequestMade(true);

      axios.get(
        `${API_ROUTE_AESTHETIC_FIND_FOR_EDIT}/${match.params.aesthetic}`,
        {
          params: {
            includeSimilarAesthetics: true,
            includeMedia: true,
            includeGalleryContent: true,
          }
        }
      ).then(res => setAestheticData(res.data));
    }
  }, [match.params.aesthetic, requestMade, setRequestMade]);

  if (!aestheticData) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
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