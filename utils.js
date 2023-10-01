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
  },
  timestamp: obj => {
    const now = new Date();
    if (!obj.createdAt) {
      obj.createdAt = now;
    }
    obj.updatedAt = now;
    return obj;
  },
  formatTimestamp: firebaseTimestamp => {
    if (firebaseTimestamp) {
      const date = new Date(firebaseTimestamp.seconds * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    } else {
      return ''
    }
  },
  formatTimestampAgo: firebaseTimestamp => {
    if (firebaseTimestamp) {
      const date = new Date(firebaseTimestamp.seconds * 1000);
      const now = new Date();
      const diff = now - date;
      const diffSeconds = Math.floor(diff / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffWeeks / 4);
      const diffYears = Math.floor(diffMonths / 12);

      if (diffSeconds < 60) {
        return `${diffSeconds} seconds ago`;
      } else if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else if (diffWeeks < 4) {
        return `${diffWeeks} weeks ago`;
      } else if (diffMonths < 12) {
        return `${diffMonths} months ago`;
      } else {
        return `${diffYears} years ago`;
      }
    } else {
      return ''
    }
  },
}

export default utils;
