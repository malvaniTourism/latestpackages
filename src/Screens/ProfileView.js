import {
    View,
    ScrollView,
    BackHandler,
    PermissionsAndroid,
    Platform,
    RefreshControl,
    Share,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../Components/Common/Header";
import COLOR from "../Services/Constants/COLORS";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import {
    comnPost,
    dataSync,
    saveToStorage,
} from "../Services/Api/CommonServices";
import { connect } from "react-redux";
import Loader from "../Components/Customs/Loader";
import { setLoader } from "../Reducers/CommonActions";
import { Image } from "@rneui/themed";
import styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkLogin, backPage, navigateTo } from "../Services/CommonMethods";
import GlobalText from "../Components/Customs/Text";
import TextButton from "../Components/Customs/Buttons/TextButton";
import Geolocation from "@react-native-community/geolocation";
import { Overlay } from "@rneui/themed";
import Path from "../Services/Api/BaseUrl";
import NetInfo from "@react-native-community/netinfo";
import CheckNet from "../Components/Common/CheckNet";
import { useTranslation } from "react-i18next";
import ProfileChip from "../Components/Common/ProfileChip";
import ChipOptions from "../Components/Common/ProfileViews/ChipOptions";
import ChangeLang from "../Components/Common/ProfileViews/ChangeLang";
import UpdateProfile from "../Components/Common/ProfileViews/UpdateProfile";
import ProfileChipSkeleton from "../Components/Common/ProfileChipSkeleton";
import MapContainer from "../Components/Common/MapContainer";
import MapSkeleton from "../Components/Common/MapSkeleton";
import { launchImageLibrary } from "react-native-image-picker";
import Popup from "../Components/Common/Popup";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DIMENSIONS from "../Services/Constants/DIMENSIONS";
import ComingSoon from "../Components/Common/ComingSoon";

const ProfileView = ({ navigation, route, ...props }) => {
    const { t, i18n } = useTranslation();

    const [currentLatitude, setCurrentLatitude] = useState();
    const [currentLongitude, setCurrentLongitude] = useState();
    const [locationStatus, setLocationStatus] = useState("");
    const [watchID, setWatchID] = useState("");
    const [showLocModal, setShowLocModal] = useState(false);
    const [initialRegion, setInitialRegion] = useState({});
    const [profile, setProfile] = useState([]);
    const [error, setError] = useState(null);
    const [offline, setOffline] = useState(false);
    const [option, setOption] = useState(0);
    const [imageSource, setImageSource] = useState(null);
    const [uploadImage, setUploadImage] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const [showOnlineMode, setShowOnlineMode] = useState(false);

    useEffect(() => {
        props.setLoader(true);
        const backHandler = BackHandler.addEventListener(
            t("EVENT.HARDWARE_BACK_PRESS"),
            () => backPress()
        );
        // requestLocationPermission();
        checkLogin(navigation);
        // getUserProfile();
        const unsubscribeFocus = navigation.addListener(
            t("EVENT.FOCUS"),
            () => {
                if (props.mode) getUserProfile();
            }
        );

        const unsubscribe = NetInfo.addEventListener((state) => {
            setOffline(false);
            dataSync(
                t("STORAGE.PROFILE_RESPONSE"),
                getUserProfile(),
                props.mode
            ).then((resp) => {
                let res = JSON.parse(resp);
                if (res) {
                    setProfile(res);
                    setOption(0);
                    setLocationMap(
                        res.addresses[0].latitude,
                        res.addresses[0].longitude
                    );
                    props.setLoader(false);
                    setRefreshing(false);
                } else if (resp) {
                    setOffline(true);
                }
                props.setLoader(false);
            });
            // removeFromStorage(t("STORAGE.LANDING_RESPONSE"))
        });
        return () => {
            Geolocation.clearWatch(watchID);
            backHandler.remove();
            unsubscribeFocus();
            unsubscribe();
        };
    }, [route]);

    const onRefresh = () => {
        setRefreshing(true);
        if (props.mode) {
            getUserProfile();
        } else {
            setShowOnlineMode(true);
            setRefreshing(false);
        }
    };

    const backPress = () => {
        if (option == 0) {
            backPage(navigation);
        } else {
            setOption(0);
        }
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === "ios") {
            getOneTimeLocation();
            subscribeLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: t("LOCATION_ACCESS_REQUIRED"),
                        message: t("NEEDS_TO_ACCESS"),
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //To Check, If Permission is granted
                    getOneTimeLocation();
                    subscribeLocation();
                } else {
                    setLocationStatus(t("PERMISSION_DENIED"));
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const getOneTimeLocation = () => {
        setLocationStatus(t("GETTING_LOCATION"));
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                setLocationStatus(t("YOU_ARE_HERE"));
                setInitialLocation(
                    position.coords.longitude,
                    position.coords.latitude
                );
                const currentLongitude = position.coords.longitude;
                //getting the Longitude from the location json
                const currentLatitude = position.coords.latitude;
                //getting the Latitude from the location json
                setCurrentLongitude(currentLongitude);
                //Setting state Longitude to re re-render the Longitude Text
                setCurrentLatitude(currentLatitude);
                //Setting state Latitude to re re-render the Longitude Text
            },
            (error) => {
                setLocationStatus(error.message);
            },
            { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 }
        );
    };

    const subscribeLocation = () => {
        let WatchID = Geolocation.watchPosition(
            (position) => {
                setLocationStatus(t("YOU_ARE_HERE"));
                //Will give you the location on location change
                const currentLongitude = position.coords.longitude;
                //getting the Longitude from the location json
                const currentLatitude = position.coords.latitude;
                //getting the Latitude from the location json
                setCurrentLongitude(currentLongitude);
                //Setting state Longitude to re re-render the Longitude Text
                setCurrentLatitude(currentLatitude);
                //Setting state Latitude to re re-render the Longitude Text
            },
            (error) => {
                setLocationStatus(error.message);
            },
            { enableHighAccuracy: false, maximumAge: 1000 }
        );
        setWatchID(WatchID);
    };

    const setInitialLocation = (lat, long) => {
        let myInitialRegion = {
            latitude: parseFloat(lat) || 47.4220936,
            longitude: parseFloat(long) || -122.083922,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
        setInitialRegion(myInitialRegion);
    };

    const setLocationMap = (lat, long) => {
        setInitialLocation(lat, long);
        setCurrentLatitude(parseFloat(lat));
        setCurrentLongitude(parseFloat(long));
    };

    const getUserProfile = () => {
        if (props.mode) {
            comnPost("v2/user-profile", props.access_token, navigation)
                .then((res) => {
                    if (res && res.data.data)
                        saveToStorage(
                            t("STORAGE.PROFILE_RESPONSE"),
                            JSON.stringify(res.data.data)
                        );
                    setProfile(res.data.data); // Update places state with response data
                    setOption(0);
                    setLocationMap(
                        res.data.data.addresses[0].latitude,
                        res.data.data.addresses[0].longitude
                    );
                    props.setLoader(false);
                    setRefreshing(false);
                })
                .catch((error) => {
                    setError(error.message); // Update error state with error message
                    props.setLoader(false);
                    setRefreshing(false);
                });
        }
    };

    const handleLogout = () => {
        props.setLoader(true);
        comnPost("v2/logout")
            .then((res) => {
                if (res.data.success) {
                    props.setLoader(false);
                    AsyncStorage.clear();
                    navigateTo(navigation, t("SCREEN.LANG_SELECTION"));
                }
            })
            .catch((error) => {
                props.setLoader(false);
            });
    };

    const referralClick = async () => {
        try {
            const deepLink = `awesomeapp://SignUp?code=${profile.uid}`;
            const shareMessage = `Hey! Use my TourKokan referral code ${profile.uid} to get awesome discounts. Enjoy!`;
            const shareUrl = deepLink;
            const result = await Share.share({
                message: shareMessage,
                url: shareUrl,
            });

            if (result.action === Share.sharedAction) {
                console.log("Content shared successfully");
            } else if (result.action === Share.dismissedAction) {
                console.log("Share dismissed");
            }
        } catch (error) {
            console.error("Error sharing content:", error.message);
        }
    };

    const setHomeLocation = () => {
        // Update Location
        requestLocationPermission();
        setShowLocModal(false);
    };

    const setCurrLocation = () => {
        requestLocationPermission();
        setShowLocModal(false);
    };

    const handleImageUpload = () => {
        launchImageLibrary(
            {
                mediaType: t("TYPE.PHOTO"),
                includeBase64: true, // Set to true to include base64 data
                maxHeight: 200,
                maxWidth: 200,
            },
            (response) => {
                if (response.assets) {
                    // Upload the image to the API
                    setUploadImage(
                        `data:${response.assets[0].type};base64,${response.assets[0].base64}`
                    );
                    setImageSource(response.assets[0].uri);
                }
            }
        );
    };

    return (
        <ScrollView
            style={styles.container}
            key={option}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <CheckNet isOff={offline} />
            <Header
                // style={{ backgroundColor: "transparent", zIndex: 10 }}
                name={""}
                startIcon={
                    <Ionicons
                        name="chevron-back-outline"
                        size={24}
                        onPress={() => backPress()}
                        color={COLOR.black}
                    />
                }
            />
            <Loader />

            <View style={styles.profileContainer}>
                <View style={styles.coinsView}>
                    <FontAwesome5
                        name="coins"
                        color={COLOR.yellow}
                        size={DIMENSIONS.iconSize}
                    />
                    <GlobalText text={profile.wallets_sum_amount} />
                </View>
                {imageSource ? (
                    <Image
                        source={{ uri: imageSource }}
                        style={styles.profilePhoto}
                    />
                ) : (
                    <Image
                        style={styles.profilePhoto}
                        source={{
                            uri: `${
                                profile.profile_picture
                                    ? Path.FTP_PATH + profile.profile_picture
                                    : "https://api-private.atlassian.com/users/2143ab39b9c73bcab4fe6562fff8d23d/avatar"
                            }`,
                        }}
                    />
                )}
                {option == 3 && (
                    <Octicons
                        name="pencil"
                        size={17}
                        onPress={() => handleImageUpload()}
                        color={COLOR.black}
                        style={styles.profileEdit}
                    />
                )}
                <GlobalText
                    text={profile.email}
                    style={styles.pricingOptionTitle}
                />
            </View>

            <View style={styles.headerContainer}>
                <GlobalText text={t("ADDRESS")} />
                {initialRegion.latitude ? (
                    <MapContainer
                        initialRegion={initialRegion}
                        currentLatitude={currentLatitude}
                        currentLongitude={currentLongitude}
                    />
                ) : (
                    <MapSkeleton />
                )}
            </View>

            <View style={styles.chipContainer}>
                {initialRegion.latitude ? (
                    option == 0 ? (
                        <ChipOptions
                            languageClick={() => setOption(1)}
                            locationClick={() => setShowLocModal(true)}
                            profileClick={() => setOption(3)}
                            logoutClick={() => setIsAlert(true)}
                            referralClick={() => referralClick()}
                            uid={profile.uid}
                        />
                    ) : option == 1 ? (
                        <ChangeLang
                            refreshOption={() => getUserProfile()}
                            setLoader={(v) => props.setLoader(v)}
                        />
                    ) : option == 3 ? (
                        <UpdateProfile
                            user={profile.email}
                            phone={profile.mobile}
                            uploadImage={uploadImage}
                            refreshOption={() => getUserProfile()}
                            setLoader={(v) => props.setLoader(v)}
                        />
                    ) : (
                        <ProfileChip />
                    )
                ) : (
                    <View>
                        <ProfileChipSkeleton />
                        <ProfileChipSkeleton />
                        <ProfileChipSkeleton />
                        <ProfileChipSkeleton />
                        <ProfileChipSkeleton />
                    </View>
                )}
            </View>

            <Overlay
                style={styles.locationModal}
                isVisible={showLocModal}
                onBackdropPress={() => setShowLocModal(false)}
            >
                <GlobalText
                    text={t("SET_LOCATION")}
                    style={styles.locationModal}
                />
                <View>
                    <TextButton
                        title={t("BUTTON.HOME_LOCATION")}
                        buttonView={styles.locBtnStyle}
                        titleStyle={styles.locButtonTitle}
                        raised={false}
                        onPress={setHomeLocation}
                        startIcon={
                            <Ionicons
                                name="home"
                                size={24}
                                color={COLOR.themeBlue}
                            />
                        }
                    />
                    <TextButton
                        title={t("BUTTON.CURRENT_LOCATION")}
                        buttonView={styles.locBtnStyle}
                        titleStyle={styles.locButtonTitle}
                        raised={false}
                        onPress={setCurrLocation}
                        startIcon={
                            <Ionicons
                                name="location"
                                size={24}
                                color={COLOR.themeBlue}
                            />
                        }
                    />
                </View>
            </Overlay>

            <Overlay
                style={styles.locationModal}
                isVisible={isAlert}
                onBackdropPress={() => setIsAlert(false)}
            >
                <GlobalText
                    text={t("ALERT.LOGOUT_ALERT")}
                    style={styles.locationModal}
                />
                <View style={styles.flexRow}>
                    <TextButton
                        title={t("BUTTON.NO")}
                        buttonView={styles.logoutButtonStyle}
                        titleStyle={styles.locButtonTitle}
                        raised={false}
                        onPress={() => setIsAlert(false)}
                    />
                    <TextButton
                        title={t("BUTTON.YES")}
                        buttonView={styles.logoutButtonStyle}
                        titleStyle={styles.locButtonTitle}
                        raised={false}
                        onPress={handleLogout}
                    />
                </View>
            </Overlay>
            <ComingSoon
                message={t("ONLINE_MODE")}
                visible={showOnlineMode}
                toggleOverlay={() => setShowOnlineMode(false)}
            />
        </ScrollView>
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
        setLoader: (data) => {
            dispatch(setLoader(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
