import { FontAwesome } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState, useContext } from 'react';
import { Dimensions, FlatList, Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AdjustableImage from './AdjustableImage';
import AppContext from '../contexts/AppContext';
import ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';

const PhotoSelectionScreen = () => {
  const navigation = useNavigation();
  const {state, setState} = useContext(AppContext);

  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [recentMedia, setRecentMedia] = useState([]);

  const deviceWidth = Dimensions.get('window').width;
  const imagesPerRow = 4;
  const imageWidth = deviceWidth / imagesPerRow;

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
      getRecentMedia().then((media) => {
        setState({...state, selectedMedia: media[0]});
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
      <View style={{ height: deviceWidth }}>
        { /* Show most recent image in recents album */ }
        {state.selectedMedia && (
          <AdjustableImage media={state.selectedMedia} onChange={changes => setState({...state, selectedMediaChanges: changes})}/>
        )}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'black' }}>
        <TouchableOpacity style={{ padding: 20 }} onPress={() => navigation.navigate('Camera')}>
          <FontAwesome name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>

        { /* Show about 50 thumbnails initially from recents album, scroll to view more */ }
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ flex: 1 }}
            numColumns={4}
            data={recentMedia}
            keyExtractor={item => item.id}
            onEndReachedThreshold={2}
            onEndReached={() => loadMoreMedia(recentMedia[recentMedia.length - 1].id)}
            renderItem={({ item: media }) => (
              <TouchableOpacity key={media.id} onPress={() => setState({...state, selectedMedia: media})} activeOpacity={0.5}>
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

