import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';
import { serialize } from 'object-to-formdata';
import { Editor } from '@tinymce/tinymce-react';

import {
  Alert,
  Button,
  Card,
  ControlGroup,
  FileInput,
  FormGroup,
  HTMLSelect,
  Icon,
  InputGroup,
  Intent,
  Overlay,
  Spinner,
} from '@blueprintjs/core';

import AestheticRelationshipSubform from './AestheticRelationshipSubform';
import MediaSubform from './MediaSubform';
import WebsiteSubform from './WebsiteSubform';

import {
  API_ROUTE_AESTHETIC_EDIT,
  API_ROUTE_AESTHETIC_MEDIA_EDIT,
  API_ROUTE_ERAS,
  API_ROUTE_WEBSITE_TYPES,
  ROLE_LEAD_CURATOR,
  ROLE_LEAD_DIRECTOR,
} from '../../functions/constants';

import { entityHasPermission } from '../../functions/utils';

import styles from './styles/EditAestheticForm.module.scss';

const DESCRIPTION_EDITOR_SETTINGS = {
  selector: '#aestheticDescription',
  height: 300,
  menubar: false,
  plugins: 'code link lists searchreplace',
  toolbar: `
undo redo | copy cut paste | styleselect | bold italic underline strikethrough subscript
superscript blockquote code | bullist numlist | link unlink | searchreplace |  removeformat remove
`
};

const SELECT_NULL_LABEL = '--';

const EditAestheticForm = props => {
  const addMessage = props.addMessage;
  const session = props.session;

  const hasFullEditAccess = entityHasPermission(session, ROLE_LEAD_DIRECTOR, ROLE_LEAD_CURATOR);

  const displayImage = props.aesthetic.displayImage;
  const originalWebsites = props.aesthetic.websites || [];
  const originalSimilarAesthetics = props.aesthetic.similarAesthetics || [];
  const originalMedia = props.aesthetic.media || [];

  const [name, setName] = useState(props.aesthetic.name);
  const [urlSlug, setUrlSlug] = useState(props.aesthetic.urlSlug);
  const [symbol, setSymbol] = useState(props.aesthetic.symbol);
  const [startEra, setStartEra] = useState(props.aesthetic.startEra);
  const [endEra, setEndEra] = useState(props.aesthetic.endEra);
  const [description, setDescription] = useState(props.aesthetic.description);
  const [displayImageFile, setDisplayImageFile] = useState(null);

  const mediaSourceUrlState = useState(props.aesthetic.mediaSourceUrl);
  const websitesState = useState(originalWebsites);
  const similarAestheticsState = useState(originalSimilarAesthetics);
  const mediaState = useState(originalMedia);

  const [startEraSpecifier, setStartEraSpecifier] = useState(0);
  const [endEraSpecifier, setEndEraSpecifier] = useState(0);
  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);

  const [nameIntent, setNameIntent] = useState(Intent.NONE);
  const [symbolIntent, setSymbolIntent] = useState(Intent.NONE);
  const [startYearIntent, setStartYearIntent] = useState(Intent.NONE);
  const [endYearIntent, setEndYearIntent] = useState(Intent.NONE);
  const [descriptionIntent, setDescriptionIntent] = useState(Intent.NONE);
  const [displayImageIntent, setDisplayImageIntent] = useState(Intent.NONE);
  const [mediaIntents, setMediaIntents] = useState(originalMedia.map(() => Intent.NONE));
  const [websiteIntents, setWebsiteIntents] = useState(originalWebsites.map(() => Intent.NONE));
  const [similarAestheticIntents, setSimilarAestheticIntents] = useState(originalSimilarAesthetics.map(() => ({
    aesthetic: Intent.NONE,
    description: Intent.NONE,
    reverseDescription: Intent.NONE,
  })));

  const [nameHelperText, setNameHelperText] = useState('');
  const [symbolHelperText, setSymbolHelperText] = useState('');
  const [startYearHelperText, setStartYearHelperText] = useState('');
  const [endYearHelperText, setEndYearHelperText] = useState('');
  const [descriptionHelperText, setDescriptionHelperText] = useState('');
  const [displayImageHelperText, setDisplayImageHelperText] = useState('');
  const [mediaHelperTexts, setMediaHelperTexts] = useState(originalMedia.map(() => ''));
  const [websiteHelperTexts, setWebsiteHelperTexts] = useState(originalWebsites.map(() => ''));
  const [similarAestheticHelperTexts, setSimilarAestheticHelperTexts] = useState(originalSimilarAesthetics.map(() => ({
    aesthetic: '',
    description: '',
    reverseDescription: '',
  })));

  const [showMediaSubform, setShowMediaSubform] = useState(false);
  const [showWebsiteSubform, setShowWebsiteSubform] = useState(false);
  const [showAestheticRelationshipSubform, setShowAestheticRelationshipSubform] = useState(false);

  const [mediaSubformIcon, setMediaSubformIcon] = useState(null);
  const [websiteSubformIcon, setWebsiteSubformIcon] = useState(null);
  const [aestheticRelationshipSubformIcon, setAestheticRelationshipSubformIcon] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [eras, setEras] = useState(null);
  const [websiteTypes, setWebsiteTypes] = useState(null);
  const [edited, setEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [displayImageBlob, setDisplayImageBlob] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);

      axios.get(API_ROUTE_WEBSITE_TYPES)
        .then(res => {
          setWebsiteTypes(res.data.reduce((map, websiteType) => {
            map[websiteType.websiteType] = {
              article: 'a' + (websiteType.label.toLowerCase().match('^[aeiou]') ? 'n' : ''),
              label: websiteType.label,
              validationRegex: websiteType.validationRegex,
            };

            return map;
          }, {}));
        })
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));

      axios.get(API_ROUTE_ERAS)
        .then(res => {
          setEras(res.data.reduce((map, era) => {
            if (!(era.eraSpecifier in map)) {
              map[era.eraSpecifier] = {
                label: era.specifier.label,
                years: {},
              };
            }

            map[era.eraSpecifier].years[era.year] = era.era;

            if (startEra === era.era) {
              setStartEraSpecifier(era.eraSpecifier);
              setStartYear(era.year);
            }

            if (endEra === era.era) {
              setEndEraSpecifier(era.eraSpecifier);
              setEndYear(era.year);
            }

            return map;
          }, {}));
        })
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
    }
  }, [addMessage, isLoading, setIsLoading, startEra, endEra]);

  if (!(eras && websiteTypes)) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (edited) {
    return <Redirect to={urlSlug ? `/aesthetics/${urlSlug}` : '/aesthetics'} />
  }

  const previewFileReader = new FileReader();

  const handleSymbolChange = event => {
    let newSymbol = event.target.value.replace(/[^a-z0-9]/gi, '');
    newSymbol = newSymbol.substring(0, 1).toUpperCase() + newSymbol.substring(1, 3).toLowerCase();
    setSymbol(newSymbol);
  };

  const handleStartEraSpecifierChange = event => {
    const value = event.target.value;
    setStartEraSpecifier(value);

    if (value === SELECT_NULL_LABEL) {
      setStartYear(SELECT_NULL_LABEL);
      setStartEra(null);
    }
  };

  const handleStartYearChange = event => {
    const year = event.target.value;
    setStartYear(year);
    setStartEra(eras[startEraSpecifier].years[year]);
  };

  const handleEndEraSpecifierChange = event => {
    const value = event.target.value;
    setEndEraSpecifier(value);

    if (value === SELECT_NULL_LABEL) {
      setEndYear(SELECT_NULL_LABEL);
      setEndEra(null);
    }
  };

  const handleEndYearChange = event => {
    const year = event.target.value;
    setEndYear(year);
    setEndEra(eras[endEraSpecifier].years[year]);
  };

  const handleDisplayImageChange = event => {
    const imageFile = event.target.files[0];

    if (!imageFile.type.startsWith('image/')) {
      setDisplayImageIntent(Intent.DANGER);
      setDisplayImageHelperText('File must be an image.');
    } else {
      setDisplayImageIntent(Intent.NONE);
      setDisplayImageHelperText('');
      setDisplayImageFile(imageFile);

      previewFileReader.onload = event => setDisplayImageBlob(event.target.result);
      previewFileReader.readAsDataURL(imageFile);
    }
  };

  const handleCancel = () => {
    setShowCancelConfirmation(true);
  };

  const handleCancelConfirmation = () => {
    setEdited(true);
  }

  const validateName = () => {
    let hasError = false;

    if (!name) {
      setNameIntent(Intent.DANGER);
      setNameHelperText('Name is required.');
      hasError = true;
    } else {
      setNameIntent(Intent.NONE);
      setNameHelperText('');
    }

    return hasError;
  };

  const validateStartEra = () => {
    let hasError = false;

    if (!startEra) {
      setStartYearIntent(Intent.DANGER);
      setStartYearHelperText('Year first observed is required.');
      hasError = true;
    } else {
      setStartYearIntent(Intent.NONE);
      setStartYearHelperText('');
    }

    return hasError;
  };

  const validateEndEra = () => {
    let hasError = false;

    if (endEra) {
      const intStartYear = parseInt(startYear);
      const intEndYear = parseInt(endYear);

      if (intStartYear > intEndYear || (intStartYear === intEndYear && startEraSpecifier > endEraSpecifier)) {
        setEndYearIntent(Intent.DANGER);
        setEndYearHelperText('End of popularity cannot be before year first observed.');
        hasError = true;
      } else {
        setEndYearHelperText('');
        setEndYearIntent(Intent.NONE);
      }
    }

    return hasError;
  };

  const validateDescription = () => {
    let hasError = false;

    if (!description) {
      setDescriptionIntent(Intent.DANGER);
      setDescriptionHelperText('Description is required.');
      hasError = true;
    } else {
      setDescriptionIntent(Intent.NONE);
      setDescriptionHelperText('');
    }

    return hasError;
  };

  const validateDisplayImage = () => {
    let hasError = false;

    if (!(displayImageFile == null || displayImageFile.type.startsWith('image/'))) {
      setDisplayImageIntent(Intent.DANGER);
      setDisplayImageHelperText('File must be an image.');
      hasError = true;
    } else {
      setDisplayImageIntent(Intent.NONE);
      setDisplayImageHelperText('');
    }

    return hasError;
  };

  const validateWebsites = () => {
    let hasError = false;
    const newWebsiteIntents = cloneDeep(websiteIntents);
    const newWebsiteHelperTexts = cloneDeep(websiteHelperTexts);

    websitesState[0].forEach((website, idx) => {
      let websiteHasError = false;
      const websiteType = website.websiteType;

      if (!websiteType) {
        newWebsiteHelperTexts[idx] = 'Website type is required.';
        websiteHasError = true;
      } else if (!website.url) {
        newWebsiteHelperTexts[idx] = 'URL is required.';
        websiteHasError = true;
      } else if (!website.url.match(websiteTypes[websiteType].validationRegex)) {
        newWebsiteHelperTexts[idx] = `URL must be ${websiteTypes[websiteType].article} ${websiteTypes[websiteType].label} URL.`;
        websiteHasError = true;
      }

      if (websiteHasError) {
        newWebsiteIntents[idx] = Intent.DANGER;
        hasError = true;
        setShowWebsiteSubform(true);
        setWebsiteSubformIcon(<Icon icon="warning-sign" intent={Intent.WARNING} />);
      } else {
        newWebsiteIntents[idx] = Intent.NONE;
        newWebsiteHelperTexts[idx] = '';
        setWebsiteSubformIcon(null);
      }
    });

    setWebsiteIntents(newWebsiteIntents);
    setWebsiteHelperTexts(newWebsiteHelperTexts);

    return hasError;
  };

  const validateSimilarAesthetics = () => {
    let hasError = false;

    const newSimilarAestheticIntents = cloneDeep(similarAestheticIntents);
    const newSimilarAestheticHelperTexts = cloneDeep(similarAestheticHelperTexts);

    similarAestheticsState[0].forEach((similarAesthetic, idx) => {
      if (!similarAesthetic.aesthetic) {
        newSimilarAestheticIntents[idx].aesthetic = Intent.DANGER;
        newSimilarAestheticHelperTexts[idx].aesthetic = 'Aesthetic is required.';
        hasError = true;
      } else {
        newSimilarAestheticIntents[idx].aesthetic = Intent.NONE;
        newSimilarAestheticHelperTexts[idx].aesthetic = '';
      }
    });

    setSimilarAestheticIntents(newSimilarAestheticIntents);
    setSimilarAestheticHelperTexts(newSimilarAestheticHelperTexts);

    if (hasError) {
      setShowAestheticRelationshipSubform(true);
      setAestheticRelationshipSubformIcon(<Icon icon="warning-sign" intent={Intent.WARNING} />);
    } else {
      setAestheticRelationshipSubformIcon(null);
    }

    return hasError;
  }

  const handleSubmit = event => {
    event.preventDefault();

    setMediaSubformIcon(null);

    if (hasFullEditAccess) {
      const hasNameError = validateName();
      const hasStartEraError = validateStartEra();
      const hasEndEraError = validateEndEra();
      const hasDescriptionError = validateDescription();
      const hasWebsiteError = validateWebsites();
      const hasSimilarAestheticError = validateSimilarAesthetics();

      if (hasNameError || hasStartEraError || hasEndEraError || hasDescriptionError
        || hasWebsiteError || hasSimilarAestheticError) {
        return;
      }
    }

    const hasDisplayImageError = validateDisplayImage();

    if (hasDisplayImageError) {
      return;
    }

    setIsSaving(true);

    const mediaToSend = cloneDeep(mediaState[0]);

    mediaToSend.forEach(media => {
      delete media.previewFileBlob;
      delete media.previewFileUrl;
      delete media.fileUrl;

      const mediaCreator = media.mediaCreator;

      if (!mediaCreator || (typeof mediaCreator === 'string' && mediaCreator.startsWith('temp_'))) {
        delete media.mediaCreator;
      } else {
        delete media.mediaCreatorName;
      }

      if (media.fileObject) {
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

    if (displayImageFile) {
      newAesthetic.displayImage = displayImageFile;
    } else if (displayImage) {
      newAesthetic.displayImageFile = displayImage.file;
    }

    if (hasFullEditAccess) {
      const websitesToSend = cloneDeep(websitesState[0]);

      websitesToSend.forEach(website => {
        delete website.aestheticWebsite;
      });

      newAesthetic.name = name;
      newAesthetic.symbol = symbol;
      newAesthetic.startEra = startEra;
      newAesthetic.description = description;
      newAesthetic.websites = websitesToSend;
      newAesthetic.similarAesthetics = similarAestheticsState[0];

      if (endEra) {
        newAesthetic.endEra = endEra;
      }

      const mediaSourceUrl = mediaSourceUrlState[0];

      if (mediaSourceUrl) {
        newAesthetic.mediaSourceUrl = mediaSourceUrl;
      }
    }

    const formData = serialize(
      newAesthetic,
      { indices: true }
    );

    const postUrl = hasFullEditAccess ? API_ROUTE_AESTHETIC_EDIT : API_ROUTE_AESTHETIC_MEDIA_EDIT;
    const postOpts = { withCredentials: true };

    axios.post(postUrl, formData, postOpts)
      .then(res => {
        if (res.data.updatedData) {
          setUrlSlug(res.data.updatedData.urlSlug);
        }

        addMessage("Successfully updated.");
        setEdited(true);
      })
      .catch(err => {
        if (err.response.status === 400) {
          err.response.data.fieldErrors.forEach(fieldError => {
            switch (fieldError.field) {
              case 'name':
                setNameIntent(Intent.DANGER);
                setNameHelperText(fieldError.message);
                break;
              case 'symbol':
                setSymbolIntent(Intent.DANGER);
                setSymbolHelperText(fieldError.message);
                break;
              case 'displayImage':
                setDisplayImageIntent(Intent.DANGER);
                setDisplayImageHelperText(fieldError.message);
                break;
              case 'media':
                const newMediaIntents = cloneDeep(mediaIntents);
                const newMediaHelperTexts = cloneDeep(mediaHelperTexts);

                newMediaIntents[fieldError.index] = Intent.DANGER;
                newMediaHelperTexts[fieldError.index] = fieldError.message;

                setMediaIntents(newMediaIntents);
                setMediaHelperTexts(newMediaHelperTexts);
                setShowMediaSubform(true);
                setMediaSubformIcon(<Icon icon="warning-sign" intent={Intent.WARNING} />);

                break;
              default:
                addMessage(`An error occurred: ${fieldError.message}`, Intent.DANGER);
            }
          });
        } else {
          addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER);
        }

        setIsSaving(false);
      });
  };

  const eraSpecifierOptions = Object.keys(eras).sort().map(eraSpecifier => ({
    label: eras[eraSpecifier].label,
    value: eraSpecifier,
  }));

  eraSpecifierOptions.unshift({ label: SELECT_NULL_LABEL, value: 0 });

  const yearSpecifierOptions = Object.keys(eras[1].years).sort().map(year => ({
    label: `${year}s`,
    value: year,
  }));

  yearSpecifierOptions.unshift({ label: SELECT_NULL_LABEL, value: 0 });

  let displayImageElem = null;

  if (displayImage?.url || displayImageBlob) {
    displayImageElem = (
      <img src={displayImageBlob || displayImage?.url} width="150"
        alt="Visual for aesthetic grid view" />
    );
  } else {
    displayImageElem = (
      <svg height="150" width="150">
        <rect height="150" style={{ fill: 'rgba(133, 185, 243, 0.85)' }} width="200" />
        <text x="27" y="75">No image</text>
      </svg>
    );
  }

  const basicInfoCard = (
    <Card>
      <h2>Basic Information</h2>
      <FormGroup helperText={nameHelperText} intent={nameIntent} label="Name"
        labelInfo="(required)">
        <InputGroup intent={nameIntent} onChange={event => setName(event.target.value)}
          value={name} />
      </FormGroup>
      <FormGroup
        helperText={symbolHelperText || "1-3 characters. Like the Periodic Table, but for aesthetics."}
        intent={symbolIntent} label="Symbol">
        <InputGroup intent={symbolIntent} onChange={handleSymbolChange} value={symbol || ''} />
      </FormGroup>
      <FormGroup helperText={startYearHelperText} intent={startYearIntent}
        label="Year First Observed" labelInfo="(required)">
        <ControlGroup>
          <HTMLSelect options={eraSpecifierOptions}
            onChange={handleStartEraSpecifierChange} value={startEraSpecifier} />
          <HTMLSelect disabled={!startEraSpecifier} options={yearSpecifierOptions}
            onChange={handleStartYearChange} value={startYear} />
        </ControlGroup>
      </FormGroup>
      <FormGroup helperText={endYearHelperText} intent={endYearIntent} label="End of Popularity">
        <ControlGroup>
          <HTMLSelect options={eraSpecifierOptions}
            onChange={handleEndEraSpecifierChange} value={endEraSpecifier} />
          <HTMLSelect disabled={!endEraSpecifier} options={yearSpecifierOptions}
            onChange={handleEndYearChange} value={endYear} />
        </ControlGroup>
      </FormGroup>
      <FormGroup helperText={displayImageHelperText} intent={displayImageIntent}
        label="Display Image">
        <div className={styles.displayImage}>
          {displayImageElem}
          <FileInput fill={true} hasSelection={displayImageFile != null}
            inputProps={{ multiple: false }} onChange={handleDisplayImageChange}
            text={displayImageFile?.name} />
        </div>
      </FormGroup>
      <FormGroup helperText={descriptionHelperText} intent={descriptionIntent}
        label="Description" labelInfo="(required)">
        <Editor apiKey={process.env.REACT_APP_TINYMCE_API_KEY} id="aestheticDescription"
          init={DESCRIPTION_EDITOR_SETTINGS}
          initialValue={description}
          onEditorChange={(content, editor) => setDescription(content)} />
      </FormGroup>
    </Card>
  );

  const websitesCard = (
    <Card>
      <WebsiteSubform helperText={[websiteHelperTexts, setWebsiteHelperTexts]}
        icon={websiteSubformIcon} intent={[websiteIntents, setWebsiteIntents]}
        mediaSourceUrl={mediaSourceUrlState} show={[showWebsiteSubform, setShowWebsiteSubform]}
        websites={websitesState} websiteTypes={websiteTypes} />
    </Card>
  );

  const relationshipsCard = (
    <Card>
      <AestheticRelationshipSubform addMessage={addMessage} aesthetic={props.aesthetic}
        helperText={[similarAestheticHelperTexts, setSimilarAestheticHelperTexts]}
        icon={aestheticRelationshipSubformIcon}
        intent={[similarAestheticIntents, setSimilarAestheticIntents]}
        show={[showAestheticRelationshipSubform, setShowAestheticRelationshipSubform]}
        similarAesthetics={similarAestheticsState} />
    </Card>
  );

  const mediaCard = (
    <Card>
      <MediaSubform addMessage={addMessage}
        helperText={[mediaHelperTexts, setMediaHelperTexts]} icon={mediaSubformIcon}
        intent={[mediaIntents, setMediaIntents]} isExpandable={true} media={mediaState}
        show={[showMediaSubform, setShowMediaSubform]} />
    </Card>
  );

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
        {hasFullEditAccess && (
          <>
            {basicInfoCard}
            <br />
            {websitesCard}
            <br />
            {relationshipsCard}
            <br />
          </>
        )}
        {mediaCard}
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

export default EditAestheticForm;
