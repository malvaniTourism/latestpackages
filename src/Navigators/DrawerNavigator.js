import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { View, Text, Linking, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Correct import for Ionicons

import TabNavigator from './TabNavigator'; // Ensure this is correctly imported
import Emergency from '../Screens/Emergency'; // Ensure this is correctly imported
import QueriesList from '../Screens/ListPages/QueriesList'; // Ensure this is correctly imported

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { t } = useTranslation();

  // Custom drawer content
  const CustomDrawerContent = (props) => {
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>

        {/* Footer with social media icons */}
        <View style={styles.footerContainer}>
          {/* Uncomment and update the logo path if you're using a logo */}
          {/* <Image source={require('../Assets/Images/Logos/tourkokan.png')} style={styles.logo} /> */}
          
          {/* Social media links */}
          <View style={styles.socialMediaContainer}>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/people/Tourkokan/61560289596939/?mibextid=LQQJ4d')}>
              <Ionicons name="logo-facebook" size={24} color="#3b5998" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/tour_kokan')}>
              <Ionicons name="logo-instagram" size={24} color="#e1306c" style={styles.icon} />
            </TouchableOpacity>
          </View>

          {/* Footer text */}
          <Text style={styles.footerText}>Designed and Developed by Probyte Solution LLP.</Text>
        </View>
      </View>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Ensure all screen components are correctly imported */}
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
  // Uncomment and adjust the logo style if you use a logo
  // logo: {
  //   width: 100,  // Adjust width according to your logo
  //   height: 100, // Adjust height according to your logo
  //   marginBottom: 20,
  // },
  socialMediaContainer: {
    flexDirection: 'row', // Align icons in a row
    justifyContent: 'space-between',
    width: '30%', // Adjust width for icon spacing
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10, // Add spacing between icons
  },
  footerText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#888',
  },
});

export default DrawerNavigator;
