import React, {Component} from 'react';
import {View, Animated, LogBox, Image} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import DIMENSIONS from '../../Services/Constants/DIMENSIONS';
import styles from './Styles';
import Path from '../../Services/Api/BaseUrl';
import ProgressImage from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

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

  onLoadError = error => {
    console.error('Image load error:', error.nativeEvent.error);
  };

  render() {
    return (
      <Animated.View
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
        ]}>
        <ProgressImage
          {...this.props}
          indicator={Progress.Circle} // Optional: Add a progress indicator
          indicatorProps={{
            size: 30,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          resizeMode="stretch"
          onLoad={this.onLoad}
          onError={this.onLoadError}
        />
      </Animated.View>
    );
  }
}

const Banner = ({style, bannerImages}) => {
  return (
    <View style={[styles.banner, style]}>
      <Carousel
        loop
        width={DIMENSIONS.windowWidth}
        height={DIMENSIONS.windowWidth / 2}
        autoPlay={true}
        data={bannerImages}
        scrollAnimationDuration={3000}
        renderItem={({index}) => {
          const imageUri = `${Path.FTP_PATH}${bannerImages[index].image}`;

          // Fallback to standard Image component if needed
          return (
            <AnimationStyle
              source={{uri: imageUri}}
              style={styles.bannerImage}
              onLoad={() => console.log(`Image ${imageUri} loaded`)}
              onError={error =>
                console.error(`Image ${imageUri} failed to load`, error)
              }
            />
          );
        }}
      />
    </View>
  );
};

export default Banner;
