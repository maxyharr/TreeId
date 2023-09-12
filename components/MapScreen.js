import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useApi } from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';
import utils from '../utils'
import { debounce } from 'lodash-es';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const { api } = useApi();
  const [markers, setMarkers] = useState([]);

  const navigation = useNavigation();

  const initialLongitudeDelta = 0.001;
  const initialLatitudeDelta = 0.0025;

  useEffect(() => {
    (async () => {
      const location = await utils.getLocationAsync();
      setLocation(location);
      await handleRegionChangeComplete({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: initialLatitudeDelta,
        longitudeDelta: initialLongitudeDelta,
      });
    })()
  }, []);

  const updateMarkers = debounce(async (region) => {
    const result = await api.getPosts(region);
    if (!result.error) {
      const posts = result.data;
      const newMarkers = posts.map((post) => ({
        id: post.id,
        coordinate: {
          latitude: post.location?.latitude || location.latitude,
          longitude: post.location?.longitude || location.longitude,
        },
        imageUri: post.mediaAssets[0].uri,
      }));
      setMarkers(newMarkers);
    }
  }, 1000)

  const handleRegionChangeComplete = React.useCallback((region) => updateMarkers(region), []);

  return (
    <View style={[styles.container]}>
      { location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: initialLatitudeDelta,
            longitudeDelta: initialLongitudeDelta,
          }}
          showsUserLocation
          onRegionChangeComplete={handleRegionChangeComplete}
          onUserLocationChange={handleRegionChangeComplete}
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
                style={{ width: 35, height: 35, borderRadius: 25 }}
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
