import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import Collapsible from "react-native-collapsible";
import styles from "./Styles";
import GlobalText from "./Text";
import Path from "../../Services/Api/BaseUrl";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLOR from "../../Services/Constants/COLORS";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import SubCatCard from "../Cards/SubCatCard";
import { navigateTo } from "../../Services/CommonMethods";
import { useTranslation } from "react-i18next";

const Accordion = ({ data, navigation }) => {
    const { t } = useTranslation();

    const [expandedIndex, setExpandedIndex] = useState(0);

    const toggleExpanded = (index) => {
        setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const AccordionItem = ({ item, index, isExpanded, onPress }) => (
        <View>
            <TouchableOpacity
                onPress={() => onPress(index)}
                style={[
                    styles.accordHeader,
                    {
                        backgroundColor: isExpanded
                            ? COLOR.transparent
                            : COLOR.white,
                    },
                ]}
            >
                <Image source={{ uri: item.icon }} style={styles.catCardIcon} />
                <GlobalText style={styles.accordHeaderText} text={item.name} />
                <Ionicons
                    name="chevron-down"
                    color={COLOR.black}
                    size={DIMENSIONS.iconMedium}
                />
            </TouchableOpacity>
            <Collapsible collapsed={!isExpanded} style={styles.accordContent}>
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={item.sub_categories}
                    renderItem={renderItem}
                    numColumns={3}
                />
            </Collapsible>
        </View>
    );

    const renderItem = ({ item }) => {
        return (
            <SubCatCard data={item} onClick={() => goToSubCats(item.code)} />
        );
    };

    const goToSubCats = (subCat) => {
        navigateTo(navigation, t("SCREEN.CITY_LIST"), { subCat });
    };

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
                <AccordionItem
                    item={item}
                    index={index}
                    isExpanded={expandedIndex === index}
                    onPress={toggleExpanded}
                />
            )}
        />
    );
};

export default Accordion;
