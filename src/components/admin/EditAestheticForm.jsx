import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';

import {
  Button,
  Card,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  Spinner,
  TextArea,
} from '@blueprintjs/core';

import AestheticRelationshipSubform from './EditAestheticForm/AestheticRelationshipSubform';
import MediaSubform from './EditAestheticForm/MediaSubform';
import WebsiteSubform from './EditAestheticForm/WebsiteSubform';

import {
  API_ROUTE_AESTHETIC_EDIT,
  API_ROUTE_WEBSITE_TYPES,
} from '../../functions/constants';

import '@blueprintjs/core/lib/css/blueprint.css';

import styles from './styles/EditAestheticForm.module.scss';

const POST_AESTHETIC_EDIT_OPTS = {
  headers: { 'Content-Type': 'application/json' },
};

const EditAestheticForm = props => {
  const originalWebsites = props.aesthetic.websites || [];
  const originalSimilarAesthetics = props.aesthetic.similarAesthetics || [];

  const [name, setName] = useState(props.aesthetic.name);
  const [symbol, setSymbol] = useState(props.aesthetic.symbol);
  const [startYear, setStartYear] = useState(props.aesthetic.startYear);
  const [endYear, setEndYear] = useState(props.aesthetic.setEndYear);
  const [description, setDescription] = useState(props.aesthetic.description);

  const mediaSourceUrlState = useState(props.aesthetic.mediaSourceUrl);
  const websitesState = useState(originalWebsites);
  const similarAestheticsState = useState(originalSimilarAesthetics);
  const mediaState = useState(props.aesthetic.media || []);

  const [nameIntent, setNameIntent] = useState(Intent.NONE);
  const [startYearIntent, setStartYearIntent] = useState(Intent.NONE);
  const [endYearIntent, setEndYearIntent] = useState(Intent.NONE);
  const [descriptionIntent, setDescriptionIntent] = useState(Intent.NONE);
  const [websiteIntents, setWebsiteIntents] = useState(originalWebsites.map(() => Intent.NONE));
  const [similarAestheticIntents, setSimilarAestheticIntents] = useState(originalSimilarAesthetics.map(() => ({
    description: Intent.NONE,
    reverseDescription: Intent.NONE,
  })));

  const [nameHelperText, setNameHelperText] = useState('');
  const [startYearHelperText, setStartYearHelperText] = useState('');
  const [endYearHelperText, setEndYearHelperText] = useState('');
  const [descriptionHelperText, setDescriptionHelperText] = useState('');
  const [websiteHelperTexts, setWebsiteHelperTexts] = useState(originalWebsites.map(() => ''));
  const [similarAestheticHelperTexts, setSimilarAestheticHelperTexts] = useState(originalSimilarAesthetics.map(() => ({
    description: '',
    reverseDescription: '',
  })));

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

  if(!websiteTypes) {
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

    if(endYear && startYear) {
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
      const websiteType = website.websiteType.websiteType;

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
      } else {
        newWebsiteIntents[idx] = Intent.NONE;
        newWebsiteHelperTexts[idx] = '';
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

    return hasError;
  }

  const handleSubmit = event => {
    event.preventDefault();

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

    const newAesthetic = {
      aesthetic: props.aesthetic.aesthetic,
      name,
      symbol,
      endYear,
      startYear,
      description,
      mediaSourceUrl: mediaSourceUrlState[0],
      websites: websitesState[0],
      similarAesthetics: similarAestheticsState[0],
      media: mediaState[0],
    };

    axios.put(API_ROUTE_AESTHETIC_EDIT, newAesthetic, POST_AESTHETIC_EDIT_OPTS)
      .then(res => {
        // TODO
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
          <FormGroup helperText="2-3 letters. Like the Periodic Table, but for aesthetics."
            label="Symbol">
            <InputGroup onChange={handleSymbolChange}
              value={symbol || ''} />
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
            <TextArea intent={descriptionIntent} growVertically={true} fill={true}
              onChange={event => setDescription(event.target.value)} value={description} />
          </FormGroup>
        </Card>
        <br />
        <Card>
          <WebsiteSubform helperText={websiteHelperTexts} intent={websiteIntents}
            mediaSourceUrl={mediaSourceUrlState} websites={websitesState}
            websiteTypes={websiteTypes} />
        </Card>
        <br />
        <Card>
          <AestheticRelationshipSubform aesthetic={props.aesthetic}
            helperText={similarAestheticHelperTexts} intent={similarAestheticIntents}
            similarAesthetics={similarAestheticsState} />
        </Card>
        <br />
        <Card>
          <MediaSubform media={mediaState} />
        </Card>
        <br />
        <FormGroup>
          <ControlGroup>
            <Button icon="undo" large={true} onClick={handleCancel}>Cancel</Button>
            <Button icon="floppy-disk" intent={Intent.SUCCESS} large={true}>Save</Button>
          </ControlGroup>
        </FormGroup>
      </form>
    </>
  );
};

export default EditAestheticForm;
