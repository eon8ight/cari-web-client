import React, { useState } from 'react';
import Modal from 'react-modal';

import { cloneDeep } from 'lodash/lang';

import {
  Button,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  NumericInput,
  OL,
  Position,
  TextArea,
} from '@blueprintjs/core';

import ConfirmDelete from './ConfirmDelete';
import ExpandableSection from './ExpandableSection';

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
  mediaImage: {
    previewImageUrl: '',
    url: '',
  },
  year: '',
};

const ellipsize = string => string.length > 50 ? string.substring(0, 50) + '...' : string;

const MediaSubform = (props) => {
  const [media, setMedia] = props.media;

  const [swapSpace, setSwapSpace] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [saved, setSaved] = useState(false);

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

  const handleModalOpen = (medium, idx) => {
    const newSwapSpace = cloneDeep(medium);
    setSwapSpace(newSwapSpace);
    setEditIndex(typeof idx === 'undefined' ? null : idx);
  };

  const handleModalClose = (didSave) => {
    if(didSave) {
      const newMedia = cloneDeep(media);

      if(editIndex === null) {
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

  const handleImageChange = (property, event) => {
    const newSwapSpace = cloneDeep(swapSpace);
    newSwapSpace.mediaImage[property] = event.target.value;
    setSwapSpace(newSwapSpace);
  };

  const handleCreatorChange = event => {
    const newSwapSpace = cloneDeep(swapSpace);
    newSwapSpace.mediaCreator.name = event.target.value;
    setSwapSpace(newSwapSpace);
  };

  const validateUrl = () => {
    let hasError = false;

    if(!swapSpace.mediaImage.url) {
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

    if(!swapSpace.mediaImage.previewImageUrl) {
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

    if(!swapSpace.label) {
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

    if(!swapSpace.description) {
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

    if(!swapSpace.year) {
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
    let hasUrlError = validateUrl();
    let hasPreviewImageUrlError = validatePreviewImageUrl();
    let hasLabelError = validateLabel();
    let hasDescriptionError = validateDescription();
    let hasYearError = validateYear();

    if(hasUrlError || hasPreviewImageUrlError || hasLabelError || hasDescriptionError || hasYearError) {
      return;
    }

    handleModalClose(true);
  }

  let mediaModalContent = null;

  if(swapSpace) {
    mediaModalContent = (
      <form>
        <h2>{swapSpace.title}</h2>
        <FormGroup helperText={urlHelperText} intent={urlIntent} label="URL"
          labelInfo="(required)">
          <InputGroup intent={urlIntent} onChange={event => handleImageChange('url', event)}
            value={swapSpace.mediaImage.url} />
        </FormGroup>
        <FormGroup helperText={previewImageUrlHelperText} intent={previewImageUrlIntent}
          label="Preview Image URL" labelInfo="(required)">
          <InputGroup intent={previewImageUrlIntent}
            onChange={event => handleImageChange('previewImageUrl', event)}
            value={swapSpace.mediaImage.previewImageUrl} />
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
        <FormGroup label="Creator" helperText="Leave blank if unknown.">
          <InputGroup onChange={handleCreatorChange} value={swapSpace.mediaCreator.name} />
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
    <li key={medium.media}>
      <FormGroup>
        <ControlGroup className={styles.mediaPreviewButtons}>
          <Button icon="edit" onClick={() => handleModalOpen(medium, idx)}>Edit</Button>
          <ConfirmDelete onClick={() => handleDelete(idx)} position={Position.BOTTOM_RIGHT} />
        </ControlGroup>
        <div className={styles.mediaPreview}>
          <a href={medium.mediaImage.url} target="_blank" rel="noopener noreferrer">
            <img src={medium.mediaImage.previewImageUrl} alt={medium.label} />
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