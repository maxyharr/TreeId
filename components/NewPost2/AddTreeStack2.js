import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import NewPost2 from './NewPost2';

const Stack = createStackNavigator();

const AddTreeStack2 = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Screen name="New Tree" component={NewPost2} />
      </Stack.Navigator>
    </View>
  )
}

export default AddTreeStack2;
