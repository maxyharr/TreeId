import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PhotoSelectionScreen from './PhotoSelectionScreen';
import CameraScreen from './CameraScreen';

const Stack = createStackNavigator();

const AddTreeStack = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Screen name="New Post" component={PhotoSelectionScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </View>
  )
}

export default AddTreeStack;
