import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    FlatList,
    View,
    Linking,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from "react-native";
import { ListItem } from "@rneui/themed";
import Header from "../../Components/Common/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import COLOR from "../../Services/Constants/COLORS";
import {
    backPage,
    checkLogin,
    goBackHandler,
    navigateTo,
} from "../../Services/CommonMethods";
import TextButton from "../../Components/Customs/Buttons/TextButton";
import styles from "./Styles";
import {
    comnPost,
    dataSync,
    saveToStorage,
} from "../../Services/Api/CommonServices";
import Loader from "../../Components/Customs/Loader";
import { setLoader } from "../../Reducers/CommonActions";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import CheckNet from "../../Components/Common/CheckNet";
import NetInfo from "@react-native-community/netinfo";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import GlobalText from "../../Components/Customs/Text";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import ContactUs from "../ContactUs";
import ComingSoon from "../../Components/Common/ComingSoon";

const QueriesList = ({ navigation, route, ...props }) => {
    const { t } = useTranslation();
    const isMounted = useRef(true);

    const [data, setData] = useState([]);
    const [offline, setOffline] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // New state to track if there's more data
    const [refreshing, setRefreshing] = useState(false);
    const [step, setStep] = useState(0);
    const [showOnlineMode, setShowOnlineMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        const backHandler = goBackHandler(navigation);
        checkLogin(navigation);
        props.setLoader(true);
        setData([]);

        if (props.access_token) {
            fetchData(1, true);
        }

        const unsubscribe = NetInfo.addEventListener((state) => {
            setOffline(!state.isConnected);
            dataSync(t("STORAGE.QUERIES"), fetchData(1, true), props.mode).then(
                (resp) => {
                    let res = JSON.parse(resp);
                    if (res) {
                        setData(res);
                    }
                }
            );
            props.setLoader(false);
        });

        return () => {
            backHandler.remove();
            unsubscribe();
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        fetchData(1, true);
    }, [step]);

    const onRefresh = () => {
        setRefreshing(true);
        if (props.mode) {
            fetchData(1, true);
        } else {
            setShowOnlineMode(true);
            setErrorMessage(t("ONLINE_MODE"));
            setRefreshing(false);
        }
    };

    const fetchData = (page, reset = false) => {
        if (props.mode) {
            // if (loading || !hasMore) {
            //     setRefreshing(false);
            //     return;
            // }
            props.setLoader(true);
            setLoading(true);
            comnPost("v2/getQueries")
                .then((res) => {
                    if (res && res.data.data) {
                        if (reset) {
                            setData(res.data.data.data);
                        } else {
                            setData((prevData) => [
                                ...prevData,
                                ...res.data.data.data,
                            ]);
                        }
                        setHasMore(!!res.data.data.next_page_url); // Check if there's more data
                        setNextPage(page + 1);
                        saveToStorage(
                            t("STORAGE.QUERIES"),
                            JSON.stringify(res.data.data.data)
                        );
                        props.setLoader(false);
                    }
                    if (isMounted.current) {
                        setLoading(false);
                    }
                    setRefreshing(false);
                    props.setLoader(false);
                })
                .catch((error) => {
                    if (isMounted.current) {
                        setLoading(false);
                        setRefreshing(false);
                        props.setLoader(false);
                    }
                });
        }
    };

    const loadMoreData = () => {
        if (!props.mode) {
            setErrorMessage(t("GET_MORE_DATA"));
            setShowOnlineMode(true);
        } else if (!loading && hasMore) {
            fetchData(nextPage);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <ListItem bottomDivider>
                <ListItem.Content
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        minWidth: DIMENSIONS.halfWidth + 50,
                    }}
                >
                    <ListItem.Title>{item.message}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Content
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                >
                    {item.status == "unread" ? (
                        <Entypo
                            name="check"
                            color={COLOR.grey}
                            size={DIMENSIONS.iconSize}
                        />
                    ) : item.status == "read" ? (
                        <Entypo
                            name="check"
                            color={COLOR.themeComicBlue}
                            size={DIMENSIONS.iconSize}
                        />
                    ) : (
                        <Feather
                            name="check-circle"
                            color={COLOR.yellow}
                            size={DIMENSIONS.iconSize}
                        />
                    )}
                </ListItem.Content>
            </ListItem>
        );
    };

    const renderFooter = () => {
        if (!loading || !hasMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={COLOR.primary} />
            </View>
        );
    };

    return (
        <>
            <Header
                name={t("HEADER.CONTACT_US")}
                goBack={() => backPage(navigation)}
                startIcon={
                    <Ionicons
                        name="chevron-back-outline"
                        size={24}
                        onPress={() => backPage(navigation)}
                        color={COLOR.black}
                    />
                }
                endIcon={
                    step == 0 && (
                        <TouchableOpacity onPress={() => setStep(1)}>
                            <GlobalText text={"Add Query"} />
                        </TouchableOpacity>
                    )
                }
            />
            <ScrollView
                style={{ flex: 1, marginTop: -19 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Loader />
                <CheckNet isOff={offline} />
                {step == 0 ? (
                    data[0] ? (
                        <FlatList
                            keyExtractor={(item) => item.id?.toString()}
                            data={data}
                            renderItem={renderItem}
                            onEndReached={loadMoreData}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            style={{ marginBottom: 30 }}
                        />
                    ) : (
                        <View
                            style={{
                                height: DIMENSIONS.screenHeight,
                                alignItems: "center",
                                padding: 50,
                            }}
                        >
                            <GlobalText
                                style={{ fontWeight: "bold" }}
                                text={offline ? t("NO_INTERNET") : t("NO_DATA")}
                            />
                        </View>
                    )
                ) : (
                    <ContactUs setStep={setStep} />
                )}
                <ComingSoon
                    message={errorMessage}
                    visible={showOnlineMode}
                    toggleOverlay={() => setShowOnlineMode(false)}
                />
            </ScrollView>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
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

export default connect(mapStateToProps, mapDispatchToProps)(QueriesList);
