import { StyleSheet } from "react-native";
import DIMENSIONS from "../Services/Constants/DIMENSIONS";
import COLOR from "../Services/Constants/COLORS";

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR.white,
    },
    homeSearchBar: {
        // marginTop: -15,
    },
    cityListView: {
        zIndex: 1,
        position: "absolute",
        top: 240,
        width: DIMENSIONS.bannerWidth,
    },
    sectionView: {
        alignItems: "center",
        marginTop: 25,
        zIndex: 10,
    },
    routeHeadCard: {
        marginVertical: 10,
    },
    stopsSectionView: {
        margin: DIMENSIONS.sectionGap,
        paddingVertical: DIMENSIONS.sectionGap,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLOR.headingColor,
        borderRadius: DIMENSIONS.borderRadiusSmall,
        backgroundColor: COLOR.yellowLight,
    },
    stopsCard: {
        width: DIMENSIONS.screenWidth / 2 - 45,
        shadowColor: COLOR.headingColor2,
    },
    routesCard: {
        width: DIMENSIONS.bannerWidth - 30,
        shadowColor: COLOR.headingColor2,
    },
    placesList: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: DIMENSIONS.headerTextSize,
        color: COLOR.black,
    },
    cardsWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
    },
    contactButtonStyle: {
        backgroundColor: COLOR.themeBlue,
        width: "auto",
        paddingVertical: 13,
    },
    contactButtonContainer: {
        // marginTop: 15,
    },
    fieldTitle: {
        textAlign: "left",
        marginTop: 10,
        marginLeft: 10,
        marginBottom: -10,
        fontWeight: "500",
    },
    containerStyle: {
        borderWidth: 1,
        padding: 10,
        borderColor: COLOR.themeBlue,
        borderRadius: DIMENSIONS.borderRadiusXS,
        marginVertical: 7,
    },
    inputContainerStyle: {
        borderColor: COLOR.transparent,
        marginBottom: 10,
    },
    profileContainerStyle: {
        borderColor: COLOR.transparent,
        marginBottom: 20,
    },
    titleStyle: {
        color: COLOR.themeBlue,
    },
    locButtonTitle: {
        color: COLOR.white,
    },
    buttonSkeleton: {
        width: DIMENSIONS.bannerWidth / 2,
        height: 50,
        marginVertical: 10,
        borderRadius: DIMENSIONS.borderRadiusXS,
        alignSelf: "flex-end",
        marginLeft: DIMENSIONS.bannerWidth / 2,
    },
    locBtnStyle: {
        width: DIMENSIONS.bannerWidth,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    profileImageView: {
        height: DIMENSIONS.bannerWidth - 90,
        marginTop: -75,
        borderRadius: DIMENSIONS.borderRadius,
        padding: 3,
    },
    profileImage: {
        // aspectRatio: 1,
        height: DIMENSIONS.bannerWidth - 90,
        resizeMode: "contain",
        // width: "100%",
    },
    handPointer: {
        height: DIMENSIONS.bannerWidth - 90,
        width: DIMENSIONS.screenWidth,
        position: "absolute",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 16,
    },
    profileDetails: {
        padding: 15,
        alignItems: "center",
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    flexAround: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: DIMENSIONS.bannerWidth,
        marginVertical: -20,
    },
    flexAroundSkeleton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: DIMENSIONS.bannerWidth,
        marginVertical: 10,
    },
    prjImgContainer: {
        marginBottom: 20,
        width: DIMENSIONS.screenWidth,
    },
    categoryBack: {
        marginTop: -20,
        height: DIMENSIONS.bannerHeight,
    },
    categoryBackImageStyle: {
        opacity: 0.7,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLOR.black,
    },
    categoryImageDetails: {
        height: DIMENSIONS.bannerHeight,
        width: DIMENSIONS.bannerWidth,
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    catTitle: {
        color: COLOR.white,
        fontWeight: "bold",
        fontSize: DIMENSIONS.headerTextSize,
        textAlign: "center",
    },
    catSubTitle: {
        color: COLOR.white,
        fontSize: DIMENSIONS.subtitleTextSize,
        textAlign: "center",
    },
    pricingView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    pricingCard: {
        margin: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLOR.grey,
        borderRadius: DIMENSIONS.borderRadiusXXS,
    },
    profileEdit: {
        left: 80,
        top: -30,
    },
    pricingOptionTitle: {
        fontSize: DIMENSIONS.largeText,
        fontWeight: "bold",
        marginBottom: 10,
    },
    pricingOptionPrice: {
        fontSize: DIMENSIONS.headerTextSize,
        color: COLOR.lightBlack,
        marginBottom: 10,
    },
    pricingOptionDescription: {
        fontSize: 14,
        color: COLOR.greySolid,
        marginBottom: 10,
    },
    pricingOptionFeatures: {
        marginBottom: 10,
    },
    pricingOptionFeature: {
        fontSize: 14,
        color: COLOR.greyDark,
    },
    pricingOptionButton: {
        fontSize: 14,
        color: COLOR.white,
        padding: 10,
    },
    planButtonContainer: {
        width: "auto",
    },
    headerContainer: {
        alignItems: "center",
    },
    chipContainer: {
        alignItems: "center",
    },
    coverPhoto: {
        width: "100%",
        height: 200,
    },
    profileContainer: {
        alignItems: "center",
        zIndex: 10,
        marginTop: -30,
    },
    profilePhoto: {
        width: DIMENSIONS.detailsImage,
        height: DIMENSIONS.detailsImage,
        borderRadius: DIMENSIONS.borderRadiusXL,
    },
    bioContainer: {
        padding: 15,
    },
    statsContainer: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 20,
    },
    statContainer: {
        alignItems: "center",
        flex: 1,
    },
    statCount: {
        fontSize: DIMENSIONS.largeText,
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: DIMENSIONS.subtitleTextSize,
        color: COLOR.greyDark,
    },
    editButtonContainer: {
        alignSelf: "center",
        width: DIMENSIONS.halfWidth - 20,
    },
    editButtonStyle: {
        width: DIMENSIONS.halfWidth - 20,
    },
    editSeeMoreStyle: {
        borderRadius: 0,
        borderTopLeftRadius: DIMENSIONS.borderRadius,
        borderBottomLeftRadius: DIMENSIONS.borderRadius,
    },
    updateSeeMoreStyle: {
        borderRadius: 0,
        borderTopRightRadius: DIMENSIONS.borderRadius,
        borderBottomRightRadius: DIMENSIONS.borderRadius,
    },
    seeMoreContainer: {
        alignSelf: "flex-end",
        width: DIMENSIONS.halfWidth / 2,
        marginRight: 25,
    },
    seeButtonStyle: {
        width: DIMENSIONS.halfWidth / 2,
    },
    seeCitiesContainer: {
        alignSelf: "flex-end",
        width: DIMENSIONS.halfWidth,
        backgroundColor: COLOR.transparent,
    },
    seeCitiesButtonStyle: {
        width: DIMENSIONS.halfWidth,
        backgroundColor: COLOR.transparent,
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    citiesButtonTitleStyle: {
        color: COLOR.themeBlue,
        textAlign: "right",
    },
    containerHome: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    boldTextHome: {
        fontSize: 25,
        color: "red",
        marginVertical: 16,
    },
    containerMap: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    mapStyle: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    locationModal: {
        padding: 10,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: DIMENSIONS.headerTextSize,
    },
    roleDropDown: {
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderColor: COLOR.grey,
        borderRadius: DIMENSIONS.borderRadius,
    },
    buttonView: {
        borderRadius: DIMENSIONS.borderRadius,
        marginVertical: 10,
        fontSize: DIMENSIONS.subtitleTextSize,
        backgroundColor: COLOR.transparent,
        elevation: 0,
        width: DIMENSIONS.halfWidth,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    profileButtonStyle: {
        backgroundColor: COLOR.themeBlue,
        width: "auto",
        paddingVertical: 13,
    },
    horizontalCategoriesScroll: {
        minHeight: DIMENSIONS.iconXXL,
        marginTop: -10,
        marginBottom: 10,
    },
    categoriesButtonScroll: {
        flexDirection: "row",
    },
    categoriesCircleButton: {
        borderRadius: DIMENSIONS.borderRadiusLarge,
    },
    categoryButtonText: {
        fontSize: DIMENSIONS.textSizeSmall,
    },
    subCatContainer: {
        minHeight: DIMENSIONS.screenHeight,
    },
    subCatHeader: {
        textAlign: "left",
        margin: 15,
        fontWeight: "bold",
        color: COLOR.labelActiveColor,
        fontSize: DIMENSIONS.headerTextSize,
    },
    subCatView: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 300,
    },
    verticalNameContainer: {
        height: DIMENSIONS.screenHeight,
        flex: 1,
    },
    verticalName: {
        transform: [{ rotate: "270deg" }],
        fontWeight: "bold",
        color: COLOR.labelActiveColor,
        fontSize: DIMENSIONS.xlText,
        letterSpacing: 7,
        width: DIMENSIONS.screenHeight / 3,
        left: -DIMENSIONS.screenWidth / 4,
        top: DIMENSIONS.screenHeight / 4,
    },
    subCatCardsContainer: {
        flex: 3,
        overflow: "scroll",
    },
    routesSearchPanelView: {
        alignItems: "center",
        zIndex: 20,
        alignSelf: "center",
    },
    slide: {
        height: DIMENSIONS.screenHeight,
        width: DIMENSIONS.screenWidth,
    },
    title: {
        fontSize: DIMENSIONS.xlText,
        color: COLOR.themeBlue,
        fontWeight: "bold",
        alignSelf: "center",
        position: "absolute",
        zIndex: 10,
    },
    introLogo: {
        height: DIMENSIONS.iconLarge,
        width: DIMENSIONS.iconCard,
        // height: DIMENSIONS.iconXL,
        // width: DIMENSIONS.iconXL,
        resizeMode: "contain",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        top: -15,
    },
    image: {
        height: DIMENSIONS.screenHeight,
        width: DIMENSIONS.screenWidth,
    },
    text: {
        color: COLOR.black,
        alignSelf: "center",
        fontWeight: "bold",
        top: -200,
        fontSize: DIMENSIONS.subtitleTextSize,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLOR.themeComicBlueULight,
    },
    eyeIcon: {
        position: "absolute",
        left: -40,
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: COLOR.themeBlue,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    catIconStyle: {
        height: DIMENSIONS.iconXXL - 20,
        width: DIMENSIONS.iconXXL - 20,
        borderRadius: DIMENSIONS.borderRadiusLarge,
        resizeMode: "cover",
    },
    buttonTitle: {
        color: COLOR.white,
    },
    searchButtonStyle: {
        height: 50,
        width: DIMENSIONS.bannerWidth / 3,
        backgroundColor: COLOR.themeBlue,
        borderRadius: DIMENSIONS.borderRadiusXS,
        alignSelf: "flex-end",
        marginRight: 20,
    },
    buttonTitleStyle: {
        color: COLOR.white,
        fontWeight: "bold",
    },
    attachmentButtonStyle: {
        height: 50,
        width: DIMENSIONS.bannerWidth / 2,
        backgroundColor: COLOR.white,
        borderRadius: DIMENSIONS.borderRadiusXS,
        alignSelf: "flex-start",
        elevation: 0,
        marginLeft: 10,
    },
    logoutButtonStyle: {
        width: DIMENSIONS.bannerWidth / 2 - 30,
        borderRadius: DIMENSIONS.borderRadiusXS,
        alignSelf: "flex-start",
        elevation: 10,
        marginLeft: 10,
    },
    attachmentTitleStyle: {
        color: COLOR.themeBlue,
    },
    advStyle: {
        color: COLOR.red,
    },
    callButton: {
        width: 30,
        backgroundColor: COLOR.white,
        elevation: 0,
        marginRight: 10,
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        height: DIMENSIONS.screenHeight,
        width: DIMENSIONS.screenWidth,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    appName: {
        zIndex: 100,
        position: "relative",
        marginTop: -140,
        height: 500,
        backgroundColor: COLOR.white,
    },
    loginName: {
        textAlign: "center",
        fontSize: DIMENSIONS.xxxlText,
        fontWeight: "bold",
        color: COLOR.black,
        fontStyle: "italic",
    },
    coinsView: {
        marginBottom: -20,
        marginLeft: DIMENSIONS.bannerWidth - 60,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default styles;
