import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import utils from '../../utils';
import AssetCarousel from '../AssetCarousel';

const PostCard = ({ post, onPress }) => {
  const deviceWidth = React.useMemo(() => utils.deviceWidth(), []);

  const CARD_MARGIN = 10;
  const CARD_PADDING = 10;

  const TITLE_FONT_SIZE = 20;
  const FONT_SIZE = 14;
  const ITEM_MARGIN_BOTTOM = 10;


  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={1}>
      <View style={{ flex: 1, margin: CARD_MARGIN, padding: CARD_PADDING, backgroundColor: 'white', borderRadius: 5 }}>

        <View style={{ marginBottom: ITEM_MARGIN_BOTTOM }}>
          <Text style={{ fontSize: TITLE_FONT_SIZE, fontWeight: 'bold' }}>{post.title}</Text>
        </View>
        <View style={{ marginBottom: ITEM_MARGIN_BOTTOM }}>
          <Text style={{ fontSize: FONT_SIZE }}>{post.treflePlant.family}</Text>
          <Text style={{ fontSize: FONT_SIZE }}>{post.treflePlant.genus}</Text>
          <Text style={{ fontSize: FONT_SIZE }}>{post.treflePlant.scientific_name}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <AssetCarousel assets={post.mediaAssets} />
        </View>

      </View>
    </TouchableOpacity>
  )
}

export default PostCard;
