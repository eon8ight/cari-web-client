import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';
import { serialize } from 'object-to-formdata';
import { Editor } from '@tinymce/tinymce-react';

import {
  Button,
  Card,
  ControlGroup,
  FormGroup,
  HTMLSelect,
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
  API_ROUTE_ERAS,
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
  const addMessage = props.addMessage;

  const originalWebsites = props.aesthetic.websites || [];
  const originalSimilarAesthetics = props.aesthetic.similarAesthetics || [];
  const originalMedia = props.aesthetic.media || [];

  const [name, setName] = useState(props.aesthetic.name);
  const [symbol, setSymbol] = useState(props.aesthetic.symbol);
  const [startEra, setStartEra] = useState(props.aesthetic.startEra);
  const [endEra, setEndEra] = useState(props.aesthetic.endEra);
  const [description, setDescription] = useState(props.aesthetic.description);

  const mediaSourceUrlState = useState(props.aesthetic.mediaSourceUrl);
  const websitesState = useState(originalWebsites);
  const similarAestheticsState = useState(originalSimilarAesthetics);
  const mediaState = useState(originalMedia);

  const [startEraSpecifier, setStartEraSpecifier] = useState(null);
  const [endEraSpecifier, setEndEraSpecifier] = useState(null);
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);

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
  const [eras, setEras] = useState(null);
  const [websiteTypes, setWebsiteTypes] = useState(null);
  const [edited, setEdited] = useState(false);

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
            if(!(era.eraSpecifier in map)) {
              map[era.eraSpecifier] = {
                label: era.specifier.label,
                years: {},
              };
            }

            map[era.eraSpecifier].years[era.year] = era.era;

            if(startEra === era.era) {
              setStartEraSpecifier(era.eraSpecifier);
              setStartYear(era.year);
            }

            if(endEra === era.era) {
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

  if(edited) {
    return <Redirect to={`/aesthetics/${props.aesthetic.urlSlug}`} />
  }

  const handleSymbolChange = event => {
    let newSymbol = event.target.value.replace(/[^a-z]/gi, '');
    newSymbol = newSymbol.substring(0, 1).toUpperCase() + newSymbol.substring(1, 3).toLowerCase();
    setSymbol(newSymbol);
  };

  const handleStartEraSpecifierChange = event => {
    const value = event.target.value;
    setStartEraSpecifier(value);

    if(value === '--') {
      setStartYear('--');
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

    if(value === '--') {
      setEndYear('--');
      setEndEra(null);
    }
  };

  const handleEndYearChange = event => {
    const year = event.target.value;
    setEndYear(year);
    setEndEra(eras[endEraSpecifier].years[year]);
  };

  const handleCancel = () => {
    setEdited(true);
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

      if(intStartYear > intEndYear || (intStartYear === intEndYear && startEraSpecifier > endEraSpecifier)) {
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
    const hasStartEraError = validateStartEra();
    const hasEndEraError = validateEndEra();
    const hasDescriptionError = validateDescription();
    const hasWebsiteError = validateWebsites();
    const hasSimilarAestheticError = validateSimilarAesthetics();

    if (hasNameError || hasStartEraError || hasEndEraError || hasDescriptionError
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
      endEra,
      startEra,
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

    const postOpts = { withCredentials: true };

    axios.post(API_ROUTE_AESTHETIC_EDIT, formData, postOpts)
      .then(res => {
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
      });
  };

  const eraSpecifierOptions = Object.keys(eras).sort().map(eraSpecifier => ({
    label: eras[eraSpecifier].label,
    value: eraSpecifier,
  }));

  eraSpecifierOptions.unshift({ label: '--', value: null });

  const yearSpecifierOptions = Object.keys(eras[1].years).sort().map(year => ({
    label: `${year}s`,
    value: year,
  }));

  yearSpecifierOptions.unshift({ label: '--', value: null });

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
          <FormGroup
            helperText={symbolHelperText || "1-3 letters. Like the Periodic Table, but for aesthetics."}
            intent={symbolIntent} label="Symbol">
            <InputGroup intent={symbolIntent} onChange={handleSymbolChange} value={symbol || ''} />
          </FormGroup>
          <FormGroup helperText={startYearHelperText} intent={startYearIntent}
            label="Year First Observed" labelInfo="(required)">
            <ControlGroup>
              <HTMLSelect options={eraSpecifierOptions}
                onChange={handleStartEraSpecifierChange} value={startEraSpecifier} />
              <HTMLSelect disabled={startEraSpecifier === '--'} options={yearSpecifierOptions}
                onChange={handleStartYearChange} value={startYear} />
            </ControlGroup>
          </FormGroup>
          <FormGroup helperText={endYearHelperText} intent={endYearIntent} label="End of Popularity">
            <ControlGroup>
              <HTMLSelect options={eraSpecifierOptions}
                onChange={handleEndEraSpecifierChange} value={endEraSpecifier} />
              <HTMLSelect disabled={endEraSpecifier === '--'} options={yearSpecifierOptions}
                onChange={handleEndYearChange} value={endYear} />
            </ControlGroup>
          </FormGroup>
          <FormGroup helperText={descriptionHelperText} intent={descriptionIntent}
            label="Description" labelInfo="(required)">
            <Editor apiKey={process.env.REACT_APP_TINYMCE_API_KEY} id="aestheticDescription"
              init={DESCRIPTION_EDITOR_SETTINGS}
              initialValue={description}
              onEditorChange={(content, editor) => setDescription(content)} />
          </FormGroup>
        </Card>
        <br />
        <Card>
          <WebsiteSubform helperText={[websiteHelperTexts, setWebsiteHelperTexts]}
            icon={websiteSubformIcon} intent={[websiteIntents, setWebsiteIntents]}
            mediaSourceUrl={mediaSourceUrlState} show={[showWebsiteSubform, setShowWebsiteSubform]}
            websites={websitesState} websiteTypes={websiteTypes} />
        </Card>
        <br />
        <Card>
          <AestheticRelationshipSubform aesthetic={props.aesthetic}
            helperText={[similarAestheticHelperTexts, setSimilarAestheticHelperTexts]}
            icon={aestheticRelationshipSubformIcon}
            intent={[similarAestheticIntents, setSimilarAestheticIntents]}
            show={[showAestheticRelationshipSubform, setShowAestheticRelationshipSubform]}
            similarAesthetics={similarAestheticsState} />
        </Card>
        <br />
        <Card>
          <MediaSubform addMessage={addMessage}
            helperText={[mediaHelperTexts, setMediaHelperTexts]} icon={mediaSubformIcon}
            intent={[mediaIntents, setMediaIntents]} media={mediaState}
            show={[showMediaSubform, setShowMediaSubform]} />
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
