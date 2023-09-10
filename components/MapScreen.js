import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// import AppContext from '../contexts/AppContext';
import { useFirebase } from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  // const { state } = useContext(AppContext);
  const { index } = useFirebase();
  const [markers, setMarkers] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      await getLocationAsync();
      console.log('location', location);
      // TODO: just get ones near the user
      const posts = await index('posts');
      const newMarkers = posts.map((post) => ({
        id: post.id,
        coordinate: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        imageUri: post.mediaAssets[0].uri,
      }));
      setMarkers(newMarkers);
    })()
    // const newMarkers = state.images.map((image) => ({
    //   id: image.uri,
    //   coordinate: {
    //     latitude: image.location.coords.latitude,
    //     longitude: image.location.coords.longitude,
    //   },
    //   imageUri: image.uri,
    // }));
    // setMarkers(newMarkers);
  }, [/*state.images*/]);

  const getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  return (
    <View style={styles.container}>
      { location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.id}
              description={marker.id}
              // on click, navigate to the TreeDetailsScreen with the marker id
              // In the future, we'll navigate with the Tree ID instead
              onPress={() => navigation.navigate('TreeDetails', { id: marker.id })}
            >
              <Image
                source={{ uri: marker.imageUri }}
                style={{ width: 50, height: 50 }}
              />
            </Marker>
          ))}
        </MapView>
       ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
       )
    }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
