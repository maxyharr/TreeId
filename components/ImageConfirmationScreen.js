import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import ImageContext from '../contexts/ImageContext';

const ImageConfirmationScreen = ({ route }) => {
  const { photo, location } = route.params;
  const navigation = useNavigation();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const { images, setImages } = useContext(ImageContext);

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })();
  }, []);

  const savePicture = async () => {
    try {
      if (!hasMediaLibraryPermission) {
        console.log('Permission to access media library is denied');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      const album = await MediaLibrary.getAlbumAsync('Trees');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Trees', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      }

      setImages([...images, { uri: photo.uri, location }]);
      // Pop the ImageConfirmationScreen off the stack and then navigate to the MapScreen
      navigation.pop();
      navigation.navigate('Map');
    } catch (error) {
      console.log('Error saving picture:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      <Button title="Back to Camera" onPress={() => navigation.goBack()} />
      <Button title="Save" onPress={() => savePicture()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default ImageConfirmationScreen;
