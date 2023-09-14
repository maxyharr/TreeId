import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native'; // importing TouchableOpacity from react-native-gesture-handler doesn't work with position absolute for some reason
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './components/MapScreen';
import TreeDetailsScreen from './components/TreeDetailsScreen';
import { AppProvider } from './contexts/AppContext';
import api from './api';
import NewPost2 from './components/NewPost2/NewPost2';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator>
        <Stack.Screen name="Map" component={MapScreen} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="UpsertPost" component={NewPost2} />
        <Stack.Screen name="Tree Details" component={TreeDetailsScreen} />
      </Stack.Navigator>
    </View>
  )
}


const AppTabNavigation = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      if (route.name === 'Home') {
        return <FontAwesome name="map-marker" size={size} color={color} />
      }
    },
    tabBarActiveTintColor: 'blue',
    tabBarInactiveTintColor: 'gray',
  })}>
    <Tab.Screen name="Home" component={HomeStack} />
    {/* <Tab.Screen name="My Trees" component={MyTreesScreen} /> */}
  </Tab.Navigator>
)

export default function App() {
  React.useEffect(() => {
    (async () => {
      api.signInAnonymously();
    })()
  }, [])

  return (
    <NavigationContainer>
      <AppTabNavigation />
    </NavigationContainer>
  );
}
