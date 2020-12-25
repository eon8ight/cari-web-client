import React from 'react';
import { Helmet } from 'react-helmet';

import EditAestheticForm from '../EditAestheticForm';

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
  return (
    <>
      <Helmet>
        <title>CARI | Admin | Create</title>
      </Helmet>
      <EditAestheticForm addMessage={props.addMessage} aesthetic={AESTHETIC_TEMPLATE} />
    </>
  )
};

export default CreateAestheticPage;