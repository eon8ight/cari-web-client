import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';
import { serialize } from 'object-to-formdata';
import { Editor } from '@tinymce/tinymce-react';

import {
  Button,
  Card,
  ControlGroup,
  FormGroup,
  Icon,
  InputGroup,
  Intent,
  Spinner,
} from '@blueprintjs/core';

import AestheticRelationshipSubform from './AestheticRelationshipSubform';
import MediaSubform from './MediaSubform';
import WebsiteSubform from './WebsiteSubform';

import {
  API_ROUTE_AESTHETIC_EDIT,
  API_ROUTE_WEBSITE_TYPES,
} from '../../functions/constants';

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

const EditAestheticForm = props => {
  const originalWebsites = props.aesthetic.websites || [];
  const originalSimilarAesthetics = props.aesthetic.similarAesthetics || [];
  const originalMedia = props.aesthetic.media || [];

  const [name, setName] = useState(props.aesthetic.name);
  const [symbol, setSymbol] = useState(props.aesthetic.symbol);
  const [startYear, setStartYear] = useState(props.aesthetic.startYear);
  const [endYear, setEndYear] = useState(props.aesthetic.setEndYear);
  const [description, setDescription] = useState(props.aesthetic.description);

  const mediaSourceUrlState = useState(props.aesthetic.mediaSourceUrl);
  const websitesState = useState(originalWebsites);
  const similarAestheticsState = useState(originalSimilarAesthetics);
  const mediaState = useState(originalMedia);

  const [nameIntent, setNameIntent] = useState(Intent.NONE);
  const [symbolIntent, setSymbolIntent] = useState(Intent.NONE);
  const [startYearIntent, setStartYearIntent] = useState(Intent.NONE);
  const [endYearIntent, setEndYearIntent] = useState(Intent.NONE);
  const [descriptionIntent, setDescriptionIntent] = useState(Intent.NONE);
  const [mediaIntents, setMediaIntents] = useState(originalMedia.map(() => Intent.NONE));
  const [websiteIntents, setWebsiteIntents] = useState(originalWebsites.map(() => Intent.NONE));
  const [similarAestheticIntents, setSimilarAestheticIntents] = useState(originalSimilarAesthetics.map(() => ({
    description: Intent.NONE,
    reverseDescription: Intent.NONE,
  })));

  const [nameHelperText, setNameHelperText] = useState('');
  const [symbolHelperText, setSymbolHelperText] = useState('');
  const [startYearHelperText, setStartYearHelperText] = useState('');
  const [endYearHelperText, setEndYearHelperText] = useState('');
  const [descriptionHelperText, setDescriptionHelperText] = useState('');
  const [mediaHelperTexts, setMediaHelperTexts] = useState(originalMedia.map(() => ''));
  const [websiteHelperTexts, setWebsiteHelperTexts] = useState(originalWebsites.map(() => ''));
  const [similarAestheticHelperTexts, setSimilarAestheticHelperTexts] = useState(originalSimilarAesthetics.map(() => ({
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
  const [websiteTypes, setWebsiteTypes] = useState([]);

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
        });
    }
  }, [isLoading, setIsLoading]);

  if (!websiteTypes) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  const handleSymbolChange = event => {
    let newSymbol = event.target.value.replace(/[^a-z]/gi, '');
    newSymbol = newSymbol.substring(0, 1).toUpperCase() + newSymbol.substring(1, 3).toLowerCase();
    setSymbol(newSymbol);
  };

  const handleCancel = () => {
    // TODO
  };

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

  const validateStartYear = () => {
    let hasError = false;

    if (!startYear) {
      setStartYearIntent(Intent.DANGER);
      setStartYearHelperText('Start year is required.');
      hasError = true;
    } else {
      setStartYearIntent(Intent.NONE);
      setStartYearHelperText('');
    }

    return hasError;
  };

  const validateEndYear = () => {
    let hasError = false;

    if (endYear && startYear) {
      const endYearInt = endYear.replace(/\D/g, '');
      const startYearInt = startYear.replace(/\D/g, '');

      if (endYearInt && startYearInt && parseInt(endYearInt) < parseInt(startYearInt)) {
        setEndYearIntent(Intent.DANGER);
        setEndYearHelperText('End year cannot be before first year observed.');
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
      if (!similarAesthetic.description) {
        newSimilarAestheticIntents[idx].description = Intent.DANGER;
        newSimilarAestheticHelperTexts[idx].description = 'Description is required.';
        hasError = true;
      } else {
        newSimilarAestheticIntents[idx].description = Intent.NONE;
        newSimilarAestheticHelperTexts[idx].description = '';
      }

      if (!similarAesthetic.reverseDescription) {
        newSimilarAestheticIntents[idx].reverseDescription = Intent.DANGER;
        newSimilarAestheticHelperTexts[idx].reverseDescription = 'Description is required.';
        hasError = true;
      } else {
        newSimilarAestheticIntents[idx].reverseDescription = Intent.NONE;
        newSimilarAestheticHelperTexts[idx].reverseDescription = '';
      }
    });

    setSimilarAestheticIntents(newSimilarAestheticIntents);
    setSimilarAestheticHelperTexts(newSimilarAestheticHelperTexts);

    if(hasError) {
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

    const hasNameError = validateName();
    const hasStartYearError = validateStartYear();
    const hasEndYearError = validateEndYear();
    const hasDescriptionError = validateDescription();
    const hasWebsiteError = validateWebsites();
    const hasSimilarAestheticError = validateSimilarAesthetics();

    if (hasNameError || hasStartYearError || hasEndYearError || hasDescriptionError
      || hasWebsiteError || hasSimilarAestheticError) {
      return;
    }

    const websitesToSend = cloneDeep(websitesState[0]);

    websitesToSend.forEach(website => {
      delete website.aestheticWebsite;
    });

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
        delete media.file;
      } else {
        delete media.fileObject;
      }
    });

    const newAesthetic = {
      aesthetic: props.aesthetic.aesthetic,
      name,
      symbol,
      endYear,
      startYear,
      description,
      mediaSourceUrl: mediaSourceUrlState[0],
      websites: websitesToSend,
      similarAesthetics: similarAestheticsState[0],
      media: mediaToSend,
    };

    const formData = serialize(
      newAesthetic,
      { indices: true }
    );

    axios.post(API_ROUTE_AESTHETIC_EDIT, formData)
      .then(res => {
        // TODO
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
                props.addMessage(fieldError.message, Intent.DANGER);
            }
          });
        } else {
          props.addMessage(`An error occurred: ${err}`, Intent.DANGER)
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>CARI | Edit Aesthetic | {name}</title>
      </Helmet>
      <form className={styles.editAestheticForm} onSubmit={handleSubmit}>
        <Card>
          <h2>Basic Information</h2>
          <FormGroup helperText={nameHelperText} intent={nameIntent} label="Name"
            labelInfo="(required)">
            <InputGroup intent={nameIntent} onChange={event => setName(event.target.value)}
              value={name} />
          </FormGroup>
          <FormGroup helperText={symbolHelperText || "1-3 letters. Like the Periodic Table, but for aesthetics."}
            intent={symbolIntent} label="Symbol">
            <InputGroup intent={symbolIntent} onChange={handleSymbolChange} value={symbol || ''} />
          </FormGroup>
          <FormGroup helperText={startYearHelperText} intent={startYearIntent}
            label="Year First Observed" labelInfo="(required)">
            <InputGroup intent={startYearIntent} onChange={event => setStartYear(event.target.value)}
              value={startYear || ''} />
          </FormGroup>
          <FormGroup helperText={endYearHelperText} intent={endYearIntent} label="End Year">
            <InputGroup intent={endYearIntent} onChange={event => setEndYear(event.target.value)}
              value={endYear || ''} />
          </FormGroup>
          <FormGroup helperText={descriptionHelperText} intent={descriptionIntent}
            label="Description" labelInfo="(required)">
            <Editor apiKey={process.env.REACT_APP_TINYMCE_API_KEY} id="aestheticDescription"
              init={DESCRIPTION_EDITOR_SETTINGS}
              initialValue={description} onEditorChange={(content, editor) => setDescription(content)} />
          </FormGroup>
        </Card>
        <br />
        <Card>
          <WebsiteSubform helperText={websiteHelperTexts} icon={websiteSubformIcon}
            intent={websiteIntents} mediaSourceUrl={mediaSourceUrlState}
            show={[showWebsiteSubform, setShowWebsiteSubform]} websites={websitesState}
            websiteTypes={websiteTypes} />
        </Card>
        <br />
        <Card>
          <AestheticRelationshipSubform aesthetic={props.aesthetic}
            helperText={similarAestheticHelperTexts} icon={aestheticRelationshipSubformIcon}
            intent={similarAestheticIntents}
            show={[showAestheticRelationshipSubform, setShowAestheticRelationshipSubform]}
            similarAesthetics={similarAestheticsState} />
        </Card>
        <br />
        <Card>
          <MediaSubform helperText={mediaHelperTexts} icon={mediaSubformIcon}
            intent={mediaIntents} media={mediaState} show={[showMediaSubform, setShowMediaSubform]} />
        </Card>
        <br />
        <FormGroup>
          <ControlGroup>
            <Button icon="undo" large={true} onClick={handleCancel}>Cancel</Button>
            <Button icon="floppy-disk" intent={Intent.SUCCESS} large={true} type="submit">
              Save
            </Button>
          </ControlGroup>
        </FormGroup>
      </form>
    </>
  );
};

export default EditAestheticForm;
