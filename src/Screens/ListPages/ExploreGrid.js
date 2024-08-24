import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    Dimensions,
} from "react-native";
import { ResponsiveGrid } from "react-native-flexible-grid";
import FastImage from "react-native-fast-image";
import ImageViewing from "react-native-image-viewing";
import styles from "./Styles";
import Path from "../../Services/Api/BaseUrl";
import {
    comnPost,
    dataSync,
    saveToStorage,
} from "../../Services/Api/CommonServices";
import Loader from "../../Components/Customs/Loader";
import { checkLogin, goBackHandler } from "../../Services/CommonMethods";
import CheckNet from "../../Components/Common/CheckNet";
import NetInfo from "@react-native-community/netinfo";
import { connect } from "react-redux";
import {
    setDestination,
    setLoader,
    setSource,
} from "../../Reducers/CommonActions";
import Header from "../../Components/Common/Header";
import Search from "../../Components/Customs/Search";
import { useTranslation } from "react-i18next";
import GlobalText from "../../Components/Customs/Text";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import ExploreGridSkeleton from "./ExploreGridSkeleton";
import ComingSoon from "../../Components/Common/ComingSoon";

const { height: screenHeight } = Dimensions.get("window");

const ExploreGrid = ({ route, navigation, ...props }) => {
    const { t } = useTranslation();
    const [gallery, setGallery] = useState([]);
    const [offline, setOffline] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showOnlineMode, setShowOnlineMode] = useState(false);

    useEffect(() => {
        const backHandler = goBackHandler(navigation);
        checkLogin(navigation);
        setLoading(true);

        const unsubscribe = NetInfo.addEventListener((state) => {
            setOffline(!state.isConnected);
            dataSync(t("STORAGE.GALLERY"), fetchData(1, true), props.mode).then(
                (resp) => {
                    let res = JSON.parse(resp);
                    if (res) {
                        const newGallery = res;
                        setGallery(newGallery);
                        FastImage.preload(
                            newGallery.map((image) => ({
                                uri: Path.FTP_PATH + image.path,
                            }))
                        );
                    }
                    props.setLoader(false);
                    setLoading(false);
                }
            );
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        fetchData(1, true);
    }, [searchValue]);

    const fetchData = (page, reset = false) => {
        if (props.mode) {
            if (loading || (page > currentPage && page > lastPage)) return;

            setLoading(true);
            const data = {
                apitype: "list",
                global: 1,
                search: searchValue,
                per_page: 20,
                page: page,
            };
            comnPost(`v2/getGallery`, data)
                .then((res) => {
                    if (res.data.success) {
                        props.setLoader(false);
                        const newGallery = res.data.data.data;
                        if (reset) {
                            setGallery(newGallery);
                            saveToStorage(
                                t("STORAGE.GALLERY"),
                                JSON.stringify(newGallery)
                            );
                        } else {
                            setGallery((prevGallery) => [
                                ...prevGallery,
                                ...newGallery,
                            ]);
                        }
                        setCurrentPage(res.data.data.current_page);
                        setLastPage(res.data.data.last_page);
                        FastImage.preload(
                            newGallery.map((image) => ({
                                uri: Path.FTP_PATH + image.path,
                            }))
                        );
                    }
                    setLoading(false);
                    setRefreshing(false);
                })
                .catch((err) => {
                    props.setLoader(false);
                    setLoading(false);
                    setRefreshing(false);
                });
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (props.mode) {
            fetchData(1, true);
        } else {
            setShowOnlineMode(true);
            setRefreshing(false);
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
        setLastPage(1);
    };

    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const offsetY = event.nativeEvent.contentOffset.y;
        const scrollHeight = event.nativeEvent.layoutMeasurement.height;

        if (
            contentHeight - (scrollHeight + offsetY) < 100 &&
            !loading &&
            currentPage < lastPage
        ) {
            fetchData(currentPage + 1);
        }
    };

    const openImageViewer = (image) => {
        setSelectedImage(image);
        setIsModalVisible(true);
    };

    const closeImageViewer = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => openImageViewer(item)}
            activeOpacity={0.7} // Improved touch responsiveness
        >
            <View style={styles.imageGridBoxContainer}>
                <FastImage
                    source={{ uri: Path.FTP_PATH + item.path }}
                    style={styles.imageGridBox}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (loading && gallery.length) {
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            );
        }
        return null;
    };

    const imageIndex = gallery.findIndex((img) => img.id === selectedImage?.id);

    return (
        <>
            <Header
                Component={
                    <Search
                        style={styles.homeSearchBar}
                        placeholder={t("Search")}
                        value={searchValue}
                        onChangeText={handleSearch}
                    />
                }
            />
            <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <CheckNet isOff={offline} />
                {loading && !gallery.length ? (
                    <ExploreGridSkeleton />
                ) : gallery.length ? (
                    <ResponsiveGrid
                        maxItemsPerColumn={3}
                        data={gallery}
                        renderItem={renderItem}
                        showScrollIndicator={false}
                        style={{ padding: 5, marginBottom: 70 }}
                        keyExtractor={(item) => item.id.toString()}
                        ListFooterComponent={renderFooter}
                    />
                ) : (
                    <View
                        style={{
                            height: screenHeight,
                            alignItems: "center",
                            padding: 50,
                        }}
                    >
                        <GlobalText
                            style={{ fontWeight: "bold" }}
                            text={offline ? t("NO_INTERNET") : t("NO_DATA")}
                        />
                    </View>
                )}
                {selectedImage && (
                    <ImageViewing
                        images={gallery.map((image) => ({
                            uri: Path.FTP_PATH + image.path,
                        }))}
                        imageIndex={imageIndex}
                        visible={isModalVisible}
                        onRequestClose={closeImageViewer}
                    />
                )}
                <ComingSoon
                    message={t("ONLINE_MODE")}
                    visible={showOnlineMode}
                    toggleOverlay={() => setShowOnlineMode(false)}
                />
            </ScrollView>
        </>
    );
};

const mapStateToProps = (state) => ({
    source: state.commonState.source,
    mode: state.commonState.mode,
});

const mapDispatchToProps = (dispatch) => ({
    setSource: (data) => dispatch(setSource(data)),
    setDestination: (data) => dispatch(setDestination(data)),
    setLoader: (data) => dispatch(setLoader(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExploreGrid);
