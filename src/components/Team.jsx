import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';
import parse from 'html-react-parser';

import {
  Intent,
  Spinner,
} from '@blueprintjs/core';

import { API_ROUTE_USER_FIND_FOR_LIST } from '../functions/constants';

import styles from './styles/Team.module.scss';

const Team = props => {
  const addMessage = props.addMessage;
  const [userList, setUserList] = useState(null);

  useEffect(() => {
    const params = {
      displayOnTeamPage: true,
      includeFavoriteAesthetic: true,
      includeProfileImage: true,
      includeRoles: true,
      sortField: 'rank,lastName,firstName',
    };

    axios.get(API_ROUTE_USER_FIND_FOR_LIST, { params })
      .then(res => setUserList(res.data.content))
      .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
  }, [addMessage, setUserList]);

  if(!userList) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  const teamDataElem = userList.map(user => {
    const firstName = user.firstName;
    const lastName = user.lastName;
    const rolesForDisplay = user.rolesForDisplay;
    const title = user.title;
    const biography = user.biography;
    const profileImage = user.profileImage;
    const favoriteAestheticData = user.favoriteAestheticData;

    let displayName = user.username;

    if(firstName) {
      displayName = firstName;

      if(lastName) {
        displayName = `${displayName} ${lastName}`;
      }
    } else if(lastName) {
      displayName = lastName;
    }

    if(rolesForDisplay) {
      displayName = `${displayName} - ${rolesForDisplay}`;

      if (title) {
        displayName = `${displayName} / ${title}`;
      }
    } else if(title) {
      displayName = `${displayName} - ${title}`;
    }

    return (
      <article className={styles.teamArticle} key={user.entity}>
        {profileImage && <img alt="Consumer Aesthetics Research Institute" src={profileImage.url}
          className={styles.profileImage} width="100" />}
        <div>
          <h3>{displayName}</h3>
          {biography && parse(biography)}
          {favoriteAestheticData && <em>
            Favorite Aesthetic:&nbsp;
            <a href={`/aesthetics/${favoriteAestheticData.urlSlug}`}>
              {favoriteAestheticData.name}
            </a>
          </em>}
        </div>
      </article>
    );
  });

  return (
    <>
      <Helmet>
        <title>CARI | Team</title>
      </Helmet>
      <h1 className={styles.teamLabel}>our team</h1>
      <section className={styles.teamContainer}>
        <div>{teamDataElem}</div>
      </section>
    </>
  );
};

export default Team;