import React from 'react';
import { StyleSheet, View, Text, Image, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import { ScrollView } from 'react-native-gesture-handler';
import utils from '../utils';
import { FontAwesome } from '@expo/vector-icons';

const TreeDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [post, setPost] = React.useState(null);
  const [imageIndex, setImageIndex] = React.useState(0);
  const { postId } = route.params;
  const deviceWidth = React.useMemo(() => utils.deviceWidth(), []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        const result = await api.getPost(postId);
        if (!result.error) {
          const post = result.data
          setPost(post)
          navigation.setOptions({
            headerRight: () => (
              <Button onPress={() => navigation.navigate('UpsertPost', { postId: post.id })} title="Edit" />
            )
          })
        }
      })()
    });
    return unsubscribe;
  }, [postId, navigation])

  const handleMomentumScrollEnd = event => {
    const calculatedIndex = (event.nativeEvent.contentOffset.x / deviceWidth)
    setImageIndex(calculatedIndex)
  }

  const deletePost = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: async () => {
        const result = await api.deletePost(postId);
        if (!result.error) {
          navigation.navigate('Map');
        }
      } }
    ]);
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, margin: 10, fontWeight: 'bold' }}>{post?.title || 'Loading...'}</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        >
          {post && post.mediaAssets && (
            post.mediaAssets.map((mediaAsset) => (
              <View key={mediaAsset.assetId} style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: mediaAsset.downloadUrl || mediaAsset.uri }}
                  style={{ backgroundColor: 'black', width: deviceWidth, aspectRatio: mediaAsset.width / mediaAsset.height }} />
              </View>
            ))
          )}
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
          {post && post.mediaAssets &&
            post.mediaAssets.map((asset, index) => (
              <FontAwesome key={asset.assetId} name="circle" size={index === imageIndex ? 7 : 5} color={index === imageIndex ? 'black' : 'gray'} style={{ marginLeft: 5 }} />
            ))}
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 18, margin: 10, fontWeight: 'bold' }}>Notes</Text>
        <Text style={{ margin: 10 }}>{post ? (post.notes || 'No notes') : 'Loading...'}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
        <Button title="Delete" onPress={() => deletePost()} color={'red'} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default TreeDetailsScreen;
