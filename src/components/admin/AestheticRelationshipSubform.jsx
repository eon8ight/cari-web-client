import React, { useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';

import {
  Button,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  MenuItem,
  OL,
  Spinner,
} from '@blueprintjs/core';

import { Suggest } from '@blueprintjs/select';

import ConfirmDelete from './ConfirmDelete';
import ExpandableSection from '../common/ExpandableSection';

import { API_ROUTE_AESTHETIC_NAMES } from '../../functions/constants';

import styles from './styles/AestheticRelationshipSubform.module.scss';

const MENU_ITEM_NO_RESULTS = <MenuItem className={styles.tooltipText} disabled={true} key={0} text="No results." />;

const SUGGEST_POPOVER_PROPS = {
  minimal: true,
  popoverClassName: styles.aestheticNameSuggest
};

const AESTHETIC_RELATIONSHIP_TEMPLATE = {
  aesthetic: 0,
  description: '',
  reverseDescription: '',
};

const compareNames = (aestheticNameA, aestheticNameB) => aestheticNameA.aesthetic === aestheticNameB.aesthetic;

const AestheticRelationshipSubform = props => {
  const addMessage = props.addMessage;

  const [similarAesthetics, setSimilarAesthetics] = props.similarAesthetics;

  const [intent, setIntent] = props.intent;
  const [helperText, setHelperText] = props.helperText;

  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState([]);
  const [namesMap, setNamesMap] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);

  const aesthetic = props.aesthetic.aesthetic;

  const refilter = (fromSimilarAesthetics, fromNames, query) => {
    const alreadySelectedAesthetics = fromSimilarAesthetics.map(aesthetic => aesthetic.aesthetic);
    alreadySelectedAesthetics.push(aesthetic);

    let newFilteredNames = fromNames.filter(
      aestheticName => !alreadySelectedAesthetics.includes(aestheticName.aesthetic)
    );

    if (query) {
      newFilteredNames = newFilteredNames.filter(
        aestheticName => aestheticName.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredNames(newFilteredNames);
  };

  const refilterCallback = useCallback(refilter, [aesthetic]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);

      axios.get(API_ROUTE_AESTHETIC_NAMES)
        .then(res => {
          const newNamesMap = res.data.reduce((map, aestheticName) => {
            map[aestheticName.aesthetic] = aestheticName.name;
            return map
          }, {});

          setNamesMap(newNamesMap);

          const newNames = res.data.filter(aestheticName => aestheticName.aesthetic !== aesthetic);
          newNames.sort((a, b) => newNamesMap[a.aesthetic].localeCompare(newNamesMap[b.aesthetic]))

          setNames(newNames);
          refilterCallback(similarAesthetics, newNames);
        })
        .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
    }
  }, [addMessage, isLoading, setIsLoading, similarAesthetics, refilterCallback, aesthetic]);

  if (!names) {
    return <Spinner />;
  }

  const nameInputValueRenderer = similarAesthetic => namesMap[similarAesthetic.aesthetic];

  const nameRenderer = (aestheticName, { modifiers, handleClick }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    return (
      <MenuItem active={modifiers.active} className={styles.tooltipText}
        key={aestheticName.aesthetic} onClick={handleClick}
        text={namesMap[aestheticName.aesthetic]} shouldDismissPopover={false} />
    );
  };

  const handleAdd = () => {
    const newSimilarAesthetics = cloneDeep(similarAesthetics);
    newSimilarAesthetics.push(cloneDeep(AESTHETIC_RELATIONSHIP_TEMPLATE));
    setSimilarAesthetics(newSimilarAesthetics);

    const newIntent = cloneDeep(intent);

    newIntent.push({
      aesthetic: Intent.NONE,
      description: Intent.NONE,
      reverseDescription: Intent.NONE,
    });

    setIntent(newIntent);

    const newHelperText = cloneDeep(helperText);

    newHelperText.push({
      aesthetic: '',
      description: '',
      reverseDescription: '',
    });

    setHelperText(newHelperText);
  };

  const handleNameSelect = (aestheticName, idx) => {
    const newSimilarAesthetics = cloneDeep(similarAesthetics);
    newSimilarAesthetics[idx].aesthetic = aestheticName.aesthetic;
    setSimilarAesthetics(newSimilarAesthetics);
    refilter(newSimilarAesthetics, names);
  };

  const handleChange = (value, key, idx) => {
    const newSimilarAesthetics = cloneDeep(similarAesthetics);
    newSimilarAesthetics[idx][key] = value;
    setSimilarAesthetics(newSimilarAesthetics);
  }

  const handleDelete = idx => {
    const newSimilarAesthetics = cloneDeep(similarAesthetics);
    newSimilarAesthetics.splice(idx, 1);
    setSimilarAesthetics(newSimilarAesthetics);

    const newIntent = cloneDeep(intent);
    newIntent.splice(idx, 1);
    setIntent(newIntent);

    const newHelperText = cloneDeep(helperText);
    newHelperText.splice(idx, 1);
    setHelperText(newHelperText);
  };

  const elems = similarAesthetics.map((similarAesthetic, idx) => {
    const similarAestheticName = namesMap[similarAesthetic.aesthetic];

    let inputs = null;

    if (similarAesthetic.aesthetic) {
      inputs = (
        <>
          <FormGroup helperText={helperText[idx].description} intent={intent[idx].description}
            label={<>How does <strong>{similarAestheticName}</strong> relate to <strong>{props.aesthetic.name}</strong>?</>}
            labelInfo="(required)">
            <InputGroup intent={intent[idx].description} value={similarAesthetic.description || ''}
              onChange={event => handleChange(event.target.value, 'description', idx)} />
          </FormGroup>
          <FormGroup helperText={helperText[idx].reverseDescription}
            intent={intent[idx].reverseDescription}
            label={<>How does <strong>{props.aesthetic.name}</strong> relate to <strong>{similarAestheticName}</strong>?</>}
            labelInfo="(required)">
            <InputGroup intent={intent[idx].reverseDescription} value={similarAesthetic.reverseDescription || ''}
              onChange={event => handleChange(event.target.value, 'reverseDescription', idx)} />
          </FormGroup>
        </>
      );
    }

    return (
      <li key={similarAesthetic.aesthetic}>
        <FormGroup helperText={helperText[idx].aesthetic} intent={intent[idx].aesthetic}>
          <ControlGroup>
            <Suggest inputValueRenderer={nameInputValueRenderer}
              itemRenderer={nameRenderer} items={filteredNames}
              itemsEqual={compareNames} noResults={MENU_ITEM_NO_RESULTS}
              onItemSelect={aestheticName => handleNameSelect(aestheticName, idx)}
              onQueryChange={query => refilter(similarAesthetics, names, query)}
              popoverProps={SUGGEST_POPOVER_PROPS} query={similarAestheticName} resetOnClose={true}
              selectedItem={similarAesthetic} />
            <ConfirmDelete onClick={() => handleDelete(idx)} />
          </ControlGroup>
        </FormGroup>
        {inputs}
      </li>
    );
  });

  return (
    <ExpandableSection header="Related Aesthetics" icon={props.icon} show={props.show}>
      <OL>{elems}</OL>
      <FormGroup>
        <Button icon="add" intent={Intent.PRIMARY} onClick={handleAdd}>
          Add Related Aesthetic
        </Button>
      </FormGroup>
    </ExpandableSection>
  );
};

export default AestheticRelationshipSubform;