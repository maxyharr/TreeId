import React from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import { ScrollView } from 'react-native-gesture-handler';
import AssetCarousel from './AssetCarousel';
import TrefleDetails from './TrefleDetails';

const TreeDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [post, setPost] = React.useState(null);
  const [postBelongsToCurrentUser, setPostBelongsToCurrentUser] = React.useState(false);

  const { postId } = route.params;

  React.useEffect(() => {
    if (!post) return;

    if (post.userId === api.getCurrentUserId()) {
      setPostBelongsToCurrentUser(true);
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={() => navigation.navigate('UpsertPost', { postId: post.id })} title="Edit" />
        )
      })
    } else {
      setPostBelongsToCurrentUser(false);
      navigation.setOptions({
        headerRight: () => null
      })
    }
  }, [post]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        const result = await api.getPost(postId);
        if (!result.error) {
          const post = result.data
          setPost(post)
        }
      })()
    });
    return unsubscribe;
  }, [postId, navigation])

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
      <View style={{ flex: 1, margin: 10 }}>
        <TrefleDetails treflePlant={post?.treflePlant} />
      </View>
      <AssetCarousel assets={post?.mediaAssets} />
      <View>
        <Text style={{ fontSize: 18, margin: 10, fontWeight: 'bold' }}>Notes</Text>
        <Text style={{ margin: 10 }}>{post ? (post.notes || 'No notes') : 'Loading...'}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
        { postBelongsToCurrentUser && <Button title="Delete" onPress={() => deletePost()} color={'red'} /> }
      </View>
    </ScrollView>
  )
}

export default TreeDetailsScreen;
