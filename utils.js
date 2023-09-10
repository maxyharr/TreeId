import * as Location from 'expo-location';
import { Dimensions } from 'react-native';

const utils = {
  getLocationAsync: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      return currentLocation.coords;
    } catch (error) {
      console.log('Error getting location:', error);
    }
  },
  deviceWidth: () => {
    return Dimensions.get('window').width;
  },
}

export default utils;
