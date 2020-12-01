import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';

import {
  Button,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  MenuItem,
  NumericInput,
  OL,
  Position,
  Spinner,
  TextArea,
} from '@blueprintjs/core';

import { Suggest } from '@blueprintjs/select';

import ConfirmDelete from './ConfirmDelete';
import ExpandableSection from './ExpandableSection';
import { API_ROUTE_MEDIA_CREATORS } from '../../../functions/Constants';

import '@blueprintjs/core/lib/css/blueprint.css';

import styles from './styles/MediaSubform.module.scss';

Modal.setAppElement('#root');

const MEDIA_TEMPLATE = {
  description: '',
  label: '',
  name: '',
  mediaCreator: {
    name: '',
  },
  previewImageUrl: '',
  url: '',
  year: '',
};

const MENU_ITEM_NO_RESULTS = <MenuItem className={styles.tooltipText} disabled={true} key={0} text="No results." />;

const SUGGEST_POPOVER_PROPS = {
  minimal: true,
  popoverClassName: styles.creatorNameSuggest
};

const ellipsize = string => string.length > 50 ? string.substring(0, 50) + '...' : string;
const compareNames = (creatorNameA, creatorNameB) => creatorNameA.mediaCreator === creatorNameB.mediaCreator;

const menuItemCreate = (query, active, handleClick) => (
  <MenuItem active={active} className={styles.tooltipText} icon="add" key={0} onClick={handleClick}
    shouldDismissPopover={false} text={`Create "${query}"`} />
);

const MediaSubform = (props) => {
  const [media, setMedia] = props.media;

  const [swapSpace, setSwapSpace] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [urlIntent, setUrlIntent] = useState(Intent.NONE);
  const [previewImageUrlIntent, setPreviewImageUrlIntent] = useState(Intent.NONE);
  const [labelIntent, setLabelIntent] = useState(Intent.NONE);
  const [descriptionIntent, setDescriptionIntent] = useState(Intent.NONE);
  const [yearIntent, setYearIntent] = useState(Intent.NONE);

  const [urlHelperText, setUrlHelperText] = useState('');
  const [previewImageUrlHelperText, setPreviewImageUrlHelperText] = useState('');
  const [labelHelperText, setLabelHelperText] = useState('');
  const [descriptionHelperText, setDescriptionHelperText] = useState('');
  const [yearHelperText, setYearHelperText] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [creatorNames, setCreatorNames] = useState([]);
  const [creatorNamesMap, setCreatorNamesMap] = useState([]);
  const [filteredCreatorNames, setFilteredCreatorNames] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);

      axios.get(API_ROUTE_MEDIA_CREATORS)
        .then(res => {
          const newCreatorNames = res.data;

          const newCreatorNamesMap = newCreatorNames.reduce((map, creatorName) => {
            map[creatorName.mediaCreator] = creatorName.name;
            return map
          }, {});

          setCreatorNames(newCreatorNames);
          setCreatorNamesMap(newCreatorNamesMap);
          setFilteredCreatorNames(newCreatorNames);
        });
    }
  }, [isLoading, setIsLoading]);

  if (!creatorNames) {
    return <Spinner />;
  }

  const refilter = query => {
    const newFilteredCreatorNames = cloneDeep(creatorNames);

    setFilteredCreatorNames(newFilteredCreatorNames.filter(
      creatorName => creatorName.name.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const handleModalOpen = (medium, idx) => {
    const newSwapSpace = cloneDeep(medium);
    setSwapSpace(newSwapSpace);
    setEditIndex(typeof idx === 'undefined' ? null : idx);
  };

  const handleModalClose = (didSave) => {
    if (didSave) {
      const newMedia = cloneDeep(media);

      if (editIndex === null) {
        newMedia.push(swapSpace);
      } else {
        newMedia[editIndex] = swapSpace;
      }

      setMedia(newMedia);
    }

    setSwapSpace(null);
  };

  const handleDelete = idx => {
    const newMedia = cloneDeep(media);
    newMedia.splice(idx, 1);
    setMedia(newMedia);
  };

  const handleChange = (property, value) => {
    const newSwapSpace = cloneDeep(swapSpace);
    newSwapSpace[property] = value;
    setSwapSpace(newSwapSpace);
  };

  const handleCreatorChange = creatorName => {
    const newSwapSpace = cloneDeep(swapSpace);
    newSwapSpace.mediaCreator = creatorName;
    setSwapSpace(newSwapSpace);
    setFilteredCreatorNames(creatorNames);
  };

  const validateUrl = () => {
    let hasError = false;

    if (!swapSpace.url) {
      setUrlIntent(Intent.DANGER);
      setUrlHelperText('URL is required.');
      hasError = true;
    } else {
      setUrlIntent(Intent.NONE);
      setUrlHelperText('');
    }

    return hasError;
  };

  const validatePreviewImageUrl = () => {
    let hasError = false;

    if (!swapSpace.previewImageUrl) {
      setPreviewImageUrlIntent(Intent.DANGER);
      setPreviewImageUrlHelperText('Preview image URL is required.');
      hasError = true;
    } else {
      setPreviewImageUrlIntent(Intent.NONE);
      setPreviewImageUrlHelperText('');
    }

    return hasError;
  };

  const validateLabel = () => {
    let hasError = false;

    if (!swapSpace.label) {
      setLabelIntent(Intent.DANGER);
      setLabelHelperText('Label is required.');
      hasError = true;
    } else {
      setLabelIntent(Intent.NONE);
      setLabelHelperText('');
    }

    return hasError;
  };

  const validateDescription = () => {
    let hasError = false;

    if (!swapSpace.description) {
      setDescriptionIntent(Intent.DANGER);
      setDescriptionHelperText('Description is required.');
      hasError = true;
    } else {
      setDescriptionIntent(Intent.NONE);
      setDescriptionHelperText('');
    }

    return hasError;
  };

  const validateYear = () => {
    let hasError = false;

    if (!swapSpace.year) {
      setYearIntent(Intent.DANGER);
      setYearHelperText('Year is required.');
      hasError = true;
    } else {
      setYearIntent(Intent.NONE);
      setYearHelperText('');
    }

    return hasError;
  };

  const handleSave = () => {
    const hasUrlError = validateUrl();
    const hasPreviewImageUrlError = validatePreviewImageUrl();
    const hasLabelError = validateLabel();
    const hasDescriptionError = validateDescription();
    const hasYearError = validateYear();

    if (hasUrlError || hasPreviewImageUrlError || hasLabelError || hasDescriptionError
      || hasYearError) {
      return;
    }

    handleModalClose(true);
  }

  const createNewMediaCreatorFromQuery = query => {
    const newCreatorNamesMap = cloneDeep(creatorNamesMap);
    newCreatorNamesMap[null] = query;
    setCreatorNamesMap(newCreatorNamesMap);

    return {
      mediaCreator: null,
      name: query,
    };
  };

  const creatorNameInputValueRenderer = creatorName => creatorNamesMap[creatorName.mediaCreator];

  const creatorNameRenderer = (creatorName, { modifiers, handleClick }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    return (
      <MenuItem active={modifiers.active} className={styles.tooltipText}
        key={creatorName.mediaCreator} onClick={handleClick}
        text={creatorNamesMap[creatorName.mediaCreator]} shouldDismissPopover={false} />
    );
  };

  let mediaModalContent = null;

  if (swapSpace) {
    console.log(swapSpace);

    mediaModalContent = (
      <form>
        <h2>{swapSpace.title}</h2>
        <FormGroup helperText={urlHelperText} intent={urlIntent} label="URL"
          labelInfo="(required)">
          <InputGroup intent={urlIntent} onChange={event => handleChange('url', event.target.value)}
            value={swapSpace.url} />
        </FormGroup>
        <FormGroup helperText={previewImageUrlHelperText} intent={previewImageUrlIntent}
          label="Preview Image URL" labelInfo="(required)">
          <InputGroup intent={previewImageUrlIntent}
            onChange={event => handleChange('previewImageUrl', event.target.value)}
            value={swapSpace.previewImageUrl} />
        </FormGroup>
        <FormGroup helperText={labelHelperText} intent={labelIntent} label="Label"
          labelInfo="(required)">
          <InputGroup intent={labelIntent}
            onChange={event => handleChange('label', event.target.value)}
            value={swapSpace.label} />
        </FormGroup>
        <FormGroup helperText={descriptionHelperText} intent={descriptionIntent}
          label="Description" labelInfo="(required)">
          <TextArea growVertically={true} fill={true}
            intent={descriptionIntent}
            onChange={event => handleChange('description', event.target.value)}
            value={swapSpace.description} />
        </FormGroup>
        <FormGroup label="Creator">
          <ControlGroup>
            <Suggest createNewItemFromQuery={createNewMediaCreatorFromQuery}
              createNewItemRenderer={menuItemCreate}
              inputValueRenderer={creatorNameInputValueRenderer}
              itemRenderer={creatorNameRenderer} items={filteredCreatorNames}
              itemsEqual={compareNames} noResults={MENU_ITEM_NO_RESULTS}
              onItemSelect={handleCreatorChange} onQueryChange={refilter}
              popoverProps={SUGGEST_POPOVER_PROPS}
              query={creatorNamesMap[swapSpace.mediaCreator.mediaCreator]} resetOnClose={true}
              selectedItem={swapSpace.mediaCreator} />
          </ControlGroup>
        </FormGroup>
        <FormGroup helperText={yearHelperText} intent={yearIntent} label="Year"
          labelInfo="(required)">
          <NumericInput intent={yearIntent} onValueChange={value => handleChange('year', value)}
            value={swapSpace.year} />
        </FormGroup>
        <ControlGroup>
          <Button icon="floppy-disk" intent={Intent.PRIMARY}
            onClick={handleSave}>Save</Button>
          <Button icon="undo" onClick={() => setSwapSpace(null)}>Cancel</Button>
        </ControlGroup>
      </form>
    );
  };

  const mediaElems = media.map((medium, idx) => (
    <li key={medium.aestheticMedia}>
      <FormGroup>
        <ControlGroup className={styles.mediaPreviewButtons}>
          <Button icon="edit" onClick={() => handleModalOpen(medium, idx)}>Edit</Button>
          <ConfirmDelete onClick={() => handleDelete(idx)} position={Position.BOTTOM_RIGHT} />
        </ControlGroup>
        <div className={styles.mediaPreview}>
          <a href={medium.url} target="_blank" rel="noopener noreferrer">
            <img src={medium.previewImageUrl} alt={medium.label} />
          </a>
          <div>
            <dl className={styles.dataListNoIndent}>
              <dt><strong>Label:</strong></dt>
              <dd>{medium.label}</dd>
              <dt><strong>Description:</strong></dt>
              <dd>{ellipsize(medium.description)}</dd>
              <dt><strong>Creator:</strong></dt>
              <dd>{medium.mediaCreator.name || '(none)'}</dd>
              <dt><strong>Year:</strong></dt>
              <dd>{medium.year}</dd>
            </dl>
          </div>
        </div>
      </FormGroup>
    </li>
  ));

  const mediaContent = (
    <>
      <OL>{mediaElems}</OL>
      <FormGroup>
        <Button icon="add" intent={Intent.PRIMARY} onClick={() => handleModalOpen(MEDIA_TEMPLATE)}>
          Add Media
        </Button>
      </FormGroup>
    </>
  );

  return (
    <>
      <ExpandableSection content={mediaContent} header="Media" />
      <Modal className={styles.modal} overlayClassName={styles.modalOverlay}
        isOpen={swapSpace !== null} onRequestClose={() => handleModalClose(false)}>
        {mediaModalContent}
      </Modal>
    </>
  )
};

export default MediaSubform;