import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';
import { truncate } from 'lodash/string';
import { uniqueId } from 'lodash/util';
import { Editor } from '@tinymce/tinymce-react';

import {
  Button,
  Callout,
  Classes,
  ControlGroup,
  Dialog,
  FileInput,
  FormGroup,
  InputGroup,
  Intent,
  MenuItem,
  NumericInput,
  OL,
  Position,
  Spinner,
} from '@blueprintjs/core';

import { Suggest } from '@blueprintjs/select';

import ConfirmDelete from './ConfirmDelete';
import ExpandableSection from '../common/ExpandableSection';
import { API_ROUTE_MEDIA_CREATORS } from '../../functions/constants';

import styles from './styles/MediaSubform.module.scss';

const TRUNCATE_OPTS = {
  length: 80,
  separator: /\s/
};

const DESCRIPTION_EDITOR_SETTINGS = {
  selector: '#mediaDescription',
  height: 300,
  menubar: false,
  plugins: 'code link lists searchreplace',
  toolbar: `
undo redo | copy cut paste | styleselect | bold italic underline strikethrough subscript
superscript blockquote code | bullist numlist | link unlink | searchreplace |  removeformat remove
`
};

const MEDIA_TEMPLATE = {
  fileUrl: null,
  fileObject: null,
  previewFileUrl: '',
  previewFileBlob: '',
  description: '',
  label: '',
  mediaCreator: 0,
  mediaCreatorName: '',
  mediaFile: null,
  mediaThumbnailFile: null,
  mediaPreviewFile: null,
  year: '',
};

const MENU_ITEM_NO_RESULTS = <MenuItem className={styles.tooltipText} disabled={true} key={0} text="No results." />;

const SUGGEST_POPOVER_PROPS = {
  minimal: true,
  popoverClassName: styles.creatorNameSuggest
};

const compareNames = (creatorNameA, creatorNameB) => creatorNameA.mediaCreator === creatorNameB.mediaCreator;

const menuItemCreate = (query, active, handleClick) => (
  <MenuItem active={active} className={styles.tooltipText} icon="add" key={0} onClick={handleClick}
    shouldDismissPopover={false} text={`Create "${query}"`} />
);

const MediaSubform = props => {
  const addMessage = props.addMessage;

  const [media, setMedia] = props.media;

  const [swapSpace, setSwapSpace] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [fileIntent, setFileIntent] = useState(Intent.NONE);
  const [labelIntent, setLabelIntent] = useState(Intent.NONE);
  const [descriptionIntent, setDescriptionIntent] = useState(Intent.NONE);
  const [yearIntent, setYearIntent] = useState(Intent.NONE);

  const [fileHelperText, setFileHelperText] = useState('');
  const [labelHelperText, setLabelHelperText] = useState('');
  const [descriptionHelperText, setDescriptionHelperText] = useState('');
  const [yearHelperText, setYearHelperText] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [creatorNames, setCreatorNames] = useState([]);
  const [creatorNamesMap, setCreatorNamesMap] = useState([]);
  const [filteredCreatorNames, setFilteredCreatorNames] = useState([]);

  const [intent, setIntent] = props.intent;
  const [helperText, setHelperText] = props.helperText;

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);

      axios.get(API_ROUTE_MEDIA_CREATORS)
        .then(res => {
          const newCreatorNames = res.data;

          const newCreatorNamesMap = newCreatorNames.reduce((map, creatorName) => {
            map[creatorName.mediaCreator] = creatorName.name;
            return map;
          }, {});

          setCreatorNames(newCreatorNames);
          setCreatorNamesMap(newCreatorNamesMap);
          setFilteredCreatorNames(newCreatorNames);
        })
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
    }
  }, [addMessage, isLoading, setIsLoading]);

  if (!creatorNames) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  const previewFileReader = new FileReader();

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

  const handleModalClose = didSave => {
    if (didSave) {
      const newMedia = cloneDeep(media);

      if (editIndex === null) {
        newMedia.push(swapSpace);

        const newIntent = cloneDeep(intent);
        newIntent.push(Intent.NONE);
        setIntent(newIntent);

        const newHelperText = cloneDeep(helperText);
        helperText.push('');
        setHelperText(newHelperText);
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

    const newIntent = cloneDeep(intent);
    newIntent.splice(idx, 1);
    setIntent(newIntent);

    const newHelperText = cloneDeep(helperText);
    newHelperText.splice(idx, 1);
    setHelperText(newHelperText);
  };

  const handleChange = (property, value) => {
    const newSwapSpace = cloneDeep(swapSpace);
    newSwapSpace[property] = value;
    setSwapSpace(newSwapSpace);
  };

  const handleFileChange = event => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      if (!imageFile.type.startsWith('image/')) {
        setFileIntent(Intent.DANGER);
        setFileHelperText('File must be an image.');
      } else {
        previewFileReader.onload = event => {
          const newSwapSpace = cloneDeep(swapSpace);
          newSwapSpace.fileObject = imageFile;
          newSwapSpace.previewFileBlob = event.target.result;
          setSwapSpace(newSwapSpace);
        };

        previewFileReader.readAsDataURL(imageFile);
      }
    } else {
      const newSwapSpace = cloneDeep(swapSpace);
      newSwapSpace.fileObject = null;
      newSwapSpace.previewFileBlob = null;
      setSwapSpace(newSwapSpace);
    }
  };

  const handleCreatorChange = creatorName => {
    const newSwapSpace = cloneDeep(swapSpace);
    newSwapSpace.mediaCreator = creatorName.mediaCreator;
    newSwapSpace.mediaCreatorName = creatorName.name;
    setSwapSpace(newSwapSpace);

    const mediaCreator = creatorName.mediaCreator;
    const name = creatorName.name;

    if (!(mediaCreator in creatorNamesMap)) {
      const newCreatorNamesMap = cloneDeep(creatorNamesMap);
      newCreatorNamesMap[mediaCreator] = name;
      setCreatorNamesMap(newCreatorNamesMap);
    }

    const newCreatorNames = cloneDeep(creatorNames);

    if (creatorNames.filter(n => n.mediaCreator === mediaCreator).length === 0) {
      const newCreatorNames = cloneDeep(creatorNames);
      newCreatorNames.push(creatorName);
      setCreatorNames(newCreatorNames);
    }

    setFilteredCreatorNames(newCreatorNames);
  };

  const validateFile = () => {
    let hasError = false;

    if (!swapSpace.fileUrl && !swapSpace.fileObject) {
      setFileIntent(Intent.DANGER);
      setFileHelperText('File is required.');
      hasError = true;
    } else if (!swapSpace.fileObject.type.startsWith('image/')) {
      setFileIntent(Intent.DANGER);
      setFileHelperText('File must be an image.');
      hasError = true;
    } else {
      setFileIntent(Intent.NONE);
      setFileHelperText('');
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
    const hasFileError = validateFile();
    const hasLabelError = validateLabel();
    const hasDescriptionError = validateDescription();
    const hasYearError = validateYear();

    if (hasFileError || hasLabelError || hasDescriptionError || hasYearError) {
      return;
    }

    handleModalClose(true);
  }

  const createNewMediaCreatorFromQuery = query => ({
    mediaCreator: uniqueId('temp_'),
    name: query,
  });

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

  const aestheticDescriptionEditorHeader = document.querySelector(
    '#aestheticDescription + .tox-tinymce > .tox-editor-container > .tox-editor-header'
  );

  let fileImageElem = null;

  if (swapSpace) {
    const previewSrc = swapSpace.previewFileUrl || swapSpace.previewFileBlob;

    if (previewSrc) {
      fileImageElem = <img src={previewSrc} width="150" alt="Media file" />;
    } else {
      fileImageElem = (
        <svg height="150" width="150">
          <rect height="150" style={{ fill: 'rgba(133, 185, 243, 0.85)' }} width="150" />
          <text x="22" y="75">No image</text>
        </svg>
      );
    }

    if (aestheticDescriptionEditorHeader !== null) {
      // Hack to prevent aesthetic description editor's toolbar from appearing over the modal
      aestheticDescriptionEditorHeader.style['z-index'] = 'initial';
    }

    const fileValue = swapSpace.fileObject?.name || swapSpace.fileUrl;

    mediaModalContent = (
      <form className={Classes.DIALOG_BODY}>
        <FormGroup helperText={fileHelperText} intent={fileIntent} label="File"
          labelInfo="(required)">
          <div className={styles.modalPreviewImage}>
            {fileImageElem}
            <FileInput fill={true} hasSelection={fileValue !== null}
              inputProps={{ multiple: false }} onChange={handleFileChange} text={fileValue} />
          </div>
        </FormGroup>
        <FormGroup helperText={labelHelperText} intent={labelIntent} label="Label"
          labelInfo="(required)">
          <InputGroup intent={labelIntent}
            onChange={event => handleChange('label', event.target.value)}
            value={swapSpace.label} />
        </FormGroup>
        <FormGroup helperText={descriptionHelperText} intent={descriptionIntent}
          label="Description" labelInfo="(required)">
          <Editor apiKey={process.env.REACT_APP_TINYMCE_API_KEY} id="mediaDescription" init={DESCRIPTION_EDITOR_SETTINGS}
            initialValue={swapSpace.description} onEditorChange={(content, editor) => handleChange('description', content)} />
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
              query={creatorNamesMap[swapSpace.mediaCreator]} resetOnClose={true}
              selectedItem={{ mediaCreator: swapSpace.mediaCreator, name: swapSpace.mediaCreatorName }} />
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
  } else if (aestheticDescriptionEditorHeader !== null) {
    // Hack to undo the above hack
    aestheticDescriptionEditorHeader.style['z-index'] = 1;
  }

  const mediaElems = media.map((medium, idx) => {
    let previewImageElem = (
      <img alt={medium.label} src={medium.previewFileUrl || medium.previewFileBlob}
        width="250" />
    );

    if (medium.fileUrl) {
      previewImageElem = (
        <a href={medium.fileUrl} target="_blank" rel="noopener noreferrer">
          {previewImageElem}
        </a>
      );
    }

    let helperCallout = null;

    if (helperText[idx]) {
      helperCallout = (
        <>
          <br />
          <Callout icon="warning-sign" intent={intent[idx]} title="Error">
            {helperText[idx]}
          </Callout>
        </>
      );
    }

    const label = truncate(medium.label, TRUNCATE_OPTS);

    const description = truncate(medium.description.replace(/<[^>]+>/g, ''), {
      length: 200,
      separator: /\s/,
    });

    return (
      <li key={medium.aestheticMedia || uniqueId('media_')}>
        <FormGroup>
          <ControlGroup className={styles.mediaPreviewButtons}>
            <Button icon="edit" onClick={() => handleModalOpen(medium, idx)}>Edit</Button>
            <ConfirmDelete onClick={() => handleDelete(idx)} position={Position.BOTTOM_RIGHT} />
          </ControlGroup>
          <div className={styles.mediaPreview}>
            {previewImageElem}
            <div>
              <dl className={styles.dataListNoIndent}>
                <dt><strong>Label:</strong></dt>
                <dd>{label}</dd>
                <dt><strong>Description:</strong></dt>
                <dd>{description}</dd>
                <dt><strong>Creator:</strong></dt>
                <dd>{creatorNamesMap[medium.mediaCreator] || '(none)'}</dd>
                <dt><strong>Year:</strong></dt>
                <dd>{medium.year}</dd>
              </dl>
            </div>
          </div>
          {helperCallout}
        </FormGroup>
      </li>
    );
  });

  let formGroup = (
    <>
      <OL>{mediaElems}</OL>
      <FormGroup>
        <Button icon="add" intent={Intent.PRIMARY} onClick={() => handleModalOpen(MEDIA_TEMPLATE)}>
          Add Media
        </Button>
      </FormGroup>
    </>
  );

  if(props.isExpandable) {
    formGroup = (
      <ExpandableSection header="Media" icon={props.icon} show={props.show}>
        {formGroup}
      </ExpandableSection>
    );
  }

  return (
    <>
      {formGroup}
      <Dialog className={styles.modal}
        isOpen={swapSpace !== null} onClose={() => handleModalClose(false)}
        title={(swapSpace && swapSpace.label) ? `Edit "${truncate(swapSpace.label, TRUNCATE_OPTS)}"` : 'Add Media'}>
        {mediaModalContent}
      </Dialog>
    </>
  )
};

export default MediaSubform;
