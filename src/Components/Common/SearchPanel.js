import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { SrcDest } from "../../Services/Constants/FIELDS";
import TextButton from "../Customs/Buttons/TextButton";
import TextField from "../Customs/TextField";
import styles from "./Styles";
import { connect } from "react-redux";
import { comnPost } from "../../Services/Api/CommonServices";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLOR from "../../Services/Constants/COLORS";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import { navigateTo } from "../../Services/CommonMethods";
import { setLoader } from "../../Reducers/CommonActions";
import GlobalText from "../Customs/Text";
import SearchDropdown from "./SearchDropdown";
import { useTranslation } from "react-i18next";
import STRING from "../../Services/Constants/STRINGS";

const SearchPanel = ({ navigation, from, onSwap, ...props }) => {
    const { t } = useTranslation();

    const [isValid, setIsValid] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [placesList, setPlacesList] = useState([]);
    const [nextPage, setNextPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [source, setSource] = useState({});
    const [destination, setDestination] = useState({});

    useEffect(() => {
        // setSource(props.source?.name || "");
        // setDestination(props.destination.name || "");
        // checkIsValid()
        checkIsValid();
    }, [props]);

    const setValue = (v, i, index, type) => {
        switch (index) {
            case 0:
                setSource(v);
                break;
            case 1:
                setDestination(v);
                break;
        }
        searchPlace(v);
        setFieldType(type);
        checkIsValid();
    };

    const getValue = (i) => {
        switch (i) {
            case 0:
                return source?.name;
            case 1:
                return destination?.name;
        }
    };

    const checkIsValid = () => {
        if (source?.name && destination?.name) setIsValid(true);
        else setIsValid(false);
    };

    const gotoRoutes = () => {
        // setSource("")
        // setDestination("")
        if (isValid) {
            navigateTo(navigation, t("SCREEN.ALL_ROUTES_SEARCH"), {
                source,
                destination,
            });
        } else setErrorText(t("ALERT.SOURCE_DESTINATION_REQUIRED"));
        setSource({});
        setDestination({});
    };

    const swap = async () => {
        let a = source;
        let b = destination;
        setSource(b);
        setDestination(a);
    };

    const refresh = async () => {
        let a = "";
        let b = "";
        setSource("");
        setDestination("");
        onSwap(a, b);
    };

    const searchPlace = (v) => {
        setSearchValue(v);
        let data = {
            search: v,
            apitype: "dropdown",
            type: "bus",
        };
        comnPost(`v2/sites`, data)
            .then((res) => {
                if (res.data.success) {
                    props.setLoader(false);
                    setPlacesList(res.data.data.data);
                } else {
                    props.setLoader(false);
                }
            })
            .catch((err) => {
                props.setLoader(false);
            });
    };

    const scrollPlace = (v, page) => {
        // props.setLoader(true)
        setSearchValue(v);
        let data = {
            search: v,
            apitype: "dropdown",
            type: "bus",
        };
        comnPost(`v2/sites?page=${page}`, data)
            .then((res) => {
                if (res.data.success) {
                    let nextUrl = res.data.data.next_page_url;
                    setPlacesList([...placesList, ...res.data.data.data]);
                    setNextPage(nextUrl[nextUrl.length - 1]);
                    props.setLoader(false);
                } else {
                    props.setLoader(false);
                }
            })
            .catch((err) => {
                props.setLoader(false);
            });
    };

    const setPlace = (place) => {
        if (fieldType == STRING.LABEL.SOURCE) {
            setSource(place);
        } else {
            setDestination(place);
        }
        setSearchValue("");
        setPlacesList([]);
    };

    const goToNext = () => {
        props.setLoader(true);
        scrollPlace(searchValue, nextPage);
    };

    const pressed = (type) => {
        searchPlace(searchValue);
        setFieldType(type);
    };

    const closeDropdown = () => {
        setPlacesList([]);
        if (fieldType == STRING.LABEL.SOURCE) {
            setSource({ name: "" });
        } else {
            setDestination({ name: "" });
        }
    };

    return (
        <KeyboardAvoidingView
            enabled
            behavior="position"
            style={{ marginVertical: 20, zIndex: 50 }}
        >
            <View style={styles.fieldsView}>
                <GlobalText
                    text={t("UNCOVER")}
                    style={styles.instructionText}
                />
                {SrcDest.map((field, index) => {
                    return (
                        <TextField
                            onPress={() => pressed(field.name)}
                            name={field.name}
                            label={field.name}
                            placeholder={field.placeholder}
                            fieldType={field.type}
                            length={field.length}
                            required={field.required}
                            disabled={
                                index == 1 &&
                                (source?.name == "" || source?.name == null)
                            }
                            value={getValue(index)}
                            setChild={(val, i) =>
                                setValue(val, i, index, field.name)
                            }
                            style={styles.searchPanelField}
                            containerStyle={styles.textContainerStyle}
                            inputContainerStyle={styles.inputContainerStyle}
                            // leftIcon={
                            //   <Ionicons
                            //     style={styles.inputBusIcon}
                            //     name="bus"
                            //     color={COLOR.grey}
                            //     size={DIMENSIONS.iconBig}
                            //     onPress={isValid ? swap : null}
                            //   />
                            // }
                        />
                    );
                })}
                <View style={styles.pannelIcons}>
                    <MaterialIcons
                        style={styles.swapIcon}
                        name="swap-vert-circle"
                        color={isValid ? COLOR.black : COLOR.grey}
                        size={DIMENSIONS.iconL}
                        onPress={isValid ? swap : null}
                    />
                    <Ionicons
                        style={styles.refreshIcon}
                        name="refresh-circle"
                        color={source?.name ? COLOR.black : COLOR.grey}
                        size={DIMENSIONS.iconL}
                        onPress={source?.name ? refresh : null}
                    />
                </View>
            </View>

            <View style={{ minHeight: 20 }}>
                {!isValid && (
                    <GlobalText text={errorText} style={styles.errorText} />
                )}
            </View>
            <TextButton
                title={t("BUTTON.SEARCH")}
                buttonView={styles.searchButtonStyle}
                titleStyle={styles.buttonTitleStyle}
                raised={false}
                onPress={gotoRoutes}
            />
            <ScrollView
                style={{
                    position: "absolute",
                    width: DIMENSIONS.bannerWidth,
                    top: 160,
                }}
                nestedScrollEnabled={true}
            >
                {placesList[0] && (
                    <SearchDropdown
                        placesList={placesList}
                        goToNext={goToNext}
                        setPlace={setPlace}
                        closeDropdown={() => closeDropdown()}
                        height={330}
                    />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
