import { TabComponent } from '@/components/navigation/Tabs';
import { Account } from './tabs/Account';
import { Notifications } from './tabs/Notifications';
import SystemParameters from './tabs/SystemParameters';

const SettingsContent = () => {
  const settingsTabs = [
    { label: 'Account', content: <Account /> },
    { label: 'Notifications', content: <Notifications /> },
    { label: 'System Parameters', content: <SystemParameters /> },
  ];

  return <TabComponent pageTitle="Settings" tabs={settingsTabs} />;
};

export default SettingsContent;
