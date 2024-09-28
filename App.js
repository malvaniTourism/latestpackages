import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
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
  TouchableOpacity
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
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';
import { navigateTo } from './src/Services/CommonMethods';

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
    image: require('./src/Assets/Images/Intro/6-min.png'),
    backgroundColor: '#fff',
    type: 'location',
  },
  {
    key: 4,
    title: 'Accept Terms and Conditions',
    image: require('./src/Assets/Images/Intro/5-min.png'),
    backgroundColor: '#fff',
    type: 'terms',
  },
  {
    key: 5,
    title: 'Select Online/Offline Mode',
    image: require('./src/Assets/Images/Intro/6-min.png'),
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
    { label: 'English', value: 'en' },
    { label: 'मराठी', value: 'mr' },
  ]);
  const [language, setLanguage] = useState('en');
  const [isFocus, setIsFocus] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textValues, setTextValues] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '' });
  const [watchID, setWatchID] = useState('');

  const [latitude, setCurrentLatitude] = useState(null);
  const [longitude, setCurrentLongitude] = useState(null);
  const [mode, setMode] = useState("true");
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  const languagesList = [
    { label: 'English', value: 'en' },
    { label: 'मराठी', value: 'mr' },
  ];

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
    console.log(key, value);

    setTextValues(prev => ({ ...prev, [key]: value }));
  };

  // const handleNextButton = () => {
  //   if (currentIndex < slides.length - 1) {
  //     setCurrentIndex(currentIndex + 1);
  //     if (sliderRef.current) sliderRef.current.goToSlide(currentIndex + 1);
  //   }
  // };

  const handleNextButton = () => {
    console.log(currentIndex, textValues);

    if (currentIndex === 3 && !textValues[4]) {
      alert('Please accept the Terms and Conditions.');
      return;
    }

    if (currentIndex === 2 && (!latitude || !longitude)) {
      alert('Please share your location.');
      return;
    }

    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (sliderRef.current) sliderRef.current.goToSlide(currentIndex + 1);
    }
  };

  const callAPI = () => {
    dataSync('landingResponse', callLandingPageAPI, true).then(resp => { });
  };

  const callLandingPageAPI = async site_id => {
    try {
      let data = { site_id };
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

  const handleSave = (key) => {
    console.log(`Saved for Slide ${key}:`, textValues[key]);
  };

  const myLocationPress = async () => {

    let valid = true;

    // Inner async function to handle async logic
    const checkLocationAndSetupListeners = async () => {
      const locationEnabled = await checkLocationServices();

      // If location services are disabled, show an alert
      if (!locationEnabled) {
        console.log('ALERT.LOCATION_SERVICES_DISABLED');
        valid = false;
      }

      if (!valid) {
        // Prompt the user to enable location services
        Alert.alert(
          'ALERT.LOCATION_REQUIRED', // Title of the alert
          'ALERT.ENABLE_LOCATION_SERVICES', // Message to user
          [
            // { text: t('ALERT.CANCEL'), style: 'cancel' }, // Cancel option
            {
              text: 'ALERT.OPEN_SETTINGS',
              onPress: () => openLocationSettings(), // Open location settings
            },
          ],
        );
      }
    };

    // Call the async function
    checkLocationAndSetupListeners();

    if (Platform.OS === 'ios') {
      getOneTimeLocation();
      subscribeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'LOCATION_ACCESS_REQUIRED',
            message: 'NEEDS_TO_ACCESS',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // To Check, If Permission is granted
          getOneTimeLocation();
          subscribeLocation();
        } else {
          setLocationStatus('PERMISSION_DENIED');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getOneTimeLocation = () => {
    // setFetchingText('ALERT.FETCHING_TEXT');
    // setLocationStatus('GETTING_LOCATION');
    Geolocation.getCurrentPosition(
      position => {
        // setLocationStatus('YOU_ARE_HERE');
        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;
        setCurrentLatitude(currentLatitude);
        setCurrentLongitude(currentLongitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
    );
  };

  const subscribeLocation = () => {
    let WatchID = Geolocation.watchPosition(
      position => {
        // setLocationStatus('YOU_ARE_HERE');
        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;
        setCurrentLatitude(currentLatitude);
        setCurrentLongitude(currentLongitude);

        console.log([currentLatitude, currentLongitude]);

      },
      error => {
        setLocationStatus(error.message);
      },
      { enableHighAccuracy: false, maximumAge: 1000 },
    );
    setWatchID(WatchID);
  };

  const checkLocationServices = async () => {
    const enabled = await DeviceInfo.isLocationEnabled();
    setIsLocationEnabled(enabled);
    return enabled;
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
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
            <TextInput
              style={styles.textInput}
              placeholder="Enter Referral Code"
              value={textValues[item.key]}
              onChangeText={text => handleInputChange(item.key, text)}
            />
          ) : item.type === 'location' ? (
            <TextButton
              title={"Share Location"}
              buttonView={styles.locButtonView}
              isDisabled={false}
              raised={true}
              onPress={() => myLocationPress()}
            />
          ) : item.type === 'terms' ? (
            <View>
              {/* <TextInput
                style={styles.checkbox}
                placeholder="Accept Terms and Conditions"
                value={textValues[item.key]}
                onChangeText={text => handleInputChange(item.key, text)}
              /> */}
              <Text onPress={() => setTextValues({ ...textValues, 4: !textValues[4] })}>
                {textValues[4] ? '✓ I Accept Terms & Conditions' : 'I Accept Terms & Conditions'}
              </Text>
            </View>
          ) : item.type === 'mode' ? (
            <View style={styles.modeSelection}>
              <Button
                title="Online"
                onPress={() =>
                  setMode("true")
                }
              />
              <Button
                title="Offline"
                onPress={() =>
                  setMode("false")
                }
              />
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const renderDoneButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons name="checkmark" color={COLOR.white} size={30} />
    </View>
  );

  const renderNextButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons name="arrow-forward" color={COLOR.white} size={30} onPress={handleNextButton} />
    </View>
  );

  const renderPrevButton = () => {
    <View style={styles.buttonCircle}>
      <Ionicons name="arrow-back" color={COLOR.white} size={30} onPress={handleBackButton} />
    </View>
  };

  const onDone = async () => {
    // Save the user's preferences
    await saveToStorage('IS_FIRST_TIME', 'false');
    await saveToStorage('language', language);
    await saveToStorage('referralCode', textValues[2] || '');
    await saveToStorage('currentLatitude', JSON.stringify(latitude));
    await saveToStorage('currentLongitude', JSON.stringify(longitude));
    await saveToStorage('termsAccepted', JSON.stringify(textValues[4] || false));
    await saveToStorage('mode', mode);
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

  const onSlideChange = (index) => {
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
      {currentIndex > 0 && renderPrevButton()}
    </>
  );
}