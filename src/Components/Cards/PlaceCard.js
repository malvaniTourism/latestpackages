import React, { useState } from "react";
import { View, ImageBackground, TouchableOpacity } from "react-native";
import styles from "./Styles";
import Path from "../../Services/Api/BaseUrl";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import COLOR from "../../Services/Constants/COLORS";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import StarRating from "react-native-star-rating";
import { comnPost } from "../../Services/Api/CommonServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalText from "../Customs/Text";
import ComingSoon from "../Common/ComingSoon";
import { useTranslation } from "react-i18next";

const PlaceCard = ({ data, reload }) => {
    const { t } = useTranslation();

    const [isFav, setIsFav] = useState(data.is_favorite);
    const [isLiked, setIsLiked] = useState(false);
    const [rating, setRating] = useState(3.5);
    const [isVisible, setIsVisible] = useState(false);

    const onHeartClick = async () => {
        let cityData = {
            user_id: await AsyncStorage.getItem(t("STORAGE.USER_ID")),
            favouritable_type: t("TABLE.SITES"),
            favouritable_id: data.id,
        };
        setIsFav(!isFav);
        comnPost("v2/addDeleteFavourite", cityData)
            .then((res) => {
                AsyncStorage.setItem("isUpdated", "true");
                reload();
            })
            .catch((err) => {});
    };

    const onStarRatingPress = async (rate) => {
        setRating(rate);
        const placeData = {
            user_id: await AsyncStorage.getItem(t("STORAGE.USER_ID")),
            rateable_type: t("TABLE.SITE"),
            rateable_id: data.id,
            rate,
        };
        comnPost("v2/addUpdateRating", placeData)
            .then((res) => {
                AsyncStorage.setItem("isUpdated", "true");
                reload();
            })
            .catch((err) => {});
    };

    const onLikeClick = () => {
        setIsLiked(!isLiked);
        // reload()
    };

    const getPlace = (id) => {
        // navigateTo(navigation, t("SCREEN.PLACE_DETAILS"), { id })
        // setIsVisible(true)
        // setTimeout(() => {
        //     setIsVisible(false)
        // }, 2000)
    };

    return (
        <View style={styles.placeContainer}>
            <View style={styles.placeImageView}>
                <ImageBackground
                    source={{ uri: Path.FTP_PATH + data.image }}
                    style={styles.placeImage}
                    imageStyle={styles.placeImageStyle}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    style={styles.likeView}
                    onPress={() => onHeartClick()}
                >
                    {isFav ? (
                        <Octicons
                            name="heart-fill"
                            color={COLOR.red}
                            size={DIMENSIONS.iconSize}
                        />
                    ) : (
                        <Octicons
                            name="heart"
                            color={COLOR.black}
                            size={DIMENSIONS.iconSize}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.placeContentView}>
                <View style={styles.placeContentTop}>
                    <TouchableOpacity onPress={() => getPlace(data.id)}>
                        <GlobalText text={data.name} style={styles.placeName} />
                        <GlobalText
                            text={data.tag_line}
                            style={styles.placeTag}
                        />
                    </TouchableOpacity>
                    <View style={styles.flexRow}>
                        <View style={{ width: "40%" }}>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                rating={rating}
                                selectedStar={(rating) =>
                                    onStarRatingPress(rating)
                                }
                                starSize={14}
                                starStyle={styles.starStyle}
                                halfStarEnabled
                            />
                        </View>
                        <TouchableOpacity onPress={() => onLikeClick()}>
                            {isLiked ? (
                                <FontAwesome
                                    name="thumbs-up"
                                    color={COLOR.intentColor}
                                    size={DIMENSIONS.iconSize}
                                />
                            ) : (
                                <FontAwesome
                                    name="thumbs-o-up"
                                    color={COLOR.black}
                                    size={DIMENSIONS.iconSize}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.placeMetaView}>
                    <View style={styles.splitView}>
                        <GlobalText
                            text={"Rs. 2500 for one"}
                            style={styles.lightBlackText}
                        />
                    </View>
                    <View style={styles.vertDivider}></View>
                    <View style={styles.splitView}>
                        <GlobalText
                            text={"2 Km"}
                            style={styles.lightBlackText}
                        />
                        <GlobalText
                            text={"25 Min"}
                            style={styles.lightBlackText}
                        />
                    </View>
                </View>
            </View>
            <ComingSoon message={t("COMING_SOON")} visible={isVisible} />
        </View>
    );
};

export default PlaceCard;
