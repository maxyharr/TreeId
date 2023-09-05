// import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native'; // importing TouchableOpacity from react-native-gesture-handler doesn't work with position absolute for some reason
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './components/MapScreen';
import ImageConfirmationScreen from './components/ImageConfirmationScreen';
import TreeDetailsScreen from './components/TreeDetailsScreen';
import { AppProvider } from './contexts/AppContext';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AddTreeStack from './components/AddTreeStack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AddTreeButton = ({ onPress }) => (
  <TouchableOpacity style={styles.addTreeButton} onPress={onPress}>
    <FontAwesome name="plus" size={24} color="white" />
  </TouchableOpacity>
);

const HomeStack = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
      <AddTreeButton onPress={() => navigation.navigate('AddTree')} />
    </View>
  )
}

const AppStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeStack} />

      <Stack.Screen name="AddTree" component={AddTreeStack} />
      <Stack.Screen name="ImageConfirmation" component={ImageConfirmationScreen} />

      <Stack.Screen name="TreeDetails" component={TreeDetailsScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppStackNavigation />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTreeButton: {
    position: 'absolute',
    bottom: 70,
    right: 30,
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure the button is above the tabs
  },
  addTreeButtonText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
});
