import React, { useState } from 'react';
import Modal from 'react-modal';

import { cloneDeep } from 'lodash/lang';

import {
  Button,
  ControlGroup,
  FormGroup,
  Intent,
  OL,
} from '@blueprintjs/core';

import '@blueprintjs/core/lib/css/blueprint.css';

import styles from './styles/MediaSubform.module.scss';

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

const MediaSubform = (props) => {
  const [media, setMedia] = props.media;

  const [mediaSwap, setMediaSwap] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [saved, setSaved] = useState(false);

  const openMediaModal = (medium, idx) => {
    const newMediaSwap = cloneDeep(medium);
    setMediaSwap(newMediaSwap);
    setSaved(false);
    setEditIndex(typeof idx === 'undefined' ? null : idx);
  };

  const handleModalClose = () => {
    if(saved) {
      const newMedia = cloneDeep(media);

      if(editIndex === null) {
        newMedia.push(mediaSwap);
      } else {
        newMedia[editIndex] = mediaSwap;
      }

      setMedia(newMedia);
    }

    setMediaSwap(null);
  };

  const mediaElems = media.map((medium, idx) => (
    <li key={medium.media}>
      <FormGroup>
        <img src={medium.mediaImage.previewImageUrl} alt={medium.label} />
        <ControlGroup>
          <Button icon="edit" onClick={() => openMediaModal(medium, idx)}>Edit</Button>
          <Button icon="trash" intent={Intent.DANGER}>Delete</Button>
        </ControlGroup>
      </FormGroup>
    </li>
  ));

  let mediaModalContent = null;

  if(mediaSwap) {
    mediaModalContent = (
      <form>
        <h2>{mediaSwap.title}</h2>
        <a href={mediaSwap.mediaImage.url} target="_blank" rel="noopener noreferrer">
          <img src={mediaSwap.mediaImage.previewImageUrl} alt={mediaSwap.description} />
        </a>
        <Button icon="floppy-disk" intent={Intent.PRIMARY}
          onClick={() => setSaved(true)}>Save</Button>
      </form>
    );
  }

  return (
    <>
      <h2>Media</h2>
      <OL>{mediaElems}</OL>
      <FormGroup>
        <Button icon="add" intent={Intent.PRIMARY} onClick={() => openMediaModal(MEDIA_TEMPLATE)}>
          Add Media
        </Button>
      </FormGroup>
      <Modal className={styles.modal} overlayClassName={styles.modalOverlay}
        isOpen={mediaModalContent !== null} onRequestClose={handleModalClose}>
        {mediaModalContent}
      </Modal>
    </>
  )
};

export default MediaSubform;