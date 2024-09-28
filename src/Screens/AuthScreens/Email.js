import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  View,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import TextField from '../../Components/Customs/TextField';
import {EmailField} from '../../Services/Constants/FIELDS';
import TextButton from '../../Components/Customs/Buttons/TextButton';
import styles from './Styles';
import {
  comnPost,
  getFromStorage,
  saveToStorage,
} from '../../Services/Api/CommonServices';
import {connect} from 'react-redux';
import {
  saveAccess_token,
  setLoader,
  setMode,
} from '../../Reducers/CommonActions';
import Loader from '../../Components/Customs/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLOR from '../../Services/Constants/COLORS';
import {navigateTo} from '../../Services/CommonMethods';
import GlobalText from '../../Components/Customs/Text';
// import SQLite from 'react-native-sqlite-storage';
import Popup from '../../Components/Common/Popup';
import Feather from 'react-native-vector-icons/Feather';
import {CommonActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {color} from 'react-native-reanimated';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DIMENSIONS from '../../Services/Constants/DIMENSIONS';

const Email = ({navigation, route, ...props}) => {
  const {t, i18n} = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOtp, setIsOtp] = useState(route.params?.isOtp || false);
  const [isPassword, setIsPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  GoogleSignin.configure({
    scopes: ['profile', 'email'], // Specify any additional scopes you need
    webClientId: __DEV__
      ? '203571229982-d9doh1t7ileevdqppomjfjvcvloj1i25.apps.googleusercontent.com' // Debug webClientId
      : '203571229982-9uv6encu2akkkh57hsbbmap8jtklvfnl.apps.googleusercontent.com', // Release webClientId
  });

  const signInWithGoogle = async () => {
    try {
      props.setLoader(true);
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      let lat = await getFromStorage('currentLatitude');
      let long = await getFromStorage('currentLongitude');
      const userInfo = await GoogleSignin.signIn();

      $payload = {
        token: userInfo.data.idToken,
        userName: userInfo.data.user.name,
        userPhoto: userInfo.data.user.photo,
        userEmail: userInfo.data.user.email,
        referral_code: await getFromStorage('referralCode'),
        latitude: lat.toString(),
        longitude: long.toString(),
        language: t('LANG'),
      };

      const res = await comnPost('v2/auth/googleAuth', $payload);
      {
        if (res.data.success) {
          AsyncStorage.setItem(
            t('STORAGE.ACCESS_TOKEN'),
            res.data.data.access_token,
          );
          AsyncStorage.setItem(
            t('STORAGE.USER_ID'),
            JSON.stringify(res.data.data.user.id),
          );
          // props.saveAccess_token(res.data.data.access_token);
          props.setLoader(false);
          AsyncStorage.setItem(
            t('STORAGE.IS_FIRST_TIME'),
            JSON.stringify(true),
          );
          saveToStorage(t('STORAGE.MODE'), JSON.stringify(true));
          props.setMode(true);
          navigateTo(navigation, t('SCREEN.HOME'));
        } else {
          setIsAlert(true);
          setAlertMessage(res.data.message?.otp || res.data.message);
          props.setLoader(false);
        }
      }
    } catch (error) {
      setIsAlert(true);
      setAlertMessage(t('ALERT.WENT_WRONG'));
      props.setLoader(false);
    }
  };

  useEffect(() => {
    getAsyncValues();
    // openDB()
    // createUserTable();
    const backHandler = BackHandler.addEventListener(
      t('EVENT.HARDWARE_BACK_PRESS'),
      () => ToNavigate(),
    );
    return () => {
      backHandler.remove();
      setIsAlert(false);
      setAlertMessage('');
    };
  }, [props.mode]);

  const getAsyncValues = async () => {
    let language = await getFromStorage('language');
    let mode = await getFromStorage('mode');
    i18n.changeLanguage(language);
    props.setMode(mode);
  };

  // const openDB = () => {
  //   const db = SQLite.openDatabase({
  //     name: 'mydb.db',
  //     createFromLocation: '~mydata.db',
  //   });
  //   if (db) {
  //     // Database initialization successful, proceed with queries
  //   } else {
  //     console.error('Failed to initialize the database.');
  //   }
  // };

  const createUserTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)',
      );
    });
  };

  const createUser = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        ['John Doe', 'john@example.com'],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Record inserted successfully.');
          } else {
            console.log('Failed to insert record.');
          }
        },
      );
    });
  };

  const getUserData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM users', [], (tx, results) => {
        const len = results.rows.length;
        for (let i = 0; i < len; i++) {
          const {id, name, email} = results.rows.item(i);
          console.log(`User ${id}: ${name} (${email})`);
        }
      });
    });
  };

  const setValue = (val, isVal, index) => {
    switch (index) {
      case 0:
        setEmail(val.trim());
        break;
    }

    setIsButtonDisabled(false);
  };

  const getValue = i => {
    switch (i) {
      case 0:
        return email;
      case 1:
        return password;
    }
  };

  const closePopup = () => {
    if (isSuccess) {
      AsyncStorage.setItem(t('STORAGE.IS_FIRST_TIME'), JSON.stringify(true));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: t('SCREEN.HOME')}],
        }),
      );
    }
    setIsAlert(false);
  };

  const signUpScreen = () => {
    navigateTo(navigation, t('SCREEN.SIGN_UP'));
  };

  const loginWithPassScreen = () => {
    navigateTo(navigation, t('SCREEN.EMAIL_SIGN_IN'));
  };

  const ToNavigate = async () => {
    if (
      (await getFromStorage(t('STORAGE.ACCESS_TOKEN'))) == null ||
      (await getFromStorage(t('STORAGE.ACCESS_TOKEN'))) == ''
    ) {
      navigateTo(navigation, t('SCREEN.LANG_SELECTION'));
    } else {
      navigateTo(navigation, t('SCREEN.HOME'));
    }
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateOtp = () => {
    props.setLoader(true);
    if (!validateEmail(email)) {
      setIsAlert(true);
      setAlertMessage(t('ALERT.INVALID_EMAIL'));
      props.setLoader(false);
      return;
    }
    const data = {
      email,
    };
    comnPost('v2/auth/sendOtp', data)
      .then(res => {
        if (res.data?.success) {
          props.setLoader(false);
          navigateTo(navigation, t('SCREEN.VERIFY_OTP'), {email});
        } else {
          setIsAlert(true);
          setIsSuccess(false);
          setAlertMessage(
            res.data?.message.email
              ? res.data?.message.email
              : res.data?.message
              ? res.data?.message
              : t('NETWORK'),
          );
          props.setLoader(false);
        }
      })
      .catch(err => {
        setIsAlert(true);
        setIsSuccess(false);
        setAlertMessage(t('ALERT.WENT_WRONG'));
        props.setLoader(false);
      });
  };

  const selectPassword = () => {
    navigateTo(navigation, t('SCREEN.PASSWORD_LOGIN'), {email});
  };

  return (
    <View style={{flex: 1, backgroundColor: COLOR.white}}>
      <ImageBackground
        style={styles.loginImage}
        source={require('../../Assets/Images/Intro/login_background.png')}
      />
      {/* <Header
        name={""}
        startIcon={<View></View>}
        style={styles.loginHeader}
      /> */}

      <View>
        <Loader />
        <GlobalText text={t('WELCOME')} style={styles.welcomeText} />
        <GlobalText text={t('APPNAME')} style={styles.boldKokan} />
      </View>
      <View style={styles.middleFlex}>
        <GlobalText text={t('LOG_IN')} style={styles.loginText} />
        {EmailField.map((field, index) => {
          return (
            <TextField
              name={field.name}
              label={field.name}
              placeholder={field.placeholder}
              fieldType={field.type}
              length={field.length}
              required={field.required}
              disabled={false}
              value={getValue(index)}
              setChild={(v, i) => setValue(v, i, index)}
              style={styles.containerStyle}
              inputContainerStyle={styles.inputContainerStyle}
              isSecure={field.isSecure}
              rightIcon={
                field.type == `${t('TYPE.PASSWORD')}` && (
                  <Feather
                    name={field.isSecure ? 'eye' : 'eye-off'}
                    size={24}
                    color={COLOR.themeBlue}
                    onPress={() => {
                      field.isSecure = !showPassword;
                      setShowPassword(!showPassword);
                    }}
                    style={styles.eyeIcon}
                  />
                )
              }
            />
          );
        })}

        {/* login with passowrd commented for the time need to fix functionality as soon as possible */}
        {/* <TouchableOpacity onPress={() => loginWithPassScreen()}>
          <GlobalText
            text={t('BUTTON.LOGIN_WITH_PASSWORD')}
            style={styles.loginSubText}
          />
        </TouchableOpacity> */}
        <View style={{alignItems: 'center'}}>
          <TextButton
            title={t('BUTTON.SEND_OTP')}
            buttonView={styles.buttonView}
            isDisabled={isButtonDisabled}
            raised={true}
            onPress={() => generateOtp()}
          />
        </View>

        <View style={styles.googleView}>
          <GlobalText
            text={'---- OR ----'}
            style={{marginTop: DIMENSIONS.sectionGap}}
          />
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => {
              signInWithGoogle();
            }}
            style={styles.googleButton}
            // disabled={isInProgress}
          />
        </View>

        <View style={styles.haveAcc}>
          <GlobalText text={t('DONT_HAVE_ACC')} />
          <TouchableOpacity onPress={() => signUpScreen()}>
            <GlobalText text={t('SIGN_UP')} style={styles.blueBold} />
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior="height"
        style={{flex: 1}}></KeyboardAvoidingView>
      <Popup message={alertMessage} onPress={closePopup} visible={isAlert} />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    access_token: state.commonState.access_token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveAccess_token: data => {
      dispatch(saveAccess_token(data));
    },
    setLoader: data => {
      dispatch(setLoader(data));
    },
    setMode: data => {
      dispatch(setMode(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Email);
