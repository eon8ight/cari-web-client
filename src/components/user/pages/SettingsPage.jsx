import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';

import {
  Card,
  Tab,
  Tabs
} from '@blueprintjs/core';

import InviteForm from './SettingsPage/InviteForm';
import ProfileForm from './SettingsPage/ProfileForm';

const ID_INVITE = 'invite';
const ID_PROFILE = 'profile';

const titleize = str => str.charAt(0).toUpperCase() + str.slice(1);

const SettingsPage = props => {
  const loc = useLocation();
  const history = useHistory();

  const [selectedTab, setSelectedTab] = useState(loc.hash.slice(1) || ID_PROFILE);

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
        <Tabs animate={true} onChange={handleTabChange} renderActiveTabPanelOnly={true}
          selectedTabId={selectedTab}>
          <Tab id={ID_PROFILE} panel={<ProfileForm />} title="Profile" />
          <Tab id={ID_INVITE} panel={<InviteForm />} title="Invite" />
        </Tabs>
      </Card>
    </>
  );
};

export default SettingsPage;