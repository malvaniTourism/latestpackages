import React, { useEffect } from "react";
import { useState } from "react";
import {
    View,
    TouchableOpacity,
    BackHandler,
    ImageBackground,
    KeyboardAvoidingView,
} from "react-native";
import TextButton from "../../Components/Customs/Buttons/TextButton";
import styles from "./Styles";
import { comnPost, saveToStorage } from "../../Services/Api/CommonServices";
import { connect } from "react-redux";
import {
    saveAccess_token,
    setLoader,
    setMode,
} from "../../Reducers/CommonActions";
import Loader from "../../Components/Customs/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLOR from "../../Services/Constants/COLORS";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import OtpInputs from "react-native-otp-inputs";
import { navigateTo } from "../../Services/CommonMethods";
import GlobalText from "../../Components/Customs/Text";
import Popup from "../../Components/Common/Popup";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";

const VerifyOTP = ({ navigation, route, ...props }) => {
    const { t } = useTranslation();

    const [otp, setOtp] = useState(null);
    const [email, setEmail] = useState(route.params?.email);
    const [sec, setSec] = useState(30);
    const [isAlert, setIsAlert] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [password, setPassword] = useState("");
    const [choiceText, setChoiceText] = useState(t("BUTTON.LOGINPASS"));
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // resend();
        const backHandler = BackHandler.addEventListener(
            t("EVENT.HARDWARE_BACK_PRESS"),
            () => navigateTo(navigation, t("SCREEN.EMAIL"))
        );
        // setInterval(() => timer(), 1000);
        startListeningForOtp();
        return () => {
            backHandler.remove();
            setIsAlert(false);
            setAlertMessage("");
        };
    }, []);

    useEffect(() => {
        let timerInterval;
        if (sec > 0) {
            timerInterval = setInterval(() => {
                setSec((prevSec) => prevSec - 1);
            }, 1000);
        }

        return () => clearInterval(timerInterval);
    }, [sec]);

    const loginClick = () => {
        props.setLoader(true);
        let data = {
            email,
            otp,
        };

        comnPost("v2/auth/verifyOtp", data)
            .then((res) => {
                if (res.data.success) {
                    AsyncStorage.setItem(
                        t("STORAGE.ACCESS_TOKEN"),
                        res.data.data.access_token
                    );
                    AsyncStorage.setItem(
                        t("STORAGE.USER_ID"),
                        JSON.stringify(res.data.data.user.id)
                    );
                    props.saveAccess_token(res.data.data.access_token);
                    props.setLoader(false);
                    AsyncStorage.setItem(
                        t("STORAGE.IS_FIRST_TIME"),
                        JSON.stringify(true)
                    );
                    saveToStorage(t("STORAGE.MODE"), JSON.stringify(true));
                    props.setMode(true);
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: t("SCREEN.HOME") }],
                        })
                    );
                    // navigateTo(navigation, t("SCREEN.HOME"));
                } else {
                    setIsAlert(true);
                    setAlertMessage(
                        res.data.message?.otp
                            ? res.data.message?.otp
                            : res.data.message
                    );
                    props.setLoader(false);
                    setIsSuccess(false);
                }
            })
            .catch((err) => {
                setIsAlert(true);
                setIsSuccess(false);
                setAlertMessage(t("ALERT.WENT_WRONG"));
                setIsSuccess(false);
                props.setLoader(false);
            });
    };

    const closePopup = () => {
        setIsAlert(false);
    };

    const resend = () => {
        props.setLoader(true);
        const data = {
            email,
        };
        setOtp(null);
        comnPost("v2/auth/sendOtp", data)
            .then((res) => {
                props.setLoader(false);
                setSec(30);
                setIsOtpSent(true);
            })
            .catch((err) => {
                props.setLoader(false);
            });
    };

    const timer = () => {
        if (sec > 0) {
            setTimeout(() => {
                setSec(sec - 1);
            }, 1000);
        }
    };

    const startListeningForOtp = () => {
        try {
            RNOtpVerify.getOtp()
                .then((p) => RNOtpVerify.addListener(otpHandler))
                .catch((p) => console.log(p));
        } catch (e) {}
    };

    const otpHandler = (message) => {
        try {
            if (message) {
                const otp = /(\d{4})/g.exec(message)[1];
                if (otp !== null && otp !== undefined) {
                    setOtp(otp);
                }
                RNOtpVerify.removeListener();
            }
        } catch (e) {}
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLOR.white }}>
            <ImageBackground
                style={styles.loginImage}
                source={require("../../Assets/Images/Intro/login_background.png")}
            />
            {/* <Header name={t("HEADER.VERIFY_OTP")} style={{ marginBottom: 50 }}
        startIcon={<></>}
      /> */}

            <View>
                <Loader />
                <GlobalText text={t("WELCOME")} style={styles.welcomeText} />
                <GlobalText text={t("APPNAME")} style={styles.boldKokan} />
            </View>

            <View style={styles.middleFlex}>
                <View>
                    <View>
                        <GlobalText
                            text={t("LOG_IN")}
                            style={styles.loginText}
                        />
                        {/* <GlobalText text={t("WE_HAVE_SENT")} />
            <GlobalText text={`${t("SENT_TO")} ${route.params?.email}`} /> */}
                    </View>
                    <OtpInputs
                        style={{ flexDirection: "row", alignSelf: "center" }}
                        numberOfInputs={6}
                        inputStyles={{
                            height: 50,
                            width: 40,
                            margin: 10,
                            backgroundColor: COLOR.white,
                            borderWidth: 1,
                            borderColor: COLOR.themeBlue,
                            textAlign: "center",
                            fontSize: 24,
                            color: COLOR.themeBlue,
                            borderRadius: DIMENSIONS.borderRadiusXS,
                        }}
                        inputContainerStyles={{ marginVertical: 10 }}
                        autofillFromClipboard={true}
                        defaultValue={otp}
                        // code={this.state.fillOtp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        // onChangeText={code => { this.setState({ otp: code }) }}
                        handleChange={(code) => {
                            setOtp(code);
                        }}
                        // onCodeChanged={code => { this.setState({ otp: code }) }}
                        // autoFocusOnLoad
                        // codeInputFieldStyle={styles.underlineStyleBase}
                        // codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        // onCodeFilled = {(code => this.setState({otp: code}))}
                    />
                </View>
                <TextButton
                    title={t("BUTTON.LOGIN")}
                    disabled={false}
                    raised={true}
                    onPress={() => loginClick()}
                />
                <View style={styles.haveAcc}>
                    {sec >= 1 ? (
                        <GlobalText
                            text={`${t("RESEND_WITHIN").replace(
                                "_",
                                sec > 9 ? sec : "0" + sec
                            )}`}
                        />
                    ) : (
                        <View style={{ flexDirection: "row" }}>
                            <GlobalText text={t("DIDNT_RECEIVE")} />
                            <TouchableOpacity onPress={() => resend()}>
                                <GlobalText
                                    text={t("RESEND")}
                                    style={styles.sendOTPText}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
            <KeyboardAvoidingView
                behavior="height"
                style={{ flex: 1 }}
            ></KeyboardAvoidingView>
            <Popup
                message={alertMessage}
                visible={isAlert}
                onPress={closePopup}
            />
        </View>
    );
};

const mapStateToProps = (state) => {
    return {
        access_token: state.commonState.access_token,
        loader: state.commonState.loader,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveAccess_token: (data) => {
            dispatch(saveAccess_token(data));
        },
        setLoader: (data) => {
            dispatch(setLoader(data));
        },
        setMode: (data) => {
            dispatch(setLoader(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyOTP);
