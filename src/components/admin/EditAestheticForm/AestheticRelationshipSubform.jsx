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

import '@blueprintjs/core/lib/css/blueprint.css';

import styles from './styles/AestheticRelationshipSubform.module.scss';

const MENU_ITEM_NO_RESULTS = <MenuItem className={styles.tooltipText} disabled={true} key={0} text="No results." />;

const SUGGEST_POPOVER_PROPS = {
  minimal: true,
  popoverClassName: styles.aestheticNameSuggest
};

const AESTHETIC_RELATIONSHIP_TEMPLATE = {
  aesthetic: 0,
  name: '',
  description: '',
};

const aestheticNameInputValueRenderer = aestheticName => aestheticName.name;
const compareAestheticNames = (aestheticNameA, aestheticNameB) => aestheticNameA.aesthetic === aestheticNameB.aesthetic;

const aestheticNameRenderer = (aestheticName, { modifiers, handleClick }) => {
  if(!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem active={modifiers.active} className={styles.tooltipText}
      key={aestheticName.aesthetic} onClick={handleClick}
      text={aestheticName.name} shouldDismissPopover={false} />
  );
};

const AestheticRelationshipSubform = (props) => {
  console.log(props);
  const [similarAesthetics, setSimilarAesthetics] = props.similarAesthetics;

  const [isLoading, setIsLoading] = useState(false);
  const [aestheticNames, setAestheticNames] = useState([]);
  const [filteredAestheticNames, setFilteredAestheticNames] = useState([]);

  const name = props.aesthetic.name;

  const refilterAestheticNames = fromAestheticNames => {
    const alreadySelectedAestheticNames = similarAesthetics.map(aesthetic => aesthetic.name);
    alreadySelectedAestheticNames.push(name);

    setFilteredAestheticNames(fromAestheticNames.filter(
      aestheticName => !alreadySelectedAestheticNames.includes(aestheticName.name)
    ));
  };

  const refilterAestheticNamesCallback = useCallback(refilterAestheticNames, [name, similarAesthetics]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);

      axios.get(`${process.env.REACT_APP_API_URL}/aesthetic/names`)
        .then(res => {
          const newAestheticNames = res.data.filter(aestheticName => aestheticName.name !== name);
          newAestheticNames.sort((a, b) => a.name.localeCompare(b.name))

          setAestheticNames(newAestheticNames);
          refilterAestheticNamesCallback(newAestheticNames);
        });
    }
  }, [isLoading, setIsLoading, similarAesthetics, name, refilterAestheticNamesCallback]);

  if(!aestheticNames) {
    return <Spinner />;
  }

  const handleAddSimilarAestheticButtonClick = () => {
    const newSimilarAesthetics = cloneDeep(similarAesthetics);
    newSimilarAesthetics.push(cloneDeep(AESTHETIC_RELATIONSHIP_TEMPLATE));
    setSimilarAesthetics(newSimilarAesthetics);
  };

  const handleAestheticNameSelect = (aestheticName, idx) => {
    const newSimilarAesthetics = cloneDeep(similarAesthetics);
    newSimilarAesthetics[idx].aesthetic = aestheticName.aesthetic;
    newSimilarAesthetics[idx].name = aestheticName.name;
    setSimilarAesthetics(newSimilarAesthetics);
    refilterAestheticNames(aestheticNames);
  };

  const similarAestheticElems = similarAesthetics.map((similarAesthetic, idx) => (
    <li key={similarAesthetic.aesthetic}>
      <FormGroup>
        <ControlGroup>
          <Suggest inputValueRenderer={aestheticNameInputValueRenderer}
            itemRenderer={aestheticNameRenderer} items={filteredAestheticNames}
            itemsEqual={compareAestheticNames} noResults={MENU_ITEM_NO_RESULTS}
            onItemSelect={aestheticName => handleAestheticNameSelect(aestheticName, idx)}
            onQueryChange={() => refilterAestheticNames(aestheticNames)}
            popoverProps={SUGGEST_POPOVER_PROPS} query={similarAesthetic.name} resetOnClose={true}
            selectedItem={similarAesthetic} />
          <Button icon="trash" intent={Intent.DANGER}>Delete</Button>
        </ControlGroup>
      </FormGroup>
      <FormGroup label={<>How does <strong>{similarAesthetic.name}</strong> relate to <strong>{name}</strong>?</>}>
        <InputGroup value={similarAesthetic.description} />
      </FormGroup>
      <FormGroup label={<>How does <strong>{name}</strong> relate to <strong>{similarAesthetic.name}</strong>?</>}>
        <InputGroup value={similarAesthetic.reverseDescription} />
      </FormGroup>
    </li>
  ));

  return (
    <>
      <h2>Related Aesthetics</h2>
      <OL>{similarAestheticElems}</OL>
      <FormGroup>
        <Button icon="add" intent={Intent.PRIMARY} onClick={handleAddSimilarAestheticButtonClick}>
          Add Related Aesthetic
        </Button>
      </FormGroup>
    </>
  );
};

export default AestheticRelationshipSubform;