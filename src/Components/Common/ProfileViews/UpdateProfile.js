import React, { useState } from "react";
import { View } from "react-native";
import { ProfileFields } from "../../../Services/Constants/FIELDS";
import TextField from "../../Customs/TextField";
import styles from "./Styles";
import TextButton from "../../Customs/Buttons/TextButton";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { comnPost } from "../../../Services/Api/CommonServices";
import Popup from "../Popup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import ComingSoon from "../ComingSoon";

const UpdateProfile = ({
    user,
    phone,
    uploadImage,
    refreshOption,
    setLoader,
    ...props
}) => {
    const { t } = useTranslation();

    const [email, setEmail] = useState(user);
    const [mobile, setMobile] = useState(phone);
    const [isAlert, setIsAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showOnlineMode, setShowOnlineMode] = useState(false);

    const setValue = (val, isVal, index) => {
        switch (index) {
            case 0:
                setEmail(val);
                break;
            case 1:
                setMobile(val);
                break;
        }
    };

    const getValue = (i) => {
        switch (i) {
            case 0:
                return email;
            case 1:
                return mobile;
        }
    };

    const save = () => {
        if (props.mode) {
            setLoader(true);
            let data = {};
            if (mobile) {
                data = {
                    email,
                    mobile,
                    profile_picture: uploadImage,
                };
            } else {
                data = {
                    email,
                    profile_picture: uploadImage,
                };
            }
            comnPost("v2/updateProfile", data)
                .then((res) => {
                    if (res.data.success) {
                        AsyncStorage.setItem("isUpdated", "true");
                        refreshOption();
                    } else {
                        setIsAlert(true);
                        setAlertMessage(
                            res.data.message.email
                                ? res.data.message.email
                                : res.data.message.mobile
                                ? res.data.message.mobile
                                : res.data?.message
                                ? res.data?.message
                                : t("NETWORK")
                        );
                        setLoader(false);
                    }
                })
                .catch((err) => {
                    setIsAlert(true);
                    setAlertMessage(t("ALERT.WENT_WRONG"));
                    setLoader(false);
                });
        } else {
            setShowOnlineMode(true);
        }
    };

    const closePopup = () => {
        setIsAlert(false);
    };

    return (
        <View>
            {ProfileFields.map((field, index) => {
                return (
                    <TextField
                        name={field.name}
                        label={field.name}
                        placeholder={field.placeholder}
                        fieldType={field.type}
                        length={field.length}
                        required={field.required}
                        disabled={field.disabled}
                        value={getValue(index)}
                        setChild={(v, i) => setValue(v, i, index)}
                        style={styles.containerStyle}
                        inputContainerStyle={styles.profileContainerStyle}
                        isSecure={field.isSecure}
                        leftIcon={
                            <Feather
                                name={field.leftIcon}
                                size={24}
                                style={styles.leftIcon}
                            />
                        }
                    />
                );
            })}

            <View>
                <TextButton
                    title={t("BUTTON.SAVE")}
                    buttonView={styles.profileButtonStyle}
                    titleStyle={styles.buttonTitleStyle}
                    onPress={save}
                />
            </View>
            <Popup
                message={alertMessage}
                onPress={closePopup}
                visible={isAlert}
            />
            <ComingSoon
                message={t("ON_UPDATE_PROFILE")}
                visible={showOnlineMode}
                toggleOverlay={() => setShowOnlineMode(false)}
            />
        </View>
    );
};

const mapStateToProps = (state) => {
    return {
        mode: state.commonState.mode,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
