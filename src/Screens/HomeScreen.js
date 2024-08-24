import React, { useEffect, useState, useRef } from "react";
import {
    View,
    ScrollView,
    LogBox,
    BackHandler,
    KeyboardAvoidingView,
    RefreshControl,
    Keyboard,
    Platform,
    Linking,
} from "react-native";
import SearchPanel from "../Components/Common/SearchPanel";
import TopComponent from "../Components/Common/TopComponent";
import Banner from "../Components/Customs/Banner";
import styles from "./Styles";
import COLOR from "../Services/Constants/COLORS";
import Feather from "react-native-vector-icons/Feather";
import {
    comnPost,
    dataSync,
    getFromStorage,
    saveToStorage,
} from "../Services/Api/CommonServices";
import { connect } from "react-redux";
import {
    saveAccess_token,
    setLoader,
    setMode,
} from "../Reducers/CommonActions";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextButton from "../Components/Customs/Buttons/TextButton";
import { exitApp, navigateTo } from "../Services/CommonMethods";
import GlobalText from "../Components/Customs/Text";
import BottomSheet from "../Components/Customs/BottomSheet";
import LocationSheet from "../Components/Common/LocationSheet";
import RouteHeadCard from "../Components/Cards/RouteHeadCard";
import CheckNet from "../Components/Common/CheckNet";
import NetInfo from "@react-native-community/netinfo";
import RouteHeadCardSkeleton from "../Components/Cards/RouteHeadCardSkeleton";
import { Overlay, Skeleton } from "@rneui/themed";
import SearchPanelSkeleton from "../Components/Common/SearchPanelSkeleton";
import TopComponentSkeleton from "../Components/Common/TopComponentSkeleton";
import CityCardSmall from "../Components/Cards/CityCardSmall";
import CityCardSmallSkeleton from "../Components/Cards/CityCardSmallSkeleton";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import BannerSkeleton from "../Components/Customs/BannerSkeleton";
import Loader from "../Components/Customs/Loader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DIMENSIONS from "../Services/Constants/DIMENSIONS";
import ComingSoon from "../Components/Common/ComingSoon";

const HomeScreen = ({ navigation, route, ...props }) => {
    const { t, i18n } = useTranslation();
    const refRBSheet = useRef();

    const [searchValue, setSearchValue] = useState("");
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [stops, setStops] = useState([]);
    const [place_category, setPlace_category] = useState([]);
    const [places, setPlaces] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState(null);
    const [cityList, setCityList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLandingDataFetched, setIsLandingDataFetched] = useState(false);
    const [offline, setOffline] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [bannerImages, setBannerImages] = useState([
        {
            id: 1,
            name: "Angnewadi Yatra 2024",
            image: "https://c4.wallpaperflare.com/wallpaper/766/970/409/cities-city-building-cityscape-wallpaper-preview.jpg",
        },
        {
            id: 1,
            name: "Angnewadi Yatra 2024",
            image: "https://c4.wallpaperflare.com/wallpaper/631/683/713/nature-bridge-sky-city-wallpaper-preview.jpg",
        },
        {
            id: 1,
            name: "Angnewadi Yatra 2024",
            image: "https://c4.wallpaperflare.com/wallpaper/977/138/381/tbilisi-georgia-wallpaper-preview.jpg",
        },
        {
            id: 1,
            name: "Angnewadi Yatra 2024",
            image: "https://4kwallpapers.com/images/walls/thumbs_3t/912.jpg",
        },
    ]);
    const [bannerObject, setBannerObject] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState("");
    const [sindhudurg, setSindh] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const [modePopup, setModePopup] = useState(false);
    const [showOffline, setShowOffline] = useState(false);
    const [showOnlineMode, setShowOnlineMode] = useState(false);
    const [updateApp, setUpdateApp] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            (event) => {
                setKeyboardOffset(event.endCoordinates.height);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setKeyboardOffset(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // const setAppMode = async () => {
    //     let mode = await getFromStorage(t("STORAGE.MODE"))
    //     props.setMode(mode)
    // }

    useEffect(() => {
        // setAppMode();
        setIsLoading(true);
        setSindh({
            id: 0,
            name: t("CITY.SINDHUDURG"),
        });
        setCurrentCity(t("CITY.SINDHUDURG"));
        props.setLoader(true);
        AsyncStorage.setItem("isUpdated", "false");
        const backHandler = BackHandler.addEventListener(
            t("EVENT.HARDWARE_BACK_PRESS"),
            () => exitApp()
        );
        if (props.access_token) {
            if (!isLandingDataFetched && props.access_token) {
                // callLandingPageAPI();
                setIsLandingDataFetched(true);
            }
        }
        LogBox.ignoreAllLogs();
        saveToken();
        SplashScreen.hide();
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            setOffline(!state.isConnected);
            let mode = JSON.parse(await getFromStorage(t("STORAGE.MODE")));

            dataSync(
                t("STORAGE.LANDING_RESPONSE"),
                callLandingPageAPI(),
                mode
            ).then((resp) => {
                let res = JSON.parse(resp);
                if (res) {
                    setCities(res.cities);
                    setRoutes(res.routes);
                    setBannerObject(res.banners);
                    setIsFetching(false);
                    setIsLoading(false);
                    // setCategories(res.categories);
                    // setProjects(res.projects);
                    // setStops(res.stops);
                    // setPlace_category(res.place_category);
                    // setPlaces(res.places);
                } else if (resp) {
                    setOffline(true);
                    setIsFetching(false);
                    setIsLoading(false);
                }
                props.setLoader(false);
            });
            // removeFromStorage(t("STORAGE.LANDING_RESPONSE"))
        });

        return () => {
            backHandler.remove();
            // AsyncStorage.setItem(
            //     t("STORAGE.IS_FIRST_TIME"),
            //     JSON.stringify(false)
            // );
            unsubscribe();
        };
    }, [props.access_token]);

    const onRefresh = () => {
        setRefreshing(true);
        if (props.mode) {
            callLandingPageAPI();
        } else {
            setShowOnlineMode(true);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(async () => {
            if (
                (await AsyncStorage.getItem("isUpdated")) == "true" &&
                props.mode
            ) {
                setIsLoading(true);
                setCities([]);
                setRoutes([]);
                setBannerObject([]);
                props.setLoader(true);
                callLandingPageAPI();
            }
        })
    );

    const saveToken = async () => {
        props.saveAccess_token(
            await AsyncStorage.getItem(t("STORAGE.ACCESS_TOKEN"))
        );
        if (
            (await AsyncStorage.getItem(t("STORAGE.ACCESS_TOKEN"))) == null ||
            (await AsyncStorage.getItem(t("STORAGE.ACCESS_TOKEN"))) == ""
        ) {
            navigateTo(navigation, t("SCREEN.LANG_SELECTION"));
        }
    };

    const callLandingPageAPI = async (site_id) => {
        console.log("cleed");

        let isFirstTime = await AsyncStorage.getItem(
            t("STORAGE.IS_FIRST_TIME")
        );
        let mode = JSON.parse(await getFromStorage(t("STORAGE.MODE")));
        if (mode) {
            let data = {
                site_id,
            };
            props.setLoader(true);
            comnPost("v2/landingpage", data, navigation)
                .then((res) => {
                    if (res && res.data.data) {
                        setOfflineData(res.data.data);
                        i18n.changeLanguage(res.data.language);
                        setCities(res.data.data.cities);
                        setRoutes(res.data.data.routes);
                        setBannerObject(res.data.data.banners);
                        setIsFetching(false);
                        setIsLoading(false);
                        props.setLoader(false);
                        setRefreshing(false);
                        if (
                            t("APP_VERSION") <
                            res.data.data.version.version_number
                        ) {
                            setUpdateApp(true);
                        }
                        // setCategories(res.data.data.categories);
                        // setProjects(res.data.data.projects);
                        // setStops(res.data.data.stops);
                        // setPlace_category(res.data.data.place_category);
                        // setPlaces(res.data.data.places);
                    }
                    if (isFirstTime == "true") {
                        // refRBSheet.current.open()
                        setModePopup(true);
                        AsyncStorage.setItem(
                            t("STORAGE.IS_FIRST_TIME"),
                            JSON.stringify(false)
                        );
                    }
                })
                .catch((error) => {
                    setIsFetching(false);
                    setIsLoading(false);
                    props.setLoader(false);
                    setRefreshing(false);
                    setError(error.message);
                });
            AsyncStorage.setItem("isUpdated", "false");
        }
    };

    const setOfflineData = (resp) => {
        saveToStorage(t("STORAGE.LANDING_RESPONSE"), JSON.stringify(resp));
        saveToStorage(
            t("STORAGE.CATEGORIES_RESPONSE"),
            JSON.stringify(resp.categories)
        );
        saveToStorage(
            t("STORAGE.ROUTES_RESPONSE"),
            JSON.stringify(resp.routes)
        );
        saveToStorage(
            t("STORAGE.CITIES_RESPONSE"),
            JSON.stringify(resp.cities)
        );
        saveToStorage(t("STORAGE.EMERGENCY"), JSON.stringify(resp.emergencies));
        saveToStorage(t("STORAGE.QUERIES"), JSON.stringify(resp.queries));
        saveToStorage(t("STORAGE.GALLERY"), JSON.stringify(resp.gallery));
        saveToStorage(t("STORAGE.PROFILE_RESPONSE"), JSON.stringify(resp.user));
        setProfilePhoto(resp.user.profile_picture);
        AsyncStorage.setItem(t("STORAGE.USER_NAME"), resp.user.name);
        AsyncStorage.setItem(
            t("STORAGE.USER_ID"),
            JSON.stringify(resp.user.id)
        );
        AsyncStorage.setItem(t("STORAGE.USER_EMAIL"), resp.user.email);
    };

    const getRoutesList = (item) => {
        navigateTo(navigation, t("SCREEN.ROUTES_LIST"), { item });
    };

    const showMore = (page, subCat) => {
        navigateTo(navigation, page, { from: t("SCREEN.HOME"), subCat });
    };

    const onSearchFocus = () => {
        navigateTo(navigation, t("SCREEN.CITY_PLACE_SEARCH"));
    };

    const openLocationSheet = () => {
        refRBSheet.current.open();
    };

    const closeLocationSheet = () => {
        refRBSheet.current.close();
    };

    const getCityDetails = (city) => {
        navigateTo(navigation, t("SCREEN.CITY_DETAILS"), { city });
    };

    const openProfile = () => {
        setIsLoading(true);
        navigateTo(navigation, t("SCREEN.PROFILE_VIEW"));
        setIsLoading(false);
    };

    const onCitySelect = (city) => {
        setCurrentCity(city.name);
        callLandingPageAPI(city.id);
    };

    const onlineClick = () => {
        saveToStorage(t("STORAGE.MODE"), JSON.stringify(true));
        props.setMode(true);
        setModePopup(false);
    };

    const offlineClick = () => {
        saveToStorage(t("STORAGE.MODE"), JSON.stringify(false));
        props.setMode(false);
        setModePopup(false);
        setShowOffline(true);
    };

    const exitUpdate = () => {
        setUpdateApp(false);
        BackHandler.exitApp();
    };

    const continueUpdate = () => {
        setUpdateApp(false);
        Linking.openURL(t("APP_URL"));
    };

    return (
        <>
            {isLoading ? (
                <TopComponentSkeleton />
            ) : (
                <TopComponent
                    cities={[sindhudurg, ...cities]}
                    currentCity={currentCity}
                    setCurrentCity={(v) => onCitySelect(v)}
                    navigation={navigation}
                    openLocationSheet={() => openLocationSheet()}
                    gotoProfile={() => openProfile()}
                    profilePhoto={profilePhoto}
                />
            )}
            <KeyboardAwareScrollView
                extraHeight={DIMENSIONS.halfHeight}
                enableOnAndroid={true}
                stickyHeaderIndices={[0]}
                style={{ backgroundColor: COLOR.white }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <CheckNet isOff={offline} />
                {/* <MyAnimatedLoader isVisible={isLoading} /> */}
                <Loader />
                <View style={{ flex: 1, alignItems: "center" }}>
                    {isLoading ? (
                        <BannerSkeleton />
                    ) : bannerObject[0] ? (
                        <Banner bannerImages={bannerObject} />
                    ) : (
                        <Banner bannerImages={bannerImages} />
                    )}
                    {/* {CityName.map((field, index) => {
                            return (
                                <SearchBar
                                    style={styles.homeSearchBar}
                                    placeholder={field.placeholder}
                                    value={searchValue}
                                    onFocus={onSearchFocus}
                                />
                            );
                        })} */}
                    <KeyboardAvoidingView
                        style={{ marginTop: 25, zIndex: 10 }}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={keyboardOffset}
                    >
                        {isLoading ? (
                            <SearchPanelSkeleton />
                        ) : (
                            <SearchPanel
                                route={route}
                                navigation={navigation}
                                from={t("SCREEN.HOME")}
                            />
                        )}
                    </KeyboardAvoidingView>
                    <View style={styles.headerContainer}>
                        <View>
                            {isLoading ? (
                                <View style={styles.flexAroundSkeleton}>
                                    <Skeleton
                                        animation="pulse"
                                        variant="text"
                                        style={{ width: 100, height: 30 }}
                                    />
                                    <Skeleton
                                        animation="pulse"
                                        variant="text"
                                        style={{ width: 100, height: 30 }}
                                    />
                                </View>
                            ) : (
                                <View style={styles.flexAround}>
                                    <GlobalText
                                        text={t("ROUTES")}
                                        style={styles.sectionTitle}
                                    />
                                    <TextButton
                                        title={t("BUTTON.SEE_ALL")}
                                        onPress={() =>
                                            showMore(
                                                t("SCREEN.ALL_ROUTES_SEARCH")
                                            )
                                        }
                                        buttonView={styles.buttonView}
                                        titleStyle={styles.titleStyle}
                                    />
                                </View>
                            )}
                        </View>
                        <View style={styles.cardsWrap}>
                            {isLoading ? (
                                <>
                                    <RouteHeadCardSkeleton />
                                    <RouteHeadCardSkeleton />
                                    <RouteHeadCardSkeleton />
                                </>
                            ) : (
                                routes.map(
                                    (route, index) =>
                                        route && (
                                            <RouteHeadCard
                                                data={route}
                                                bus={"Hirkani"}
                                                cardClick={() =>
                                                    getRoutesList(route)
                                                }
                                            />
                                        )
                                )
                            )}
                        </View>
                    </View>

                    <View style={styles.sectionView}>
                        <View style={{ marginTop: 20 }}>
                            {isLoading ? (
                                <Skeleton
                                    animation="pulse"
                                    variant="text"
                                    style={styles.buttonSkeleton}
                                />
                            ) : (
                                <View style={styles.flexAround}>
                                    <GlobalText
                                        text={t("CITIES")}
                                        style={styles.sectionTitle}
                                    />
                                    <TextButton
                                        title={t("BUTTON.SEE_ALL")}
                                        onPress={() =>
                                            showMore(
                                                t("SCREEN.CITY_LIST"),
                                                "city"
                                            )
                                        }
                                        buttonView={styles.buttonView}
                                        titleStyle={styles.titleStyle}
                                    />
                                </View>
                            )}
                        </View>
                        <ScrollView horizontal style={{ marginLeft: 5 }}>
                            {isLoading ? (
                                <>
                                    <CityCardSmallSkeleton />
                                    <CityCardSmallSkeleton />
                                    <CityCardSmallSkeleton />
                                </>
                            ) : (
                                cities.map((city, index) => (
                                    <CityCardSmall
                                        data={city}
                                        reload={() => {
                                            callLandingPageAPI();
                                        }}
                                        navigation={navigation}
                                        onClick={() => getCityDetails(city)}
                                    />
                                ))
                            )}
                        </ScrollView>
                        {isLoading ? (
                            <Skeleton
                                animation="pulse"
                                variant="text"
                                style={styles.buttonSkeleton}
                            />
                        ) : (
                            <TextButton
                                title={t("BUTTON.SEE_MORE")}
                                onPress={() =>
                                    showMore(t("SCREEN.CITY_LIST"), "city")
                                }
                                containerStyle={styles.showMore}
                                buttonView={styles.buttonView}
                                buttonStyle={styles.buttonStyle}
                                titleStyle={styles.titleStyle}
                                endIcon={
                                    <Feather
                                        name="chevrons-right"
                                        size={24}
                                        color={COLOR.themeBlue}
                                    />
                                }
                            />
                        )}
                    </View>
                </View>
                <BottomSheet
                    refRBSheet={refRBSheet}
                    height={300}
                    Component={
                        <LocationSheet
                            setCurrentCity={(name) => setCurrentCity(name)}
                            openLocationSheet={() => openLocationSheet()}
                            closeLocationSheet={() => closeLocationSheet()}
                        />
                    }
                    openLocationSheet={() => openLocationSheet()}
                    closeLocationSheet={() => closeLocationSheet()}
                />

                <Overlay
                    style={styles.locationModal}
                    isVisible={modePopup}
                    onBackdropPress={() => setModePopup(false)}
                >
                    <GlobalText
                        text={t("ALERT.MODE_CHOICE")}
                        style={styles.locationModal}
                    />
                    <View style={styles.flexRow}>
                        <TextButton
                            title={t("BUTTON.OFFLINE")}
                            buttonView={styles.logoutButtonStyle}
                            titleStyle={styles.locButtonTitle}
                            raised={false}
                            onPress={() => offlineClick()}
                        />
                        <TextButton
                            title={t("BUTTON.ONLINE")}
                            buttonView={styles.logoutButtonStyle}
                            titleStyle={styles.locButtonTitle}
                            raised={false}
                            onPress={() => onlineClick()}
                        />
                    </View>
                </Overlay>
                <Overlay style={styles.locationModal} isVisible={updateApp}>
                    <GlobalText
                        text={t("ALERT.APP_VERSION")}
                        style={styles.locationModal}
                    />
                    <View style={styles.flexRow}>
                        <TextButton
                            title={t("BUTTON.NO")}
                            buttonView={styles.logoutButtonStyle}
                            titleStyle={styles.locButtonTitle}
                            raised={false}
                            onPress={() => exitUpdate()}
                        />
                        <TextButton
                            title={t("BUTTON.CONTINUE")}
                            buttonView={styles.logoutButtonStyle}
                            titleStyle={styles.locButtonTitle}
                            raised={false}
                            onPress={() => continueUpdate()}
                        />
                    </View>
                </Overlay>
                <ComingSoon
                    message={t("OFFLINE_MODE")}
                    visible={showOffline}
                    toggleOverlay={() => setShowOffline(false)}
                />
                <ComingSoon
                    message={t("ONLINE_MODE")}
                    visible={showOnlineMode}
                    toggleOverlay={() => setShowOnlineMode(false)}
                />
            </KeyboardAwareScrollView>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        access_token: state.commonState.access_token,
        mode: state.commonState.mode,
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
            dispatch(setMode(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
