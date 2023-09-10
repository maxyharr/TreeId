import React from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import utils from '../../utils';

const LocationPicker = ({ form, onChange }) => {
  const deviceWidth = utils.deviceWidth();

  React.useEffect(() => {
    (async () => {
      try {
        const location = await utils.getLocationAsync();
        onChange({ ...form, location });
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  if (!form) return null;

  return (
    <View style={{ flex: 1, height: deviceWidth, width: deviceWidth }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Location</Text>
      { form.location && form.location.latitude && (
        // Touching a point on the map should move the marker to that point
        <MapView
          style={{ flex: 1 }}
          onPress={(e) => onChange({ ...form, location: e.nativeEvent.coordinate })}
          initialRegion={{
            latitude: form.location.latitude,
            longitude: form.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
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
