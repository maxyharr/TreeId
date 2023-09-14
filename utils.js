import * as Location from 'expo-location';
import { Dimensions } from 'react-native';

const utils = {
  getLocationAsync: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      return currentLocation.coords;
    } catch (error) {
      console.error('Error getting location:', error);
    }
  },
  deviceWidth: () => {
    return Dimensions.get('window').width;
  },
  deviceHeight: () => {
    return Dimensions.get('window').height;
  },
  getRadiusInMeters: (latitudeDelta, longitudeDelta) => {
    // If in portrait, use latitudeDelta, else use longitudeDelta
    // Delta is degrees visible on screen
    // 1 degress is ~69 miles
    // 1 mile is ~1609 meters
    // 1 degree is ~69 * 1609 meters
    // 1 degree is ~111120 meters

    const inPortrait = Dimensions.get('window').height > Dimensions.get('window').width;
    const diameterInMeters = inPortrait ? latitudeDelta * 111120 : longitudeDelta * 111120;
    const radiusInMeters = diameterInMeters / 3 * 2; // / 2 seemed to cut off a little too much

    return radiusInMeters;
  }
}

export default utils;
