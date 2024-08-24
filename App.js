import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./Store";
import {
    Image,
    LogBox,
    StyleSheet,
    View,
    ActivityIndicator,
} from "react-native";
import StackNavigator from "./src/Navigators/StackNavigator";
import COLOR from "./src/Services/Constants/COLORS";
import AppIntroSlider from "react-native-app-intro-slider";
import GlobalText from "./src/Components/Customs/Text";
import DIMENSIONS from "./src/Services/Constants/DIMENSIONS";
import STRING from "./src/Services/Constants/STRINGS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextButton from "./src/Components/Customs/Buttons/TextButton";
import Feather from "react-native-vector-icons/Feather";
import styles from "./src/Screens/Styles";
import analytics from "@react-native-firebase/analytics";
import Ionicons from "react-native-vector-icons/Ionicons";
import "./src/localization/i18n";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["Warning: ...", "Possible Unhandled Promise Rejection"]);
const Stack = createNativeStackNavigator();

analytics().setAnalyticsCollectionEnabled(true);

export default function App() {
    const [isFirstTime, setIsFirstTime] = useState(null); // Set initial state to null
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(async () => {
        try {
            const isFirstTimeValue = await AsyncStorage.getItem(
                STRING.STORAGE.IS_FIRST_TIME
            );
            setIsFirstTime(isFirstTimeValue);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching isFirstTime value:", error);
            setLoading(false);
        }
    }, []);

    const slides = [
        {
            key: 1,
            title: "Title 1",
            text: "Description.\nSay something cool",
            image: require("./src/Assets/Images/Intro/1-min.png"),
            backgroundColor: "#fff",
        },
        {
            key: 2,
            title: "Title 2",
            text: "Other cool stuff",
            image: require("./src/Assets/Images/Intro/2-min.png"),
            backgroundColor: "#fff",
        },
        {
            key: 3,
            title: "Title 3",
            text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
            image: require("./src/Assets/Images/Intro/3-min.png"),
            backgroundColor: "#fff",
        },
    ];

    const renderItem = ({ item }) => {
        return (
            <View
                style={[
                    styles.slide,
                    { backgroundColor: item.backgroundColor },
                ]}
            >
                {/* <GlobalText style={styles.title} text={item.title} /> */}
                {/* <Image
                    source={require("./src/Assets/Images/Logos/black.png")}
                    style={styles.introLogo}
                /> */}
                <Image source={item.image} style={styles.image} />
                <View style={styles.appName}>
                    <GlobalText
                        text={STRING.APPNAME}
                        style={styles.loginName}
                    />
                </View>
                {/* <GlobalText style={styles.text} text={item.text} /> */}
            </View>
        );
    };

    const onDone = () => {
        AsyncStorage.setItem(STRING.STORAGE.IS_FIRST_TIME, "false");
        setIsFirstTime("false");
    };

    const renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Ionicons name="arrow-forward" color={COLOR.white} size={30} />
            </View>
        );
    };

    const renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Ionicons name="checkmark" color={COLOR.white} size={30} />
            </View>
        );
    };

    if (loading) {
        // Display a loading screen while fetching data
        return (
            <View style={styles.loadingContainer}>
                {/* Customize this loading view according to your app's design */}
                <ActivityIndicator size="large" color={COLOR.themeBlue} />
            </View>
        );
    }

    if (isFirstTime === "false") {
        return (
            <Provider store={store}>
                <SafeAreaProvider>
                    {/* <StatusBar backgroundColor={COLOR.yellow} /> */}
                    <StackNavigator />
                </SafeAreaProvider>
            </Provider>
        );
    }

    return (
        <>
            <StatusBar backgroundColor={COLOR.loginImageBlue} />
            <AppIntroSlider
                nextButtonTextColor={"#000"}
                renderItem={renderItem}
                data={slides}
                onDone={onDone}
                // renderNextButton={_renderNextButton}
                activeDotColor={COLOR.themeBlue}
                renderDoneButton={renderDoneButton}
                renderNextButton={renderNextButton}
            />
        </>
    );
}
