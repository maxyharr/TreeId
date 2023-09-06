import React, { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PhotoSelectionScreen from './PhotoSelectionScreen';
import CameraScreen from './CameraScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AppContext from '../contexts/AppContext';

const Stack = createStackNavigator();

const AddTreeStack = () => {
  const navigation = useNavigation();
  const { state } = useContext(AppContext);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('ImageConfirmation')}
              title="Next"
            />
          )
        }}
      >
        <Stack.Screen name="New Post" component={PhotoSelectionScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </View>
  )
}

export default AddTreeStack;
