import React, {useState} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {FTP_PATH} from '@env';
import styles from './Styles';
import GlobalText from '../Customs/Text';
import Octicons from 'react-native-vector-icons/Octicons';
import COLOR from '../../Services/Constants/COLORS';
import DIMENSIONS from '../../Services/Constants/DIMENSIONS';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const PackageCard = ({data, cardType, onClick, reload}) => {
  const [rating, setRating] = useState(data?.rating_avg_rate || 0);
  const [isFav, setIsFav] = useState(data?.is_favorite);

  return (
    <TouchableOpacity
      style={
        cardType == 'small' ? styles.packageCardSmall : styles.packageCardLong
      }
      onPress={() => onClick()}>
      <TouchableOpacity
        style={
          cardType == 'small'
            ? styles.smallPackageImage
            : styles.smallPackageImageLong
        }
        onPress={() => onClick()}>
        {data.image ? (
          <ImageBackground
            source={{uri: FTP_PATH + data.image}}
            // style={cardType == 'small' ? styles.smallPackageImage : styles.placeImage}
            imageStyle={
              cardType == 'small'
                ? styles.smallPackageImageStyle
                : styles.smallPackageImageLongStyle
            }
            resizeMode="cover"
          />
        ) : data.gallery && data?.gallery[0] ? (
          <ImageBackground
            source={{uri: FTP_PATH + data.gallery[0].path}}
            imageStyle={
              cardType == 'small'
                ? styles.smallPackageImageStyle
                : styles.smallPackageImageLongStyle
            }
            resizeMode="cover"
          />
        ) : (
          <ImageBackground
            source={require('../../Assets/Images/no-image.png')}
            // style={cardType == 'small' ? styles.smallPackageImage : styles.placeImage}
            imageStyle={
              cardType == 'small'
                ? styles.smallPackageImageStyle
                : styles.smallPackageImageLongStyle
            }
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>

      {cardType == 'small' && (
        <View style={styles.packageLikeView}>
          <View
            style={styles.citySmallLikeView}
            // onPress={() => onHeartClick()}
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
          </View>
        </View>
      )}

      <View
        style={
          cardType == 'small'
            ? styles.packageCardContent
            : styles.packageCardContentLong
        }>
        <View>
          <GlobalText
            text={data.name}
            style={cardType == 'small' ? styles.boldText : styles.boldTextLong}
          />
          {cardType == 'small' ? (
            <GlobalText
              text={`${data?.tag_line?.slice(0, 12)}...`}
              style={styles.greyText}
            />
          ) : (
            <View
              style={
                cardType == 'small'
                  ? styles.flexRowSmall
                  : styles.flexRowSmallLong
              }>
              <MaterialIcons
                name="location-pin"
                color={COLOR.grey}
                size={DIMENSIONS.smallIcon}
              />
              <GlobalText text={data?.site?.name} style={styles.greyText} />
            </View>
          )}
        </View>
        <View
          style={
            cardType == 'small' ? styles.lastContent : styles.lastContentLong
          }>
          {cardType == 'small' ? (
            <View style={styles.flexRowSmall}>
              <Octicons
                name="star"
                color={COLOR.yellow}
                size={DIMENSIONS.smallIcon}
              />
              <GlobalText text={rating} style={{marginLeft: 5}} />
              {/* {rating > 0 && (
                                <GlobalText text={"4.5"} />
                                )} */}
            </View>
          ) : (
            // <View>
            //     <Feather
            //         name="user"
            //         size={DIMENSIONS.smallIcon}
            //         color={COLOR.black}
            //         style={{ marginTop: 10 }}
            //     />
            // </View>
            <View style={styles.flexRowSmall}>
              <Octicons
                name="star"
                color={COLOR.yellow}
                size={DIMENSIONS.smallIcon}
              />
              <GlobalText text={rating} style={{marginLeft: 5}} />
              {/* {rating > 0 && (
                                <GlobalText text={"4.5"} />
                                )} */}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PackageCard;
