import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native'; // importing TouchableOpacity from react-native-gesture-handler doesn't work with position absolute for some reason
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './components/MapScreen';
import TreeDetailsScreen from './components/TreeDetailsScreen';
import api from './api';
import UpsertPost from './components/UpsertPost/UpsertPost';
import { FontAwesome } from '@expo/vector-icons';
import MyTreesScreen from './components/Account/MyTreesScreen/';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator>
        <Stack.Screen name="MapScreen" component={MapScreen} screenOptions={{ headerShown: false }} />
      </Stack.Navigator>
    </View>
  )
}

const MyTreesStack = () => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator>
        <Stack.Screen name="Listing Trees" component={MyTreesScreen} screenOptions={{ headerShown: false }} />
      </Stack.Navigator>
    </View>
  )
}


const AppTabNavigation = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      if (route.name === 'Map') {
        return <FontAwesome name="map-marker" size={size} color={color} />
      }

      if (route.name === 'My Trees') {
        return <FontAwesome name="tree" size={size} color={color} />
      }
    },
    tabBarActiveTintColor: 'blue',
    tabBarInactiveTintColor: 'gray',
  })}>
    <Tab.Screen name="Map" component={HomeStack} />
    <Tab.Screen name="My Trees" component={MyTreesStack} />
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
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={AppTabNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="UpsertPost" component={UpsertPost} options={{ headerBackTitle: 'Back' }}/>
        <Stack.Screen name="Tree Details" component={TreeDetailsScreen} options={{ headerBackTitle: 'Back' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
