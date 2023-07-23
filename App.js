// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './components/MapScreen';
import CameraScreen from './components/CameraScreen';
import ImageConfirmationScreen from './components/ImageConfirmationScreen';
import { ImageProvider } from './contexts/ImageContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CameraStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Camera" component={CameraScreen} />
    <Stack.Screen name="ImageConfirmation" component={ImageConfirmationScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <ImageProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Other" component={CameraStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </ImageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
