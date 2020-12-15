import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';
import parse from 'html-react-parser';

import { Spinner } from '@blueprintjs/core';

import { API_ROUTE_USER_FIND_FOR_LIST } from '../functions/constants';

import styles from './styles/Team.module.scss';

const Team = props => {
  const [userList, setUserList] = useState(null);

  useEffect(() => {
    const params = {
      role: 1,
      includeFavoriteAesthetic: true,
      includeProfileImage: true,
      sortField: 'lastName,firstName',
    };

    axios.get(API_ROUTE_USER_FIND_FOR_LIST, { params })
      .then(res => setUserList(res.data.content));
  }, [setUserList]);

  if(!userList) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  const teamDataElem = userList.map(user => (
    <article class={styles.teamArticle}>
      <img alt="Consumer Aesthetics Research Institute" src={user.profileImage.url}
        class={styles.profileImage} width="100" />
      <div>
        <h3>{user.firstName} {user.lastName} - {user.title}</h3>
        <p>
          {parse(user.biography)}
          <br />
          <em>
            Favorite Aesthetic:&nbsp;
            <a href={`/aesthetics/${user.favoriteAestheticData.urlSlug}`}>
              {user.favoriteAestheticData.name}
            </a>
          </em>
        </p>
      </div>
    </article>
  ));

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