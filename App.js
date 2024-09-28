import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './Store';
import { Image, LogBox, StyleSheet, View, ActivityIndicator, TextInput, Button } from 'react-native';
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
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('./src/Assets/Images/Intro/4-min.png'),
    backgroundColor: '#fff',
    type: 'language',
    onNext: () => {
        console.log('Slide 1 Next clicked');
        // Perform any actions specific to Slide 1
      },
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    image: require('./src/Assets/Images/Intro/5-min.png'),
    backgroundColor: '#fff',
    type: 'referral',
    onNext: () => {
        console.log('Slide 2 Next clicked');
        // Perform any actions specific to Slide 1
      },
  },
  {
    key: 3,
    title: 'Title 3',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: require('./src/Assets/Images/Intro/6-min.png'),
    backgroundColor: '#fff',
    type: 'location',
    onNext: () => {
        console.log('Slide 3 Next clicked');
        // Perform any actions specific to Slide 1
      },
  },
];

export default function App() {
  // const { i18n } = useTranslation();
  const sliderRef = React.useRef(null);

  const [isFirstTime, setIsFirstTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [textValues, setTextValues] = useState({ 1: '', 2: '', 3: '' }); // State for text inputs
  const [list, setList] = useState([
    { label: 'English', value: 'en' },
    { label: 'मराठी', value: 'mr' },
  ]);
  const [language, setLanguage] = useState('en');
  const [isFocus, setIsFocus] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const doSomething = async () => {
    try {
      const isFirstTimeValue = await AsyncStorage.getItem(STRING.STORAGE.IS_FIRST_TIME);
      setIsFirstTime(isFirstTimeValue);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching isFirstTime value:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    doSomething();
    callAPI();
  }, []);

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

  const handleNextButton = () => {
    // Call the `onNext` function of the current slide
    slides[currentIndex].onNext();

    // Move to the next slide
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleInputChange = (key, value) => {
    setTextValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key) => {
    console.log(`Saved for Slide ${key}:`, textValues[key]);
  };

  const myLocationPress = async () => {
    props.setLoader(true);

    let valid = true;
    let errorMessage = '';

    // Inner async function to handle async logic
    const checkLocationAndSetupListeners = async () => {
      const locationEnabled = await checkLocationServices();

      // If location services are disabled, show an alert
      if (!locationEnabled) {
        errorMessage = t('ALERT.LOCATION_SERVICES_DISABLED');
        valid = false;
      }

      if (!valid) {
        // Prompt the user to enable location services
        Alert.alert(
          t('ALERT.LOCATION_REQUIRED'), // Title of the alert
          t('ALERT.ENABLE_LOCATION_SERVICES'), // Message to user
          [
            // { text: t('ALERT.CANCEL'), style: 'cancel' }, // Cancel option
            {
              text: t('ALERT.OPEN_SETTINGS'),
              onPress: () => openLocationSettings(), // Open location settings
            },
          ],
        );

        setAlertMessage(errorMessage);
        setIsAlert(true);
        setShowPrivacy(false);
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
            title: t('LOCATION_ACCESS_REQUIRED'),
            message: t('NEEDS_TO_ACCESS'),
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // To Check, If Permission is granted
          getOneTimeLocation();
          subscribeLocation();
        } else {
          setLocationStatus(t('PERMISSION_DENIED'));
          props.setLoader(false);
        }
      } catch (err) {
        console.warn(err);
        props.setLoader(false);
      }
    }
  };

  const saveLang = () => {
    // i18n.changeLanguage(language);
    AsyncStorage.setItem("Language", language);
    navigateTo(navigation, t('SCREEN.EMAIL'));
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <Image source={item.image} style={styles.image} />
        {/* <View style={styles.appName}>
          <GlobalText text={STRING.APPNAME} style={styles.loginName} />
        </View> */}

        <View style={styles.bottomFields}>
          {item.type === 'language' ? (
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={styles.itemTextStyle}
              dropdownTextStyle={styles.dropdownText}
              iconStyle={styles.dropdownIcon}
              data={list}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select item' : '...'}
              value={language}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setLanguage(item.value);
                setIsFocus(false);
              }}
            />
          )
            : item.type === 'referral' ? (
                <TextInput
                  style={styles.textInput}
                  placeholder={`Enter text for ${item.title}`}
                  value={textValues[item.key]}
                  onChangeText={text => handleInputChange(item.key, text)}
                />
            )
              : (
                <TextButton
                  title={"Share Location"}
                  buttonView={styles.locButtonView}
                  isDisabled={false}
                  raised={true}
                  onPress={() => myLocationPress()}
                />
              )}
        </View>
      </View>
    );
  };

  const onDone = (key) => {
    console.log('key - -', key);
    
    AsyncStorage.setItem(STRING.STORAGE.IS_FIRST_TIME, 'false');
    setIsFirstTime('false');
  };

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons name="arrow-forward" color={COLOR.white} size={30} onPress={() => {
            if (sliderRef.current && currentIndex < slides.length - 1) {
              sliderRef.current.goToSlide(currentIndex + 1); // Navigate to the next slide
              slides[currentIndex].onNext();  // Trigger slide-specific action
            }
          }}
        />
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons name="checkmark" color={COLOR.white} size={30} />
      </View>
    );
  };

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
        onSlideChange={setCurrentIndex}
      />
    </>
  );
}
