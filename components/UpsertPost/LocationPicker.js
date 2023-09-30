import React from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import utils from '../../utils';
import * as geoFire from 'geofire-common';
import constants from '../../constants';
import { useNavigation } from '@react-navigation/native';

const LocationPicker = ({ form, onChange }) => {
  const deviceWidth = utils.deviceWidth();
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // We only want to use the user's location for new posts, not editing posts
      if (!form?.id) {
        try {
          const userLocation = await utils.getLocationAsync();
          const formLocation = form?.location;
          handleLocationChange({ nativeEvent: { coordinate: {
            latitude: formLocation?.latitude || userLocation.latitude,
            longitude: formLocation?.longitude || userLocation.longitude,
           }}});
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  if (!form) return null;

  const handleLocationChange = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const geoHash = geoFire.geohashForLocation([latitude, longitude]);
    console.log('LocationPicker#handleLocationChange', latitude, longitude, geoHash);
    onChange({ ...form, location: {latitude, longitude, geoHash }});
  }

  return (
    <View style={{ flex: 1, height: deviceWidth, width: '100%' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Location</Text>
      { form.location && form.location.latitude && (
        // Touching a point on the map should move the marker to that point
        <MapView
          style={{ flex: 1 }}
          onPress={handleLocationChange}
          showsUserLocation
          initialRegion={{
            latitude: form.location.latitude,
            longitude: form.location.longitude,
            latitudeDelta: constants.INITIAL_LAT_LONG_DELTA,
            longitudeDelta: constants.INITIAL_LAT_LONG_DELTA,
          }}
        >
          <Marker
            draggable
            coordinate={{ latitude: form.location.latitude, longitude: form.location.longitude }}
            onDragEnd={(e) => handleLocationChange(e)}
          />
        </MapView>
      )}
    </View>
  )
}

export default LocationPicker;
