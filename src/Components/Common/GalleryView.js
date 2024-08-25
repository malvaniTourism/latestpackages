import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, Image, Text} from 'react-native';
import ProgressImage from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import ImageViewing from 'react-native-image-viewing';
import styles from './Styles';
import Path from '../../Services/Api/BaseUrl';

const ImageViewer = ({images}) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isVisible, setIsVisible] = useState(false);

  const openImageViewer = image => {
    setSelectedImage(image);
    setIsVisible(true);
  };

  const renderItem = ({item}) => {
    const imageUri = Path.FTP_PATH + item.path;
    console.log('Thumbnail Image URL:', imageUri); // Debugging: Log URL

    return (
      <TouchableOpacity onPress={() => openImageViewer(item)}>
        <ProgressImage
          source={{uri: imageUri}}
          style={styles.thumbnail}
          indicator={Progress.Circle}
          indicatorProps={{
            size: 30,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          resizeMode="cover"
          onError={error => console.error('Thumbnail image load error:', error)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.galleryContainer}>
      <ProgressImage
        style={styles.mainImage}
        source={{uri: Path.FTP_PATH + selectedImage.path}}
        indicator={Progress.Bar}
        indicatorProps={{
          size: 80,
          borderWidth: 0,
          color: 'rgba(150, 150, 150, 1)',
          unfilledColor: 'rgba(200, 200, 200, 0.2)',
        }}
        resizeMode="contain"
        onError={error => console.error('Main image load error:', error)}
      />
      <View style={styles.thumbnailView}>
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          style={styles.thumbnailList}
        />
      </View>
      {/* <ImageViewing
        images={images.map((image) => ({ uri: Path.FTP_PATH + image.path }))}
        imageIndex={images.indexOf(selectedImage)}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      /> */}
    </View>
  );
};

export default ImageViewer;
