import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import { cloneDeep } from 'lodash/lang';

import {
  Button,
  Card,
  ControlGroup,
  FileInput,
  FormGroup,
  InputGroup,
  Intent,
  MenuItem,
  Spinner,
  TextArea
} from '@blueprintjs/core';

import { Suggest } from '@blueprintjs/select';

import PasswordInput from '../../../common/PasswordInput';
import { addMessage } from '../../../../redux/actions';

import {
  API_ROUTE_AESTHETIC_NAMES,
  API_ROUTE_USER_FIND_FOR_EDIT,
  API_ROUTE_USER_UPDATE
} from '../../../../functions/constants';

import styles from './styles/ProfileForm.module.scss';

const MENU_ITEM_NO_RESULTS = <MenuItem className={styles.tooltipText} disabled={true} key={0} text="No results." />;

const SUGGEST_POPOVER_PROPS = {
  minimal: true,
  popoverClassName: styles.aestheticNameSuggest
};

const compareNames = (aestheticNameA, aestheticNameB) => aestheticNameA.aesthetic === aestheticNameB.aesthetic;

const ProfileForm = (props) => {
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [isLoadingEntity, setIsLoadingEntity] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);

  const [names, setNames] = useState([]);
  const [namesMap, setNamesMap] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);

  const [emailAddress, setEmailAddress] = useState('');
  const [emailAddressIntent, setEmailAddressIntent] = useState(Intent.NONE);
  const [emailAddressHelperText, setEmailAddressHelperText] = useState('');

  const [username, setUsername] = useState('');
  const [usernameIntent, setUsernameIntent] = useState(Intent.NONE);
  const [usernameHelperText, setUsernameHelperText] = useState('');

  const [password, setPassword] = useState('');
  const [passwordIntent, setPasswordIntent] = useState(Intent.NONE);
  const [passwordHelperText, setPasswordHelperText] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordIntent, setConfirmPasswordIntent] = useState(Intent.NONE);
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [biography, setBiography] = useState('');
  const [title, setTitle] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [favoriteAesthetic, setFavoriteAesthetic] = useState(null);

  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    if (!isLoadingNames) {
      setIsLoadingNames(true);

      axios.get(API_ROUTE_AESTHETIC_NAMES)
        .then(res => {
          const newNamesMap = res.data.reduce((map, aestheticName) => {
            map[aestheticName.aesthetic] = aestheticName.name;
            return map
          }, {});

          setNamesMap(newNamesMap);

          const newNames = res.data.sort((a, b) => newNamesMap[a.aesthetic].localeCompare(newNamesMap[b.aesthetic]))
          setNames(newNames);
          setFilteredNames(newNames);
        });
    }
  }, [isLoadingNames]);

  useEffect(() => {
    if (!isLoadingEntity) {
      setIsLoadingEntity(true);

      const getOpts = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };

      axios.get(API_ROUTE_USER_FIND_FOR_EDIT, getOpts)
        .then(res => {
          const entity = res.data;

          setUsername(entity.username);
          setEmailAddress(entity.emailAddress);
          setFirstName(entity.firstName);
          setLastName(entity.lastName);
          setBiography(entity.biography);
          setTitle(entity.title);
          setFavoriteAesthetic(entity.favoriteAesthetic);

          if (entity.profileImage) {
            setProfileImageUrl(entity.profileImage.url);
          }
        });
    }
  }, [isLoadingEntity]);

  if (!names || !username) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  const validateEmailAddress = () => {
    let hasError = false;

    if (!emailAddress) {
      setEmailAddressIntent(Intent.DANGER);
      setEmailAddressHelperText('Email address is required.');
      hasError = true;
    } else if (!/^.+@.+$/.test(emailAddress)) {
      setEmailAddressIntent(Intent.DANGER);
      setEmailAddressHelperText('Must be an email address.');
      hasError = true;
    } else {
      setEmailAddressIntent(Intent.NONE);
      setEmailAddressHelperText('');
    }

    return hasError;
  };

  const validateUsername = () => {
    let hasError = false;

    if (!username) {
      setUsernameIntent(Intent.DANGER);
      setUsernameHelperText('Username is required.');
      hasError = true;
    } else {
      setUsernameIntent(Intent.NONE);
      setUsernameHelperText('');
    }

    return hasError;
  };

  const validatePassword = () => {
    let hasError = false;

    if (password !== confirmPassword) {
      setPasswordIntent(Intent.DANGER);
      setConfirmPasswordIntent(Intent.DANGER);
      setConfirmPasswordHelperText('Passwords must match.');
      hasError = true;
    } else {
      setPasswordIntent(Intent.NONE);
      setConfirmPasswordIntent(Intent.NONE);
      setPasswordHelperText('');
      setConfirmPasswordHelperText('');
    }

    return hasError;
  };

  const handleEmailAddressChange = event => setEmailAddress(event.target.value);
  const handleUsernameChange = event => setUsername(event.target.value);
  const handlePasswordChange = event => setPassword(event.target.value);
  const handleConfirmPasswordChange = event => setConfirmPassword(event.target.value);
  const handleFirstNameChange = event => setFirstName(event.target.value);
  const handleLastNameChange = event => setLastName(event.target.value);
  const handleBiographyChange = event => setBiography(event.target.value);
  const handleTitleChange = event => setTitle(event.target.value);
  const handleProfileImageChange = event => setProfileImage(event.target.files[0]);

  const refilter = query => {
    let newFilteredNames = cloneDeep(names);

    if (query) {
      newFilteredNames = newFilteredNames.filter(
        aestheticName => aestheticName.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredNames(newFilteredNames);
  };

  const handleSubmit = event => {
    event.preventDefault();

    const hasEmailAddressError = validateEmailAddress();
    const hasUsernameError = validateUsername();
    const hasPasswordError = validatePassword();

    if (hasEmailAddressError || hasUsernameError || hasPasswordError) {
      return;
    }

    setIsUpdating(true);

    const formData = new FormData();

    formData.append('username', username);
    formData.append('emailAddress', emailAddress);

    if (password) {
      formData.append('password', password);
    }

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('title', title);
    formData.append('biography', biography);

    if (profileImage) {
      formData.append('profileImage', profileImage, profileImage.name);
    }

    formData.append('favoriteAesthetic', favoriteAesthetic);

    axios.post(API_ROUTE_USER_UPDATE, formData, { withCredentials: true })
      .then(res => {
        setIsUpdating(false);
        setProfileImageUrl(res.data.updatedData.profileImageUrl);
        setPassword('');
        setConfirmPassword('');
        props.addMessage('Profile update successful.', Intent.SUCCESS);
      })
      .catch(err => {
        setIsUpdating(false);

        if (err.response.status === 400) {
          err.response.data.fieldErrors.forEach(fieldError => {
            switch (fieldError.field) {
              case 'emailAddress':
                setEmailAddressIntent(Intent.DANGER);
                setEmailAddressHelperText(fieldError.message);
                break;
              case 'username':
                setUsernameIntent(Intent.DANGER);
                setUsernameHelperText(fieldError.message);
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

  const nameInputValueRenderer = aesthetic => namesMap[aesthetic.aesthetic];
  const handleNameSelect = aestheticName => setFavoriteAesthetic(aestheticName.aesthetic);

  const selectedAestheticName = {
    aesthetic: favoriteAesthetic,
    name: namesMap[favoriteAesthetic],
  };

  const profileImageText = profileImage ? profileImage.name : 'Choose file...';

  let profileImageElem = null;

  if (profileImageUrl) {
    profileImageElem = <img src={profileImageUrl} width="150px" alt="User avatar" />;
  } else {
    profileImageElem = (
      <svg height="150" width="150">
        <rect height="150" style={{ fill: 'rgba(133, 185, 243, 0.85)' }} width="150" />
        <text x="22" y="75">No image</text>
      </svg>
    );
  }

  return (
    <Card>
      <form autoComplete={false} onSubmit={handleSubmit}>
        <FormGroup helperText={emailAddressHelperText} label="Email Address">
          <InputGroup intent={emailAddressIntent} onChange={handleEmailAddressChange}
            placeholder="New Email Address" value={emailAddress} />
        </FormGroup>
        <FormGroup helperText={usernameHelperText} label="Username">
          <InputGroup intent={usernameIntent} onChange={handleUsernameChange}
            placeholder="New Username" value={username} />
        </FormGroup>
        <PasswordInput helperText={passwordHelperText} intent={passwordIntent} large={false}
          label="Password" onChange={handlePasswordChange} placeholder="New Password" />
        <PasswordInput helperText={confirmPasswordHelperText} intent={confirmPasswordIntent}
          large={false} onChange={handleConfirmPasswordChange}
          placeholder="Confirm New Password" />
        <FormGroup label="Name">
          <ControlGroup>
            <InputGroup onChange={handleFirstNameChange} placeholder="New First Name"
              value={firstName} />
            <InputGroup onChange={handleLastNameChange} placeholder="New Last Name"
              value={lastName} />
          </ControlGroup>
        </FormGroup>
        <FormGroup label="Title">
          <InputGroup onChange={handleTitleChange} placeholder="New Title" value={title} />
        </FormGroup>
        <FormGroup label="Biography">
          <TextArea growVertically={true} fill={true} onChange={handleBiographyChange}
            value={biography} />
        </FormGroup>
        <FormGroup label="Profile Image URL">
          <div className={styles.profileImage}>
            {profileImageElem}
            <FileInput fill={true} hasSelection={profileImage != null}
              inputProps={{ multiple: false }} onChange={handleProfileImageChange}
              text={profileImageText} />
          </div>
        </FormGroup>
        <FormGroup label="Favorite Aesthetic">
          <Suggest fill={true} inputValueRenderer={nameInputValueRenderer}
            itemRenderer={nameRenderer} items={filteredNames} itemsEqual={compareNames}
            noResults={MENU_ITEM_NO_RESULTS} onItemSelect={handleNameSelect}
            onQueryChange={refilter} popoverProps={SUGGEST_POPOVER_PROPS}
            resetOnClose={true} selectedItem={selectedAestheticName} />
        </FormGroup>
        <Button disabled={isUpdating} intent={Intent.PRIMARY} icon="confirm" type="submit">
          Save
        </Button>
      </form>
    </Card>
  );
};

export default connect(
  null,
  { addMessage }
)(ProfileForm);