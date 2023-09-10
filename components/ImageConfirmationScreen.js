import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import AppContext from '../contexts/AppContext';
import * as ImageManipulator from 'expo-image-manipulator';

const ImageConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const { state, setState } = useContext(AppContext);

  const { selectedMedia, selectedMediaLocation, selectedMediaChanges } = state;

  const activeMedia = state.croppedMedia || state.selectedMedia;

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedMediaChanges) {
        const { resize, crop } = selectedMediaChanges;
        const { originX, originY, width, height } = crop;

        // use imagemaniupulator to crop the image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          selectedMedia.uri,
          [
            { crop: { originX, originY, width, height } }
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        setState({ ...state, croppedMedia: manipulatedImage });
      }
    })()
  }, [selectedMedia, selectedMediaChanges]);

  const savePicture = async () => {
    try {
      if (!hasMediaLibraryPermission) {
        console.log('Permission to access media library is denied');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(activeMedia.uri);
      const album = await MediaLibrary.getAlbumAsync('Trees');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Trees', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      }

      setState({...state, images: [...state.images, { uri: activeMedia.uri, location: selectedMediaLocation }]});
      // Pop the ImageConfirmationScreen off the stack and then navigate to the MapScreen
      navigation.pop();
      navigation.navigate('Map');
    } catch (error) {
      console.log('Error saving picture:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: activeMedia.uri }} style={styles.image} />
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
