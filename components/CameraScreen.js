import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import AppContext from '../contexts/AppContext';

const CameraScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const { state, setState } = useContext(AppContext);
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
      const media = await camera.takePictureAsync({ quality: 1 });
      const mediaLocation = await Location.getCurrentPositionAsync({});

      setState({ ...state, selectedMedia: media, selectedMediaLocation: mediaLocation });

      navigation.navigate('ImageConfirmation');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'blue' }}>
      {hasCameraPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasCameraPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <View style={{ flex: 1, backgroundColor: 'green' }}>
          <View style={{ flex: 1, backgroundColor: 'pink' }}>
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
          <View style={{ flex: 1, backgroundColor: 'white' }}>

          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    // flexDirection: 'row',
    // backgroundColor: 'black',
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
