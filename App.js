// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './components/MapScreen';
import CameraScreen from './components/CameraScreen';
import ImageConfirmationScreen from './components/ImageConfirmationScreen';
import TreeDetailsScreen from './components/TreeDetailsScreen';
import { ImageProvider } from './contexts/ImageContext';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Tab.Navigator>
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <ImageProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeStack} />
          <Stack.Screen name="ImageConfirmation" component={ImageConfirmationScreen} />
          <Stack.Screen name="TreeDetails" component={TreeDetailsScreen} />
        </Stack.Navigator>
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
