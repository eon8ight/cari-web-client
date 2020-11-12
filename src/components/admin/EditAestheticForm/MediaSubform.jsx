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

  const handleModalOpen = (medium, idx) => {
    const newSwapSpace = cloneDeep(medium);
    setSwapSpace(newSwapSpace);
    setSaved(false);
    setEditIndex(typeof idx === 'undefined' ? null : idx);
  };

  const handleModalClose = () => {
    if(saved) {
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

  const handleChange = (property, event) => {
    const newSwapSpace = cloneDeep(swapSpace);
    newSwapSpace[property] = event.target.value;
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

  const handleSave = () => {
    setSaved(true);
    handleModalClose();
  }

  let mediaModalContent = null;

  if(swapSpace) {
    mediaModalContent = (
      <form>
        <h2>{swapSpace.title}</h2>
        <FormGroup label="URL" labelInfo="(required)">
          <InputGroup onChange={event => handleImageChange('url', event)} value={swapSpace.mediaImage.url} />
        </FormGroup>
        <FormGroup label="Preview Image URL" labelInfo="(required)">
          <InputGroup onChange={event => handleImageChange('previewImageUrl', event)}
          value={swapSpace.mediaImage.previewImageUrl} />
        </FormGroup>
        <FormGroup label="Label" labelInfo="(required)">
          <InputGroup onChange={event => handleChange('label', event)} value={swapSpace.label} />
        </FormGroup>
        <FormGroup label="Description" labelInfo="(required)">
          <TextArea growVertically={true} fill={true}
            onChange={event => handleChange('description', event)} value={swapSpace.description} />
        </FormGroup>
        <FormGroup label="Creator" helperText="Leave blank if unknown.">
          <InputGroup onChange={handleCreatorChange} value={swapSpace.mediaCreator.name} />
        </FormGroup>
        <FormGroup label="Year" labelInfo="(required)">
          <NumericInput onChange={event => handleChange('year', event)} value={swapSpace.year} />
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
        isOpen={swapSpace !== null} onRequestClose={handleModalClose}>
        {mediaModalContent}
      </Modal>
    </>
  )
};

export default MediaSubform;