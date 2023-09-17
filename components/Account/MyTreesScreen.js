import React from 'react';
import api from '../../api';
import { useNavigation } from '@react-navigation/native';
import PostCard from './PostCard';
import { View, FlatList } from 'react-native';

const MyTreesScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const result = await api.getCurrentUsersPosts();
      if (!result.error) {
        const posts = result.data;
        setPosts(posts);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, }}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item: post }) => (
          <PostCard
            post={post}
            onPress={() => navigation.navigate('Tree Details', { postId: post.id })}
          />
        )}
      />
    </View>
  )
}

export default MyTreesScreen;
