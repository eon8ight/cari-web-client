import React, { useEffect, useState } from 'react';

import axios from 'axios';
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
  Spinner,
} from '@blueprintjs/core';

import '@blueprintjs/core/lib/css/blueprint.css';

import styles from './styles/WebsiteSubform.module.scss';

const ARENA_API_URL = 'https://api.are.na/v2/channels/';
const WEBSITE_TYPE_ARENA = 1;

const WEBSITE_TEMPLATE = {
  url: '',
  websiteType: { websiteType: 0 },
};

const WebsiteSubform = (props) => {
  const [mediaSourceUrl, setMediaSourceUrl] = props.mediaSourceUrl;
  const [websites, setWebsites] = props.websites;

  const [isLoading, setIsLoading] = useState(false);
  const [websiteTypes, setWebsiteTypes] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);

      axios.get(`${process.env.REACT_APP_API_URL}/websiteTypes`)
        .then(res => {
          const websiteTypeData = res.data.map(websiteType => ({
            label: websiteType.label,
            value: websiteType.websiteType
          }));

          websiteTypeData.unshift({ label: '--', value: 0 });
          setWebsiteTypes(websiteTypeData);
        });
    }
  }, [isLoading, setIsLoading]);

  if (!websiteTypes) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

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

  const websiteElems = websites.map((website, idx) => {
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
      <li key={website.website}>
        <FormGroup contentClassName={styles.oneLineInput}>
          <ControlGroup fill={true}>
            <HTMLSelect className={Classes.FIXED} onChange={event => handleWebsiteTypeChange(event.target.value, idx)}
              options={websiteTypes} value={website.websiteType.websiteType} />
            <InputGroup onChange={event => handleWebsiteChange(event.target.value, idx)}
              placeholder={website.websiteType.placeholderText} value={website.url} />
            <Button className={Classes.FIXED} icon="trash" intent={Intent.DANGER}>Delete</Button>
          </ControlGroup>
        </FormGroup>
        {mediaSourceCheckbox}
      </li>
    );
  });

  return (
    <>
      <h2>Websites</h2>
      <Callout icon="help" intent={Intent.PRIMARY} title="Media Sources">
        Are.na websites can be used as a media source. If an aesthetic only has one Are.na website,
        it will automatically be selected and used. If there are more than one, the one selected
        will be used.
      </Callout>
      <br />
      <OL>{websiteElems}</OL>
      <FormGroup>
        <Button icon="add" intent={Intent.PRIMARY} onClick={handleAdd}>Add Website</Button>
      </FormGroup>
    </>
  )
};

export default WebsiteSubform;