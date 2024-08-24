import React, { Component } from "react";
import { View, Animated } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import DIMENSIONS from "../../Services/Constants/DIMENSIONS";
import styles from "./Styles";
import Path from "../../Services/Api/BaseUrl";
import FastImage from "react-native-fast-image";

class AnimationStyle extends Component {
    state = {
        opacity: new Animated.Value(0),
    };

    onLoad = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    render() {
        return (
            <Animated.Image
                onLoad={this.onLoad}
                {...this.props}
                style={[
                    {
                        opacity: this.state.opacity,
                        transform: [
                            {
                                scale: this.state.opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.85, 1],
                                }),
                            },
                        ],
                    },
                    this.props.style,
                ]}
            />
        );
    }
}

const Banner = ({ style, bannerImages }) => {
    return (
        <View style={[styles.banner, style]}>
            <Carousel
                loop
                // mode={"parallax"}
                // customAnimation={animationStyle}
                width={DIMENSIONS.windowWidth}
                height={DIMENSIONS.windowWidth / 2}
                autoPlay={true}
                data={bannerImages}
                scrollAnimationDuration={3000}
                // onSnapToItem={(index) => console.log("current index:", index)}
                renderItem={({ index }) => (
                    <FastImage
                        style={styles.bannerImage}
                        source={{
                            uri: `${Path.FTP_PATH}${bannerImages[index].image}`,
                            headers: { Authorization: "someAuthToken" },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                    // <AnimationStyle
                    //     source={{
                    //         uri: `${Path.FTP_PATH}${bannerImages[index].image}`,
                    //     }}
                    //     style={styles.bannerImage}
                    // >
                    // </AnimationStyle>
                )}
            />
        </View>
    );
};

export default Banner;
