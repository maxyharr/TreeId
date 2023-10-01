import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageView from "react-native-image-viewing";

const TrefleDetails = ({ treflePlant, button }) => {
  if (!treflePlant) return null;

  const [imageViewVisible, setImageViewVisible] = React.useState(false);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <TouchableOpacity onPress={() => setImageViewVisible(true)}>
        <Image
          source={{ uri: treflePlant.image_url }}
          style={{ width: 50, height: 50, marginRight: 10, backgroundColor: 'lightgray', borderRadius: 10 }}
        />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>{treflePlant.common_name}</Text>
          { !!button && button() }
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={{ marginRight: 5, fontWeight: 'bold' }}>Family:</Text>
          <Text style={{  }}>{treflePlant.family}</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={{ marginRight: 5, fontWeight: 'bold' }}>Genus:</Text>
          <Text style={{  }}>{treflePlant.genus}</Text>
        </View>
      </View>
      <ImageView images={[{ uri: treflePlant.image_url }]} imageIndex={0} visible={imageViewVisible} onRequestClose={() => setImageViewVisible(false)} />
    </View>

  )
}

export default TrefleDetails;
