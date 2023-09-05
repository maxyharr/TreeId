import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import AdjustableImage from './AdjustableImage';

const PhotoSelectionScreen = () => {

  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [recentMedia, setRecentMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const deviceWidth = Dimensions.get('window').width;
  const imagesPerRow = 4;
  const imageWidth = deviceWidth / imagesPerRow;

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
      getRecentMedia().then((media) => {
        setSelectedMedia(media[0]);
        setRecentMedia(media)
      });
    })();
  }, []);

  const getRecentMedia = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      // TODO: Handle permission denied
      return;
    }
    const { assets } = await MediaLibrary.getAssetsAsync({ first: 50 });
    // assets will contain an array of media items
    return assets;
  };

  const loadMoreMedia = async (after) => {
    const { assets } = await MediaLibrary.getAssetsAsync({ after });
    const newRecentMedia = recentMedia.concat(assets);
    setRecentMedia(newRecentMedia);
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ flex: 1 }}>
        { /* Show most recent image in recents album */ }
        {selectedMedia && (
          <AdjustableImage style={{ flex: 1 }} source={{ uri: selectedMedia.uri }} />
        )}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ padding: 20 }}>
          <FontAwesome name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>

        { /* Show about 20 thumbnails from recents album */ }
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ flex: 1 }}
            numColumns={4}
            data={recentMedia}
            keyExtractor={item => item.id}
            onEndReachedThreshold={2}
            onEndReached={() => loadMoreMedia(recentMedia[recentMedia.length - 1].id)}
            renderItem={({ item: media }) => (
              <TouchableOpacity key={media.id} onPress={() => setSelectedMedia(media)} activeOpacity={0.5}>
                <Image
                  source={{ uri: media.uri }}
                  style={{ height: imageWidth, width: imageWidth }}
                />
              </TouchableOpacity>
            )}>
          </FlatList>
        </View>

      </View>
    </View>
  );
}

export default PhotoSelectionScreen;

