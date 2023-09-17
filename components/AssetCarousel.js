import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';

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
          assets.map((mediaAsset) => (
            <View key={mediaAsset.assetId} style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={{ uri: mediaAsset.downloadUrl || mediaAsset.uri }}
                style={{ backgroundColor: 'black', width: compWidth, aspectRatio: mediaAsset.width / mediaAsset.height }} />
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
    </View>
  )
}

export default AssetCarousel;
