import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import ImageContext from '../contexts/ImageContext';

const CameraScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const { images } = useContext(ImageContext);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');

      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({ quality: 1 });
      const location = await Location.getCurrentPositionAsync({});
      navigation.navigate('ImageConfirmation', { photo, location });
    }
  };

  return (
    <View style={styles.container}>
      {hasCameraPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasCameraPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            ref={(ref) => setCamera(ref)}
            type={Camera.Constants.Type.back}
            autoFocus={Camera.Constants.AutoFocus.on}
            flashMode={Camera.Constants.FlashMode.off}
            whiteBalance={Camera.Constants.WhiteBalance.auto}
          />
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureButtonText}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show location of each image as text */}
      {images.map((image) => (
        <Text key={image.uri}>{JSON.stringify(image.location)}</Text>
      ))}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 10,
  },
  captureButtonText: {
    fontSize: 18,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  imagePreview: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default CameraScreen;
