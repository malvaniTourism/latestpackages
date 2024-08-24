import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import FastImage from "react-native-fast-image";
import ImageViewing from "react-native-image-viewing";
import styles from "./Styles";
import Path from "../../Services/Api/BaseUrl";

const ImageViewer = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Preload images for faster loading
        FastImage.preload(
            images.map((image) => ({ uri: Path.FTP_PATH + image.path }))
        );
    }, [images]);

    const openImageViewer = (image) => {
        setSelectedImage(image);
        setIsVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openImageViewer(item)}>
            <FastImage
                source={{ uri: Path.FTP_PATH + item.path }}
                style={styles.thumbnail}
                resizeMode={FastImage.resizeMode.cover}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.galleryContainer}>
            <FastImage
                style={styles.mainImage}
                source={{
                    uri: Path.FTP_PATH + selectedImage.path,
                    headers: { Authorization: "someAuthToken" },
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.thumbnailView}>
                <FlatList
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    style={styles.thumbnailList}
                />
            </View>
            {/* <ImageViewing
                images={images.map(image => ({ uri: Path.FTP_PATH + image.path }))}
                imageIndex={images.indexOf(selectedImage)}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            /> */}
        </View>
    );
};

export default ImageViewer;
