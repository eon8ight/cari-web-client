import React from 'react';

import { cloneDeep } from 'lodash/lang';

import {
  Button,
  Callout,
  Checkbox,
  Classes,
  ControlGroup,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Intent,
  OL,
} from '@blueprintjs/core';

import ConfirmDelete from './ConfirmDelete';
import ExpandableSection from './ExpandableSection';

import {
  ARENA_API_URL,
  WEBSITE_TYPE_ARENA,
} from '../../../functions/constants';

import '@blueprintjs/core/lib/css/blueprint.css';

const WEBSITE_TEMPLATE = {
  url: '',
  websiteType: { websiteType: 0 },
};

const WebsiteSubform = props => {
  const [mediaSourceUrl, setMediaSourceUrl] = props.mediaSourceUrl;
  const [websites, setWebsites] = props.websites;

  const intent = props.intent;
  const helperText = props.helperText;

  const websiteTypeOptions = Object.keys(props.websiteTypes).map(websiteType => ({
    label: props.websiteTypes[websiteType].label,
    value: websiteType
  }));

  websiteTypeOptions.unshift({ label: '--', value: null });

  const handleAdd = () => {
    const newWebsites = cloneDeep(websites);
    newWebsites.push(cloneDeep(WEBSITE_TEMPLATE));
    setWebsites(newWebsites);
  };

  const handleWebsiteChange = (url, idx) => {
    const newWebsites = cloneDeep(websites);
    newWebsites[idx].url = url;
    setWebsites(newWebsites);
  };

  const handleWebsiteTypeChange = (websiteType, idx) => {
    const newWebsites = cloneDeep(websites);
    newWebsites[idx].websiteType.websiteType = parseInt(websiteType);
    setWebsites(newWebsites);
  }

  const handleDelete = idx => {
    const newWebsites = cloneDeep(websites);
    newWebsites.splice(idx, 1);
    setWebsites(newWebsites);
  };

  const elems = websites.map((website, idx) => {
    let mediaSourceCheckbox = null;

    if (website.websiteType.websiteType === WEBSITE_TYPE_ARENA) {
      const mediaSource = mediaSourceUrl.split('/').pop();
      const arenaWebsiteSlug = website.url.split('/').pop();

      const hasMultipleArenaWebsites = websites
        .filter(website => website.websiteType.websiteType === WEBSITE_TYPE_ARENA)
        .length > 1;

      mediaSourceCheckbox = (
        <Checkbox checked={mediaSource === arenaWebsiteSlug || !hasMultipleArenaWebsites}
          disabled={!hasMultipleArenaWebsites} label="Is Media Source?"
          onChange={() => setMediaSourceUrl(ARENA_API_URL + arenaWebsiteSlug)} />
      );
    }

    return (
      <li key={website.website || `new_${idx}`}>
        <FormGroup helperText={helperText[idx]} intent={intent[idx]}>
          <ControlGroup fill={true}>
            <HTMLSelect className={Classes.FIXED} intent={intent[idx]}
              onChange={event => handleWebsiteTypeChange(event.target.value, idx)}
              options={websiteTypeOptions} value={website.websiteType.websiteType} />
            <InputGroup intent={intent[idx]}
              onChange={event => handleWebsiteChange(event.target.value, idx)}
              placeholder={website.websiteType.url} value={website.url} />
            <ConfirmDelete onClick={() => handleDelete(idx)} />
          </ControlGroup>
        </FormGroup>
        {mediaSourceCheckbox}
      </li>
    );
  });

  const websiteContent = (
    <>
      <Callout icon="help" intent={Intent.PRIMARY} title="Media Sources">
        Are.na websites can be used as a media source. If an aesthetic only has one Are.na website,
        it will automatically be selected and used. If there are more than one, the one selected
        will be used.
      </Callout>
      <br />
      <OL>{elems}</OL>
      <FormGroup>
        <Button icon="add" intent={Intent.PRIMARY} onClick={handleAdd}>Add Website</Button>
      </FormGroup>
    </>
  );

  return <ExpandableSection content={websiteContent} header="Websites" />;
};

export default WebsiteSubform;