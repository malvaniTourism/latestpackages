import React, { useState, lazy, Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigator from "./DrawerNavigator";
import GlobalText from "../Components/Customs/Text";
import AllRoutesSearch from "../Screens/ListPages/AllRoutesSearch";
import PasswordLogin from "../Screens/AuthScreens/PasswordLogin";
import Email from "../Screens/AuthScreens/Email";
import { useTranslation } from "react-i18next";
import LangSelection from "../Screens/AuthScreens/LangSelection";
import ContactUs from "../Screens/ContactUs";

const SignIn = lazy(() => import("../Screens/AuthScreens/SignIn"));
const SignUp = lazy(() => import("../Screens/AuthScreens/SignUp"));
const SearchList = lazy(() => import("../Screens/ListPages/SearchList"));
const RoutesList = lazy(() => import("../Screens/ListPages/RoutesList"));
const BusTimings = lazy(() => import("../Screens/BusTimings"));
const CategoryProjects = lazy(() => import("../Screens/CategoryProjects"));
const CityDetails = lazy(() => import("../Screens/DetailPages/CityDetails"));
const CityList = lazy(() => import("../Screens/ListPages/CityList"));
const Explore = lazy(() => import("../Screens/ListPages/Explore"));
const Categories = lazy(() => import("../Screens/ListPages/Categories"));
const ExploreGrid = lazy(() => import("../Screens/ListPages/ExploreGrid"));
const ProjectList = lazy(() => import("../Screens/ListPages/ProjectList"));
const QueriesList = lazy(() => import("../Screens/ListPages/QueriesList"));
const CityPlaceSearch = lazy(() =>
    import("../Screens/ListPages/CityPlaceSearch")
);
const StopList = lazy(() => import("../Screens/ListPages/StopList"));
const EmailSignIn = lazy(() => import("../Screens/AuthScreens/EmailSignIn"));
const AuthScreen = lazy(() => import("../Screens/AuthScreens/AuthScreen"));
const VerifyOTP = lazy(() => import("../Screens/AuthScreens/VerifyOTP"));
const PlaceDetails = lazy(() => import("../Screens/DetailPages/PlaceDetails"));
const ProjectDetails = lazy(() =>
    import("../Screens/DetailPages/ProjectDetails")
);
const StopDetails = lazy(() => import("../Screens/DetailPages/StopDetails"));
const SearchPlace = lazy(() => import("../Screens/SearchPlace"));
const MapScreen = lazy(() => import("../Screens/MapScreen"));
const ProfileView = lazy(() => import("../Screens/ProfileView"));
const Profile = lazy(() => import("../Screens/Profile"));

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ["myapp://"],
    config: {
        screens: {
            Home: "home",
            Details: "details",
        },
    },
};

const StackNavigator = () => {
    const { t } = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        <Suspense fallback={<GlobalText text={t("ALERT.LOADING")} />}>
            <NavigationContainer linking={linking}>
                <Stack.Navigator
                    screenOptions={{
                        cardStyle: { backgroundColor: "#fff" },
                    }}
                >
                    {isLoggedIn ? (
                        // Screens for logged in users
                        <Stack.Group
                            screenOptions={{
                                headerShown: false,
                                cardStyle: { backgroundColor: "#fff" },
                            }}
                        >
                            <Stack.Screen
                                name={t("SCREEN.ROOT")}
                                component={DrawerNavigator}
                                options={{ headerShown: false }}
                            />
                            {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
                        </Stack.Group>
                    ) : (
                        // Auth screens
                        <Stack.Group
                            screenOptions={{
                                headerShown: false,
                                cardStyle: { backgroundColor: "#fff" },
                            }}
                        >
                            <Stack.Screen
                                name={t("SCREEN.EMAIL_SIGN_IN")}
                                component={EmailSignIn}
                            />
                            {/* <Stack.Screen name="SignUp" component={SignUp} /> */}
                        </Stack.Group>
                    )}
                    {/* Common modal screens */}
                    <Stack.Group
                        screenOptions={{
                            headerShown: false,
                            presentation: "modal",
                            cardStyle: { backgroundColor: "#fff" },
                        }}
                    >
                        <Stack.Screen
                            name={t("SCREEN.HOME")}
                            component={DrawerNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={t("SCREEN.SEARCH_LIST")}
                            component={SearchList}
                        />
                        <Stack.Screen
                            name={t("SCREEN.ALL_ROUTES_SEARCH")}
                            component={AllRoutesSearch}
                        />
                        <Stack.Screen
                            name={t("SCREEN.ROUTES_LIST")}
                            component={RoutesList}
                        />
                        <Stack.Screen
                            name={t("SCREEN.BUS_TIMINGS")}
                            component={BusTimings}
                        />
                        <Stack.Screen
                            name={t("SCREEN.LANG_SELECTION")}
                            component={LangSelection}
                        />
                        <Stack.Screen
                            name={t("SCREEN.AUTH_SCREEN")}
                            component={AuthScreen}
                        />
                        <Stack.Screen
                            name={t("SCREEN.LOGIN")}
                            component={SignIn}
                        />
                        <Stack.Screen
                            name={t("SCREEN.EMAIL_SIGN_IN")}
                            component={EmailSignIn}
                        />
                        <Stack.Screen
                            name={t("SCREEN.EMAIL")}
                            component={Email}
                        />
                        <Stack.Screen
                            name={t("SCREEN.PASSWORD_LOGIN")}
                            component={PasswordLogin}
                        />
                        <Stack.Screen
                            name={t("SCREEN.VERIFY_OTP")}
                            component={VerifyOTP}
                        />
                        <Stack.Screen
                            name={t("SCREEN.SIGN_UP")}
                            component={SignUp}
                        />
                        <Stack.Screen
                            name={t("SCREEN.CATEGORY_PROJECTS")}
                            component={CategoryProjects}
                        />
                        <Stack.Screen
                            name={t("SCREEN.CITY_LIST")}
                            component={CityList}
                        />
                        <Stack.Screen
                            name={t("SCREEN.EXPLORE")}
                            component={Explore}
                        />
                        <Stack.Screen
                            name={t("SCREEN.CATEGORIES")}
                            component={Categories}
                        />
                        <Stack.Screen
                            name={t("SCREEN.PROJECT_LIST")}
                            component={ProjectList}
                        />
                        <Stack.Screen
                            name={t("SCREEN.QUERIES_LIST")}
                            component={QueriesList}
                        />
                        <Stack.Screen
                            name={t("SCREEN.CONTACT_US")}
                            component={ContactUs}
                        />
                        <Stack.Screen
                            name={t("SCREEN.STOP_LIST")}
                            component={StopList}
                        />
                        <Stack.Screen
                            name={t("SCREEN.CITY_DETAILS")}
                            component={CityDetails}
                        />
                        <Stack.Screen
                            name={t("SCREEN.PLACE_DETAILS")}
                            component={PlaceDetails}
                        />
                        <Stack.Screen
                            name={t("SCREEN.PROJECT_DETAILS")}
                            component={ProjectDetails}
                        />
                        <Stack.Screen
                            name={t("SCREEN.STOP_DETAILS")}
                            component={StopDetails}
                        />
                        <Stack.Screen
                            name={t("SCREEN.SEARCH_PLACE")}
                            component={SearchPlace}
                        />
                        <Stack.Screen
                            name={t("SCREEN.MAP_SCREEN")}
                            component={MapScreen}
                        />
                        <Stack.Screen
                            name={t("SCREEN.CITY_PLACE_SEARCH")}
                            component={CityPlaceSearch}
                        />
                        <Stack.Screen
                            name={t("SCREEN.PROFILE_VIEW")}
                            component={ProfileView}
                        />
                        <Stack.Screen
                            name={t("SCREEN.PROFILE")}
                            component={Profile}
                        />
                        <Stack.Screen
                            name={t("SCREEN.EXPLOREGRID")}
                            component={ExploreGrid}
                        />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </Suspense>
    );
};

export default StackNavigator;
