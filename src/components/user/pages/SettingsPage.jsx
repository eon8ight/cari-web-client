import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import {
  Card,
  Intent,
  Tab,
  Tabs,
  Spinner,
} from '@blueprintjs/core';

import InviteForm from './SettingsPage/InviteForm';
import ProfileForm from './SettingsPage/ProfileForm';

import { addMessage } from '../../../redux/actions';
import useSession from '../../../hooks/useSession';

const ID_INVITE = 'invite';
const ID_PROFILE = 'profile';

const titleize = str => str.charAt(0).toUpperCase() + str.slice(1);

const SettingsPage = props => {
  const session = useSession();
  const loc = useLocation();
  const history = useHistory();

  const [selectedTab, setSelectedTab] = useState(loc.hash.slice(1) || ID_PROFILE);

  if (session.isValid === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  if (!session.isValid) {
      props.addMessage('You must be logged in to view this page', Intent.DANGER);
      return <Redirect to="/user/login" />;
  }

  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
    history.push(`${loc.pathname}#${tabId}`);
  };

  return (
    <>
      <Helmet>
        <title>CARI | {titleize(selectedTab)}</title>
      </Helmet>
      <Card>
        <Tabs animate={true} onChange={handleTabChange}
          selectedTabId={selectedTab}>
          <Tab id={ID_PROFILE} panel={<ProfileForm session={session} />} title="Profile" />
          <Tab id={ID_INVITE} panel={<InviteForm session={session} />} title="Invite" />
        </Tabs>
      </Card>
    </>
  );
};

export default connect(null, { addMessage })(SettingsPage);