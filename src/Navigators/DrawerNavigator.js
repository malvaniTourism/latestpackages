import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { View, Text, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TabNavigator from './TabNavigator';
import Emergency from '../Screens/Emergency';
import QueriesList from '../Screens/ListPages/QueriesList';

const Drawer = createDrawerNavigator();

const socialLinks = [
  { name: 'logo-facebook', url: 'https://www.facebook.com/...', color: '#3b5998' },
  { name: 'logo-instagram', url: 'https://www.instagram.com/tour_kokan', color: '#e1306c' }
];

const DrawerNavigator = () => {
  const { t, i18n } = useTranslation();

  if (!i18n.isInitialized) {
    return null; // Ensure translations are loaded
  }

  const handleLinkPress = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('Failed to open URL:', err);
    }
  };

  // Reusable component for social media links
  const SocialMediaLinks = () => (
    <View style={styles.socialMediaContainer}>
      {socialLinks.map((link, index) => (
        <TouchableOpacity key={index} onPress={() => handleLinkPress(link.url)}>
          <Ionicons name={link.name} size={24} color={link.color} style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
  );

  // Footer component for social media and credits
  const Footer = () => (
    <View style={styles.footerContainer}>
      <SocialMediaLinks />
      <Text style={styles.footerText}>Designed and Developed by Probyte Solution LLP.</Text>
    </View>
  );

  // Custom drawer content with conditional footer rendering
  const CustomDrawerContent = (props) => (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {/* Conditionally render footer based on screen */}
      {props.state.routeNames.includes('QueriesList') && <Footer />}
    </View>
  );

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name={t('SCREEN.DASHBOARD')} component={TabNavigator} />
      <Drawer.Screen name={t('SCREEN.EMERGENCY')} component={Emergency} />
      <Drawer.Screen name={t('SCREEN.CONTACT_US')} component={QueriesList} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#888',
  },
});

export default DrawerNavigator;
