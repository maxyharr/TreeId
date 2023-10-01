import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageView from "react-native-image-viewing";

const AssetCarousel = ({ assets = [] }) => {

  const [imageIndex, setImageIndex] = React.useState(0);
  const [compWidth, setCompWidth] = React.useState(0);

  const handleMomentumScrollEnd = event => {
    const calculatedIndex = (event.nativeEvent.contentOffset.x / compWidth)
    setImageIndex(calculatedIndex)
  }

  const setComponentWidth = (ref) => {
    if (ref) {
      ref.measure((x, y, width, height, pageX, pageY) => {
        setCompWidth(width);
      });
    }
  }

  const [imageViewVisible, setImageViewVisible] = React.useState(false);
  const onTouchImage = (index) => {
    setImageIndex(index); // Shouldn't be needed, but more reliable than calculating it
    setImageViewVisible(true);
  }

  // Arctic foxes
  const defaultUri = 'https://images.unsplash.com/photo-1516590914727-51e55df118d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3292&q=80';

  return (
    <View
      ref={ref => setComponentWidth(ref)}
      style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {assets && (
          assets.map((mediaAsset, index) => (
            <View key={mediaAsset.assetId} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => onTouchImage(index)} activeOpacity={1}>
                <Image
                  placeholder={require('../assets/loading.gif')}
                  source={{ uri: mediaAsset.downloadUrl || mediaAsset.uri }}
                  style={{ backgroundColor: 'black', width: compWidth, aspectRatio: mediaAsset.width / mediaAsset.height }}
                  />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
        {assets &&
          assets.map((asset, index) => (
            <FontAwesome key={asset.assetId} name="circle" size={index === imageIndex ? 7 : 5} color={index === imageIndex ? 'black' : 'gray'} style={{ marginLeft: 5 }} />
          ))}
      </View>
      <ImageView
        images={assets.map(asset => ({ uri: asset.downloadUrl || asset.uri }))}
        imageIndex={imageIndex}
        visible={imageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
    </View>
  )
}

export default AssetCarousel;
