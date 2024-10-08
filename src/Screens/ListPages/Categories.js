import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, FlatList, RefreshControl } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLOR from "../../Services/Constants/COLORS";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import {
    comnPost,
    dataSync,
    getFromStorage,
    saveToStorage,
} from "../../Services/Api/CommonServices";
import { connect } from "react-redux";
import { setLoader } from "../../Reducers/CommonActions";
import Loader from "../../Components/Customs/Loader";
import styles from "../Styles";
import Header from "../../Components/Common/Header";
import {
    backPage,
    checkLogin,
    goBackHandler,
    navigateTo,
} from "../../Services/CommonMethods";
import GlobalText from "../../Components/Customs/Text";
import NetInfo from "@react-native-community/netinfo";
import CheckNet from "../../Components/Common/CheckNet";
import ImageButton from "../../Components/Customs/Buttons/ImageButton";
import SubCatCard from "../../Components/Cards/SubCatCard";
import ImageButtonSkeleton from "../../Components/Customs/Buttons/ImageButtonSkeleton";
import { useTranslation } from "react-i18next";
import Accordion from "../../Components/Customs/Accordian";
import ComingSoon from "../../Components/Common/ComingSoon";

const Categories = ({ route, navigation, ...props }) => {
    const { t } = useTranslation();
    const refRBSheet = useRef();

    const [places, setPlaces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isEnabled, setIsEnabled] = useState(
        route.name == t("SCREEN.CATEGORIES")
    );
    const [isLandingDataFetched, setIsLandingDataFetched] = useState(false);
    const [nextPage, setNextPage] = useState(1);
    const [offline, setOffline] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showOnlineMode, setShowOnlineMode] = useState(false);

    useEffect(() => {
        props.setLoader(true);
        const backHandler = goBackHandler(navigation);
        checkLogin(navigation);
        setIsLoading(true);

        const unsubscribe = NetInfo.addEventListener((state) => {
            setOffline(false);

            dataSync(
                t("STORAGE.CATEGORIES_RESPONSE"),
                getCategories(),
                props.mode
            ).then((resp) => {
                if (resp) {
                    setCategories(cats);
                    setSelectedCategory(cats[0].name);
                    setSelectedSubCategory(cats[0].sub_categories);
                } else if (resp) {
                    setOffline(true);
                }
                props.setLoader(false);
            });
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        if (props.mode) {
            getCategories();
        } else {
            setShowOnlineMode(true);
            setRefreshing(false);
        }
    };

    const getCategories = async () => {
        setIsLoading(true);
        let cat = await getFromStorage(t("STORAGE.CATEGORIES_RESPONSE"));
        let cats = JSON.parse(cat);
        setCategories(cats);
        setSelectedCategory(cats[0].name);
        setSelectedSubCategory(cats[0].sub_categories);
        // setSelectedSubCategory(cats[0].sub_categories)
        setIsLoading(false);
        props.setLoader(false);
        setRefreshing(false);
        return cats;
    };

    const handleCategoryPress = (category) => {
        setSelectedCategory(category.name);
        setSelectedSubCategory(
            categories.find((item) => item.name === category.name)
                .sub_categories
        );
    };

    const renderItem = ({ item }) => {
        return <SubCatCard data={item} onClick={() => goToSubCats(item)} />;
    };

    const goToSubCats = (subCat) => {
        navigateTo(navigation, t("SCREEN.CITY_LIST"), { subCat });
    };

    return (
        <>
            <Header
                name={t("SCREEN.CATEGORIES")}
                startIcon={
                    <Ionicons
                        name="chevron-back-outline"
                        color={COLOR.black}
                        size={DIMENSIONS.userIconSize}
                        onPress={() => backPage(navigation)}
                    />
                }
            />
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: COLOR.themeComicBlueULight,
                    marginTop: -20,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Loader />
                <CheckNet isOff={offline} />
                {/* <View style={styles.horizontalCategoriesScroll}>
                <ScrollView horizontal style={styles.categoriesButtonScroll}>
                    {isLoading ? (
                        <>
                            <ImageButtonSkeleton />
                            <ImageButtonSkeleton />
                            <ImageButtonSkeleton />
                            <ImageButtonSkeleton />
                            <ImageButtonSkeleton />
                        </>
                    ) : (
                        categories.map((category) => (
                            <ImageButton
                                key={category.id}
                                icon={"bus"}
                                onPress={() => handleCategoryPress(category)}
                                isSelected={selectedCategory === category.name}
                                image={category.icon}
                                imageButtonCircle={
                                    styles.categoriesCircleButton
                                }
                                buttonIcon={styles.catIconStyle}
                                text={
                                    <GlobalText
                                        text={category.name}
                                        style={styles.categoryButtonText}
                                    />
                                }
                            />
                        ))
                    )}
                </ScrollView>
            </View> */}

                <View style={styles.subCatContainer}>
                    {/* <View>
                    <GlobalText
                        text={t("HEADER.CLASSIFICATIONS")}
                        style={styles.subCatHeader}
                    />
                </View>
                <View style={styles.subCatView}>
                    <View style={styles.verticalNameContainer}>
                        <GlobalText
                            text={selectedCategory}
                            style={styles.verticalName}
                        />
                    </View>
                    <View style={styles.subCatCardsContainer}>
                        <FlatList
                            keyExtractor={(item) => item.id}
                            data={selectedSubCategory}
                            renderItem={renderItem}
                            numColumns={2}
                        />
                    </View>
                </View> */}
                    <Accordion data={categories} navigation={navigation} />
                </View>
                <ComingSoon
                    message={t("ONLINE_MODE")}
                    visible={showOnlineMode}
                    toggleOverlay={() => setShowOnlineMode(false)}
                />
            </ScrollView>
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
        setLoader: (data) => {
            dispatch(setLoader(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
