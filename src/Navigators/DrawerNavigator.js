// DrawerNavigator.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';

import TabNavigator from './TabNavigator';

import ContactUs from '../Screens/ContactUs';
import Emergency from '../Screens/Emergency';
import QueriesList from '../Screens/ListPages/QueriesList';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const {t} = useTranslation();

  return (
    <Drawer.Navigator screenOptions={{headerShown: false}}>
      {/* Change screen name to avoid conflict */}
      <Drawer.Screen name={t('SCREEN.DASHBOARD')} component={TabNavigator} />
      {/* <Drawer.Screen name={t("SCREEN.REQUEST_PAID_ADVERTISEMENT")} component={Pricing} /> */}
      {/* Update other screens accordingly */}
      <Drawer.Screen name={t('SCREEN.EMERGENCY')} component={Emergency} />
      <Drawer.Screen name={t('SCREEN.CONTACT_US')} component={QueriesList} />
      {/* <Drawer.Screen name={t("SCREEN.WEATHER")} component={Weather} /> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
