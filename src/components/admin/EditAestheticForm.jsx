import React, { useState } from 'react';

import {
  Button,
  Card,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  NumericInput,
  TextArea,
} from '@blueprintjs/core';

import AestheticRelationshipSubform from './EditAestheticForm/AestheticRelationshipSubform';
import MediaSubform from './EditAestheticForm/MediaSubform';
import WebsiteSubform from './EditAestheticForm/WebsiteSubform';

import '@blueprintjs/core/lib/css/blueprint.css';

const EditAestheticForm = (props) => {
  const [name, setName] = useState(props.aesthetic.name);
  const [symbol, setSymbol] = useState(props.aesthetic.symbol);
  const [startYear, setStartYear] = useState(props.aesthetic.startYear);
  const [peakYear, setPeakYear] = useState(props.aesthetic.setPeakYear);
  const [description, setDescription] = useState(props.aesthetic.description);

  const mediaSourceUrlState = useState(props.aesthetic.mediaSourceUrl);
  const websitesState = useState(props.aesthetic.websites);
  const similarAestheticsState = useState(props.aesthetic.similarAesthetics);
  const mediaState = useState(props.aesthetic.media);

  const handleCancel = () => {

  };

  const handleSave = () => {

  };

  return (
    <form>
      <Card>
        <h2>Basic Information</h2>
        <FormGroup label="Name" labelInfo="(required)">
          <InputGroup onChange={event => setName(event.target.value)} value={name} />
        </FormGroup>
        <FormGroup label="Symbol">
          <InputGroup onChange={event => setSymbol(event.target.value)} value={symbol || ''} />
        </FormGroup>
        <FormGroup label="Year First Observed" labelInfo="(required)">
          <NumericInput onChange={event => setStartYear(event.target.value)}
            value={startYear || ''} />
        </FormGroup>
        <FormGroup label="Peak Year">
          <NumericInput onChange={event => setPeakYear(event.target.value)} value={peakYear || ''} />
        </FormGroup>
        <FormGroup label="Description" labelInfo="(required)">
          <TextArea growVertically={true} fill={true}
            onChange={event => setDescription(event.target.value)} value={description} />
        </FormGroup>
      </Card>
      <br />
      <Card>
        <WebsiteSubform mediaSourceUrl={mediaSourceUrlState} websites={websitesState} />
      </Card>
      <br />
      <Card>
        <AestheticRelationshipSubform aesthetic={props.aesthetic}
          similarAesthetics={similarAestheticsState} />
      </Card>
      <br />
      <Card>
        <MediaSubform media={mediaState} />
      </Card>
      <br />
      <FormGroup>
        <ControlGroup>
          <Button icon="undo" large={true} onClick={handleCancel}>Cancel</Button>
          <Button icon="floppy-disk" intent={Intent.SUCCESS} large={true}
            onClick={handleSave}>Save</Button>
        </ControlGroup>
      </FormGroup>
    </form>
  );
};

export default EditAestheticForm;