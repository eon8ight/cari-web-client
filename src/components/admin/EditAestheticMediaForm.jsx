import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';
import { serialize } from 'object-to-formdata';

import {
  Alert,
  Button,
  Card,
  ControlGroup,
  FormGroup,
  Intent,
  Overlay,
  Spinner,
} from '@blueprintjs/core';

import MediaSubform from './MediaSubform';

import {
  API_ROUTE_AESTHETIC_MEDIA_EDIT,
} from '../../functions/constants';

import styles from './styles/EditAestheticForm.module.scss';

const EditAestheticMediaForm = props => {
  const addMessage = props.addMessage;
  const urlSlug = props.aesthetic.urlSlug;

  const originalMedia = props.aesthetic.media || [];
  const mediaState = useState(originalMedia);

  const [mediaIntents, setMediaIntents] = useState(originalMedia.map(() => Intent.NONE));
  const [mediaHelperTexts, setMediaHelperTexts] = useState(originalMedia.map(() => ''));

  const [edited, setEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  if(edited) {
    return <Redirect to={urlSlug ? `/aesthetics/${urlSlug}` : '/aesthetics'} />
  }

  const handleCancel = () => {
    setShowCancelConfirmation(true);
  };

  const handleCancelConfirmation = () => {
    setEdited(true);
  }

  const handleSubmit = event => {
    event.preventDefault();

    setIsSaving(true);

    const mediaToSend = cloneDeep(mediaState[0]);

    mediaToSend.forEach(media => {
      delete media.previewFileBlob;
      delete media.previewFileUrl;
      delete media.fileUrl;

      const mediaCreator = media.mediaCreator;

      if (typeof mediaCreator === 'string' && mediaCreator.startsWith('temp_')) {
        delete media.mediaCreator;
      } else {
        delete media.mediaCreatorName;
      }

      if(media.fileObject) {
        delete media.mediaFile;
        delete media.mediaThumbnailFile;
        delete media.mediaPreviewFile;
      } else {
        delete media.fileObject;
      }
    });

    const newAesthetic = {
      aesthetic: props.aesthetic.aesthetic,
      media: mediaToSend,
    };

    const formData = serialize(
      newAesthetic,
      { indices: true }
    );

    const postOpts = { withCredentials: true };

    axios.post(API_ROUTE_AESTHETIC_MEDIA_EDIT, formData, postOpts)
      .then(res => {
        addMessage("Successfully updated.");
        setEdited(true);
      })
      .catch(err => {
        if (err.response.status === 400) {
          err.response.data.fieldErrors.forEach(fieldError => {
            if(fieldError.field === 'media') {
              const newMediaIntents = cloneDeep(mediaIntents);
              const newMediaHelperTexts = cloneDeep(mediaHelperTexts);

              newMediaIntents[fieldError.index] = Intent.DANGER;
              newMediaHelperTexts[fieldError.index] = fieldError.message;

              setMediaIntents(newMediaIntents);
              setMediaHelperTexts(newMediaHelperTexts);
            } else {
              addMessage(`An error occurred: ${fieldError.message}`, Intent.DANGER);
            }
          });
        } else {
          addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER);
        }

        setIsSaving(false);
      });
  };

  return (
    <>
      <Overlay canEscapeKeyClose={false} canOutsideClickClose={false} isOpen={isSaving}>
        <Card className={styles.savingDialog}>
          <Spinner size={Spinner.SIZE_LARGE} />
          <br />
          <p>
            <strong>Saving...</strong>
            <br />
            This may take some time depending on how much media you are uploading.
          </p>
        </Card>
      </Overlay>
      <form className={styles.editAestheticForm} onSubmit={handleSubmit}>
        <MediaSubform addMessage={addMessage} helperText={[mediaHelperTexts, setMediaHelperTexts]}
          intent={[mediaIntents, setMediaIntents]} isExpandable={false} media={mediaState} />
        <br />
        <FormGroup>
          <ControlGroup>
            <Button disabled={isSaving} icon="undo" large={true} onClick={handleCancel}>
              Cancel
            </Button>
            <Button disabled={isSaving} icon="floppy-disk" intent={Intent.SUCCESS} large={true}
              type="submit">
              Save
            </Button>
          </ControlGroup>
        </FormGroup>
        <Alert cancelButtonText="No" canEscapeKeyCancel={true} canOutsideClickCancel={true}
          confirmButtonText="Yes" icon="warning-sign" intent={Intent.DANGER}
          isOpen={showCancelConfirmation} onCancel={() => setShowCancelConfirmation(false)}
          onConfirm={handleCancelConfirmation}>
          Are you sure you want to cancel? Your changes will not be saved.
        </Alert>
      </form>
    </>
  );
};

export default EditAestheticMediaForm;