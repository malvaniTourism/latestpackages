import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import ContactUs from "../Screens/ContactUs";
import Emergency from "../Screens/Emergency";
import { useTranslation } from "react-i18next";
import QueriesList from "../Screens/ListPages/QueriesList";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const { t } = useTranslation();

    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name={t("SCREEN.HOME")} component={TabNavigator} />
            {/* <Drawer.Screen name={t("SCREEN.REQUEST_PAID_ADVERTISEMENT")} component={Pricing} /> */}
            <Drawer.Screen name={t("SCREEN.EMERGENCY")} component={Emergency} />
            <Drawer.Screen
                name={t("SCREEN.CONTACT_US")}
                component={QueriesList}
            />
            {/* <Drawer.Screen name={t("SCREEN.WEATHER")} component={Weather} /> */}
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
