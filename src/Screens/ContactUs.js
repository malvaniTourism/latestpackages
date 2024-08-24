import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Header from "../Components/Common/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLOR from "../Services/Constants/COLORS";
import DIMENSIONS from "../Services/Constants/DIMENSIONS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backPage, checkLogin, goBackHandler } from "../Services/CommonMethods";
import { ContactUsFields } from "../Services/Constants/FIELDS";
import TextField from "../Components/Customs/TextField";
import TextButton from "../Components/Customs/Buttons/TextButton";
import styles from "./Styles";
import { comnPost } from "../Services/Api/CommonServices";
import Popup from "../Components/Common/Popup";
import Loader from "../Components/Customs/Loader";
import { setLoader } from "../Reducers/CommonActions";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import GlobalText from "../Components/Customs/Text";
import DocumentPicker from "react-native-document-picker";

const ContactUs = ({ navigation, route, setStep, ...props }) => {
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlert, setIsAlert] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(async () => {
        setEmail(await AsyncStorage.getItem(t("STORAGE.USER_EMAIL")));
        const backHandler = goBackHandler(navigation);
        checkLogin(navigation);
        return () => {
            backHandler.remove();
        };
    }, []);

    const setValue = (val, isVal, index) => {
        switch (index) {
            case 0:
                setEmail(val);
                break;
            case 1:
                setPhone(val);
                break;
            case 2:
                setMessage(val);
                break;
        }
    };

    const getValue = (i) => {
        switch (i) {
            case 0:
                return email;
            case 1:
                return phone;
            case 2:
                return message;
        }
    };

    const submit = async () => {
        props.setLoader(true);
        let data = {
            user_id: await AsyncStorage.getItem(t("STORAGE.USER_ID")),
            name: await AsyncStorage.getItem(t("STORAGE.USER_NAME")),
            email,
            phone,
            message,
        };

        comnPost("v2/addQuery", data)
            .then((res) => {
                setIsAlert(true);
                setAlertMessage(
                    res.data.message.email
                        ? res.data.message.email
                        : res.data.message.phone
                        ? res.data.message.phone
                        : res.data.message.message
                        ? res.data.message.message
                        : res.data.message
                );
                props.setLoader(false);
                setPhone("");
                setMessage("");
            })
            .catch((err) => {
                setIsAlert(true);
                setAlertMessage(t("ALERT.FAILED"));
                props.setLoader(false);
            });
    };

    const closePopup = () => {
        setIsAlert(false);
        setStep(0);
    };

    const selectFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles], // Allow all types of files
            });
            setSelectedFile(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled file picker");
            } else {
                console.log("Unknown Error: ", err);
                throw err;
            }
        }
    };

    return (
        <View style={{ backgroundColor: COLOR.white }}>
            <View
                style={{
                    alignItems: "center",
                    height: DIMENSIONS.screenHeight,
                    backgroundColor: COLOR.white,
                    marginTop: -19,
                }}
            >
                {ContactUsFields.map((field, index) => {
                    return (
                        <View>
                            <GlobalText
                                text={field.placeholder}
                                style={styles.fieldTitle}
                            />
                            <TextField
                                name={field.name}
                                label={field.name}
                                placeholder={field.placeholder}
                                fieldType={field.type}
                                length={field.length}
                                required={field.required}
                                disabled={index == 0}
                                value={getValue(index)}
                                setChild={(v, i) => setValue(v, i, index)}
                                style={styles.containerStyle}
                                inputContainerStyle={styles.inputContainerStyle}
                                multiline={field.multiline}
                            />
                        </View>
                    );
                })}
                <TextButton
                    title={t("BUTTON.SEND")}
                    buttonView={styles.searchButtonStyle}
                    titleStyle={styles.buttonTitleStyle}
                    onPress={submit}
                />
            </View>
            <Popup
                message={alertMessage}
                onPress={closePopup}
                visible={isAlert}
            />
        </View>
    );
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoader: (data) => {
            dispatch(setLoader(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
