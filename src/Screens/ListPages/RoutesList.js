import React, { useEffect, useState } from "react";
import { FlatList, View, SafeAreaView, ScrollView } from "react-native";
import { ListItem } from "@rneui/themed";
import Header from "../../Components/Common/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLOR from "../../Services/Constants/COLORS";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import RouteLine from "../../Components/Customs/RouteLines/RouteLine";
import {
    backPage,
    checkLogin,
    goBackHandler,
} from "../../Services/CommonMethods";
import RouteLineFirst from "../../Components/Customs/RouteLines/RouteLineFirst";
import RouteLineLast from "../../Components/Customs/RouteLines/RouteLineLast";
import GlobalText from "../../Components/Customs/Text";
import RouteHeadCard from "../../Components/Cards/RouteHeadCard";
import styles from "./Styles";
import { useTranslation } from "react-i18next";

const RoutesList = ({ navigation, route }) => {
    const { t } = useTranslation();

    const [list, setList] = useState(route.params.item.route_stops);

    useEffect(() => {
        const backHandler = goBackHandler(navigation);
        checkLogin(navigation);
        return () => {
            backHandler.remove();
        };
    }, []);

    const renderItem = ({ item, index }) => {
        let isFirst = index === 0;
        let isLast = index === list.length - 1;

        return (
            <ListItem bottomDivider style={{ paddingTop: isFirst ? 20 : 0 }}>
                {isFirst ? (
                    <RouteLineFirst />
                ) : isLast ? (
                    <RouteLineLast />
                ) : (
                    <RouteLine />
                )}
                <ListItem.Content>
                    <ListItem.Title>
                        <View
                            style={
                                isFirst || isLast
                                    ? styles.listItem
                                    : styles.listItemMid
                            }
                        >
                            <View>
                                <GlobalText
                                    text={item.site.name}
                                    style={{
                                        color:
                                            isFirst || isLast
                                                ? COLOR.themeBlue
                                                : COLOR.black,
                                    }}
                                />
                            </View>
                            <View>
                                {/* <GlobalText text={t("ETA") + item.dept_time.slice(0, -3)} /> */}
                                <GlobalText
                                    text={t("ETA") + item.arr_time.slice(0, -3)}
                                />
                            </View>
                        </View>
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        );
    };

    return (
        <ScrollView stickyHeaderIndices={[0]}>
            <Header
                name={t("HEADER.ROUTE")}
                goBack={() => backPage(navigation)}
                startIcon={
                    <Ionicons
                        name="chevron-back-outline"
                        color={COLOR.black}
                        size={DIMENSIONS.userIconSize}
                        onPress={() => backPage(navigation)}
                    />
                }
                endIcon={<></>}
            />
            <View style={{ marginVertical: -15 }}>
                <RouteHeadCard
                    data={route.params.item}
                    cardClick={() => console.log("")}
                />
            </View>
            <SafeAreaView>
                <View style={styles.flatListContainer}>
                    <FlatList
                        keyExtractor={(item) => item.id}
                        data={list}
                        renderItem={renderItem}
                    />
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default RoutesList;
