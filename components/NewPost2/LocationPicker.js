import React from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import utils from '../../utils';
import * as geoFire from 'geofire-common';
import constants from '../../constants';

const LocationPicker = ({ form, onChange }) => {
  const deviceWidth = utils.deviceWidth();

  React.useEffect(() => {
    (async () => {
      try {
        const location = await utils.getLocationAsync();
        handleLocationChange({ nativeEvent: { coordinate: location }});
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  if (!form) return null;

  const handleLocationChange = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const geoHash = geoFire.geohashForLocation([latitude, longitude]);
    console.log('geoHash:', geoHash)
    onChange({ ...form, location: {...e.nativeEvent.coordinate, geoHash }});
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
            onDragEnd={(e) => onChange({ ...form, location: e.nativeEvent.coordinate })}
          />
        </MapView>
      )}
    </View>
  )
}

export default LocationPicker;
