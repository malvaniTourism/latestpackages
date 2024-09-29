import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import store from './Store';
import {
  Image,
  LogBox,
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
  Button,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import StackNavigator from './src/Navigators/StackNavigator';
import COLOR from './src/Services/Constants/COLORS';
import AppIntroSlider from 'react-native-app-intro-slider';
import GlobalText from './src/Components/Customs/Text';
import DIMENSIONS from './src/Services/Constants/DIMENSIONS';
import STRING from './src/Services/Constants/STRINGS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextButton from './src/Components/Customs/Buttons/TextButton';
import Feather from 'react-native-vector-icons/Feather';
import styles from './src/Screens/Styles';
import analytics from '@react-native-firebase/analytics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import './src/localization/i18n';
import firebase from '@react-native-firebase/app';
import {
  comnPost,
  dataSync,
  saveToStorage,
} from './src/Services/Api/CommonServices';
import {useTranslation} from 'react-i18next';
import {Dropdown} from 'react-native-element-dropdown';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';
import {navigateTo} from './src/Services/CommonMethods';
import TextField from './src/Components/Customs/TextField';
import {CheckBox, Switch} from '@rneui/themed';
import PrivacyPolicy from './src/Components/Common/PrivacyPolicy';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import LocationEnabler from 'react-native-android-location-enabler';
import {
  checkLocationEnabled,
  requestResolutionSettings,
} from 'react-native-android-location-enabler';
import * as LocationEnabler from 'react-native-android-location-enabler';

// LogBox.ignoreAllLogs();
// LogBox.ignoreLogs(['Warning: ...', 'Possible Unhandled Promise Rejection']);
const Stack = createNativeStackNavigator();

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp();
}

analytics().setAnalyticsCollectionEnabled(true);

const slides = [
  {
    key: 1,
    title: 'Select Language',
    image: require('./src/Assets/Images/Intro/4-min.png'),
    backgroundColor: '#fff',
    type: 'language',
  },
  {
    key: 2,
    title: 'Enter Referral Code',
    image: require('./src/Assets/Images/Intro/5-min.png'),
    backgroundColor: '#fff',
    type: 'referral',
  },
  {
    key: 3,
    title: 'Enable Location',
    image: require('./src/Assets/Images/Intro/7-min.png'),
    backgroundColor: '#fff',
    type: 'location',
  },
  {
    key: 4,
    title: 'Accept Terms and Conditions',
    image: null,
    backgroundColor: '#fff',
    type: 'terms',
  },
  {
    key: 5,
    title: 'Select Online/Offline Mode',
    image: null,
    backgroundColor: '#fff',
    type: 'mode',
  },
];

export default function App() {
  // const { i18n } = useTranslation();
  const sliderRef = React.useRef(null);

  const [isFirstTime, setIsFirstTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([
    {label: 'English', value: 'en'},
    {label: 'मराठी', value: 'mr'},
  ]);
  const [language, setLanguage] = useState('en');
  const [isFocus, setIsFocus] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textValues, setTextValues] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });
  const [watchID, setWatchID] = useState('');

  const [latitude, setCurrentLatitude] = useState(null);
  const [longitude, setCurrentLongitude] = useState(null);
  const [mode, setMode] = useState(true);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const languagesList = [
    {label: 'English', value: 'en'},
    {label: 'मराठी', value: 'mr'},
  ];

  const [isLoading, setIsLoading] = useState(false); // State to manage loading spinner
  const [locationStatus, setLocationStatus] = useState('Share Location'); // State for button text
  const [buttonColor, setButtonColor] = useState('#007bff'); // Initial button color
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [referral, setReferral] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const checkFirstTime = async () => {
      const isFirstTimeValue = await AsyncStorage.getItem('IS_FIRST_TIME');
      setIsFirstTime(isFirstTimeValue);
      setLoading(false);
    };
    checkFirstTime();
    callAPI();
  }, []);

  const handleInputChange = (key, value) => {
    setTextValues(prev => ({...prev, [key]: value}));
  };

  // const handleNextButton = () => {
  //   if (currentIndex < slides.length - 1) {
  //     setCurrentIndex(currentIndex + 1);
  //     if (sliderRef.current) sliderRef.current.goToSlide(currentIndex + 1);
  //   }
  // };

  const handleNextButton = () => {
    // Check when on the third slide for Terms and Conditions acceptance and location sharing
    if (currentIndex === 3) {
      if (!textValues[4]) {
        alert('Please accept the Terms and Conditions.');
        return;
      }

      if (!latitude || !longitude) {
        console.log(1);

        alert('Please share your location.');
        return;
      }
    }

    // Check when on the second slide for location sharing
    if (currentIndex === 2 && (!latitude || !longitude)) {
      console.log(2);

      alert('Please share your location.');
      return;
    }

    // Proceed to the next slide
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (sliderRef.current) sliderRef.current.goToSlide(currentIndex + 1);
    }
  };

  const callAPI = () => {
    dataSync('landingResponse', callLandingPageAPI, true).then(resp => {});
  };

  const callLandingPageAPI = async site_id => {
    try {
      let data = {site_id};
      const res = await comnPost('v2/landingpage', data);
      if (res && res.data.data) {
        setOfflineData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log('finally');
    }
  };

  const setOfflineData = resp => {
    saveToStorage('landingResponse', JSON.stringify(resp));
    saveToStorage('categoriesResponse', JSON.stringify(resp.categories));
    saveToStorage('routesResponse', JSON.stringify(resp.routes));
    saveToStorage('citiesResponse', JSON.stringify(resp.cities));
    saveToStorage('emergency', JSON.stringify(resp.emergencies));
    saveToStorage('queries', JSON.stringify(resp.queries));
    saveToStorage('gallery', JSON.stringify(resp.gallery));
    saveToStorage('profileResponse', JSON.stringify(resp.user));
    saveToStorage('userName', resp.user.name);
    saveToStorage('userId', JSON.stringify(resp.user.id));
    saveToStorage('userEmail', resp.user.email);
  };

  // const handleNextButton = () => {
  //   // Call the `onNext` function of the current slide
  //   slides[currentIndex].onNext();

  //   // Move to the next slide
  //   if (currentIndex < slides.length - 1) {
  //     setCurrentIndex(currentIndex + 1);
  //   }
  // };

  // const handleInputChange = (key, value) => {
  //   setTextValues(prev => ({ ...prev, [key]: value }));
  // };

  const enableLocationService = async () => {
    try {
      setIsLoading(true); // Start loading spinner
      setIsButtonDisabled(true); // Disable the button while processing

      // Check if location is already enabled
      const isLocationEnabled = await LocationEnabler.isLocationEnabled();

      if (isLocationEnabled) {
        console.log('Location services are already enabled');
        getOneTimeLocation();
      } else {
        LocationEnabler.promptForEnableLocationIfNeeded()
          .then(() => {
            console.log('Location services have been enabled');
            Alert.alert('Success', 'Location services have been enabled');
            getOneTimeLocation();
          })
          .catch(error => {
            console.error('Error enabling location services:', error);
            Alert.alert('Error', 'Failed to enable location services');
            setIsLoading(false); // Stop loading spinner
            setIsButtonDisabled(false); // Re-enable the button
          });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
      setIsLoading(false); // Stop loading spinner
      setIsButtonDisabled(false); // Re-enable the button
    }
  };

  const getOneTimeLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const currentLatitude = position.coords.latitude;
          const currentLongitude = position.coords.longitude;

          console.log(
            'Latitude:',
            currentLatitude,
            'Longitude:',
            currentLongitude,
          );
          setCurrentLatitude(currentLatitude);
          setCurrentLongitude(currentLongitude);
          setLocationStatus('Location Enabled'); // Update button text
          setButtonColor('#28a745'); // Set color to green after success
          setIsLoading(false); // Stop loading spinner
          setIsButtonDisabled(true); // Keep the button disabled
        },
        error => {
          setLocationStatus('Enable Location'); // Reset text
          setButtonColor('#dc3545'); // Change to red color on error
          setIsLoading(false); // Stop loading spinner
          setIsButtonDisabled(false); // Enable button again
          console.error('Location Error:', error);
        },
        {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
      );
    } catch (error) {
      setLocationStatus('Enable Location'); // Reset text
      setButtonColor('#dc3545'); // Change to red color on error
      setIsLoading(false);
      setIsButtonDisabled(false); // Enable button again
      console.error('Error fetching location:', error);
    }
  };

  const privacyClicked = () => {
    setIsPrivacyChecked(!isPrivacyChecked);
    setTextValues({...textValues, 4: !textValues[4]});
  };

  const changeMode = () => {
    saveToStorage('mode', JSON.stringify(!mode));
    setMode(!mode);
    Animated.spring(scaleValue, {
      toValue: 1.1,
      friction: 2,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderItem = ({item}) => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
            {item.image && <Image source={item.image} style={styles.image} />}

            <View style={styles.bottomFields}>
              {item.type === 'language' ? (
                <Dropdown
                  style={styles.dropdown}
                  data={languagesList}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Language"
                  value={language}
                  onChange={item => setLanguage(item.value)}
                />
              ) : item.type === 'referral' ? (
                <TextField
                  fieldType={'text'}
                  style={[
                    styles.searchPanelFieldNew,
                    {
                      marginTop: isKeyboardVisible ? -400 : 0,
                      borderWidth: isKeyboardVisible ? 3 : 1,
                    },
                  ]}
                  inputContainerStyle={styles.inputContainerStyle}
                  placeholder="Enter Referral Code"
                  value={referral}
                  setChild={(v, i) => setReferral(v)}
                />
              ) : item.type === 'location' ? (
                <View>
                  <TextButton
                    title={
                      isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        locationStatus
                      )
                    } // Show spinner instead of text when loading
                    buttonView={[
                      styles.locButtonView,
                      {backgroundColor: buttonColor},
                    ]}
                    isDisabled={isButtonDisabled}
                    raised={true}
                    onPress={enableLocationService}></TextButton>
                </View>
              ) : item.type === 'terms' ? (
                <View>
                  {/* <TextInput
                style={styles.checkbox}
                placeholder="Accept Terms and Conditions"
                value={textValues[item.key]}
                onChangeText={text => handleInputChange(item.key, text)}
              /> */}
                  <PrivacyPolicy
                  // acceptClick={acceptClick}
                  // cancelClick={closePopup}
                  />
                  <CheckBox
                    title={'I Accept Terms & Conditions'}
                    onPress={() => privacyClicked()}
                    checked={isPrivacyChecked}
                  />
                </View>
              ) : item.type === 'mode' ? (
                <View style={styles.modeScreen}>
                  <GlobalText
                    text={'How would you like to use your app?'}
                    style={styles.sectionTitle}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={styles.toggleContainer}>
                      <TouchableOpacity onPress={() => changeMode(true)}>
                        <Animated.View
                          style={[
                            styles.optionCard,
                            mode && styles.selectedCard,
                            {transform: [{scale: mode ? scaleValue : 1}]},
                          ]}>
                          <FontAwesome5Icon
                            name="cloud"
                            size={50}
                            color="#4cd137"
                          />
                          <Text style={styles.optionText}>Online Mode</Text>
                        </Animated.View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => changeMode(false)}>
                        <Animated.View
                          style={[
                            styles.optionCard,
                            !mode && styles.selectedCard,
                            {transform: [{scale: !mode ? scaleValue : 1}]},
                          ]}>
                          <Feather name="wifi-off" size={50} color="#f39c12" />
                          <Text style={styles.optionText}>Offline Mode</Text>
                        </Animated.View>
                      </TouchableOpacity>
                    </View>
                    <GlobalText
                      text={
                        'Please note: Even in offline mode, a network connection is required initially to complete the login process and load essential data.'
                      }
                      style={styles.note}
                    />
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  const renderDoneButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons name="checkmark" color={COLOR.white} size={30} />
    </View>
  );

  const renderNextButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="arrow-forward"
        color={COLOR.white}
        size={30}
        onPress={handleNextButton}
      />
    </View>
  );

  const renderNewButton = () => (
    <View style={styles.backCircle}>
      <Ionicons
        name="arrow-back"
        color={COLOR.white}
        size={30}
        onPress={handleBackButton}
      />
    </View>
  );

  const onDone = async () => {
    // Save the user's preferences
    await saveToStorage('IS_FIRST_TIME', 'false');
    await saveToStorage('language', language);
    await saveToStorage('referralCode', referral);
    await saveToStorage('currentLatitude', JSON.stringify(latitude));
    await saveToStorage('currentLongitude', JSON.stringify(longitude));
    await saveToStorage(
      'termsAccepted',
      JSON.stringify(textValues[4] || false),
    );
    await saveToStorage('mode', JSON.stringify(mode));
    setIsFirstTime('false');
  };

  const handleBackButton = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      sliderRef.current.goToSlide(currentIndex - 1);
    }
  };

  // const renderNextButton = () => {
  //   return (
  //     <View style={styles.buttonCircle}>
  //       <Ionicons name="arrow-forward" color={COLOR.white} size={30} onPress={() => {
  //           if (sliderRef.current && currentIndex < slides.length - 1) {
  //             sliderRef.current.goToSlide(currentIndex + 1); // Navigate to the next slide
  //             slides[currentIndex].onNext();  // Trigger slide-specific action
  //           }
  //         }}
  //       />
  //     </View>
  //   );
  // };

  // const renderDoneButton = () => {
  //   return (
  //     <View style={styles.buttonCircle}>
  //       <Ionicons name="checkmark" color={COLOR.white} size={30} />
  //     </View>
  //   );
  // };

  const onSlideChange = index => {
    // Update the current index and trigger specific actions for the slide.
    setCurrentIndex(index);
    // Trigger any actions specific to the new slide
    slides[index].onNext();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.themeBlue} />
      </View>
    );
  }

  if (isFirstTime === 'false') {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <StackNavigator />
        </SafeAreaProvider>
      </Provider>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={COLOR.loginImageBlue} />
      <AppIntroSlider
        ref={sliderRef}
        nextButtonTextColor={'#000'}
        renderItem={renderItem}
        data={slides}
        onDone={onDone}
        activeDotColor={COLOR.themeBlue}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 7.5,
          backgroundColor: '#C0C0C0',
        }}
        activeDotStyle={{
          width: 15,
          height: 15,
          borderRadius: 10,
          backgroundColor: COLOR.themeBlue,
        }}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
        // renderPrevButton={renderPrevButton}
        onSlideChange={setCurrentIndex}
        scrollEnabled={false}
        dotClickEnabled={false}
      />
      {currentIndex > 0 && renderNewButton()}
    </>
  );
}
