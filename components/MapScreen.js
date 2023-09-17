import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import utils from '../utils'
import { debounce } from 'lodash-es';
import constants from '../constants';
import AddTreeButton from './AddTreeButton';
import api from '../api';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const location = await utils.getLocationAsync();
      setLocation(location);
      if (location.latitude && location.longitude) {
        await handleRegionChangeComplete({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: constants.INITIAL_LAT_LONG_DELTA,
          longitudeDelta: constants.INITIAL_LAT_LONG_DELTA,
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  const debounceHandleRegionChangeComplete = React.useCallback(async region =>
    debounce(handleRegionChangeComplete, 300, { leading: true })(region),
    []
  );

  const handleRegionChangeComplete = async (region) => {
    if (!region.latitude || !region.longitude) return;

    const result = await api.getPosts(region);
    if (!result.error) {
      const posts = result.data;
      const newMarkers = posts.map((post) => {
        console.log('MapScreen#handleRegionChange post:', post)
        const { uri, downloadUrl } = post.mediaAssets[0];
        return {
          id: post.id,
          postId: post.id,
          coordinate: {
            latitude: post.location?.latitude || location.latitude,
            longitude: post.location?.longitude || location.longitude,
          },
          uri: downloadUrl || uri,
        }
      });
      setMarkers(newMarkers);
    }
  }

  return (
    <View style={[styles.container]}>
      { location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: constants.INITIAL_LAT_LONG_DELTA,
            longitudeDelta: constants.INITIAL_LAT_LONG_DELTA,
          }}
          showsUserLocation
          onRegionChangeComplete={debounceHandleRegionChangeComplete}
          onUserLocationChange={debounceHandleRegionChangeComplete}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              // on click, navigate to the TreeDetailsScreen with the marker id
              // In the future, we'll navigate with the Tree ID instead
              onPress={() => navigation.navigate('Tree Details', { postId: marker.postId })}
            >
              <Image
                source={{ uri: marker.uri }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
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
      <View style={{ position: 'absolute', bottom: 30, right: 30, zIndex: 2 }}>
        <AddTreeButton onPress={() => navigation.navigate('UpsertPost')} />
      </View>
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
